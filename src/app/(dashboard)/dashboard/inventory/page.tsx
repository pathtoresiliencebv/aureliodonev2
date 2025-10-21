import { Suspense, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InventoryForm } from "./_components/InventoryForm";
import { 
  BarChart3, 
  AlertTriangle, 
  Package, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Plus,
  Edit
} from "lucide-react";

// Mock data for inventory
const mockInventory = [
  {
    id: "INV-001",
    product: "Wireless Headphones",
    sku: "WH-001",
    stock: 45,
    minStock: 10,
    maxStock: 100,
    status: "in_stock",
    lastUpdated: "2025-01-21"
  },
  {
    id: "INV-002",
    product: "Smart Watch",
    sku: "SW-002",
    stock: 23,
    minStock: 15,
    maxStock: 50,
    status: "in_stock",
    lastUpdated: "2025-01-21"
  },
  {
    id: "INV-003",
    product: "Coffee Maker",
    sku: "CM-003",
    stock: 0,
    minStock: 5,
    maxStock: 25,
    status: "out_of_stock",
    lastUpdated: "2025-01-20"
  },
  {
    id: "INV-004",
    product: "Running Shoes",
    sku: "RS-004",
    stock: 3,
    minStock: 10,
    maxStock: 50,
    status: "low_stock",
    lastUpdated: "2025-01-21"
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "in_stock":
      return "bg-green-100 text-green-800";
    case "low_stock":
      return "bg-yellow-100 text-yellow-800";
    case "out_of_stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "in_stock":
      return <Package className="h-4 w-4" />;
    case "low_stock":
      return <AlertTriangle className="h-4 w-4" />;
    case "out_of_stock":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
}

function InventoryList() {
  return (
    <div className="space-y-4">
      {mockInventory.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className="font-semibold">{item.product}</span>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{item.stock} units</div>
                <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">Stock Range</div>
                <div className="text-sm text-muted-foreground">
                  Min: {item.minStock} | Max: {item.maxStock}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Last Updated</div>
                <div className="text-sm text-muted-foreground">{item.lastUpdated}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Stock Level</div>
                <div className="text-sm text-muted-foreground">
                  {item.stock < item.minStock ? "Below minimum" : "Above minimum"}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">
                Update Stock
              </Button>
              <Button variant="outline" size="sm">
                View History
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditInventory(item)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function InventoryListSkeleton() {
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
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);

  const handleAddInventory = () => {
    setEditingInventory(null);
    setShowForm(true);
  };

  const handleEditInventory = (inventory: any) => {
    setEditingInventory(inventory);
    setShowForm(true);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Inventory data:", data);
    // TODO: Implement inventory creation/update logic
    setShowForm(false);
    setEditingInventory(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingInventory(null);
  };

  if (showForm) {
    return (
      <InventoryForm
        inventory={editingInventory}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">
            Track and manage your stock levels
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddInventory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">
              Available items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Completely out
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>
            Monitor stock levels and manage inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<InventoryListSkeleton />}>
            <InventoryList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}


