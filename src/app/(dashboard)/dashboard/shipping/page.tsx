import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Truck,
  Plus,
  Edit,
  Trash2,
  Package,
  Clock,
  DollarSign
} from "lucide-react";

// Mock data for shipping zones
const mockShippingZones = [
  {
    id: "ZONE-001",
    name: "United States",
    countries: ["US"],
    methods: [
      { name: "Standard Shipping", cost: 5.99, delivery: "3-5 days" },
      { name: "Express Shipping", cost: 12.99, delivery: "1-2 days" }
    ],
    status: "active"
  },
  {
    id: "ZONE-002",
    name: "Europe",
    countries: ["DE", "FR", "IT", "ES", "NL"],
    methods: [
      { name: "Standard Shipping", cost: 8.99, delivery: "5-7 days" },
      { name: "Express Shipping", cost: 19.99, delivery: "2-3 days" }
    ],
    status: "active"
  },
  {
    id: "ZONE-003",
    name: "Canada",
    countries: ["CA"],
    methods: [
      { name: "Standard Shipping", cost: 7.99, delivery: "4-6 days" }
    ],
    status: "active"
  },
  {
    id: "ZONE-004",
    name: "Rest of World",
    countries: ["*"],
    methods: [
      { name: "International Shipping", cost: 25.99, delivery: "7-14 days" }
    ],
    status: "active"
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function ShippingZonesList() {
  return (
    <div className="space-y-4">
      {mockShippingZones.map((zone) => (
        <Card key={zone.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold">{zone.name}</span>
                </div>
                <Badge className={getStatusColor(zone.status)}>
                  {zone.status}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{zone.methods.length} methods</div>
                <div className="text-sm text-muted-foreground">
                  {zone.countries.length === 1 && zone.countries[0] === "*"
                    ? "All countries"
                    : `${zone.countries.length} countries`}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Shipping Methods:</div>
              <div className="space-y-2">
                {zone.methods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="font-semibold">${method.cost}</span>
                        <span className="text-muted-foreground ml-2">{method.delivery}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Zone
              </Button>
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ShippingZonesSkeleton() {
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
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ShippingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipping Zones</h1>
          <p className="text-muted-foreground">
            Configure shipping rates and delivery options
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shipping Zone
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipping Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Active zones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipping Methods</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Total methods
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries Covered</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50+</div>
            <p className="text-xs text-muted-foreground">
              Worldwide shipping
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">
              Days average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Configuration</CardTitle>
          <CardDescription>
            Manage shipping zones and delivery methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ShippingZonesSkeleton />}>
            <ShippingZonesList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
