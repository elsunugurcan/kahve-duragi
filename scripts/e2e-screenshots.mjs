// Uçtan uca akış testi + gerçek ekran görüntüleri. Önce `npm run build && npm start` (port 3000).
import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "screenshots";
await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const shot = async (name, opts = {}) => { await page.waitForLoadState("networkidle"); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/${name}.png`, ...opts }); console.log("📸", name); };
const ok = (c, m) => { if (!c) throw new Error("TEST BAŞARISIZ: " + m); console.log("✓", m); };

// 1) Ana sayfa
await page.goto(BASE); await shot("01-home");
ok(await page.locator("h1").count() === 1, "ana sayfada tek H1");

// 2) Ürün listesi + filtre
await page.goto(BASE + "/urunler?roast=Açık"); await shot("02-products-filtered");
const cards = await page.locator("a[href^='/urun/']").count();
ok(cards >= 3, `açık kavrum filtresi ${cards} ürün`);

// 3) Ürün detayı, varyant, sepete ekle
await page.goto(BASE + "/urun/etiyopya-yirgacheffe"); await page.waitForLoadState("networkidle");
await page.getByRole("button", { name: "500 g" }).click();
await page.getByRole("button", { name: "Filtre", exact: true }).click();
await shot("03-product");
await page.waitForFunction(() => document.querySelector("span.font-serif.text-3xl")?.textContent?.includes("796"), null, { timeout: 5000 });
ok(true, "500 g fiyatı 796 ₺ (%5 avantaj)");
await page.getByRole("button", { name: /Sepete ekle/ }).click();
await page.waitForTimeout(500); await shot("04-cart-drawer");
ok((await page.locator("aside").innerText()).includes("Etiyopya Yirgacheffe"), "ürün sepet çekmecesinde");
await page.locator("aside button[aria-label='Kapat']").click();

// ikinci ürün
await page.goto(BASE + "/urun/ev-harmani"); await page.waitForLoadState("networkidle");
await page.getByRole("button", { name: /Sepete ekle/ }).click();
await page.waitForTimeout(300); await page.locator("aside button[aria-label='Kapat']").click();

// 4) Sepet
await page.goto(BASE + "/sepet"); await shot("05-cart");

// 5) Ödeme: önce hatalı gönderim → doğrulama, sonra kupon + başarılı
await page.goto(BASE + "/odeme"); await page.waitForLoadState("networkidle");
await page.getByRole("button", { name: /Siparişi tamamla/ }).click();
await page.waitForTimeout(600);
ok((await page.locator("text=Ad soyad en az 3 karakter").count()) === 1, "Zod doğrulama hataları görünüyor");
await shot("06-checkout-validation");
const f = { name: "Uğur Can Elsun", email: "test@kahveduragi.example", phone: "0536 522 15 23", city: "Adana", district: "Çukurova", address: "Güzelyalı Mah. Turgut Özal Blv. No:12 D:4", holder: "UGUR CAN ELSUN", number: "4242 4242 4242 4242", exp: "12/28", cvv: "123" };
const labels = { name: "Ad Soyad", email: "E-posta", phone: "Telefon", city: "İl", district: "İlçe", address: "Adres", holder: "Kart üzerindeki isim", number: "Kart numarası", exp: "Son kullanma (AA/YY)", cvv: "CVV" };
for (const [k, v] of Object.entries(f)) await page.getByLabel(labels[k], { exact: true }).fill(v);
await page.getByRole("button", { name: "Hızlı kargo" }).click();
await page.getByPlaceholder("Kupon kodu").fill("HOSGELDIN");
await page.getByRole("button", { name: "Uygula" }).click();
await page.waitForTimeout(500);
ok((await page.locator("text=%10 indirim uygulandı").count()) === 1, "kupon uygulandı");
await shot("07-checkout-filled", { fullPage: true });
await page.getByRole("button", { name: /Siparişi tamamla/ }).click();
await page.waitForURL(/\/siparis\/KD/, { timeout: 15000 });
await shot("08-order-confirmation", { fullPage: true });
const number = page.url().split("/").pop();
ok(/^KD/.test(number), "sipariş oluştu: " + number);

// 6) Reddedilen kart senaryosu
await page.goto(BASE + "/urun/kenya-aa"); await page.waitForLoadState("networkidle"); await page.getByRole("button", { name: /Sepete ekle/ }).click(); await page.waitForTimeout(300); await page.locator("aside button[aria-label='Kapat']").click();
await page.goto(BASE + "/odeme"); await page.waitForLoadState("networkidle");
for (const [k, v] of Object.entries({ ...f, number: "4000 0000 0000 0002" })) await page.getByLabel(labels[k], { exact: true }).fill(v);
await page.getByRole("button", { name: /Siparişi tamamla/ }).click(); await page.waitForTimeout(800);
ok((await page.locator("text=Banka işlemi reddetti").count()) === 1, "4000… kartı reddedildi");

// 7) Sipariş takibi
await page.goto(BASE + "/siparis-takip"); await page.waitForLoadState("networkidle");
await page.getByLabel("Sipariş numarası").fill(number); await page.getByLabel("E-posta").fill(f.email);
await page.getByRole("button", { name: "Sorgula" }).click(); await page.waitForTimeout(600);
ok((await page.locator("text=Ödeme alındı").count()) >= 1, "sipariş takibi çalışıyor");

// 8) Abonelik + Quiz
await page.goto(BASE + "/abonelik?plan=favori"); await page.waitForLoadState("networkidle"); await shot("09-subscription");
await page.getByPlaceholder("sen@ornek.com").fill(f.email);
await page.getByRole("button", { name: "Aboneliği başlat" }).click(); await page.waitForTimeout(800);
ok((await page.locator("text=Aboneliğin kuruldu").count()) === 1, "abonelik oluştu");
await page.goto(BASE + "/kahveni-bul"); await page.waitForLoadState("networkidle");
await page.getByRole("button", { name: /Filtre \/ V60/ }).click(); await page.getByRole("button", { name: /Meyveli/ }).click(); await page.getByRole("button", { name: "Sade" }).click();
await shot("10-quiz-result");

// 9) Admin
await page.goto(BASE + "/admin"); ok(page.url().includes("/admin/login"), "admin girişsiz yönlendirildi");
await page.getByLabel("Şifre").fill("kahve123"); await page.getByRole("button", { name: "Giriş" }).click();
await page.waitForURL(/\/admin$/); await shot("11-admin-orders");
ok((await page.locator("text=" + number).count()) >= 1, "sipariş admin panelinde");
await page.locator("select[name=status]").first().selectOption("kargoda"); await page.getByRole("button", { name: "Kaydet" }).first().click(); await page.waitForTimeout(600);
await page.goto(BASE + "/admin/urunler"); await shot("12-admin-products");
ok((await page.locator("text=Etiyopya Yirgacheffe").count()) >= 1, "ürün stok listesi");

// mobil görünüm
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await m.goto(BASE); await m.screenshot({ path: `${OUT}/m1-home.png` });
await m.goto(BASE + "/urun/kolombiya-huila"); await m.screenshot({ path: `${OUT}/m2-product.png` });
await m.goto(BASE + "/urunler"); await m.screenshot({ path: `${OUT}/m3-products.png` });
console.log("📸 mobil");
await browser.close();
console.log("\nTÜM TESTLER GEÇTİ");
