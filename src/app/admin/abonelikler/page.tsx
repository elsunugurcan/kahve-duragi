import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { fmt, PLANS, type PlanKey } from "@/lib/pricing";
export const dynamic = "force-dynamic";
export default function Page() {
  const subs = db.select().from(schema.subscriptions).orderBy(desc(schema.subscriptions.id)).all();
  return <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-xs uppercase text-[var(--mocha)]"><tr>{["#", "E-posta", "Plan", "Öğütüm", "Sıklık", "Tutar", "Başlangıç"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>
    {subs.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-[var(--mocha)]">Henüz abonelik yok.</td></tr>}
    {subs.map((s) => <tr key={s.id} className="border-t border-espresso/10"><td className="px-4 py-3 font-mono">#{s.id}</td><td className="px-4 py-3">{s.email}</td><td className="px-4 py-3">{PLANS[s.plan as PlanKey]?.name}</td><td className="px-4 py-3">{s.grind}</td><td className="px-4 py-3">{s.frequencyWeeks} hafta</td><td className="px-4 py-3 font-semibold">{fmt(s.price)}</td><td className="px-4 py-3 text-xs">{new Date(s.createdAt + "Z").toLocaleDateString("tr-TR")}</td></tr>)}
  </tbody></table></div>;
}
