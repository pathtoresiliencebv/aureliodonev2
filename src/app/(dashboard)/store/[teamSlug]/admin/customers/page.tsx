import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { CustomerList } from './_components/CustomerList';
import { CustomerListSkeleton } from './_components/CustomerListSkeleton';
import { CustomerFilters } from './_components/CustomerFilters';
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";

interface CustomersPageProps {
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
    segment?: string;
  }>;
}

export default async function CustomersPage({ params, searchParams }: CustomersPageProps) {
  const { teamSlug } = await params;
  const searchParamsResolved = await searchParams;

  // Check if user has permission to view customers
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.VIEW_CUSTOMERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your store's customers and their information.
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
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <CustomerFilters teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </aside>

        {/* Customers List */}
        <div className="lg:col-span-3">
          <Suspense fallback={<CustomerListSkeleton />}>
            <CustomerList teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
