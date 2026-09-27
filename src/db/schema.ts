import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  origin: text("origin").notNull(),        // Etiyopya, Kolombiya...
  region: text("region"),                  // Yirgacheffe, Huila...
  process: text("process").notNull(),      // Yıkanmış, Natural, Honey
  roast: text("roast").notNull(),          // Açık, Orta, Koyu
  notes: text("notes", { mode: "json" }).$type<string[]>().notNull(),
  description: text("description").notNull(),
  altitude: text("altitude"),
  price: integer("price").notNull(),       // 250 g fiyatı, kuruş
  color: text("color").notNull(),          // paket rengi
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  stock: integer("stock").notNull().default(50),
  roastedAt: text("roasted_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const coupons = sqliteTable("coupons", {
  code: text("code").primaryKey(),
  type: text("type").notNull(),            // percent | fixed
  value: integer("value").notNull(),       // percent: 0-100, fixed: kuruş
  minSubtotal: integer("min_subtotal").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull().unique(),
  status: text("status").notNull().default("odeme_alindi"), // odeme_alindi | hazirlaniyor | kargoda | teslim
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  shipping: text("shipping").notNull(),     // standart | hizli
  shippingFee: integer("shipping_fee").notNull(),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  couponCode: text("coupon_code"),
  total: integer("total").notNull(),
  paymentRef: text("payment_ref").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  name: text("name").notNull(),
  grind: text("grind").notNull(),
  weight: integer("weight").notNull(),      // gram
  qty: integer("qty").notNull(),
  unitPrice: integer("unit_price").notNull(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  plan: text("plan").notNull(),             // kesif | favori | espresso
  grind: text("grind").notNull(),
  frequencyWeeks: integer("frequency_weeks").notNull().default(4),
  price: integer("price").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
