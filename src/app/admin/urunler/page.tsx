import { db, schema } from "@/db";
import { fmt } from "@/lib/pricing";
import { setStock, toggleFeatured } from "../actions";
export const dynamic = "force-dynamic";
export default function Page() {
  const products = db.select().from(schema.products).orderBy(schema.products.id).all();
  return <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-xs uppercase text-[var(--mocha)]"><tr>{["Ürün", "Köken", "Kavrum", "Fiyat (250 g)", "Kavurma", "Stok", "Öne çıkan"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>
    {products.map((p) => <tr key={p.id} className="border-t border-espresso/10"><td className="px-4 py-3"><span className="mr-2 inline-block h-3 w-3 rounded-full align-middle" style={{ background: p.color }} /><b>{p.name}</b></td><td className="px-4 py-3">{p.origin}</td><td className="px-4 py-3">{p.roast}</td><td className="px-4 py-3">{fmt(p.price)}</td><td className="px-4 py-3">{p.roastedAt}</td><td className="px-4 py-3"><form action={async (fd) => { "use server"; await setStock(p.id, Number(fd.get("stock"))); }} className="flex gap-1"><input name="stock" type="number" defaultValue={p.stock} className={`input !w-20 !py-1.5 text-xs ${p.stock < 20 ? "border-amber-400" : ""}`} /><button className="btn-outline !px-3 !py-1.5 text-xs">✓</button></form></td><td className="px-4 py-3"><form action={async () => { "use server"; await toggleFeatured(p.id); }}><button className={`chip ${p.featured ? "bg-[var(--espresso)] text-[var(--cream)] border-transparent" : ""}`}>{p.featured ? "Evet" : "Hayır"}</button></form></td></tr>)}
  </tbody></table></div>;
}
