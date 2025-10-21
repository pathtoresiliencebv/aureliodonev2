import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Store, 
  Settings, 
  Eye, 
  Edit,
  Globe,
  Palette,
  ShoppingCart,
  Users
} from "lucide-react";

// Mock data for store settings
const mockStoreSettings = [
  {
    id: "SETTING-001",
    name: "Store Name",
    value: "Aurelio Store",
    type: "text",
    category: "General"
  },
  {
    id: "SETTING-002",
    name: "Store Domain",
    value: "aurelio-store.com",
    type: "url",
    category: "General"
  },
  {
    id: "SETTING-003",
    name: "Store Theme",
    value: "Modern Blue",
    type: "theme",
    category: "Appearance"
  },
  {
    id: "SETTING-004",
    name: "Currency",
    value: "USD",
    type: "currency",
    category: "General"
  },
  {
    id: "SETTING-005",
    name: "Language",
    value: "English",
    type: "language",
    category: "General"
  },
  {
    id: "SETTING-006",
    name: "Store Status",
    value: "Live",
    type: "status",
    category: "General"
  }
];

function getCategoryIcon(category: string) {
  switch (category) {
    case "General":
      return <Settings className="h-4 w-4" />;
    case "Appearance":
      return <Palette className="h-4 w-4" />;
    case "SEO":
      return <Globe className="h-4 w-4" />;
    default:
      return <Settings className="h-4 w-4" />;
  }
}

function getStatusColor(value: string) {
  switch (value.toLowerCase()) {
    case "live":
      return "bg-green-100 text-green-800";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800";
    case "offline":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function StoreSettingsList() {
  return (
    <div className="space-y-4">
      {mockStoreSettings.map((setting) => (
        <Card key={setting.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(setting.category)}
                  <span className="font-semibold">{setting.name}</span>
                </div>
                <Badge variant="outline">{setting.category}</Badge>
              </div>
              <div className="flex items-center space-x-4">
                {setting.type === "status" ? (
                  <Badge className={getStatusColor(setting.value)}>
                    {setting.value}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">{setting.value}</span>
                )}
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StoreSettingsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function StorePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Online Store</h1>
          <p className="text-muted-foreground">
            Configure your store settings and appearance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Store
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Store Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Status</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Live</div>
            <p className="text-xs text-muted-foreground">
              Store is online
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              Visitors to customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Rating</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Store Configuration</CardTitle>
          <CardDescription>
            Manage your store settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<StoreSettingsSkeleton />}>
            <StoreSettingsList />
          </Suspense>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme Customization</CardTitle>
            <CardDescription>
              Customize your store's appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Palette className="h-4 w-4 mr-2" />
              Customize Theme
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Domain Settings</CardTitle>
            <CardDescription>
              Configure your store domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              Domain Settings
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO Settings</CardTitle>
            <CardDescription>
              Optimize your store for search engines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              SEO Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


