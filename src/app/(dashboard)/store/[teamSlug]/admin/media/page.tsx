import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Grid, List, Search, Filter } from 'lucide-react';
import { MediaGrid } from './_components/MediaGrid';
import { MediaList } from './_components/MediaList';
import { MediaUpload } from './_components/MediaUpload';
import { MediaFilters } from './_components/MediaFilters';
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";

interface MediaPageProps {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<{
    view?: string;
    search?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  }>;
}

export default async function MediaPage({ params, searchParams }: MediaPageProps) {
  const { teamSlug } = await params;
  const searchParamsResolved = await searchParams;

  // Check if user has permission to manage media
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.MANAGE_PRODUCTS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your store's images and media files.
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
          <MediaUpload teamSlug={teamSlug} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <MediaFilters teamSlug={teamSlug} searchParams={searchParamsResolved} />
          </Suspense>
        </aside>

        {/* Media Content */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={searchParamsResolved.view === 'list' ? 'default' : 'outline'}
                size="sm"
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>
              <Button
                variant={searchParamsResolved.view !== 'list' ? 'default' : 'outline'}
                size="sm"
              >
                <Grid className="mr-2 h-4 w-4" />
                Grid
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {/* Media count will be shown here */}
            </div>
          </div>

          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            {searchParamsResolved.view === 'list' ? (
              <MediaList teamSlug={teamSlug} searchParams={searchParamsResolved} />
            ) : (
              <MediaGrid teamSlug={teamSlug} searchParams={searchParamsResolved} />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
