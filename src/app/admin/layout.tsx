import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin, logout } from "./actions";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const path = headers().get("x-pathname") ?? "";
  const ok = await isAdmin();
  if (!ok && !path.startsWith("/admin/login")) redirect("/admin/login");
  if (!ok) return <>{children}</>;
  return <section className="container-x py-8"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-espresso/10 pb-4"><div className="flex items-center gap-2"><span className="font-serif text-xl font-bold">Yönetim</span><nav className="ml-4 flex gap-1 text-sm">{[["/admin", "Siparişler"], ["/admin/urunler", "Ürünler & Stok"], ["/admin/abonelikler", "Abonelikler"]].map(([h, l]) => <Link key={h} href={h} className="rounded-full px-3 py-1.5 hover:bg-espresso/5">{l}</Link>)}</nav></div><form action={logout}><button className="btn-outline !py-1.5 text-xs">Çıkış</button></form></div><div className="mt-6">{children}</div></section>;
}
