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
  Upload, 
  X, 
  Plus,
  Save,
  ArrowLeft
} from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  comparePrice: z.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive", "draft"]),
  trackInventory: z.boolean(),
  inventory: z.number().min(0, "Inventory must be positive"),
  allowBackorder: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [variants, setVariants] = useState<any[]>(product?.variants || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      description: "",
      price: 0,
      comparePrice: 0,
      sku: "",
      barcode: "",
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      category: "",
      tags: [],
      status: "draft",
      trackInventory: true,
      inventory: 0,
      allowBackorder: false,
      seoTitle: "",
      seoDescription: "",
    },
  });

  const trackInventory = watch("trackInventory");
  const status = watch("status");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addVariant = () => {
    setVariants([...variants, {
      id: Date.now().toString(),
      name: "",
      price: 0,
      sku: "",
      inventory: 0,
    }]);
  };

  const removeVariant = (variantId: string) => {
    setVariants(variants.filter(variant => variant.id !== variantId));
  };

  const updateVariant = (variantId: string, field: string, value: any) => {
    setVariants(variants.map(variant => 
      variant.id === variantId ? { ...variant, [field]: value } : variant
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-muted-foreground">
            {product ? "Update product information" : "Create a new product for your store"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential product details and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
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

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter product description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare at Price</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  {...register("comparePrice", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
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
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload product images (first image will be the main image)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-24 border-dashed"
                onClick={() => {/* Handle image upload */}}
              >
                <Upload className="h-6 w-6 mr-2" />
                Add Image
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              Manage stock levels and inventory tracking
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory">Quantity in Stock</Label>
                  <Input
                    id="inventory"
                    type="number"
                    {...register("inventory", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowBackorder"
                    {...register("allowBackorder")}
                  />
                  <Label htmlFor="allowBackorder">Allow backorders</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>
              Add different options like size, color, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((variant) => (
              <div key={variant.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Variant {variants.indexOf(variant) + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeVariant(variant.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Variant Name</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                      placeholder="e.g., Small, Red"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.id, "price", parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                      placeholder="Variant SKU"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addVariant}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add tags to help customers find your product
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

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimize your product for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                {...register("seoTitle")}
                placeholder="SEO optimized title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                {...register("seoDescription")}
                placeholder="SEO optimized description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
            <CardDescription>
              Control when your product is visible to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue("status", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
            {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
