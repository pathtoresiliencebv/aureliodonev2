import { db } from '@/db';
import { orderTable, teamTable } from '@/db/schema';
import { eq, desc, and, like, gte, lte } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Truck,
  Package,
  CreditCard,
  Mail
} from "lucide-react";

interface OrderListProps {
  teamSlug: string;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  };
}

export async function OrderList({ teamSlug, searchParams }: OrderListProps) {
  const team = await db.query.teamTable.findFirst({
    where: (team, { eq }) => eq(team.slug, teamSlug),
  });

  if (!team) {
    return <p>Team not found.</p>;
  }

  // Build where conditions
  const whereConditions = [eq(orderTable.teamId, team.id)];

  if (searchParams.search) {
    whereConditions.push(like(orderTable.orderNumber, `%${searchParams.search}%`));
  }

  if (searchParams.status) {
    whereConditions.push(eq(orderTable.status, searchParams.status as any));
  }

  if (searchParams.dateFrom) {
    whereConditions.push(gte(orderTable.createdAt, new Date(searchParams.dateFrom)));
  }

  if (searchParams.dateTo) {
    whereConditions.push(lte(orderTable.createdAt, new Date(searchParams.dateTo)));
  }

  const orders = await db.query.orderTable.findMany({
    where: and(...whereConditions),
    orderBy: (order, { desc }) => [desc(order.createdAt)],
    limit: 50,
  });

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {searchParams.search || searchParams.status || searchParams.dateFrom || searchParams.dateTo
              ? "Try adjusting your filters to see more results."
              : "Orders will appear here once customers start placing them."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      confirmed: { variant: "default" as const, label: "Confirmed" },
      shipped: { variant: "default" as const, label: "Shipped" },
      delivered: { variant: "default" as const, label: "Delivered" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
      refunded: { variant: "outline" as const, label: "Refunded" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      paid: { variant: "default" as const, label: "Paid" },
      partially_paid: { variant: "outline" as const, label: "Partially Paid" },
      refunded: { variant: "destructive" as const, label: "Refunded" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{order.orderNumber}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.saleorOrderId}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customerName || 'Guest'}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.customerEmail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatDate(order.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(order.status)}
              </TableCell>
              <TableCell>
                {getPaymentStatusBadge(order.paymentStatus)}
              </TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(order.totalAmount)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => window.location.href = `/store/${teamSlug}/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = `/store/${teamSlug}/admin/orders/${order.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Truck className="h-4 w-4 mr-2" />
                      Update Shipping
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Package className="h-4 w-4 mr-2" />
                      Fulfill Order
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Payment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
