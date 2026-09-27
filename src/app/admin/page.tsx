import { db, schema } from "@/db";
import { desc, sql } from "drizzle-orm";
import { fmt } from "@/lib/pricing";
import { setOrderStatus } from "./actions";

export const dynamic = "force-dynamic";
const STATUSES = [["odeme_alindi", "Ödeme alındı"], ["hazirlaniyor", "Hazırlanıyor"], ["kargoda", "Kargoda"], ["teslim", "Teslim"]];

export default function Page() {
  const orders = db.select().from(schema.orders).orderBy(desc(schema.orders.id)).all();
  const items = db.select().from(schema.orderItems).all();
  const stats = db.select({ n: sql<number>`count(*)`, sum: sql<number>`coalesce(sum(total),0)` }).from(schema.orders).get()!;
  const subs = db.select({ n: sql<number>`count(*)` }).from(schema.subscriptions).get()!;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">{[["Sipariş", stats.n], ["Ciro", fmt(stats.sum)], ["Aktif abonelik", subs.n]].map(([a, b]) => <div key={a as string} className="card p-5"><div className="text-xs text-[var(--mocha)]">{a as string}</div><div className="mt-1 font-serif text-3xl font-bold">{b as React.ReactNode}</div></div>)}</div>
      <div className="card mt-6 overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-xs uppercase text-[var(--mocha)]"><tr>{["Sipariş", "Müşteri", "Ürünler", "Tutar", "Kargo", "Durum"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>
        {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-[var(--mocha)]">Henüz sipariş yok.</td></tr>}
        {orders.map((o) => <tr key={o.id} className="border-t border-espresso/10 align-top"><td className="px-4 py-3 font-mono font-semibold">{o.number}<div className="text-xs font-sans font-normal text-[var(--mocha)]">{new Date(o.createdAt + "Z").toLocaleString("tr-TR")}</div></td><td className="px-4 py-3">{o.customerName}<div className="text-xs text-[var(--mocha)]">{o.email} · {o.district}/{o.city}</div></td><td className="px-4 py-3 text-xs">{items.filter((i) => i.orderId === o.id).map((i) => <div key={i.id}>{i.qty}× {i.name} · {i.weight} g · {i.grind}</div>)}</td><td className="px-4 py-3 font-semibold">{fmt(o.total)}{o.discount > 0 && <div className="text-xs font-normal text-green-700">{o.couponCode} −{fmt(o.discount)}</div>}</td><td className="px-4 py-3 text-xs">{o.shipping === "hizli" ? "Hızlı" : "Standart"}</td><td className="px-4 py-3"><form action={async (fd) => { "use server"; await setOrderStatus(o.id, String(fd.get("status"))); }} className="flex gap-1"><select name="status" defaultValue={o.status} className="input !w-auto !py-1.5 text-xs">{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select><button className="btn-primary !px-3 !py-1.5 text-xs">Kaydet</button></form></td></tr>)}
      </tbody></table></div>
    </div>
  );
}
