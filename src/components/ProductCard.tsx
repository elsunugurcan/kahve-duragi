import Link from "next/link";
import type { Product } from "@/db/schema";
import { fmt } from "@/lib/pricing";
import BagArt from "./BagArt";

export default function ProductCard({ p, badge }: { p: Product; badge?: string }) {
  const fresh = (Date.now() - new Date(p.roastedAt).getTime()) / 864e5 <= 3;
  return (
    <Link href={`/urun/${p.slug}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative bg-[var(--cream-2)] p-6">
        <BagArt color={p.color} name={p.name} origin={p.origin} roast={p.roast} className="mx-auto h-56 w-auto transition duration-500 group-hover:scale-105 group-hover:-rotate-2" />
        <div className="absolute left-3 top-3 flex gap-1">{badge && <span className="chip bg-[var(--accent)] text-white border-transparent">{badge}</span>}{fresh && <span className="chip">Yeni kavrum</span>}{p.stock < 20 && <span className="chip bg-amber-100">Az kaldı</span>}</div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs text-[var(--mocha)]">{p.origin} · {p.process}</div>
        <h3 className="mt-1 font-serif text-lg font-bold">{p.name}</h3>
        <div className="mt-1 text-sm text-[var(--mocha)]">{p.notes.join(" · ")}</div>
        <div className="mt-auto flex items-center justify-between pt-4"><span className="font-semibold">{fmt(p.price)} <span className="text-xs font-normal text-[var(--mocha)]">/ 250 g</span></span><span className="chip">{p.roast} kavrum</span></div>
      </div>
    </Link>
  );
}
