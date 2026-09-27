import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const poppins = localFont({ src: [{ path: "./fonts/Poppins-Regular.ttf", weight: "400" }, { path: "./fonts/Poppins-Bold.ttf", weight: "700" }], variable: "--font-poppins", display: "swap" });
const lora = localFont({ src: "./fonts/Lora-Variable.ttf", variable: "--font-lora", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Kahve Durağı — Taze Kavrulmuş Çekirdek Kahve", template: "%s · Kahve Durağı" },
  description: "Adana'da küçük partiler halinde kavrulan nitelikli kahve. Kavurma tarihi garantili, aylık abonelik, aynı gün kargo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${poppins.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
