"use client";
import { useState } from "react";
import { ShoppingBag, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { GRINDS, WEIGHTS, priceFor, fmt, SUBSCRIPTION_DISCOUNT, type Grind, type Weight } from "@/lib/pricing";
import { useCart } from "@/store/cart";

export default function AddToCart({ p }: { p: Product }) {
  const [grind, setGrind] = useState<Grind>("Çekirdek");
  const [weight, setWeight] = useState<Weight>(250);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const price = priceFor(p.price, weight);
  const out = p.stock <= 0;
  const submit = () => {
    add({ productId: p.id, slug: p.slug, name: p.name, color: p.color, grind, weight, unitPrice: price }, qty);
    setAdded(true); setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="card p-6">
      <div className="flex items-baseline gap-2"><span className="font-serif text-3xl font-bold">{fmt(price)}</span><span className="text-sm text-[var(--mocha)]">/ {weight} g</span>{weight > 250 && <span className="chip bg-green-100 text-green-800">{weight === 500 ? "%5" : "%10"} avantaj</span>}</div>
      <div className="mt-5"><div className="label">Gramaj</div><div className="flex gap-2">{WEIGHTS.map((w) => <button key={w} onClick={() => setWeight(w)} className={`chip px-4 py-2 text-sm transition ${weight === w ? "border-transparent bg-[var(--espresso)] text-[var(--cream)]" : "hover:border-espresso/40"}`}>{w >= 1000 ? "1 kg" : `${w} g`}</button>)}</div></div>
      <div className="mt-4"><div className="label">Öğütüm</div><div className="flex flex-wrap gap-2">{GRINDS.map((g) => <button key={g} onClick={() => setGrind(g)} className={`chip px-3 py-2 text-sm transition ${grind === g ? "border-transparent bg-[var(--espresso)] text-[var(--cream)]" : "hover:border-espresso/40"}`}>{g}</button>)}</div><p className="mt-2 text-xs text-[var(--mocha)]">Çekirdek olarak alıp evde öğütmek en taze sonucu verir.</p></div>
      <div className="mt-5 flex gap-3">
        <div className="flex items-center rounded-full border border-espresso/15"><button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3">−</button><span className="w-8 text-center font-semibold">{qty}</span><button onClick={() => setQty(qty + 1)} className="px-4 py-3">+</button></div>
        <button onClick={submit} disabled={out} className="btn-accent flex-1 !py-3.5 text-base">{added ? <><Check size={18} /> Sepete eklendi</> : out ? "Tükendi" : <><ShoppingBag size={18} /> Sepete ekle · {fmt(price * qty)}</>}</button>
      </div>
      <Link href={`/abonelik?kahve=${p.slug}`} className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-accent/40 bg-accent/5 px-4 py-3 text-sm transition hover:bg-accent/10"><span className="flex items-center gap-2"><RefreshCw size={16} className="text-[var(--accent)]" /><span><b>Abonelikle al, %{SUBSCRIPTION_DISCOUNT * 100} tasarruf et</b><br /><span className="text-xs text-[var(--mocha)]">Her 4 haftada bir · istediğin zaman iptal</span></span></span><b className="text-[var(--accent)]">{fmt(Math.round(price * (1 - SUBSCRIPTION_DISCOUNT)))}</b></Link>
      <p className="mt-4 text-xs text-[var(--mocha)]">🚚 Bugün 16:00&apos;a kadar sipariş → bugün kargoda · 500 ₺ üzeri ücretsiz kargo · Stok: {p.stock} paket</p>
    </div>
  );
}
