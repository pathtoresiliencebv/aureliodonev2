import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Truck, Package, CreditCard } from 'lucide-react';
import { OrderDetail } from './_components/OrderDetail';
import { OrderDetailSkeleton } from './_components/OrderDetailSkeleton';
import { requireTeamPermission } from "@/utils/team-auth";
import { TEAM_PERMISSIONS } from "@/db/schema";

interface OrderDetailPageProps {
  params: Promise<{
    teamSlug: string;
    orderId: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { teamSlug, orderId } = await params;

  // Check if user has permission to view orders
  await requireTeamPermission(teamSlug, TEAM_PERMISSIONS.VIEW_ORDERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href={`/store/${teamSlug}/admin/orders`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">
              Order #{orderId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          <Button variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Update Shipping
          </Button>
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Fulfill
          </Button>
          <Button variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            Process Payment
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Order
          </Button>
        </div>
      </div>

      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetail teamSlug={teamSlug} orderId={orderId} />
      </Suspense>
    </div>
  );
}
