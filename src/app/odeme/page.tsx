import CheckoutForm from "./CheckoutForm";
export const metadata = { title: "Ödeme" };
export default function Page() {
  return (
    <section className="container-x py-10">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm"><span className="chip bg-[var(--espresso)] text-[var(--cream)] border-transparent">1 · Sepet</span><span className="text-[var(--mocha)]">→</span><span className="chip bg-[var(--espresso)] text-[var(--cream)] border-transparent">2 · Teslimat & Ödeme</span><span className="text-[var(--mocha)]">→</span><span className="chip">3 · Onay</span></div>
      <h1 className="mb-8 font-serif text-4xl font-bold">Ödeme</h1>
      <CheckoutForm />
    </section>
  );
}
