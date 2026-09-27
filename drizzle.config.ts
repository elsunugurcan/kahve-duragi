import type { Config } from "drizzle-kit";
export default { schema: "./src/db/schema.ts", out: "./drizzle", dialect: "sqlite", dbCredentials: { url: "./data/kahve.db" } } satisfies Config;
