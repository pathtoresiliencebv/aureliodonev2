import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus, Search, AlertTriangle, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { InventoryList } from './_components/InventoryList';
import { InventoryListSkeleton } from './_components/InventoryListSkeleton';
import { InventoryFilters } from './_components/InventoryFilters';
import { InventoryStats } from './_components/InventoryStats';
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";

interface InventoryPageProps {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
    lowStock?: string;
  }>;
}

export default async function InventoryPage({ params, searchParams }: InventoryPageProps) {
  const { teamSlug } = await params;
  const searchParamsResolved = await searchParams;

  // Check if user has permission to manage products
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.MANAGE_PRODUCTS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track stock levels, manage inventory, and set up low stock alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Bulk Update
          </Button>
        </div>
      </div>

      {/* Inventory Stats */}
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded" />}>
        <InventoryStats teamSlug={teamSlug} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <InventoryFilters teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </aside>

        {/* Inventory List */}
        <div className="lg:col-span-3">
          <Suspense fallback={<InventoryListSkeleton />}>
            <InventoryList teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
