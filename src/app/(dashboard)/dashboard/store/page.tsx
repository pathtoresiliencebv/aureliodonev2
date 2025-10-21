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
  Users,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Download,
  Upload,
  Zap,
  Shield,
  Clock
} from "lucide-react";

// Mock data for store templates
const mockTemplates = [
  {
    id: "TEMPLATE-001",
    name: "Modern Minimal",
    description: "Clean and minimalist design perfect for modern brands",
    category: "Minimalist",
    color: "bg-gray-100",
    preview: "/api/placeholder/300/200",
    isActive: true,
    features: ["Responsive", "SEO Optimized", "Fast Loading"]
  },
  {
    id: "TEMPLATE-002",
    name: "Vintage Classic",
    description: "Timeless design with vintage aesthetics",
    category: "Vintage",
    color: "bg-amber-100",
    preview: "/api/placeholder/300/200",
    isActive: false,
    features: ["Responsive", "Custom Fonts", "Image Gallery"]
  },
  {
    id: "TEMPLATE-003",
    name: "Tech Futuristic",
    description: "Modern tech-focused design with bold elements",
    category: "Tech",
    color: "bg-blue-100",
    preview: "/api/placeholder/300/200",
    isActive: false,
    features: ["Responsive", "Dark Mode", "Animations"]
  }
];

// Mock data for domains
const mockDomains = [
  {
    id: "DOMAIN-001",
    name: "mystore.aurelio.com",
    type: "subdomain",
    status: "active",
    ssl: true,
    primary: true
  },
  {
    id: "DOMAIN-002",
    name: "mystore.com",
    type: "custom",
    status: "pending",
    ssl: false,
    primary: false
  }
];

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
    value: "mystore.aurelio.com",
    type: "url",
    category: "General"
  },
  {
    id: "SETTING-003",
    name: "Store Theme",
    value: "Modern Minimal",
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
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "offline":
    case "inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getDomainTypeColor(type: string) {
  switch (type) {
    case "subdomain":
      return "bg-blue-100 text-blue-800";
    case "custom":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function TemplatesList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockTemplates.map((template) => (
        <Card key={template.id} className={`hover:shadow-md transition-shadow ${template.isActive ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </div>
              {template.isActive && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`h-32 rounded mb-4 ${template.color} flex items-center justify-center`}>
              <div className="text-center">
                <Monitor className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Preview</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{template.category}</Badge>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <Button className="w-full" variant={template.isActive ? "outline" : "default"}>
                {template.isActive ? "Customize" : "Activate"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DomainsList() {
  return (
    <div className="space-y-4">
      {mockDomains.map((domain) => (
        <Card key={domain.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">{domain.name}</span>
                  {domain.primary && (
                    <Badge variant="secondary">Primary</Badge>
                  )}
                </div>
                <Badge className={getDomainTypeColor(domain.type)}>
                  {domain.type}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {domain.ssl ? (
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">SSL</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-600">No SSL</span>
                    </div>
                  )}
                  <Badge className={getStatusColor(domain.status)}>
                    {domain.status}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
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

function TemplatesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full mb-4" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <div className="flex space-x-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <div className="flex space-x-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-14" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DomainsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-16" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
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
            Manage your store templates, domains, and settings like Shopify
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

      {/* Store Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Store Templates</CardTitle>
          <CardDescription>
            Choose and customize your store's appearance with professional templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TemplatesSkeleton />}>
            <TemplatesList />
          </Suspense>
        </CardContent>
      </Card>

      {/* Domain Management */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Management</CardTitle>
          <CardDescription>
            Manage your store domains, SSL certificates, and DNS settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<DomainsSkeleton />}>
            <DomainsList />
          </Suspense>
        </CardContent>
      </Card>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme Builder</CardTitle>
            <CardDescription>
              Customize your store with Plasmic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Palette className="h-4 w-4 mr-2" />
              Open Theme Builder
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Domain</CardTitle>
            <CardDescription>
              Connect a custom domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO Settings</CardTitle>
            <CardDescription>
              Optimize for search engines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              SEO Configuration
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analytics</CardTitle>
            <CardDescription>
              View store performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Monitor className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


