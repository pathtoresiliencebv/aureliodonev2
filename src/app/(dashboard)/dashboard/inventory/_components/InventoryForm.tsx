"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Save,
  ArrowLeft,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

const inventorySchema = z.object({
  productId: z.string().min(1, "Product is required"),
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  currentStock: z.number().min(0, "Stock must be positive"),
  reservedStock: z.number().min(0, "Reserved stock must be positive"),
  availableStock: z.number().min(0, "Available stock must be positive"),
  lowStockThreshold: z.number().min(0, "Low stock threshold must be positive"),
  reorderPoint: z.number().min(0, "Reorder point must be positive"),
  reorderQuantity: z.number().min(0, "Reorder quantity must be positive"),
  cost: z.number().min(0, "Cost must be positive"),
  price: z.number().min(0, "Price must be positive"),
  weight: z.number().min(0, "Weight must be positive"),
  dimensions: z.object({
    length: z.number().min(0, "Length must be positive"),
    width: z.number().min(0, "Width must be positive"),
    height: z.number().min(0, "Height must be positive"),
  }).optional(),
  location: z.string().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  trackInventory: z.boolean(),
  allowBackorder: z.boolean(),
  status: z.enum(["active", "inactive", "discontinued"]),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  inventory?: InventoryFormData;
  onSubmit: (data: InventoryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InventoryForm({ inventory, onSubmit, onCancel, isLoading = false }: InventoryFormProps) {
  const [tags, setTags] = useState<string[]>(inventory?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [stockAdjustments, setStockAdjustments] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: inventory || {
      productId: "",
      productName: "",
      sku: "",
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      lowStockThreshold: 10,
      reorderPoint: 5,
      reorderQuantity: 50,
      cost: 0,
      price: 0,
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      location: "",
      supplier: "",
      notes: "",
      trackInventory: true,
      allowBackorder: false,
      status: "active",
      category: "",
      tags: [],
    },
  });

  const trackInventory = watch("trackInventory");
  const currentStock = watch("currentStock");
  const reservedStock = watch("reservedStock");
  const lowStockThreshold = watch("lowStockThreshold");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addStockAdjustment = () => {
    const newAdjustment = {
      id: Date.now().toString(),
      type: "add",
      quantity: 0,
      reason: "",
      notes: "",
    };
    setStockAdjustments([...stockAdjustments, newAdjustment]);
  };

  const removeStockAdjustment = (adjustmentId: string) => {
    setStockAdjustments(stockAdjustments.filter(adj => adj.id !== adjustmentId));
  };

  const updateStockAdjustment = (adjustmentId: string, field: string, value: any) => {
    setStockAdjustments(stockAdjustments.map(adj => 
      adj.id === adjustmentId ? { ...adj, [field]: value } : adj
    ));
  };

  const getStockStatus = () => {
    if (currentStock <= 0) return { status: "out_of_stock", color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4" /> };
    if (currentStock <= lowStockThreshold) return { status: "low_stock", color: "bg-yellow-100 text-yellow-800", icon: <AlertTriangle className="h-4 w-4" /> };
    return { status: "in_stock", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4" /> };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {inventory ? "Edit Inventory Item" : "Add New Inventory Item"}
          </h1>
          <p className="text-muted-foreground">
            {inventory ? "Update inventory information" : "Add a new product to inventory"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Basic product details and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  {...register("productName")}
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <p className="text-sm text-red-500">{errors.productName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="Enter SKU"
                />
                {errors.sku && (
                  <p className="text-sm text-red-500">{errors.sku.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="toys">Toys</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue("status", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Stock Information</span>
              <Badge className={stockStatus.color}>
                <div className="flex items-center space-x-1">
                  {stockStatus.icon}
                  <span className="capitalize">{stockStatus.status.replace('_', ' ')}</span>
                </div>
              </Badge>
            </CardTitle>
            <CardDescription>
              Current stock levels and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="trackInventory"
                checked={trackInventory}
                onCheckedChange={(checked) => setValue("trackInventory", checked)}
              />
              <Label htmlFor="trackInventory">Track inventory for this product</Label>
            </div>

            {trackInventory && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Current Stock *</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      {...register("currentStock", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {errors.currentStock && (
                      <p className="text-sm text-red-500">{errors.currentStock.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reservedStock">Reserved Stock</Label>
                    <Input
                      id="reservedStock"
                      type="number"
                      {...register("reservedStock", { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availableStock">Available Stock</Label>
                    <Input
                      id="availableStock"
                      type="number"
                      {...register("availableStock", { valueAsNumber: true })}
                      placeholder="0"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      {...register("lowStockThreshold", { valueAsNumber: true })}
                      placeholder="10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reorderPoint">Reorder Point</Label>
                    <Input
                      id="reorderPoint"
                      type="number"
                      {...register("reorderPoint", { valueAsNumber: true })}
                      placeholder="5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reorderQuantity">Reorder Quantity</Label>
                    <Input
                      id="reorderQuantity"
                      type="number"
                      {...register("reorderQuantity", { valueAsNumber: true })}
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowBackorder"
                    {...register("allowBackorder")}
                  />
                  <Label htmlFor="allowBackorder">Allow backorders</Label>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pricing & Cost */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Cost</CardTitle>
            <CardDescription>
              Product pricing and cost information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  {...register("cost", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Properties</CardTitle>
            <CardDescription>
              Weight and dimensions for shipping calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...register("weight", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.01"
                  {...register("dimensions.length", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  {...register("dimensions.width", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  {...register("dimensions.height", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Supplier */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Supplier</CardTitle>
            <CardDescription>
              Warehouse location and supplier information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Warehouse Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g., A-1-2, Shelf 3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  {...register("supplier")}
                  placeholder="Supplier name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Adjustments */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Adjustments</CardTitle>
            <CardDescription>
              Record stock movements and adjustments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockAdjustments.map((adjustment) => (
              <div key={adjustment.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Adjustment {stockAdjustments.indexOf(adjustment) + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeStockAdjustment(adjustment.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Adjustment Type</Label>
                    <Select 
                      value={adjustment.type} 
                      onValueChange={(value) => updateStockAdjustment(adjustment.id, "type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Add Stock</SelectItem>
                        <SelectItem value="remove">Remove Stock</SelectItem>
                        <SelectItem value="adjust">Adjust Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={adjustment.quantity}
                      onChange={(e) => updateStockAdjustment(adjustment.id, "quantity", parseInt(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Input
                      value={adjustment.reason}
                      onChange={(e) => updateStockAdjustment(adjustment.id, "reason", e.target.value)}
                      placeholder="e.g., Received shipment"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={adjustment.notes}
                    onChange={(e) => updateStockAdjustment(adjustment.id, "notes", e.target.value)}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addStockAdjustment}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stock Adjustment
            </Button>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add tags to help categorize inventory items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Additional notes about this inventory item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add any notes about this inventory item"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : inventory ? "Update Inventory" : "Add to Inventory"}
          </Button>
        </div>
      </form>
    </div>
  );
}
