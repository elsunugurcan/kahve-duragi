import { db, schema } from "./index";

const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

const PRODUCTS: Omit<typeof schema.products.$inferInsert, "id" | "createdAt">[] = [
  { slug: "etiyopya-yirgacheffe", name: "Etiyopya Yirgacheffe", origin: "Etiyopya", region: "Yirgacheffe, Gedeo", process: "Yıkanmış", roast: "Açık", notes: ["Yasemin", "Bergamot", "Şeftali"], altitude: "1.900 – 2.100 m", price: 41900, color: "#c2410c", featured: true, stock: 42, roastedAt: daysAgo(3),
    description: "Gedeo bölgesinin küçük üreticilerinden toplanan, geleneksel yıkanmış işlemle hazırlanan bir kahve. Fincanda çiçeksi bir açılış, bergamot asiditesi ve şeftali tatlılığı var. Filtre ve pour-over için ideal." },
  { slug: "kolombiya-huila", name: "Kolombiya Huila", origin: "Kolombiya", region: "Huila", process: "Yıkanmış", roast: "Orta", notes: ["Karamel", "Kırmızı elma", "Kakao"], altitude: "1.700 – 1.900 m", price: 38900, color: "#9a3412", featured: true, stock: 60, roastedAt: daysAgo(2),
    description: "Dengeli gövde, yuvarlak asidite ve uzun karamel bitiş. Günün her saati içilebilen, hem filtre hem espresso için çalışan bir kahve." },
  { slug: "brezilya-cerrado", name: "Brezilya Cerrado", origin: "Brezilya", region: "Cerrado Mineiro", process: "Natural", roast: "Orta-Koyu", notes: ["Fındık", "Sütlü çikolata", "Kuru meyve"], altitude: "1.000 – 1.200 m", price: 32900, color: "#78350f", featured: true, stock: 80, roastedAt: daysAgo(4),
    description: "Düşük asidite, yoğun gövde ve çikolatalı bitiş. Espresso, moka pot ve sütlü kahveler için harman temeli." },
  { slug: "kenya-aa", name: "Kenya AA", origin: "Kenya", region: "Nyeri", process: "Yıkanmış", roast: "Açık", notes: ["Siyah kuş üzümü", "Greyfurt", "Esmer şeker"], altitude: "1.700 – 1.800 m", price: 44900, color: "#b91c1c", featured: true, stock: 18, roastedAt: daysAgo(5),
    description: "Kenya'nın klasik parlak asiditesi: siyah kuş üzümü ve greyfurt, esmer şeker tatlılığıyla dengeleniyor. Soğuk demleme için de mükemmel." },
  { slug: "guatemala-antigua", name: "Guatemala Antigua", origin: "Guatemala", region: "Antigua", process: "Yıkanmış", roast: "Orta", notes: ["Bitter çikolata", "Portakal", "Baharat"], altitude: "1.500 – 1.700 m", price: 39900, color: "#7c2d12", featured: false, stock: 35, roastedAt: daysAgo(6),
    description: "Volkanik topraklardan gelen tam gövdeli, baharatlı bir fincan. Portakal kabuğu asiditesi ve bitter çikolata bitişi." },
  { slug: "etiyopya-guji-natural", name: "Etiyopya Guji Natural", origin: "Etiyopya", region: "Guji", process: "Natural", roast: "Açık", notes: ["Çilek", "Yaban mersini", "Kakao"], altitude: "2.000 – 2.200 m", price: 45900, color: "#be185d", featured: false, stock: 22, roastedAt: daysAgo(3),
    description: "Kurutma yataklarında meyvesiyle birlikte kurutulan natural işlem, fincana çilek ve yaban mersini reçeli getiriyor. Meyveli kahve sevenlerin favorisi." },
  { slug: "kosta-rika-tarrazu-honey", name: "Kosta Rika Tarrazú Honey", origin: "Kosta Rika", region: "Tarrazú", process: "Honey", roast: "Orta", notes: ["Bal", "Kayısı", "Badem"], altitude: "1.600 – 1.900 m", price: 42900, color: "#d97706", featured: false, stock: 28, roastedAt: daysAgo(7),
    description: "Honey işlem, meyve etinin bir kısmını çekirdek üzerinde bırakır: sonuç bal gibi tatlı, kayısılı, pürüzsüz bir kahve." },
  { slug: "sumatra-mandheling", name: "Sumatra Mandheling", origin: "Endonezya", region: "Sumatra", process: "Wet-hulled", roast: "Koyu", notes: ["Toprak", "Sedir", "Bitter kakao"], altitude: "1.100 – 1.500 m", price: 36900, color: "#3f2a1d", featured: false, stock: 40, roastedAt: daysAgo(8),
    description: "Ağır gövdeli, düşük asiditeli, topraksı ve sedir ağacı notalarıyla klasik bir Sumatra. Koyu kavrum ve French press için." },
  { slug: "ev-harmani", name: "Ev Harmanı", origin: "Harman", region: "Brezilya + Kolombiya", process: "Karışık", roast: "Orta", notes: ["Çikolata", "Fındık", "Karamel"], altitude: "—", price: 29900, color: "#57534e", featured: true, stock: 120, roastedAt: daysAgo(1),
    description: "Her sabah güvenle demlenecek, dengeli ve tatlı bir harman. Filtre kahve makinesi, French press ve moka pot için tasarlandı." },
  { slug: "espresso-harmani", name: "Espresso Harmanı", origin: "Harman", region: "Brezilya + Etiyopya + Sumatra", process: "Karışık", roast: "Orta-Koyu", notes: ["Bitter çikolata", "Kırmızı meyve", "Krema"], altitude: "—", price: 34900, color: "#1c1917", featured: true, stock: 90, roastedAt: daysAgo(2),
    description: "Kalın krema, çikolatalı gövde ve arkada hafif meyve. Sütle harika, sade espresso olarak dengeli." },
  { slug: "kafeinsiz-kolombiya", name: "Kafeinsiz Kolombiya", origin: "Kolombiya", region: "Cauca · Swiss Water", process: "Yıkanmış · Kafeinsiz", roast: "Orta", notes: ["Sütlü çikolata", "Kuru erik", "Karamel"], altitude: "1.600 – 1.800 m", price: 37900, color: "#4d7c0f", featured: false, stock: 30, roastedAt: daysAgo(4),
    description: "Swiss Water yöntemiyle kimyasal kullanılmadan kafeinsizleştirilmiş; tadından ödün vermeyen akşam kahvesi." },
  { slug: "peru-cajamarca", name: "Peru Cajamarca", origin: "Peru", region: "Cajamarca", process: "Yıkanmış", roast: "Orta", notes: ["Bal", "Elma", "Fındık"], altitude: "1.800 – 2.000 m", price: 35900, color: "#0f766e", featured: false, stock: 26, roastedAt: daysAgo(9),
    description: "Organik sertifikalı küçük çiftliklerden, temiz ve tatlı bir fincan. Günlük filtre kahve için ekonomik ve keyifli seçenek." },
];

const COUPONS: typeof schema.coupons.$inferInsert[] = [
  { code: "HOSGELDIN", type: "percent", value: 10, minSubtotal: 0, active: true },
  { code: "KAHVE100", type: "fixed", value: 10000, minSubtotal: 80000, active: true },
  { code: "ESKI", type: "percent", value: 20, minSubtotal: 0, active: false },
];

async function main() {
  const existing = db.select().from(schema.products).all();
  if (existing.length === 0) {
    db.insert(schema.products).values(PRODUCTS).run();
    console.log(`✓ ${PRODUCTS.length} ürün eklendi`);
  } else console.log(`· ürünler zaten var (${existing.length})`);
  for (const c of COUPONS) db.insert(schema.coupons).values(c).onConflictDoNothing().run();
  console.log("✓ kuponlar hazır");
}
main();
