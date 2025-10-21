import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { TrendingUp, Calendar, Download, BarChart3 } from "lucide-react";

interface RevenueChartProps {
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
const mockRevenueData = [
  { date: "2024-01-01", revenue: 12500, orders: 45, customers: 23 },
  { date: "2024-01-02", revenue: 15200, orders: 52, customers: 28 },
  { date: "2024-01-03", revenue: 18900, orders: 67, customers: 34 },
  { date: "2024-01-04", revenue: 22100, orders: 78, customers: 41 },
  { date: "2024-01-05", revenue: 19800, orders: 71, customers: 38 },
  { date: "2024-01-06", revenue: 25600, orders: 89, customers: 46 },
  { date: "2024-01-07", revenue: 28900, orders: 98, customers: 52 },
  { date: "2024-01-08", revenue: 31200, orders: 105, customers: 58 },
  { date: "2024-01-09", revenue: 27800, orders: 94, customers: 49 },
  { date: "2024-01-10", revenue: 33400, orders: 112, customers: 61 },
  { date: "2024-01-11", revenue: 29800, orders: 101, customers: 54 },
  { date: "2024-01-12", revenue: 35600, orders: 118, customers: 63 },
  { date: "2024-01-13", revenue: 38900, orders: 128, customers: 68 },
  { date: "2024-01-14", revenue: 41200, orders: 135, customers: 72 },
  { date: "2024-01-15", revenue: 37800, orders: 124, customers: 66 },
  { date: "2024-01-16", revenue: 42500, orders: 142, customers: 75 },
  { date: "2024-01-17", revenue: 39800, orders: 133, customers: 71 },
  { date: "2024-01-18", revenue: 45600, orders: 151, customers: 80 },
  { date: "2024-01-19", revenue: 48900, orders: 162, customers: 86 },
  { date: "2024-01-20", revenue: 51200, orders: 168, customers: 89 },
  { date: "2024-01-21", revenue: 47800, orders: 158, customers: 84 },
  { date: "2024-01-22", revenue: 53400, orders: 175, customers: 93 },
  { date: "2024-01-23", revenue: 56700, orders: 186, customers: 98 },
  { date: "2024-01-24", revenue: 59200, orders: 194, customers: 102 },
  { date: "2024-01-25", revenue: 55800, orders: 183, customers: 97 },
  { date: "2024-01-26", revenue: 61200, orders: 201, customers: 106 },
  { date: "2024-01-27", revenue: 64500, orders: 212, customers: 112 },
  { date: "2024-01-28", revenue: 67800, orders: 223, customers: 118 },
  { date: "2024-01-29", revenue: 63400, orders: 208, customers: 110 },
  { date: "2024-01-30", revenue: 68900, orders: 225, customers: 119 },
];

export function RevenueChart({ teamSlug, searchParams }: RevenueChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const totalRevenue = mockRevenueData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = mockRevenueData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = mockRevenueData.reduce((sum, day) => sum + day.customers, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  const maxRevenue = Math.max(...mockRevenueData.map(d => d.revenue));
  const minRevenue = Math.min(...mockRevenueData.map(d => d.revenue));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Revenue Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="text-sm text-muted-foreground">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
            <div className="text-sm text-muted-foreground">Avg Order Value</div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Daily Revenue</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatCurrency(minRevenue)} - {formatCurrency(maxRevenue)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {mockRevenueData.slice(-14).map((day, index) => {
              const height = (day.revenue / maxRevenue) * 100;
              const date = new Date(day.date);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-foreground">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-8 relative">
                      <div
                        className={`h-8 rounded-full transition-all duration-300 ${
                          isWeekend ? 'bg-blue-500' : 'bg-primary'
                        }`}
                        style={{ width: `${height}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {formatCurrency(day.revenue)}
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm text-muted-foreground">
                      {day.orders} orders
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-medium">Trend Analysis</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Best Day:</span>
              <span className="ml-2 font-medium">
                {new Date(mockRevenueData.reduce((best, current) =>
                  current.revenue > best.revenue ? current : best
                ).date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Peak Revenue:</span>
              <span className="ml-2 font-medium">{formatCurrency(maxRevenue)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Growth Rate:</span>
              <span className="ml-2 font-medium text-green-600">+12.5%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


