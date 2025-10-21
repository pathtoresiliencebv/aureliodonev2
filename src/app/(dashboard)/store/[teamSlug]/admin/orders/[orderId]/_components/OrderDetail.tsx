import { db } from '@/db';
import { orderTable, teamTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { Button } from '@/components/ui/button';
import {
  User,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Calendar,
  Mail,
  Phone,
  Building
} from 'lucide-react';

interface OrderDetailProps {
  teamSlug: string;
  orderId: string;
}

export async function OrderDetail({ teamSlug, orderId }: OrderDetailProps) {
  const team = await db.query.teamTable.findFirst({
    where: (team, { eq }) => eq(team.slug, teamSlug),
  });

  if (!team) {
    return <p>Team not found.</p>;
  }

  const order = await db.query.orderTable.findFirst({
    where: (order, { eq, and }) => and(
      eq(order.id, orderId),
      eq(order.teamId, team.id)
    ),
  });

  if (!order) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Order not found</h3>
          <p className="text-muted-foreground">
            The order you're looking for doesn't exist or you don't have permission to view it.
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

  const getFulfillmentStatusBadge = (status: string) => {
    const statusConfig = {
      unfulfilled: { variant: "secondary" as const, label: "Unfulfilled" },
      partially_fulfilled: { variant: "outline" as const, label: "Partially Fulfilled" },
      fulfilled: { variant: "default" as const, label: "Fulfilled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unfulfilled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Parse line items (assuming they're stored as JSON)
  const lineItems = order.lineItems as Array<{
    id: string;
    productName: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }> || [];

  // Parse addresses (assuming they're stored as JSON)
  const shippingAddress = order.shippingAddress as Record<string, any> || {};
  const billingAddress = order.billingAddress as Record<string, any> || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order Number</label>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Saleor Order ID</label>
                <p className="font-mono text-sm">{order.saleorOrderId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.paymentStatus)}
                  {getFulfillmentStatusBadge(order.fulfillmentStatus)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between py-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productName}</h4>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shippingAddress.firstName ? (
              <div className="space-y-1">
                <p className="font-medium">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                {shippingAddress.company && (
                  <p>{shippingAddress.company}</p>
                )}
                <p>{shippingAddress.address1}</p>
                {shippingAddress.address2 && (
                  <p>{shippingAddress.address2}</p>
                )}
                <p>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phone && (
                  <p className="flex items-center mt-2">
                    <Phone className="mr-2 h-3 w-3" />
                    {shippingAddress.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No shipping address provided</p>
            )}
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {billingAddress.firstName ? (
              <div className="space-y-1">
                <p className="font-medium">
                  {billingAddress.firstName} {billingAddress.lastName}
                </p>
                {billingAddress.company && (
                  <p>{billingAddress.company}</p>
                )}
                <p>{billingAddress.address1}</p>
                {billingAddress.address2 && (
                  <p>{billingAddress.address2}</p>
                )}
                <p>
                  {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
                </p>
                <p>{billingAddress.country}</p>
                {billingAddress.phone && (
                  <p className="flex items-center mt-2">
                    <Phone className="mr-2 h-3 w-3" />
                    {billingAddress.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No billing address provided</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="font-medium">{order.customerName || 'Guest'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="flex items-center">
                <Mail className="mr-2 h-3 w-3" />
                {order.customerEmail}
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Customer Profile
            </Button>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Order Placed</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {order.status !== 'pending' && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Order Confirmed</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            )}

            {order.fulfillmentStatus === 'fulfilled' && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Order Fulfilled</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Truck className="mr-2 h-4 w-4" />
              Update Shipping
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Fulfill Order
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
