import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { fmt, fmtDate, SHIPPING, type ShippingKey } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sipariş onayı" };
const STEPS = [["odeme_alindi", "Ödeme alındı", CheckCircle2], ["hazirlaniyor", "Kavruluyor & paketleniyor", Package], ["kargoda", "Kargoda", Truck], ["teslim", "Teslim edildi", Home]] as const;

export default function Page({ params }: { params: { number: string } }) {
  const o = db.select().from(schema.orders).where(eq(schema.orders.number, params.number)).get();
  if (!o) notFound();
  const items = db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, o.id)).all();
  const stepIdx = STEPS.findIndex(([k]) => k === o.status);
  return (
    <section className="container-x py-10">
      <div className="mx-auto max-w-3xl">
        <div className="card p-8 text-center"><CheckCircle2 size={56} className="mx-auto text-green-600" /><h1 className="mt-4 font-serif text-3xl font-bold">Teşekkürler, {o.customerName.split(" ")[0]}!</h1><p className="mt-2 text-[var(--mocha)]">Siparişin alındı. Onay e-postası <b>{o.email}</b> adresine gönderildi.</p><div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--cream-2)] px-4 py-2 text-sm">Sipariş no <b className="font-mono">{o.number}</b> · {fmtDate(o.createdAt)}</div></div>
        <div className="card mt-6 p-6">
          <div className="grid grid-cols-4 gap-2">{STEPS.map(([k, label, Icon], i) => <div key={k} className="text-center"><div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${i <= stepIdx ? "bg-[var(--accent)] text-white" : "bg-[var(--cream-2)] text-[var(--mocha)]"}`}><Icon size={18} /></div><div className={`mt-2 text-xs ${i <= stepIdx ? "font-semibold" : "text-[var(--mocha)]"}`}>{label}</div></div>)}</div>
          <p className="mt-4 text-center text-xs text-[var(--mocha)]">{SHIPPING[o.shipping as ShippingKey].label} · {SHIPPING[o.shipping as ShippingKey].desc}. Kargo takip numarası e-posta ile gelecek.</p>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="card p-6"><h2 className="font-serif text-xl font-bold">Ürünler</h2><ul className="mt-3 divide-y divide-espresso/10 text-sm">{items.map((i) => <li key={i.id} className="flex justify-between py-3"><span><b>{i.name}</b><br /><span className="text-xs text-[var(--mocha)]">{i.weight} g · {i.grind} × {i.qty}</span></span><span>{fmt(i.unitPrice * i.qty)}</span></li>)}</ul>
            <div className="mt-3 space-y-1 border-t border-espresso/10 pt-3 text-sm"><div className="flex justify-between"><span>Ara toplam</span><span>{fmt(o.subtotal)}</span></div>{o.discount > 0 && <div className="flex justify-between text-green-700"><span>İndirim ({o.couponCode})</span><span>−{fmt(o.discount)}</span></div>}<div className="flex justify-between"><span>Kargo</span><span>{o.shippingFee === 0 ? "Ücretsiz" : fmt(o.shippingFee)}</span></div><div className="flex justify-between pt-2 text-lg font-bold"><span>Toplam</span><span>{fmt(o.total)}</span></div></div></div>
          <div className="card p-6 text-sm"><h2 className="font-serif text-xl font-bold">Teslimat</h2><p className="mt-3">{o.customerName}<br />{o.address}<br />{o.district} / {o.city}<br />{o.phone}</p><h3 className="mt-5 font-semibold">Ödeme</h3><p className="text-[var(--mocha)]">Kredi kartı · Ref: <span className="font-mono">{o.paymentRef}</span></p></div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/urunler" className="btn-primary">Alışverişe devam et</Link><Link href="/siparis-takip" className="btn-outline">Sipariş takibi</Link></div>
      </div>
    </section>
  );
}
