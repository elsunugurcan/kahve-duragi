"use client";
import { useState } from "react";
import Link from "next/link";
import BagArt from "@/components/BagArt";
import { fmt } from "@/lib/pricing";

type P = { slug: string; name: string; roast: string; process: string; notes: string[]; color: string; origin: string; price: number };
const Q = [
  { q: "Nasıl demliyorsun?", opts: [["filtre", "Filtre / V60 / Chemex"], ["espresso", "Espresso makinesi"], ["press", "French press / Moka pot"], ["turk", "Türk kahvesi"]] },
  { q: "Hangi tat seni daha çok çeker?", opts: [["meyve", "Meyveli, parlak, çiçeksi"], ["cikolata", "Çikolatalı, fındıklı, yumuşak"], ["karamel", "Karamelli, dengeli"], ["yogun", "Yoğun, topraksı, güçlü"]] },
  { q: "Sütle mi, sade mi?", opts: [["sade", "Sade"], ["sut", "Sütlü"], ["ikisi", "Değişiyor"]] },
];
function pick(a: string[], products: P[]) {
  const score = (p: P) => {
    let s = 0;
    if (a[0] === "filtre" && p.roast === "Açık") s += 3; if (a[0] === "espresso" && p.roast.includes("Koyu")) s += 3; if (a[0] === "press" && (p.roast === "Orta" || p.roast === "Koyu")) s += 2; if (a[0] === "turk" && p.roast === "Koyu") s += 3;
    if (a[1] === "meyve" && (p.process === "Natural" || p.roast === "Açık")) s += 3; if (a[1] === "cikolata" && p.notes.some((n) => /çikolata|fındık/i.test(n))) s += 3; if (a[1] === "karamel" && p.notes.some((n) => /karamel|bal/i.test(n))) s += 3; if (a[1] === "yogun" && p.notes.some((n) => /toprak|sedir|bitter/i.test(n))) s += 3;
    if (a[2] === "sut" && p.roast.includes("Koyu")) s += 2; if (a[2] === "sade" && p.roast === "Açık") s += 1;
    return s;
  };
  return [...products].sort((x, y) => score(y) - score(x)).slice(0, 3);
}
export default function Quiz({ products }: { products: P[] }) {
  const [a, setA] = useState<string[]>([]);
  const step = a.length;
  if (step === Q.length) {
    const res = pick(a, products);
    return <div><div className="card p-6 md:p-8"><div className="eyebrow">Sana en uygun</div><div className="mt-4 grid gap-6 md:grid-cols-[auto_1fr] md:items-center"><BagArt color={res[0].color} name={res[0].name} origin={res[0].origin} roast={res[0].roast} className="mx-auto h-56 w-auto" /><div><h2 className="font-serif text-3xl font-bold">{res[0].name}</h2><p className="mt-1 text-[var(--accent)]">{res[0].notes.join(" · ")}</p><p className="mt-2 text-sm text-[var(--mocha)]">{res[0].origin} · {res[0].process} · {res[0].roast} kavrum</p><div className="mt-4 flex gap-3"><Link href={`/urun/${res[0].slug}`} className="btn-accent">İncele · {fmt(res[0].price)}</Link><button onClick={() => setA([])} className="btn-outline">Yeniden başla</button></div></div></div></div>
      <h3 className="mt-8 font-semibold">Bunlar da olabilir</h3><div className="mt-3 grid gap-4 sm:grid-cols-2">{res.slice(1).map((p) => <Link key={p.slug} href={`/urun/${p.slug}`} className="card flex items-center gap-4 p-4"><BagArt color={p.color} name={p.name} origin={p.origin} roast={p.roast} className="h-20 w-auto" /><div><b>{p.name}</b><div className="text-xs text-[var(--mocha)]">{p.notes.join(" · ")}</div></div></Link>)}</div></div>;
  }
  const q = Q[step];
  return <div className="card p-6 md:p-8"><div className="flex items-center gap-2 text-xs text-[var(--mocha)]">{Q.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[var(--accent)]" : "bg-espresso/10"}`} />)}<span className="ml-2">{step + 1}/{Q.length}</span></div><h2 className="mt-5 font-serif text-2xl font-bold">{q.q}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{q.opts.map(([v, l]) => <button key={v} onClick={() => setA([...a, v])} className="rounded-2xl border border-espresso/15 bg-white/50 p-5 text-left font-medium transition hover:border-[var(--accent)] hover:bg-accent/5">{l}</button>)}</div>{step > 0 && <button onClick={() => setA(a.slice(0, -1))} className="mt-4 text-sm text-[var(--mocha)] underline">← Geri</button>}</div>;
}
