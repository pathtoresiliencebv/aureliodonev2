import { db } from '@/db';
import { customerTable, teamTable, orderTable } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  User,
  CreditCard,
  Truck,
  Star
} from 'lucide-react';

interface CustomerDetailProps {
  teamSlug: string;
  customerId: string;
}

export async function CustomerDetail({ teamSlug, customerId }: CustomerDetailProps) {
  const team = await db.query.teamTable.findFirst({
    where: (team, { eq }) => eq(team.slug, teamSlug),
  });

  if (!team) {
    return <p>Team not found.</p>;
  }

  const customer = await db.query.customerTable.findFirst({
    where: (customer, { eq, and }) => and(
      eq(customer.id, customerId),
      eq(customer.teamId, team.id)
    ),
  });

  if (!customer) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Customer not found</h3>
          <p className="text-muted-foreground">
            The customer you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get customer's orders
  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.customerId, customerId),
    orderBy: (order, { desc }) => [desc(order.createdAt)],
    limit: 10,
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const getCustomerSegment = (totalSpent: number, totalOrders: number) => {
    if (totalSpent >= 1000 || totalOrders >= 10) {
      return { label: "VIP", variant: "default" as const, description: "High-value customer" };
    } else if (totalSpent >= 500 || totalOrders >= 5) {
      return { label: "Loyal", variant: "secondary" as const, description: "Frequent customer" };
    } else if (totalSpent >= 100 || totalOrders >= 2) {
      return { label: "Regular", variant: "outline" as const, description: "Regular customer" };
    } else {
      return { label: "New", variant: "outline" as const, description: "New customer" };
    }
  };

  const segment = getCustomerSegment(totalSpent, totalOrders);
  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Guest';
  const initials = `${customer.firstName?.charAt(0) || ''}${customer.lastName?.charAt(0) || ''}`.toUpperCase() || '?';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={segment.variant}>{segment.label}</Badge>
                  <span className="text-sm text-muted-foreground">{segment.description}</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="text-sm text-muted-foreground">{customer.email}</p>

                {customer.defaultShippingAddress?.phone && (
                  <>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.defaultShippingAddress.phone}
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Member Since</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.defaultShippingAddress ? (
                <div className="space-y-1">
                  <p className="font-medium">
                    {customer.defaultShippingAddress.firstName} {customer.defaultShippingAddress.lastName}
                  </p>
                  {customer.defaultShippingAddress.company && (
                    <p>{customer.defaultShippingAddress.company}</p>
                  )}
                  <p>{customer.defaultShippingAddress.address1}</p>
                  {customer.defaultShippingAddress.address2 && (
                    <p>{customer.defaultShippingAddress.address2}</p>
                  )}
                  <p>
                    {customer.defaultShippingAddress.city}, {customer.defaultShippingAddress.state} {customer.defaultShippingAddress.postalCode}
                  </p>
                  <p>{customer.defaultShippingAddress.country}</p>
                  {customer.defaultShippingAddress.phone && (
                    <p className="text-sm text-muted-foreground">
                      {customer.defaultShippingAddress.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No shipping address on file</p>
              )}
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.defaultBillingAddress ? (
                <div className="space-y-1">
                  <p className="font-medium">
                    {customer.defaultBillingAddress.firstName} {customer.defaultBillingAddress.lastName}
                  </p>
                  {customer.defaultBillingAddress.company && (
                    <p>{customer.defaultBillingAddress.company}</p>
                  )}
                  <p>{customer.defaultBillingAddress.address1}</p>
                  {customer.defaultBillingAddress.address2 && (
                    <p>{customer.defaultBillingAddress.address2}</p>
                  )}
                  <p>
                    {customer.defaultBillingAddress.city}, {customer.defaultBillingAddress.state} {customer.defaultBillingAddress.postalCode}
                  </p>
                  <p>{customer.defaultBillingAddress.country}</p>
                  {customer.defaultBillingAddress.phone && (
                    <p className="text-sm text-muted-foreground">
                      {customer.defaultBillingAddress.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No billing address on file</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {orders.length >= 10 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      View All Orders
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No orders found for this customer.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Customer Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Customer Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Orders</span>
              </div>
              <span className="font-semibold">{totalOrders}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Spent</span>
              </div>
              <span className="font-semibold">{formatCurrency(totalSpent)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Average Order</span>
              </div>
              <span className="font-semibold">{formatCurrency(averageOrderValue)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segment */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <Badge variant={segment.variant} className="text-lg px-4 py-2">
                {segment.label}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {segment.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Orders</span>
                <span className="font-medium">{totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spent</span>
                <span className="font-medium">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Order Value</span>
                <span className="font-medium">{formatCurrency(averageOrderValue)}</span>
              </div>
            </div>
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
              <Phone className="mr-2 h-4 w-4" />
              Call Customer
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View All Orders
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Add to Segment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
