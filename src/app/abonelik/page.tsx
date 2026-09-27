import SubscriptionForm from "./SubscriptionForm";
import type { PlanKey } from "@/lib/pricing";
export const metadata = { title: "Kahve Aboneliği" };
export default function Page({ searchParams }: { searchParams: { plan?: string; kahve?: string } }) {
  const plan = (["kesif", "favori", "espresso"].includes(searchParams.plan ?? "") ? searchParams.plan : searchParams.kahve?.includes("espresso") ? "espresso" : searchParams.kahve ? "favori" : "kesif") as PlanKey;
  return (
    <section className="container-x py-10">
      <div className="max-w-2xl"><div className="eyebrow">Abonelik</div><h1 className="mt-2 font-serif text-4xl font-bold md:text-5xl">Kahven bitmeden yenisi kapında.</h1><p className="mt-4 text-[var(--mocha)]">Her gönderimde %15 indirim ve ücretsiz kargo. Kavurma takvimimize göre planlanır; taze olmayan kahve asla gitmez.</p></div>
      <div className="mt-10"><SubscriptionForm initialPlan={plan} /></div>
    </section>
  );
}
