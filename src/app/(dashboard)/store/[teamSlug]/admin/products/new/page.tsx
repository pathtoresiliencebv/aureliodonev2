import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";
import { ProductForm } from "../_components/ProductForm";

interface NewProductPageProps {
  params: Promise<{
    teamSlug: string;
  }>;
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { teamSlug } = await params;
  // Check if user has permission to create products
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.MANAGE_PRODUCTS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground">
            Add a new product to your store.
          </p>
        </div>
      </div>

      <ProductForm teamSlug={teamSlug} />
    </div>
  );
}
