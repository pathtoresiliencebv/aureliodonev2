import { Inter } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aurelio Store",
  description: "Your online store powered by Aurelio",
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <StoreHeader />
          <main className="min-h-screen">
            {children}
          </main>
          <StoreFooter />
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
