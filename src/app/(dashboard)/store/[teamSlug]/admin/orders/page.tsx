import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Download, Filter } from 'lucide-react';
import { OrderList } from './_components/OrderList';
import { OrderListSkeleton } from './_components/OrderListSkeleton';
import { OrderFilters } from './_components/OrderFilters';
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";

interface OrdersPageProps {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  }>;
}

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const { teamSlug } = await params;
  const searchParamsResolved = await searchParams;

  // Check if user has permission to view orders
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.VIEW_ORDERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track customer orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <OrderFilters teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </aside>

        {/* Orders List */}
        <div className="lg:col-span-3">
          <Suspense fallback={<OrderListSkeleton />}>
            <OrderList teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
