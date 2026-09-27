import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Mountain, Droplets, Flame, CalendarDays } from "lucide-react";
import { getProduct, listProducts } from "@/lib/queries";
import { fmtDate } from "@/lib/pricing";
import BagArt from "@/components/BagArt";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  return { title: p?.name ?? "Ürün", description: p?.description };
}

const BREW: Record<string, string[]> = {
  "Açık": ["V60 / Chemex: 15 g kahve, 250 g su, 94°C, 3:00", "AeroPress: 14 g, 220 g su, 1:30 demleme", "Soğuk demleme: 1:8 oran, 14 saat"],
  "Orta": ["Filtre makinesi: 60 g/L", "French press: 1:15, 4 dk", "Espresso: 18 g → 40 g, 28 sn"],
  "Orta-Koyu": ["Espresso: 18 g → 36 g, 26 sn, 92°C", "Moka pot: ince öğütüm, kısık ateş", "Sütlü kahveler için ideal"],
  "Koyu": ["French press: 1:14, 4 dk", "Türk kahvesi: çok ince öğütüm", "Moka pot: orta-ince öğütüm"],
};

export default function Page({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  const similar = listProducts({ roast: p.roast.split("-")[0] }).filter((x) => x.id !== p.id).slice(0, 3);
  const days = Math.floor((Date.now() - new Date(p.roastedAt).getTime()) / 864e5);
  return (
    <section className="container-x py-8">
      <nav className="flex items-center gap-1 text-xs text-[var(--mocha)]"><Link href="/">Ana sayfa</Link><ChevronRight size={12} /><Link href="/urunler">Kahveler</Link><ChevronRight size={12} /><span className="text-[var(--espresso)]">{p.name}</span></nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="card relative overflow-hidden bg-[var(--cream-2)] p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.7),transparent_50%)]" /><BagArt color={p.color} name={p.name} origin={p.origin} roast={p.roast} className="relative mx-auto h-[460px] w-auto drop-shadow-2xl" /></div>
        <div>
          <div className="flex flex-wrap gap-2"><span className="chip">{p.origin}</span><span className="chip">{p.process}</span><span className="chip">{p.roast} kavrum</span>{days <= 3 && <span className="chip bg-green-100 text-green-800">Bu hafta kavruldu</span>}</div>
          <h1 className="mt-4 font-serif text-4xl font-bold md:text-5xl">{p.name}</h1>
          <p className="mt-2 text-lg text-[var(--accent)]">{p.notes.join(" · ")}</p>
          <p className="mt-4 text-[var(--mocha)]">{p.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[[Mountain, "Rakım", p.altitude], [Droplets, "İşlem", p.process], [Flame, "Kavrum", p.roast], [CalendarDays, "Kavurma", fmtDate(p.roastedAt)]].map(([I, a, b]) => { const Icon = I as typeof Mountain; return <div key={a as string} className="rounded-2xl bg-white/60 p-3"><Icon size={16} className="text-[var(--accent)]" /><div className="mt-1 text-xs text-[var(--mocha)]">{a as string}</div><div className="font-semibold">{b as string}</div></div>; })}
          </div>
          <div className="mt-6"><AddToCart p={p} /></div>
        </div>
      </div>
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="card p-7"><h2 className="font-serif text-2xl font-bold">Nasıl demlenir?</h2><ul className="mt-4 space-y-3 text-sm">{(BREW[p.roast] ?? BREW["Orta"]).map((b) => <li key={b} className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />{b}</li>)}</ul></div>
        <div className="card p-7"><h2 className="font-serif text-2xl font-bold">Köken</h2><p className="mt-4 text-sm text-[var(--mocha)]">{p.region ? `${p.region} bölgesinden.` : ""} {p.origin === "Harman" ? "Harmanlar her partide aynı tat profilini korumak için kavurmadan sonra karıştırılır." : `Kooperatif ve küçük çiftliklerden doğrudan ticaretle alınır; ödediğimiz fiyat borsa fiyatının en az %30 üzerindedir.`}</p><div className="mt-4 flex flex-wrap gap-2">{p.notes.map((n) => <span key={n} className="chip">{n}</span>)}</div></div>
      </div>
      {similar.length > 0 && <div className="mt-20"><h2 className="font-serif text-3xl font-bold">Benzer kahveler</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <ProductCard key={s.id} p={s} />)}</div></div>}
    </section>
  );
}
