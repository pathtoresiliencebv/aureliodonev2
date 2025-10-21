import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Calendar, RefreshCw, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { AnalyticsOverview } from './_components/AnalyticsOverview';
import { RevenueChart } from './_components/RevenueChart';
import { TopProducts } from './_components/TopProducts';
import { CustomerMetrics } from './_components/CustomerMetrics';
import { OrderMetrics } from './_components/OrderMetrics';
import { AnalyticsFilters } from './_components/AnalyticsFilters';
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";

interface AnalyticsPageProps {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<{
    period?: string;
    dateFrom?: string;
    dateTo?: string;
    metric?: string;
    compare?: string;
  }>;
}

export default async function AnalyticsPage({ params, searchParams }: AnalyticsPageProps) {
  const { teamSlug } = await params;
  const searchParamsResolved = await searchParams;

  // Check if user has permission to view analytics
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.VIEW_ANALYTICS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your store's performance, revenue, and customer insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
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
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded" />}>
        <AnalyticsOverview teamSlug={teamSlug} searchParams={searchParamsResolved} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <AnalyticsFilters teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </aside>

        {/* Main Analytics Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Revenue Chart */}
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <RevenueChart teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
              <TopProducts teamSlug={teamSlug} searchParams={searchParamsResolved} />
            </Suspense>

            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
              <CustomerMetrics teamSlug={teamSlug} searchParams={searchParamsResolved} />
            </Suspense>
          </div>

          {/* Order Metrics */}
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <OrderMetrics teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}


