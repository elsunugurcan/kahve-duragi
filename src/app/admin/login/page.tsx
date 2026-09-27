import { login } from "../actions";
export const metadata = { title: "Yönetim girişi" };
export default function Page({ searchParams }: { searchParams: { hata?: string } }) {
  return <section className="container-x flex min-h-[70vh] items-center justify-center"><form action={login} className="card w-full max-w-sm p-8"><h1 className="font-serif text-2xl font-bold">Yönetim paneli</h1><p className="mt-1 text-xs text-[var(--mocha)]">Demo şifre: <code>kahve123</code></p><label htmlFor="pw" className="label mt-5">Şifre</label><input id="pw" name="password" type="password" className="input" autoFocus />{searchParams.hata && <p className="mt-2 text-xs text-red-600">Şifre hatalı.</p>}<button className="btn-primary mt-4 w-full">Giriş</button></form></section>;
}
