import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface InventoryStatsProps {
  teamSlug: string;
}

// Mock data - in real implementation, this would come from the database
const mockStats = {
  totalProducts: 156,
  inStock: 142,
  lowStock: 8,
  outOfStock: 6,
  totalValue: 125000, // in cents
  lowStockValue: 8500, // in cents
  outOfStockValue: 12000, // in cents
  averageStockLevel: 24.5,
  lowStockThreshold: 10,
  alerts: [
    { id: "1", product: "Premium T-Shirt", currentStock: 3, threshold: 10, priority: "high" },
    { id: "2", product: "Designer Jeans", currentStock: 5, threshold: 15, priority: "medium" },
    { id: "3", product: "Running Shoes", currentStock: 2, threshold: 8, priority: "high" },
  ]
};

export function InventoryStats({ teamSlug }: InventoryStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const getStockStatus = (current: number, threshold: number) => {
    if (current === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (current <= threshold) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {mockStats.inStock} in stock, {mockStats.lowStock} low stock, {mockStats.outOfStock} out of stock
          </p>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{mockStats.lowStock}</div>
          <p className="text-xs text-muted-foreground">
            Products below threshold
          </p>
        </CardContent>
      </Card>

      {/* Total Inventory Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(mockStats.totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Total stock value
          </p>
        </CardContent>
      </Card>

      {/* Average Stock Level */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Stock Level</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.averageStockLevel}</div>
          <p className="text-xs text-muted-foreground">
            Units per product
          </p>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      {mockStats.alerts.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStats.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={alert.priority === "high" ? "destructive" : "secondary"}>
                      {alert.priority === "high" ? "High Priority" : "Medium Priority"}
                    </Badge>
                    <div>
                      <p className="font-medium">{alert.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.currentStock} units remaining (threshold: {alert.threshold})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {alert.currentStock} / {alert.threshold}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((alert.currentStock / alert.threshold) * 100)}% of threshold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
