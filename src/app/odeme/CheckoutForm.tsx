"use client";
import { useEffect, useId, useMemo, useState, useTransition, cloneElement, isValidElement } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Tag, Truck, CheckCircle2 } from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { fmt, SHIPPING, FREE_SHIPPING_MIN, type ShippingKey } from "@/lib/pricing";
import { placeOrder, validateCoupon, type FieldErrors } from "@/app/actions";
import BagArt from "@/components/BagArt";

const Field = ({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) => {
  const id = useId();
  const child = isValidElement(children) ? cloneElement(children as React.ReactElement<{ id?: string; "aria-invalid"?: boolean }>, { id, "aria-invalid": !!error }) : children;
  return <div className={className}><label htmlFor={id} className="label">{label}</label>{child}{error && <p className="mt-1 text-xs text-red-600">{error}</p>}</div>;
};

export default function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [shipping, setShipping] = useState<ShippingKey>("standart");
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<{ discount: number; label: string } | { error: string } | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, start] = useTransition();
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", district: "", address: "", holder: "", number: "", exp: "", cvv: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const subtotal = cartSubtotal(items);
  const discount = couponState && "discount" in couponState ? couponState.discount : 0;
  const shippingFee = useMemo(() => (subtotal - discount >= FREE_SHIPPING_MIN && shipping === "standart" ? 0 : SHIPPING[shipping].fee), [subtotal, discount, shipping]);
  const total = subtotal - discount + shippingFee;

  async function applyCoupon() {
    if (!coupon) return;
    const r = await validateCoupon(coupon, subtotal);
    setCouponState(r.ok ? { discount: r.discount, label: r.label } : { error: r.error });
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await placeOrder({
        name: form.name, email: form.email, phone: form.phone.replace(/\s/g, ""), city: form.city, district: form.district, address: form.address, shipping,
        coupon: couponState && "discount" in couponState ? coupon : "",
        card: { number: form.number.replace(/\s/g, ""), exp: form.exp, cvv: form.cvv, holder: form.holder },
        items: items.map((i) => ({ productId: i.productId, grind: i.grind, weight: i.weight, qty: i.qty })),
      });
      if (r.ok) { clear(); router.push(`/siparis/${r.number}`); }
      else { setErrors(r.errors); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
  }

  if (!hydrated) return null;
  if (items.length === 0) return <div className="card p-16 text-center text-[var(--mocha)]"><p>Sepetin boş.</p><Link href="/urunler" className="btn-primary mt-4">Kahvelere göz at</Link></div>;

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        {Object.keys(errors).length > 0 && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Lütfen işaretli alanları düzelt.</div>}
        <section className="card p-6">
          <h2 className="font-serif text-xl font-bold">1. Teslimat bilgileri</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Ad Soyad" error={errors.name}><input className="input" value={form.name} onChange={set("name")} autoComplete="name" /></Field>
            <Field label="E-posta" error={errors.email}><input className="input" type="email" value={form.email} onChange={set("email")} autoComplete="email" /></Field>
            <Field label="Telefon" error={errors.phone}><input className="input" value={form.phone} onChange={set("phone")} placeholder="05xx xxx xx xx" autoComplete="tel" /></Field>
            <div className="grid grid-cols-2 gap-3"><Field label="İl" error={errors.city}><input className="input" value={form.city} onChange={set("city")} /></Field><Field label="İlçe" error={errors.district}><input className="input" value={form.district} onChange={set("district")} /></Field></div>
            <Field label="Adres" error={errors.address} className="sm:col-span-2"><input className="input" value={form.address} onChange={set("address")} placeholder="Mahalle, sokak, no, daire" autoComplete="street-address" /></Field>
          </div>
        </section>
        <section className="card p-6">
          <h2 className="font-serif text-xl font-bold">2. Kargo</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(Object.keys(SHIPPING) as ShippingKey[]).map((k) => {
              const free = k === "standart" && subtotal - discount >= FREE_SHIPPING_MIN;
              return <button type="button" key={k} onClick={() => setShipping(k)} className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${shipping === k ? "border-[var(--accent)] bg-accent/5" : "border-espresso/15 hover:border-espresso/40"}`}><Truck size={18} className="mt-0.5 text-[var(--accent)]" /><span><b>{SHIPPING[k].label}</b> <span className="text-sm text-[var(--mocha)]">· {free ? "Ücretsiz" : fmt(SHIPPING[k].fee)}</span><br /><span className="text-xs text-[var(--mocha)]">{SHIPPING[k].desc}</span></span></button>;
            })}
          </div>
        </section>
        <section className="card p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold">3. Ödeme <Lock size={16} className="text-[var(--mocha)]" /></h2>
          <p className="mt-1 text-xs text-[var(--mocha)]">Test modu: <code className="rounded bg-[var(--cream-2)] px-1">4242 4242 4242 4242</code> başarılı, <code className="rounded bg-[var(--cream-2)] px-1">4000…</code> reddedilir. Kart bilgisi saklanmaz.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Kart üzerindeki isim" error={errors["card.holder"]} className="sm:col-span-2"><input className="input" value={form.holder} onChange={set("holder")} autoComplete="cc-name" /></Field>
            <Field label="Kart numarası" error={errors["card.number"]} className="sm:col-span-2"><input className="input font-mono" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })} placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="cc-number" /></Field>
            <Field label="Son kullanma (AA/YY)" error={errors["card.exp"]}><input className="input font-mono" value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/") })} placeholder="12/28" inputMode="numeric" autoComplete="cc-exp" /></Field>
            <Field label="CVV" error={errors["card.cvv"]}><input className="input font-mono" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="123" inputMode="numeric" autoComplete="cc-csc" /></Field>
          </div>
        </section>
      </div>
      <aside className="card h-fit p-6 lg:sticky lg:top-24">
        <h2 className="font-serif text-xl font-bold">Sipariş özeti</h2>
        <ul className="mt-4 divide-y divide-espresso/10">{items.map((i) => <li key={i.key} className="flex items-center gap-3 py-3 text-sm"><div className="h-12 w-10 shrink-0 rounded-lg bg-[var(--cream-2)] p-0.5"><BagArt color={i.color} name={i.name} origin="" roast="" className="h-full w-full" /></div><div className="min-w-0 flex-1"><div className="truncate font-semibold">{i.name}</div><div className="text-xs text-[var(--mocha)]">{i.weight} g · {i.grind} × {i.qty}</div></div><b>{fmt(i.unitPrice * i.qty)}</b></li>)}</ul>
        <div className="mt-4">
          <div className="flex gap-2"><div className="relative flex-1"><Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mocha)]" /><input className="input !pl-8 uppercase" placeholder="Kupon kodu" value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponState(null); }} /></div><button type="button" onClick={applyCoupon} className="btn-outline !py-2">Uygula</button></div>
          {couponState && ("error" in couponState ? <p className="mt-1 text-xs text-red-600">{couponState.error}</p> : <p className="mt-1 flex items-center gap-1 text-xs text-green-700"><CheckCircle2 size={12} /> {couponState.label} uygulandı</p>)}
          {errors.coupon && <p className="mt-1 text-xs text-red-600">{errors.coupon}</p>}
        </div>
        <div className="mt-4 space-y-2 border-t border-espresso/10 pt-4 text-sm">
          <div className="flex justify-between"><span>Ara toplam</span><span>{fmt(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-700"><span>İndirim</span><span>−{fmt(discount)}</span></div>}
          <div className="flex justify-between"><span>Kargo</span><span>{shippingFee === 0 ? <span className="text-green-700">Ücretsiz</span> : fmt(shippingFee)}</span></div>
          <div className="flex justify-between border-t border-espresso/10 pt-3 text-xl font-bold"><span>Toplam</span><span>{fmt(total)}</span></div>
        </div>
        <button disabled={pending} className="btn-accent mt-5 w-full !py-4 text-base"><Lock size={16} /> {pending ? "İşleniyor…" : `Siparişi tamamla · ${fmt(total)}`}</button>
        <p className="mt-3 text-center text-xs text-[var(--mocha)]">Siparişi tamamlayarak <Link href="/hakkimizda#kosullar" className="underline">satış koşullarını</Link> kabul etmiş olursun.</p>
      </aside>
    </form>
  );
}
