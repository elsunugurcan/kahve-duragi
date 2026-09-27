# Kahve Durağı — Abonelikli Kahve E-Ticaret Sitesi

Konsept e-ticaret projesi (uurstudio portföyü). Taze kavrulmuş çekirdek kahve satan bir kavurucu için tek seferlik satış + aylık abonelik modeli.

## Teknolojiler
- **Next.js 14** (App Router, Server Actions, Middleware) · **TypeScript**
- **Drizzle ORM + SQLite** (better-sqlite3) — ürün, sipariş, kupon, abonelik tabloları
- **Zustand** (persist) — sepet durumu
- **Zod** — sunucu tarafı form doğrulama; fiyatlar istemciden değil sunucuda hesaplanır
- **Tailwind CSS** · **lucide-react**
- **Playwright** — uçtan uca test + ekran görüntüleri (`scripts/e2e-screenshots.mjs`)

## Özellikler
- Ürün listesi: köken / kavrum / işlem filtreleri, arama, sıralama (URL tabanlı)
- Ürün detayı: gramaj (250 g / 500 g / 1 kg) ve öğütüm varyantları, kavurma tarihi, demleme rehberi
- Sepet çekmecesi, ücretsiz kargo eşiği, kupon (`HOSGELDIN` %10, `KAHVE100` 800 ₺ üzeri 100 ₺)
- Ödeme: teslimat + kargo seçimi + test kartı (4242… başarılı, 4000… reddedilir), stok düşümü, sipariş numarası
- Sipariş onayı ve sipariş takibi (numara + e-posta)
- Abonelik planları (%15 indirim), "Kahveni bul" eşleştirme testi
- Yönetim paneli (`/admin`, şifre `kahve123`): siparişler + durum güncelleme, stok, öne çıkanlar, abonelikler

## Kurulum
```bash
npm install
npm run db:setup      # şemayı oluşturur ve 12 kahve + kuponları ekler
npm run dev           # http://localhost:3000
```

## Test ve ekran görüntüleri
```bash
npm run build && npm start
node scripts/e2e-screenshots.mjs   # 18 kontrol, screenshots/ klasörüne görseller
```

## Notlar
- Ödeme test modundadır; gerçek tahsilat yoktur, kart bilgisi saklanmaz. Canlıya alırken `placeOrder` içindeki test kartı kuralı iyzico/Stripe çağrısıyla değiştirilir.
- `ADMIN_PASSWORD` ve `DATABASE_PATH` ortam değişkenleriyle özelleştirilebilir (`.env.example`).
