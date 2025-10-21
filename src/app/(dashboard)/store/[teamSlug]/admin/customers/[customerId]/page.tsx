import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { CustomerDetail } from './_components/CustomerDetail';
import { CustomerDetailSkeleton } from './_components/CustomerDetailSkeleton';
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";

interface CustomerDetailPageProps {
  params: Promise<{
    teamSlug: string;
    customerId: string;
  }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { teamSlug, customerId } = await params;

  // Check if user has permission to view customers
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.VIEW_CUSTOMERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href={`/store/${teamSlug}/admin/customers`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Customer Profile</h1>
            <p className="text-muted-foreground">
              Customer ID: {customerId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Call Customer
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </Button>
        </div>
      </div>

      <Suspense fallback={<CustomerDetailSkeleton />}>
        <CustomerDetail teamSlug={teamSlug} customerId={customerId} />
      </Suspense>
    </div>
  );
}
