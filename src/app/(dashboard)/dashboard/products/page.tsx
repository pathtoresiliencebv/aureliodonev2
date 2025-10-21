import { Suspense, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "./_components/ProductForm";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Eye,
  MoreHorizontal
} from "lucide-react";

// Mock data for products
const mockProducts = [
  {
    id: "PROD-001",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    stock: 45,
    status: "active",
    category: "Electronics",
    image: "/placeholder-product.jpg"
  },
  {
    id: "PROD-002",
    name: "Smart Watch",
    description: "Advanced smartwatch with health tracking features",
    price: 299.99,
    stock: 23,
    status: "active",
    category: "Electronics",
    image: "/placeholder-product.jpg"
  },
  {
    id: "PROD-003",
    name: "Coffee Maker",
    description: "Automatic coffee maker with programmable settings",
    price: 149.99,
    stock: 0,
    status: "out_of_stock",
    category: "Appliances",
    image: "/placeholder-product.jpg"
  },
  {
    id: "PROD-004",
    name: "Running Shoes",
    description: "Comfortable running shoes for all terrains",
    price: 89.99,
    stock: 67,
    status: "active",
    category: "Sports",
    image: "/placeholder-product.jpg"
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "out_of_stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function ProductsList() {
  return (
    <div className="space-y-4">
      {mockProducts.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${product.price}</div>
                    <div className="text-sm text-muted-foreground">Stock: {product.stock}</div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center space-x-4">
                  <Badge className={getStatusColor(product.status)}>
                    {product.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                  <span className="text-sm text-muted-foreground">ID: {product.id}</span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
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

function ProductsListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12 mt-1" />
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="mt-4 flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Product data:", data);
    // TODO: Implement product creation/update logic
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
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
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">
              Available for sale
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Manage your product inventory and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}


