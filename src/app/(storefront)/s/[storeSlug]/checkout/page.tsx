import { Suspense } from "react";
import { StoreHeader } from "../_components/StoreHeader";
import { StoreFooter } from "../_components/StoreFooter";
import { CheckoutForm } from "./_components/CheckoutForm";
import { CheckoutSummary } from "./_components/CheckoutSummary";
import { CheckoutSkeleton } from "./_components/CheckoutSkeleton";

interface CheckoutPageProps {
  params: Promise<{
    storeSlug: string;
  }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { storeSlug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeSlug={storeSlug} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Suspense fallback={<CheckoutSkeleton />}>
                <CheckoutForm storeSlug={storeSlug} />
              </Suspense>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8">
              <Suspense fallback={<CheckoutSkeleton />}>
                <CheckoutSummary storeSlug={storeSlug} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter storeSlug={storeSlug} />
    </div>
  );
}
