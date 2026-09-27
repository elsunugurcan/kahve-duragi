import Quiz from "./Quiz";
import { listProducts } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const metadata = { title: "Kahveni Bul" };
export default function Page() {
  const products = listProducts().map((p) => ({ slug: p.slug, name: p.name, roast: p.roast, process: p.process, notes: p.notes, color: p.color, origin: p.origin, price: p.price }));
  return <section className="container-x py-10"><div className="mx-auto max-w-3xl"><div className="eyebrow">1 dakikalık test</div><h1 className="mt-2 font-serif text-4xl font-bold">Sana göre kahveyi bulalım</h1><p className="mt-3 text-[var(--mocha)]">Üç soru, bir öneri. Demleme yöntemine ve damak zevkine göre eşleştiriyoruz.</p><div className="mt-8"><Quiz products={products} /></div></div></section>;
}
