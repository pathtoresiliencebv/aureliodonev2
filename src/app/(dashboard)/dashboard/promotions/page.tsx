import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Eye,
  Calendar,
  Percent
} from "lucide-react";

// Mock data for promotions
const mockPromotions = [
  {
    id: "PROMO-001",
    name: "Summer Sale 2025",
    type: "percentage",
    value: 20,
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    usage: 156,
    limit: 1000
  },
  {
    id: "PROMO-002",
    name: "Free Shipping",
    type: "fixed",
    value: 0,
    status: "active",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    usage: 89,
    limit: 500
  },
  {
    id: "PROMO-003",
    name: "New Customer Discount",
    type: "percentage",
    value: 15,
    status: "scheduled",
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    usage: 0,
    limit: 200
  },
  {
    id: "PROMO-004",
    name: "Black Friday 2024",
    type: "percentage",
    value: 50,
    status: "expired",
    startDate: "2024-11-24",
    endDate: "2024-11-30",
    usage: 234,
    limit: 500
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "percentage":
      return <Percent className="h-4 w-4" />;
    case "fixed":
      return <Tag className="h-4 w-4" />;
    default:
      return <Tag className="h-4 w-4" />;
  }
}

function PromotionsList() {
  return (
    <div className="space-y-4">
      {mockPromotions.map((promo) => (
        <Card key={promo.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(promo.type)}
                  <span className="font-semibold">{promo.name}</span>
                </div>
                <Badge className={getStatusColor(promo.status)}>
                  {promo.status}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {promo.type === "percentage" ? `${promo.value}%` : `$${promo.value}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {promo.usage}/{promo.limit} used
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">Duration</div>
                <div className="text-sm text-muted-foreground">
                  {promo.startDate} - {promo.endDate}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Usage</div>
                <div className="text-sm text-muted-foreground">
                  {promo.usage} of {promo.limit} uses
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Type</div>
                <div className="text-sm text-muted-foreground capitalize">{promo.type}</div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PromotionsListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="mt-4 flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-muted-foreground">
            Create and manage discount campaigns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Times used this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,456</div>
            <p className="text-xs text-muted-foreground">
              Additional revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.4%</div>
            <p className="text-xs text-muted-foreground">
              With promotions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Promotions List */}
      <Card>
        <CardHeader>
          <CardTitle>Promotion Campaigns</CardTitle>
          <CardDescription>
            Manage your discount and promotional campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PromotionsListSkeleton />}>
            <PromotionsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}


