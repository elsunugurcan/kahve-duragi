import { db, schema } from "@/db";
import { eq, and, desc, like, or, sql } from "drizzle-orm";
import type { Product } from "@/db/schema";

export type Filters = { q?: string; origin?: string; roast?: string; process?: string; sort?: "yeni" | "fiyat-artan" | "fiyat-azalan" | "populer" };

export function listProducts(f: Filters = {}): Product[] {
  const conds = [];
  if (f.q) conds.push(or(like(schema.products.name, `%${f.q}%`), like(schema.products.origin, `%${f.q}%`), like(schema.products.notes, `%${f.q}%`)));
  if (f.origin) conds.push(eq(schema.products.origin, f.origin));
  if (f.roast) conds.push(like(schema.products.roast, `${f.roast}%`));
  if (f.process) conds.push(like(schema.products.process, `${f.process}%`));
  const order = f.sort === "fiyat-artan" ? schema.products.price : f.sort === "fiyat-azalan" ? desc(schema.products.price) : f.sort === "yeni" ? desc(schema.products.roastedAt) : desc(schema.products.featured);
  return db.select().from(schema.products).where(conds.length ? and(...conds) : undefined).orderBy(order, schema.products.id).all();
}
export const getProduct = (slug: string) => db.select().from(schema.products).where(eq(schema.products.slug, slug)).get() ?? null;
export const featuredProducts = () => db.select().from(schema.products).where(eq(schema.products.featured, true)).limit(6).all();
export const facets = () => ({
  origins: db.select({ v: schema.products.origin, n: sql<number>`count(*)` }).from(schema.products).groupBy(schema.products.origin).all(),
  roasts: ["Açık", "Orta", "Koyu"],
  processes: ["Yıkanmış", "Natural", "Honey"],
});
