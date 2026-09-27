"use client";
import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { PLANS, GRINDS, SUBSCRIPTION_DISCOUNT, fmt, type PlanKey, type Grind } from "@/lib/pricing";
import { createSubscription } from "@/app/actions";

export default function SubscriptionForm({ initialPlan = "kesif" }: { initialPlan?: PlanKey }) {
  const [plan, setPlan] = useState<PlanKey>(initialPlan);
  const [grind, setGrind] = useState<Grind>("Çekirdek");
  const [freq, setFreq] = useState<2 | 4>(4);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ id: number; price: number } | { error: string } | null>(null);
  const [pending, start] = useTransition();
  const price = Math.round(PLANS[plan].price * (1 - SUBSCRIPTION_DISCOUNT) / 100) * 100;
  if (result && "id" in result) return <div className="card p-10 text-center"><CheckCircle2 size={56} className="mx-auto text-green-600" /><h2 className="mt-4 font-serif text-2xl font-bold">Aboneliğin kuruldu 🎉</h2><p className="mt-2 text-[var(--mocha)]">İlk paketin bu haftaki kavurmadan sonra yola çıkıyor. Her {freq} haftada bir {fmt(result.price)} · abonelik no <b className="font-mono">#{result.id}</b></p></div>;
  return (
    <form className="grid gap-8 lg:grid-cols-[1.4fr_1fr]" onSubmit={(e) => { e.preventDefault(); start(async () => setResult(await createSubscription({ email, plan, grind, frequencyWeeks: freq }))); }}>
      <div className="space-y-6">
        <section><div className="label">1. Plan</div><div className="grid gap-3 sm:grid-cols-3">{(Object.keys(PLANS) as PlanKey[]).map((k) => <button type="button" key={k} onClick={() => setPlan(k)} className={`rounded-2xl border p-5 text-left transition ${plan === k ? "border-[var(--accent)] bg-accent/5" : "border-espresso/15 bg-white/50 hover:border-espresso/40"}`}><div className="font-serif text-xl font-bold">{PLANS[k].name}</div><div className="mt-1 text-xs text-[var(--mocha)]">{PLANS[k].desc}</div><div className="mt-3"><span className="text-sm line-through text-[var(--mocha)]">{fmt(PLANS[k].price)}</span> <b>{fmt(Math.round(PLANS[k].price * (1 - SUBSCRIPTION_DISCOUNT) / 100) * 100)}</b></div></button>)}</div></section>
        <section><div className="label">2. Öğütüm</div><div className="flex flex-wrap gap-2">{GRINDS.map((g) => <button type="button" key={g} onClick={() => setGrind(g)} className={`chip px-3 py-2 text-sm ${grind === g ? "border-transparent bg-[var(--espresso)] text-[var(--cream)]" : ""}`}>{g}</button>)}</div></section>
        <section><div className="label">3. Sıklık</div><div className="flex gap-2">{([2, 4] as const).map((f) => <button type="button" key={f} onClick={() => setFreq(f)} className={`chip px-4 py-2 text-sm ${freq === f ? "border-transparent bg-[var(--espresso)] text-[var(--cream)]" : ""}`}>Her {f} haftada bir</button>)}</div></section>
        <section><div className="label">4. E-posta</div><input className="input max-w-md" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sen@ornek.com" />{result && "error" in result && <p className="mt-1 text-xs text-red-600">{result.error}</p>}</section>
      </div>
      <aside className="card h-fit p-6"><h2 className="font-serif text-xl font-bold">Özet</h2><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span>{PLANS[plan].name}</span><span className="line-through text-[var(--mocha)]">{fmt(PLANS[plan].price)}</span></div><div className="flex justify-between text-green-700"><span>Abonelik indirimi</span><span>−%{SUBSCRIPTION_DISCOUNT * 100}</span></div><div className="flex justify-between"><span>Kargo</span><span className="text-green-700">Ücretsiz</span></div><div className="flex justify-between border-t border-espresso/10 pt-3 text-xl font-bold"><span>Her {freq} haftada</span><span>{fmt(price)}</span></div></div><ul className="mt-4 space-y-1 text-xs text-[var(--mocha)]"><li>✓ İstediğin zaman atla, duraklat, iptal et</li><li>✓ Her paket kavurmadan 48 saat sonra yola çıkar</li><li>✓ Ödeme her gönderimde alınır</li></ul><button disabled={pending} className="btn-accent mt-5 w-full">{pending ? "Kuruluyor…" : "Aboneliği başlat"}</button></aside>
    </form>
  );
}
