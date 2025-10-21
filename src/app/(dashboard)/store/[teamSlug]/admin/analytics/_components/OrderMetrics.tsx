import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, Package, Truck, DollarSign, Calendar } from "lucide-react";

interface OrderMetricsProps {
  teamSlug: string;
  searchParams: {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
    metric?: string;
    compare?: string;
  };
}

// Mock data - in real implementation, this would come from the database
const mockOrderMetrics = {
  totalOrders: 342,
  pendingOrders: 23,
  completedOrders: 298,
  cancelledOrders: 21,
  orderGrowth: 8.2,
  averageOrderValue: 365.50, // in cents
  aovGrowth: -2.1,
  fulfillmentRate: 87.1,
  fulfillmentGrowth: 3.2,
  averageFulfillmentTime: 2.3, // days
  orderStatuses: [
    { status: "Pending", count: 23, percentage: 6.7, color: "bg-yellow-500" },
    { status: "Processing", count: 45, percentage: 13.2, color: "bg-blue-500" },
    { status: "Shipped", count: 89, percentage: 26.0, color: "bg-purple-500" },
    { status: "Delivered", count: 209, percentage: 61.1, color: "bg-green-500" },
    { status: "Cancelled", count: 21, percentage: 6.1, color: "bg-red-500" },
  ],
  recentOrders: [
    {
      id: "ORD-001",
      customer: "John Smith",
      amount: 12500, // in cents
      status: "Delivered",
      date: "2024-01-15",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      amount: 8900,
      status: "Shipped",
      date: "2024-01-14",
      items: 2,
    },
    {
      id: "ORD-003",
      customer: "Mike Wilson",
      amount: 15600,
      status: "Processing",
      date: "2024-01-13",
      items: 1,
    },
    {
      id: "ORD-004",
      customer: "Lisa Brown",
      amount: 7200,
      status: "Pending",
      date: "2024-01-12",
      items: 4,
    },
    {
      id: "ORD-005",
      customer: "David Lee",
      amount: 13400,
      status: "Delivered",
      date: "2024-01-11",
      items: 2,
    },
  ],
  topOrderSources: [
    { source: "Website", orders: 156, percentage: 45.6 },
    { source: "Mobile App", orders: 89, percentage: 26.0 },
    { source: "Social Media", orders: 67, percentage: 19.6 },
    { source: "Email Campaign", orders: 30, percentage: 8.8 },
  ],
  orderTrends: [
    { day: "Mon", orders: 45, revenue: 12500 },
    { day: "Tue", orders: 52, revenue: 15200 },
    { day: "Wed", orders: 67, revenue: 18900 },
    { day: "Thu", orders: 78, revenue: 22100 },
    { day: "Fri", orders: 71, revenue: 19800 },
    { day: "Sat", orders: 89, revenue: 25600 },
    { day: "Sun", orders: 98, revenue: 28900 },
  ],
};

export function OrderMetrics({ teamSlug, searchParams }: OrderMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Processing":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "Shipped":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <ShoppingBag className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "secondary" as const,
      Processing: "default" as const,
      Shipped: "default" as const,
      Delivered: "default" as const,
      Cancelled: "destructive" as const,
    };
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Order Metrics
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{mockOrderMetrics.totalOrders}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {getTrendIcon(mockOrderMetrics.orderGrowth)}
              <span className={`text-xs ${getTrendColor(mockOrderMetrics.orderGrowth)}`}>
                +{mockOrderMetrics.orderGrowth}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatCurrency(mockOrderMetrics.averageOrderValue)}</div>
            <div className="text-sm text-muted-foreground">Avg Order Value</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {getTrendIcon(mockOrderMetrics.aovGrowth)}
              <span className={`text-xs ${getTrendColor(mockOrderMetrics.aovGrowth)}`}>
                {mockOrderMetrics.aovGrowth > 0 ? "+" : ""}{mockOrderMetrics.aovGrowth}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockOrderMetrics.fulfillmentRate}%</div>
            <div className="text-sm text-muted-foreground">Fulfillment Rate</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+{mockOrderMetrics.fulfillmentGrowth}%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockOrderMetrics.averageFulfillmentTime}d</div>
            <div className="text-sm text-muted-foreground">Avg Fulfillment Time</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">-0.5d</span>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium">Order Status Breakdown</h4>
          <div className="space-y-2">
            {mockOrderMetrics.orderStatuses.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span className="text-sm font-medium">{status.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{status.count} orders</span>
                  <Badge variant="outline">{status.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Orders</h4>
          <div className="space-y-2">
            {mockOrderMetrics.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {order.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.customer}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(order.amount)}</div>
                    <div className="text-sm text-muted-foreground">{order.items} items</div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Sources */}
        <div className="space-y-3">
          <h4 className="font-medium">Order Sources</h4>
          <div className="space-y-2">
            {mockOrderMetrics.topOrderSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <span className="text-sm">{source.source}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{source.orders} orders</span>
                  <Badge variant="outline">{source.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Order Trends */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Weekly Order Trends</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {mockOrderMetrics.orderTrends.map((day) => (
              <div key={day.day} className="text-center">
                <div className="text-xs text-muted-foreground">{day.day}</div>
                <div className="text-sm font-medium">{day.orders}</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(day.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


