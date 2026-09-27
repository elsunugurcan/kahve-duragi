import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { listProducts, facets, type Filters } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tüm Kahveler" };

const build = (base: Record<string, string | undefined>, patch: Record<string, string | undefined>) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...base, ...patch })) if (v) q.set(k, v);
  const s = q.toString();
  return "/urunler" + (s ? "?" + s : "");
};

export default function Page({ searchParams }: { searchParams: Filters }) {
  const products = listProducts(searchParams);
  const f = facets();
  const sp = searchParams as Record<string, string | undefined>;
  const Chip = ({ k, v, label }: { k: string; v?: string; label: string }) => {
    const on = (sp[k] ?? "") === (v ?? "");
    return <Link href={build(sp, { [k]: on && v ? undefined : v })} className={`chip transition ${on ? "border-transparent bg-[var(--espresso)] text-[var(--cream)]" : "hover:border-espresso/40"}`}>{label}</Link>;
  };
  return (
    <section className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><div className="eyebrow">Mağaza</div><h1 className="mt-2 font-serif text-4xl font-bold">Tüm kahveler <span className="text-base font-sans font-normal text-[var(--mocha)]">· {products.length} ürün</span></h1></div>
        <form className="flex gap-2"><input name="q" defaultValue={sp.q} placeholder="Kahve, köken veya nota ara…" className="input w-64" />{Object.entries(sp).filter(([k, v]) => k !== "q" && v).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}<button className="btn-primary">Ara</button></form>
      </div>
      <div className="card mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 text-sm">
        <span className="flex items-center gap-2 font-semibold"><SlidersHorizontal size={16} /> Filtre</span>
        <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-[var(--mocha)]">Köken</span>{f.origins.map((o) => <Chip key={o.v} k="origin" v={o.v} label={`${o.v} (${o.n})`} />)}</div>
        <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-[var(--mocha)]">Kavrum</span>{f.roasts.map((r) => <Chip key={r} k="roast" v={r} label={r} />)}</div>
        <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-[var(--mocha)]">İşlem</span>{f.processes.map((r) => <Chip key={r} k="process" v={r} label={r} />)}</div>
        <div className="ml-auto flex flex-wrap items-center gap-2"><span className="text-xs text-[var(--mocha)]">Sırala</span>{[["populer", "Popüler"], ["yeni", "Yeni kavrum"], ["fiyat-artan", "Fiyat ↑"], ["fiyat-azalan", "Fiyat ↓"]].map(([v, l]) => <Chip key={v} k="sort" v={v} label={l} />)}</div>
        {Object.values(sp).some(Boolean) && <Link href="/urunler" className="text-xs underline">Temizle</Link>}
      </div>
      {products.length === 0 ? <p className="py-20 text-center text-[var(--mocha)]">Bu filtreyle ürün bulunamadı.</p> : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </section>
  );
}
