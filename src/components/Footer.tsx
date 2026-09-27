import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-espresso/10 bg-[var(--cream-2)]">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl font-bold">Kahve <span className="text-[var(--accent)]">Durağı</span></div>
          <p className="mt-3 max-w-sm text-sm text-[var(--mocha)]">Adana&apos;da küçük partiler halinde kavuruyoruz. Her paket kavurma tarihiyle çıkar; siparişin 16:00&apos;a kadar verilirse aynı gün kargoda.</p>
        </div>
        <div><div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--mocha)]">Mağaza</div><ul className="space-y-2 text-sm">{[["/urunler", "Tüm kahveler"], ["/urunler?roast=Açık", "Açık kavrum"], ["/urunler?roast=Koyu", "Koyu kavrum"], ["/abonelik", "Abonelik"], ["/kahveni-bul", "Kahveni bul"]].map(([h, l]) => <li key={h}><Link href={h} className="hover:text-[var(--accent)]">{l}</Link></li>)}</ul></div>
        <div><div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--mocha)]">Yardım</div><ul className="space-y-2 text-sm">{[["/hakkimizda", "Kavurma evi"], ["/siparis-takip", "Sipariş takibi"], ["/hakkimizda#kargo", "Kargo & iade"], ["/hakkimizda#iletisim", "İletişim"], ["/admin", "Yönetim"]].map(([h, l]) => <li key={h}><Link href={h} className="hover:text-[var(--accent)]">{l}</Link></li>)}</ul></div>
      </div>
      <div className="border-t border-espresso/10 py-5 text-center text-xs text-[var(--mocha)]">© {new Date().getFullYear()} Kahve Durağı Roastery · Konsept e-ticaret projesi · uurstudio tarafından geliştirildi</div>
    </footer>
  );
}
