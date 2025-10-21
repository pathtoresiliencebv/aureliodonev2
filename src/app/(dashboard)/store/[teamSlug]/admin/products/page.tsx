import { Suspense } from "react";
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";
import { ProductList } from "./_components/ProductList";
import { ProductListSkeleton } from "./_components/ProductListSkeleton";

interface ProductsPageProps {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { teamSlug } = await params;
  const searchParamsResolved = await searchParams;
  // Check if user has permission to view products
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.VIEW_PRODUCTS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store products, inventory, and pricing.
          </p>
        </div>
      </div>

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList
          teamSlug={teamSlug}
          searchParams={searchParamsResolved}
        />
      </Suspense>
    </div>
  );
}
