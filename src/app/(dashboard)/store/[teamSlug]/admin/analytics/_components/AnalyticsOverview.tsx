import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format-currency";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Eye, Heart } from "lucide-react";

interface AnalyticsOverviewProps {
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
const mockOverviewData = {
  totalRevenue: 125000, // in cents
  revenueChange: 12.5,
  totalOrders: 342,
  ordersChange: 8.2,
  totalCustomers: 156,
  customersChange: 15.3,
  averageOrderValue: 365.50, // in cents
  aovChange: -2.1,
  conversionRate: 3.2,
  conversionChange: 0.8,
  totalProducts: 89,
  productsChange: 5.1,
  totalViews: 12500,
  viewsChange: 22.1,
  totalFavorites: 234,
  favoritesChange: 18.7,
};

export function AnalyticsOverview({ teamSlug, searchParams }: AnalyticsOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeBadge = (change: number) => {
    return (
      <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
        {change >= 0 ? "+" : ""}{change.toFixed(1)}%
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(mockOverviewData.totalRevenue)}</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.revenueChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.revenueChange)}`}>
              {mockOverviewData.revenueChange >= 0 ? "+" : ""}{mockOverviewData.revenueChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockOverviewData.totalOrders}</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.ordersChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.ordersChange)}`}>
              {mockOverviewData.ordersChange >= 0 ? "+" : ""}{mockOverviewData.ordersChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockOverviewData.totalCustomers}</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.customersChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.customersChange)}`}>
              {mockOverviewData.customersChange >= 0 ? "+" : ""}{mockOverviewData.customersChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Order Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(mockOverviewData.averageOrderValue)}</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.aovChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.aovChange)}`}>
              {mockOverviewData.aovChange >= 0 ? "+" : ""}{mockOverviewData.aovChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockOverviewData.conversionRate}%</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.conversionChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.conversionChange)}`}>
              {mockOverviewData.conversionChange >= 0 ? "+" : ""}{mockOverviewData.conversionChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockOverviewData.totalProducts}</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.productsChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.productsChange)}`}>
              {mockOverviewData.productsChange >= 0 ? "+" : ""}{mockOverviewData.productsChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Views */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockOverviewData.totalViews.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.viewsChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.viewsChange)}`}>
              {mockOverviewData.viewsChange >= 0 ? "+" : ""}{mockOverviewData.viewsChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Favorites */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockOverviewData.totalFavorites}</div>
          <div className="flex items-center gap-2 mt-1">
            {getChangeIcon(mockOverviewData.favoritesChange)}
            <span className={`text-sm ${getChangeColor(mockOverviewData.favoritesChange)}`}>
              {mockOverviewData.favoritesChange >= 0 ? "+" : ""}{mockOverviewData.favoritesChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


