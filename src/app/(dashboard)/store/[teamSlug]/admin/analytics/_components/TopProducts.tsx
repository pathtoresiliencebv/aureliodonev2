import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { TrendingUp, TrendingDown, Star, Eye, ShoppingCart, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface TopProductsProps {
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
const mockTopProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    sku: "TSHIRT-001",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    revenue: 12500, // in cents
    unitsSold: 45,
    orders: 38,
    views: 1250,
    conversionRate: 3.2,
    rating: 4.8,
    reviewCount: 120,
    trend: "up",
    trendValue: 15.2,
    rank: 1,
  },
  {
    id: "2",
    name: "Designer Denim Jeans",
    sku: "JEANS-002",
    image: "https://images.unsplash.com/photo-1560769629-9f27b070934c?w=400&h=400&fit=crop",
    revenue: 9800,
    unitsSold: 28,
    orders: 24,
    views: 890,
    conversionRate: 2.7,
    rating: 4.5,
    reviewCount: 85,
    trend: "up",
    trendValue: 8.7,
    rank: 2,
  },
  {
    id: "3",
    name: "Classic Leather Wallet",
    sku: "WALLET-003",
    image: "https://images.unsplash.com/photo-1584917865442-de84ad4d6c6e?w=400&h=400&fit=crop",
    revenue: 7200,
    unitsSold: 36,
    orders: 32,
    views: 650,
    conversionRate: 4.9,
    rating: 4.9,
    reviewCount: 200,
    trend: "down",
    trendValue: -3.1,
    rank: 3,
  },
  {
    id: "4",
    name: "Minimalist Smartwatch",
    sku: "WATCH-004",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    revenue: 15600,
    unitsSold: 12,
    orders: 10,
    views: 2100,
    conversionRate: 0.5,
    rating: 4.7,
    reviewCount: 150,
    trend: "up",
    trendValue: 22.3,
    rank: 4,
  },
  {
    id: "5",
    name: "Baseball Cap",
    sku: "CAP-005",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
    revenue: 4200,
    unitsSold: 84,
    orders: 67,
    views: 980,
    conversionRate: 6.8,
    rating: 4.3,
    reviewCount: 95,
    trend: "up",
    trendValue: 5.4,
    rank: 5,
  },
];

export function TopProducts({ teamSlug, searchParams }: TopProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: string, value: number) => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-muted-foreground";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">#1</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">#2</Badge>;
    if (rank === 3) return <Badge className="bg-orange-500">#3</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Top Products
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTopProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {/* Rank */}
              <div className="flex-shrink-0">
                {getRankBadge(product.rank)}
              </div>

              {/* Product Image */}
              <div className="flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="aspect-square rounded-md object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <span className="text-xs text-muted-foreground">({product.sku})</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span>({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{product.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    <span>{product.unitsSold} sold</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex-shrink-0 text-right">
                <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                <div className="text-sm text-muted-foreground">
                  {product.orders} orders
                </div>
                <div className="text-xs text-muted-foreground">
                  {product.conversionRate}% conversion
                </div>
              </div>

              {/* Trend */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1">
                  {getTrendIcon(product.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(product.trend, product.trendValue)}`}>
                    {product.trendValue > 0 ? "+" : ""}{product.trendValue.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Revenue:</span>
              <span className="ml-2 font-medium">
                {formatCurrency(mockTopProducts.reduce((sum, p) => sum + p.revenue, 0))}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Units Sold:</span>
              <span className="ml-2 font-medium">
                {mockTopProducts.reduce((sum, p) => sum + p.unitsSold, 0)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Conversion:</span>
              <span className="ml-2 font-medium">
                {(mockTopProducts.reduce((sum, p) => sum + p.conversionRate, 0) / mockTopProducts.length).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Rating:</span>
              <span className="ml-2 font-medium">
                {(mockTopProducts.reduce((sum, p) => sum + p.rating, 0) / mockTopProducts.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


