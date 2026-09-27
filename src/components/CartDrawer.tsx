"use client";
import Link from "next/link";
import { X, Minus, Plus, Trash2, Truck } from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { fmt, FREE_SHIPPING_MIN } from "@/lib/pricing";
import BagArt from "./BagArt";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove } = useCart();
  const subtotal = cartSubtotal(items);
  const toFree = Math.max(0, FREE_SHIPPING_MIN - subtotal);
  return (
    <>
      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-50 bg-espresso/40 backdrop-blur-sm transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--cream)] shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} aria-label="Sepet">
        <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-4">
          <h2 className="font-serif text-xl font-bold">Sepetin</h2>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-espresso/5" aria-label="Kapat"><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="py-16 text-center text-[var(--mocha)]"><p>Sepetin boş.</p><Link href="/urunler" onClick={() => setOpen(false)} className="btn-primary mt-4">Kahvelere göz at</Link></div>
          ) : items.map((i) => (
            <div key={i.key} className="flex gap-3 border-b border-espresso/10 py-4">
              <div className="h-20 w-16 shrink-0 rounded-xl bg-[var(--cream-2)] p-1"><BagArt color={i.color} name={i.name} origin="" roast="" className="h-full w-full" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2"><Link href={`/urun/${i.slug}`} onClick={() => setOpen(false)} className="truncate font-semibold">{i.name}</Link><button onClick={() => remove(i.key)} className="text-[var(--mocha)] hover:text-[var(--accent)]" aria-label="Kaldır"><Trash2 size={16} /></button></div>
                <div className="text-xs text-[var(--mocha)]">{i.weight} g · {i.grind}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-espresso/15"><button onClick={() => setQty(i.key, i.qty - 1)} className="p-1.5" aria-label="Azalt"><Minus size={14} /></button><span className="w-7 text-center text-sm">{i.qty}</span><button onClick={() => setQty(i.key, i.qty + 1)} className="p-1.5" aria-label="Artır"><Plus size={14} /></button></div>
                  <div className="font-semibold">{fmt(i.unitPrice * i.qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="border-t border-espresso/10 p-5">
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-[var(--cream-2)] px-3 py-2 text-xs text-[var(--mocha)]"><Truck size={14} />{toFree > 0 ? <span><b>{fmt(toFree)}</b> daha ekle, kargo bedava olsun</span> : <span className="text-green-700">Kargo bedava 🎉</span>}</div>
            <div className="flex justify-between text-sm"><span>Ara toplam</span><b>{fmt(subtotal)}</b></div>
            <Link href="/odeme" onClick={() => setOpen(false)} className="btn-accent mt-4 w-full">Ödemeye geç</Link>
            <Link href="/sepet" onClick={() => setOpen(false)} className="mt-2 block text-center text-sm text-[var(--mocha)] underline">Sepeti görüntüle</Link>
          </div>
        )}
      </aside>
    </>
  );
}
