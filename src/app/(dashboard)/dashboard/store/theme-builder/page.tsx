"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Layout, 
  Eye, 
  Save, 
  Download, 
  Upload,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  Image,
  Type,
  Grid,
  Layers,
  Zap
} from "lucide-react";

// Mock theme data
const mockThemes = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and minimalist design perfect for modern brands",
    category: "Minimalist",
    color: "bg-gray-100",
    preview: "/api/placeholder/300/200",
    isActive: true
  },
  {
    id: "vintage-classic",
    name: "Vintage Classic",
    description: "Timeless design with vintage aesthetics",
    category: "Vintage",
    color: "bg-amber-100",
    preview: "/api/placeholder/300/200",
    isActive: false
  },
  {
    id: "tech-futuristic",
    name: "Tech Futuristic",
    description: "Modern tech-focused design with bold elements",
    category: "Tech",
    color: "bg-blue-100",
    preview: "/api/placeholder/300/200",
    isActive: false
  }
];

const mockComponents = [
  {
    id: "hero-section",
    name: "Hero Section",
    type: "section",
    icon: <Layout className="h-4 w-4" />,
    description: "Eye-catching hero with CTA"
  },
  {
    id: "product-grid",
    name: "Product Grid",
    type: "section",
    icon: <Grid className="h-4 w-4" />,
    description: "Product showcase grid"
  },
  {
    id: "testimonials",
    name: "Testimonials",
    type: "section",
    icon: <Type className="h-4 w-4" />,
    description: "Customer testimonials"
  },
  {
    id: "newsletter",
    name: "Newsletter Signup",
    type: "section",
    icon: <Zap className="h-4 w-4" />,
    description: "Email subscription form"
  }
];

export default function ThemeBuilderPage() {
  const [selectedTheme, setSelectedTheme] = useState(mockThemes[0]);
  const [selectedDevice, setSelectedDevice] = useState("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme Builder</h1>
          <p className="text-muted-foreground">
            Design and customize your online store with Plasmic
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Theme
          </Button>
        </div>
      </div>

      <Tabs defaultValue="design" className="space-y-4">
        <TabsList>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Theme</CardTitle>
              <CardDescription>
                Select a base theme to start customizing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTheme.id === theme.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{theme.name}</h3>
                      {theme.isActive && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {theme.description}
                    </p>
                    <div className={`h-20 rounded ${theme.color} mb-3`} />
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{theme.category}</Badge>
                      <Button size="sm" variant="outline">
                        Customize
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your store looks on different devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Button
                  variant={selectedDevice === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDevice("desktop")}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={selectedDevice === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDevice("tablet")}
                >
                  <Tablet className="h-4 w-4 mr-2" />
                  Tablet
                </Button>
                <Button
                  variant={selectedDevice === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="text-center text-muted-foreground">
                  <Layout className="h-12 w-12 mx-auto mb-2" />
                  <p>Plasmic Canvas will be embedded here</p>
                  <p className="text-sm">Connect to Plasmic to start designing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Components Library</CardTitle>
              <CardDescription>
                Drag and drop components to build your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockComponents.map((component) => (
                  <div
                    key={component.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {component.icon}
                      <span className="font-medium">{component.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {component.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Configure global theme settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    defaultValue="#3b82f6"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    defaultValue="#64748b"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="opensans">Open Sans</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Store Logo</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Export</CardTitle>
              <CardDescription>
                Export your theme as code or download assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button>
                  <Code className="h-4 w-4 mr-2" />
                  Export React Code
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Assets
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <pre className="text-sm text-muted-foreground">
                  {`// Generated theme code will appear here
import { ThemeProvider } from './theme';

export default function StoreTheme() {
  return (
    <ThemeProvider>
      {/* Your store components */}
    </ThemeProvider>
  );
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
