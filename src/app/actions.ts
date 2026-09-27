"use server";
import { z } from "zod";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { priceFor, SHIPPING, FREE_SHIPPING_MIN, SUBSCRIPTION_DISCOUNT, GRINDS, PLANS, type Weight, type Grind } from "@/lib/pricing";

const itemSchema = z.object({ productId: z.number().int(), grind: z.enum(GRINDS), weight: z.union([z.literal(250), z.literal(500), z.literal(1000)]), qty: z.number().int().min(1).max(20) });
const checkoutSchema = z.object({
  name: z.string().trim().min(3, "Ad soyad en az 3 karakter"),
  email: z.string().trim().email("Geçerli bir e-posta gir"),
  phone: z.string().trim().regex(/^(\+90|0)?5\d{9}$/, "Telefon 05xx xxx xx xx biçiminde olmalı"),
  city: z.string().trim().min(2, "İl gerekli"),
  district: z.string().trim().min(2, "İlçe gerekli"),
  address: z.string().trim().min(10, "Adres en az 10 karakter"),
  shipping: z.enum(["standart", "hizli"]),
  coupon: z.string().trim().toUpperCase().optional().or(z.literal("")),
  card: z.object({ number: z.string().regex(/^\d{16}$/, "16 haneli kart numarası"), exp: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "AA/YY"), cvv: z.string().regex(/^\d{3}$/, "3 haneli CVV"), holder: z.string().min(3, "Kart üzerindeki isim") }),
  items: z.array(itemSchema).min(1, "Sepet boş"),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type FieldErrors = Record<string, string>;

/** Kupon doğrulama + indirim hesabı (kuruş) */
export async function validateCoupon(code: string, subtotal: number): Promise<{ ok: true; discount: number; label: string } | { ok: false; error: string }> {
  const c = db.select().from(schema.coupons).where(eq(schema.coupons.code, code.trim().toUpperCase())).get();
  if (!c || !c.active) return { ok: false, error: "Kupon geçersiz." };
  if (subtotal < c.minSubtotal) return { ok: false, error: `Bu kupon ${(c.minSubtotal / 100).toLocaleString("tr-TR")} ₺ üzeri siparişlerde geçerli.` };
  const discount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : Math.min(c.value, subtotal);
  return { ok: true, discount, label: c.type === "percent" ? `%${c.value} indirim` : `${(c.value / 100).toLocaleString("tr-TR")} ₺ indirim` };
}

/** Fiyatlar sunucuda yeniden hesaplanır; istemciden gelen fiyata güvenilmez. */
export async function placeOrder(raw: unknown): Promise<{ ok: true; number: string } | { ok: false; errors: FieldErrors }> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }
  const d = parsed.data;
  // Test kartı kuralı (iyzico sandbox mantığı): 4242… başarılı, 4000… reddedilir
  if (d.card.number.startsWith("4000")) return { ok: false, errors: { "card.number": "Banka işlemi reddetti (test kartı 4000…). 4242 4242 4242 4242 ile dene." } };

  const products = db.select().from(schema.products).all();
  const lines = d.items.map((i) => {
    const p = products.find((x) => x.id === i.productId);
    if (!p) throw new Error("Ürün bulunamadı");
    if (p.stock < i.qty) throw new Error(`${p.name} için yeterli stok yok`);
    return { p, ...i, unitPrice: priceFor(p.price, i.weight as Weight) };
  });
  const subtotal = lines.reduce((a, l) => a + l.unitPrice * l.qty, 0);
  let discount = 0, couponCode: string | null = null;
  if (d.coupon) {
    const c = await validateCoupon(d.coupon, subtotal);
    if (!c.ok) return { ok: false, errors: { coupon: c.error } };
    discount = c.discount; couponCode = d.coupon;
  }
  const shippingFee = subtotal - discount >= FREE_SHIPPING_MIN && d.shipping === "standart" ? 0 : SHIPPING[d.shipping].fee;
  const total = subtotal - discount + shippingFee;
  const number = "KD" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);
  const paymentRef = "TEST-" + Math.random().toString(36).slice(2, 10).toUpperCase();

  db.transaction((tx) => {
    const order = tx.insert(schema.orders).values({ number, customerName: d.name, email: d.email, phone: d.phone, address: d.address, city: d.city, district: d.district, shipping: d.shipping, shippingFee, subtotal, discount, couponCode, total, paymentRef }).returning({ id: schema.orders.id }).get();
    for (const l of lines) {
      tx.insert(schema.orderItems).values({ orderId: order.id, productId: l.p.id, name: l.p.name, grind: l.grind as Grind, weight: l.weight, qty: l.qty, unitPrice: l.unitPrice }).run();
      tx.update(schema.products).set({ stock: l.p.stock - l.qty }).where(eq(schema.products.id, l.p.id)).run();
    }
  });
  return { ok: true, number };
}

const subSchema = z.object({ email: z.string().email("Geçerli bir e-posta gir"), plan: z.enum(["kesif", "favori", "espresso"]), grind: z.enum(GRINDS), frequencyWeeks: z.union([z.literal(2), z.literal(4)]) });

export async function createSubscription(raw: unknown): Promise<{ ok: true; id: number; price: number } | { ok: false; error: string }> {
  const parsed = subSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;
  const price = Math.round(PLANS[d.plan].price * (1 - SUBSCRIPTION_DISCOUNT) / 100) * 100;
  const r = db.insert(schema.subscriptions).values({ email: d.email, plan: d.plan, grind: d.grind, frequencyWeeks: d.frequencyWeeks, price }).returning({ id: schema.subscriptions.id }).get();
  return { ok: true, id: r.id, price };
}

export async function trackOrder(number: string, email: string) {
  const o = db.select().from(schema.orders).where(eq(schema.orders.number, number.trim().toUpperCase())).get();
  if (!o || o.email.toLowerCase() !== email.trim().toLowerCase()) return null;
  return { number: o.number, status: o.status, createdAt: o.createdAt, total: o.total, shipping: o.shipping };
}
