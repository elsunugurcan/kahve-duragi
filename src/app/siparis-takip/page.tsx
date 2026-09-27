"use client";
import { useState, useTransition } from "react";
import { trackOrder } from "@/app/actions";
import { fmt, fmtDate } from "@/lib/pricing";
const LABEL: Record<string, string> = { odeme_alindi: "Ödeme alındı", hazirlaniyor: "Kavruluyor & paketleniyor", kargoda: "Kargoda", teslim: "Teslim edildi" };
export default function Page() {
  const [r, setR] = useState<Awaited<ReturnType<typeof trackOrder>> | undefined>();
  const [pending, start] = useTransition();
  return (
    <section className="container-x py-10"><div className="mx-auto max-w-lg"><h1 className="font-serif text-4xl font-bold">Sipariş takibi</h1>
      <form className="card mt-6 space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); start(async () => setR(await trackOrder(String(fd.get("number")), String(fd.get("email"))))); }}>
        <div><label htmlFor="tn" className="label">Sipariş numarası</label><input id="tn" name="number" className="input font-mono uppercase" placeholder="KDXXXXXX" required /></div>
        <div><label htmlFor="te" className="label">E-posta</label><input id="te" name="email" type="email" className="input" required /></div>
        <button disabled={pending} className="btn-primary w-full">{pending ? "Sorgulanıyor…" : "Sorgula"}</button>
        {r === null && <p className="text-sm text-red-600">Sipariş bulunamadı. Numara ve e-postayı kontrol et.</p>}
        {r && <div className="rounded-2xl bg-[var(--cream-2)] p-4 text-sm"><div className="font-mono font-bold">{r.number}</div><div className="mt-1">Durum: <b>{LABEL[r.status]}</b></div><div className="text-[var(--mocha)]">{fmtDate(r.createdAt)} · {fmt(r.total)}</div></div>}
      </form></div></section>
  );
}
