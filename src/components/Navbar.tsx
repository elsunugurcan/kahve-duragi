"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, cartCount } from "@/store/cart";

const links = [
  { href: "/urunler", label: "Kahveler" },
  { href: "/abonelik", label: "Abonelik" },
  { href: "/kahveni-bul", label: "Kahveni Bul" },
  { href: "/hakkimizda", label: "Kavurma Evi" },
];

export default function Navbar() {
  const path = usePathname();
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const [count, setCount] = useState(0);
  const [menu, setMenu] = useState(false);
  useEffect(() => setCount(cartCount(items)), [items]);
  useEffect(() => setMenu(false), [path]);
  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-cream/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">Kahve <span className="text-[var(--accent)]">Durağı</span></Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`rounded-full px-4 py-2 text-sm font-medium transition ${path.startsWith(l.href) ? "bg-[var(--espresso)] text-[var(--cream)]" : "hover:bg-espresso/5"}`}>{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="relative rounded-full p-2.5 transition hover:bg-espresso/5" aria-label="Sepet">
            <ShoppingBag size={22} />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[11px] font-bold text-white">{count}</span>}
          </button>
          <button onClick={() => setMenu(!menu)} className="rounded-full p-2.5 md:hidden" aria-label="Menü">{menu ? <X /> : <Menu />}</button>
        </div>
      </div>
      {menu && (
        <nav className="container-x flex flex-col gap-1 pb-4 md:hidden">
          {links.map((l) => <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 font-medium hover:bg-espresso/5">{l.label}</Link>)}
        </nav>
      )}
    </header>
  );
}
