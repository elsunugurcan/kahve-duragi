"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const PASS = process.env.ADMIN_PASSWORD ?? "kahve123";
export async function login(fd: FormData) {
  if (String(fd.get("password")) !== PASS) redirect("/admin/login?hata=1");
  cookies().set("kd_admin", "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}
export async function logout() { cookies().delete("kd_admin"); redirect("/admin/login"); }
export async function isAdmin() { return cookies().get("kd_admin")?.value === "1"; }

export async function setOrderStatus(id: number, status: string) {
  if (!(await isAdmin())) return;
  db.update(schema.orders).set({ status }).where(eq(schema.orders.id, id)).run();
  revalidatePath("/admin");
}
export async function setStock(id: number, stock: number) {
  if (!(await isAdmin())) return;
  db.update(schema.products).set({ stock: Math.max(0, stock) }).where(eq(schema.products.id, id)).run();
  revalidatePath("/admin/urunler"); revalidatePath("/urunler");
}
export async function toggleFeatured(id: number) {
  if (!(await isAdmin())) return;
  const p = db.select().from(schema.products).where(eq(schema.products.id, id)).get();
  if (p) db.update(schema.products).set({ featured: !p.featured }).where(eq(schema.products.id, id)).run();
  revalidatePath("/admin/urunler"); revalidatePath("/");
}
