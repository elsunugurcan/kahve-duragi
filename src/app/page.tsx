import Link from "next/link";
import { ArrowRight, Leaf, Truck, RefreshCw, Flame } from "lucide-react";
import { featuredProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import BagArt from "@/components/BagArt";

export const dynamic = "force-dynamic";

export default function Home() {
  const featured = featuredProducts();
  const hero = featured[0];
  return (
    <>
      <section className="container-x grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="rise">
          <span className="chip"><Flame size={12} className="text-[var(--accent)]" /> Bu hafta kavruldu</span>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">Taze kavrulmuş kahve, <em className="text-[var(--accent)]">kapına</em> gelsin.</h1>
          <p className="mt-5 max-w-lg text-lg text-[var(--mocha)]">Küçük partiler, tek köken çekirdekler, üzerinde kavurma tarihi. 16:00&apos;a kadar sipariş ver, bugün kargoda.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/urunler" className="btn-primary">Kahveleri keşfet <ArrowRight size={16} /></Link><Link href="/kahveni-bul" className="btn-outline">Kahveni bul · 1 dk</Link></div>
          <div className="mt-10 grid grid-cols-3 gap-4 text-sm">{[[Leaf, "Tek köken", "Çiftlikten izlenebilir"], [Truck, "Aynı gün kargo", "500 ₺ üzeri ücretsiz"], [RefreshCw, "Abonelik", "%15 daha uygun"]].map(([I, a, b]) => { const Icon = I as typeof Leaf; return <div key={a as string}><Icon size={20} className="text-[var(--accent)]" /><div className="mt-2 font-semibold">{a as string}</div><div className="text-xs text-[var(--mocha)]">{b as string}</div></div>; })}</div>
        </div>
        <div className="relative rise" style={{ animationDelay: ".15s" }}>
          <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-accent/20 via-[var(--cream-2)] to-transparent" />
          {hero && <BagArt color={hero.color} name={hero.name} origin={hero.origin} roast={hero.roast} className="mx-auto h-[420px] w-auto drop-shadow-2xl md:h-[520px]" />}
          {hero && <Link href={`/urun/${hero.slug}`} className="card absolute bottom-6 left-6 flex items-center gap-3 px-4 py-3 text-sm backdrop-blur"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /><span><b>{hero.name}</b><br /><span className="text-xs text-[var(--mocha)]">{hero.notes.join(" · ")}</span></span></Link>}
        </div>
      </section>

      <section className="container-x mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Seçkimiz</div><h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Bu haftanın kahveleri</h2></div><Link href="/urunler" className="btn-outline">Tümünü gör <ArrowRight size={16} /></Link></div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p, i) => <ProductCard key={p.id} p={p} badge={i === 0 ? "Haftanın kahvesi" : undefined} />)}</div>
      </section>

      <section className="container-x mt-24">
        <div className="card grid items-center gap-8 overflow-hidden bg-[var(--espresso)] p-8 text-[var(--cream)] md:grid-cols-2 md:p-14">
          <div><div className="eyebrow">Abonelik</div><h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Her ay taze kahve, %15 daha uygun.</h2><p className="mt-4 text-cream/70">Damak zevkine göre seçilen 2 farklı kahve, kavurmadan 48 saat sonra kapında. İstediğin zaman atla, duraklat ya da iptal et.</p><Link href="/abonelik" className="btn-accent mt-6">Aboneliği kur</Link></div>
          <div className="grid grid-cols-3 gap-3">{featured.slice(1, 4).map((p) => <div key={p.id} className="rounded-2xl bg-white/5 p-3"><BagArt color={p.color} name={p.name} origin={p.origin} roast={p.roast} className="h-32 w-auto mx-auto" /></div>)}</div>
        </div>
      </section>

      <section className="container-x mt-24 grid gap-8 md:grid-cols-3">
        {[["01", "Yeşil çekirdek seçimi", "Her sezon 30'dan fazla numune tadıyor, en iyi 10-12'sini raflara alıyoruz. Çiftlik ve kooperatif adını pakette görürsün."], ["02", "Küçük parti kavurma", "12 kg'lık partiler, her köken için ayrı kavurma profili. Kavurma tarihi pakette; 3 günden eski kahve göndermiyoruz."], ["03", "Demleme desteği", "Her siparişle demleme kartı gelir. Kararsız kaldığında WhatsApp'tan baristalarımıza sorabilirsin."]].map(([n, t, d]) => <div key={n} className="card p-7"><div className="font-serif text-4xl font-bold text-[var(--accent)]">{n}</div><h3 className="mt-3 text-lg font-bold">{t}</h3><p className="mt-2 text-sm text-[var(--mocha)]">{d}</p></div>)}
      </section>
    </>
  );
}
