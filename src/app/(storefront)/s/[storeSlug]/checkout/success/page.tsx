import { Suspense } from "react";
import { StoreHeader } from "../../_components/StoreHeader";
import { StoreFooter } from "../../_components/StoreFooter";
import { CheckoutSuccessContent } from "./_components/CheckoutSuccessContent";

interface CheckoutSuccessPageProps {
  params: Promise<{
    storeSlug: string;
  }>;
  searchParams: Promise<{
    orderId?: string;
    sessionId?: string;
  }>;
}

export default async function CheckoutSuccessPage({ params, searchParams }: CheckoutSuccessPageProps) {
  const { storeSlug } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeSlug={storeSlug} />

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded" />}>
          <CheckoutSuccessContent
            storeSlug={storeSlug}
            orderId={resolvedSearchParams.orderId}
            sessionId={resolvedSearchParams.sessionId}
          />
        </Suspense>
      </main>

      <StoreFooter storeSlug={storeSlug} />
    </div>
  );
}
