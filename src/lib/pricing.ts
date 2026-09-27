export const WEIGHTS = [250, 500, 1000] as const;
export type Weight = (typeof WEIGHTS)[number];
export const GRINDS = ["Çekirdek", "Filtre", "Espresso", "French Press", "Moka Pot", "Türk Kahvesi"] as const;
export type Grind = (typeof GRINDS)[number];

/** 250 g baz fiyatından gramaj fiyatı (500 g %5, 1 kg %10 avantajlı) */
export function priceFor(base250: number, weight: Weight) {
  const mult = weight === 250 ? 1 : weight === 500 ? 1.9 : 3.6;
  return Math.round((base250 * mult) / 100) * 100;
}
export const SUBSCRIPTION_DISCOUNT = 0.15;
export const FREE_SHIPPING_MIN = 50000;
export const SHIPPING = { standart: { label: "Standart kargo", desc: "1-3 iş günü", fee: 4990 }, hizli: { label: "Hızlı kargo", desc: "Ertesi gün (16:00'a kadar sipariş)", fee: 8990 } } as const;
export type ShippingKey = keyof typeof SHIPPING;

export const fmt = (kurus: number) => (kurus / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 });
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
export const PLANS = { kesif: { name: "Keşif", desc: "Her ay 2 farklı tek köken (2 × 250 g)", price: 79900 }, favori: { name: "Favorim", desc: "Seçtiğin kahve, 500 g", price: 69900 }, espresso: { name: "Espresso", desc: "Espresso harmanı, 1 kg", price: 119900 } } as const;
export type PlanKey = keyof typeof PLANS;
