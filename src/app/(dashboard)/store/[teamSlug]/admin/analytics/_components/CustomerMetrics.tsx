import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { Users, UserPlus, UserCheck, UserX, TrendingUp, TrendingDown, Star, ShoppingBag, DollarSign, Calendar } from "lucide-react";

interface CustomerMetricsProps {
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
const mockCustomerMetrics = {
  totalCustomers: 156,
  newCustomers: 23,
  returningCustomers: 133,
  churnedCustomers: 8,
  customerGrowth: 15.3,
  retentionRate: 85.2,
  averageLifetimeValue: 1250, // in cents
  averageOrderFrequency: 2.3,
  customerSegments: [
    { name: "VIP", count: 12, percentage: 7.7, color: "bg-purple-500" },
    { name: "Loyal", count: 45, percentage: 28.8, color: "bg-blue-500" },
    { name: "Regular", count: 67, percentage: 42.9, color: "bg-green-500" },
    { name: "New", count: 32, percentage: 20.5, color: "bg-orange-500" },
  ],
  topCustomers: [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      totalSpent: 2500, // in cents
      totalOrders: 8,
      lastOrder: "2024-01-15",
      segment: "VIP",
      avatar: "JS",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      totalSpent: 1800,
      totalOrders: 5,
      lastOrder: "2024-01-12",
      segment: "Loyal",
      avatar: "SJ",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@example.com",
      totalSpent: 1200,
      totalOrders: 3,
      lastOrder: "2024-01-10",
      segment: "Regular",
      avatar: "MW",
    },
  ],
  customerAcquisition: [
    { source: "Organic Search", customers: 45, percentage: 28.8 },
    { source: "Social Media", customers: 38, percentage: 24.4 },
    { source: "Direct", customers: 32, percentage: 20.5 },
    { source: "Email Marketing", customers: 25, percentage: 16.0 },
    { source: "Referrals", customers: 16, percentage: 10.3 },
  ],
};

export function CustomerMetrics({ teamSlug, searchParams }: CustomerMetricsProps) {
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

  const getSegmentColor = (segment: string) => {
    const colors = {
      VIP: "bg-purple-500",
      Loyal: "bg-blue-500",
      Regular: "bg-green-500",
      New: "bg-orange-500",
    };
    return colors[segment as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Customer Metrics
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{mockCustomerMetrics.totalCustomers}</div>
            <div className="text-sm text-muted-foreground">Total Customers</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {getTrendIcon(mockCustomerMetrics.customerGrowth)}
              <span className={`text-xs ${getTrendColor(mockCustomerMetrics.customerGrowth)}`}>
                +{mockCustomerMetrics.customerGrowth}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockCustomerMetrics.retentionRate}%</div>
            <div className="text-sm text-muted-foreground">Retention Rate</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+2.1%</span>
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="space-y-3">
          <h4 className="font-medium">Customer Segments</h4>
          <div className="space-y-2">
            {mockCustomerMetrics.customerSegments.map((segment) => (
              <div key={segment.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                  <span className="text-sm font-medium">{segment.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{segment.count} customers</span>
                  <Badge variant="outline">{segment.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="space-y-3">
          <h4 className="font-medium">Top Customers</h4>
          <div className="space-y-2">
            {mockCustomerMetrics.topCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center gap-3 p-2 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {customer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{customer.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{customer.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatCurrency(customer.totalSpent)}</div>
                  <div className="text-xs text-muted-foreground">{customer.totalOrders} orders</div>
                </div>
                <Badge variant="outline" className={getSegmentColor(customer.segment)}>
                  {customer.segment}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Acquisition */}
        <div className="space-y-3">
          <h4 className="font-medium">Customer Acquisition</h4>
          <div className="space-y-2">
            {mockCustomerMetrics.customerAcquisition.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <span className="text-sm">{source.source}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{source.customers} customers</span>
                  <Badge variant="outline">{source.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Lifetime Value */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-medium">Customer Lifetime Value</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(mockCustomerMetrics.averageLifetimeValue)}</div>
          <div className="text-sm text-muted-foreground">
            Average order frequency: {mockCustomerMetrics.averageOrderFrequency}x
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


