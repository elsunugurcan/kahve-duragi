"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { fmt, FREE_SHIPPING_MIN, SHIPPING } from "@/lib/pricing";
import BagArt from "@/components/BagArt";

export default function Page() {
  const { items, setQty, remove } = useCart();
  const subtotal = cartSubtotal(items);
  const ship = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING.standart.fee;
  return (
    <section className="container-x py-10">
      <h1 className="font-serif text-4xl font-bold">Sepet</h1>
      {items.length === 0 ? <div className="card mt-8 p-16 text-center text-[var(--mocha)]"><p>Sepetin boş.</p><Link href="/urunler" className="btn-primary mt-4">Kahvelere göz at</Link></div> : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="card divide-y divide-espresso/10">
            {items.map((i) => (
              <div key={i.key} className="flex items-center gap-4 p-5">
                <div className="h-24 w-20 shrink-0 rounded-xl bg-[var(--cream-2)] p-1"><BagArt color={i.color} name={i.name} origin="" roast="" className="h-full w-full" /></div>
                <div className="min-w-0 flex-1"><Link href={`/urun/${i.slug}`} className="font-serif text-lg font-bold">{i.name}</Link><div className="text-sm text-[var(--mocha)]">{i.weight} g · {i.grind} · {fmt(i.unitPrice)} / adet</div></div>
                <div className="flex items-center rounded-full border border-espresso/15"><button onClick={() => setQty(i.key, i.qty - 1)} className="p-2" aria-label="Azalt"><Minus size={14} /></button><span className="w-8 text-center">{i.qty}</span><button onClick={() => setQty(i.key, i.qty + 1)} className="p-2" aria-label="Artır"><Plus size={14} /></button></div>
                <div className="w-24 text-right font-semibold">{fmt(i.unitPrice * i.qty)}</div>
                <button onClick={() => remove(i.key)} className="text-[var(--mocha)] hover:text-[var(--accent)]" aria-label="Kaldır"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <aside className="card h-fit p-6">
            <h2 className="font-serif text-xl font-bold">Özet</h2>
            <div className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><span>Ara toplam</span><span>{fmt(subtotal)}</span></div><div className="flex justify-between"><span>Kargo (standart)</span><span>{ship === 0 ? <span className="text-green-700">Ücretsiz</span> : fmt(ship)}</span></div><div className="flex justify-between border-t border-espresso/10 pt-3 text-lg font-bold"><span>Toplam</span><span>{fmt(subtotal + ship)}</span></div></div>
            <p className="mt-3 text-xs text-[var(--mocha)]">Kupon kodunu ödeme adımında girebilirsin.</p>
            <Link href="/odeme" className="btn-accent mt-5 w-full">Ödemeye geç <ArrowRight size={16} /></Link>
          </aside>
        </div>
      )}
    </section>
  );
}
