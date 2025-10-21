"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Save,
  ArrowLeft
} from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  compareAtPrice: z.number().min(0).optional(),
  status: z.enum(["draft", "published", "archived"]),
  categoryId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isAvailableForPurchase: z.boolean(),
  availableForPurchase: z.string().optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(z.object({
    name: z.string(),
    sku: z.string().optional(),
    price: z.number(),
    attributes: z.record(z.string()),
  })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  teamSlug: string;
  product?: {
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    compareAtPrice?: number;
    status?: string;
    categoryId?: string;
    metadata?: {
      seoTitle?: string;
      seoDescription?: string;
    };
    isAvailableForPurchase?: boolean;
    availableForPurchase?: string;
    images?: string[];
    variants?: unknown[];
  };
}

export function ProductForm({ teamSlug, product }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [variants, setVariants] = useState<unknown[]>(product?.variants || []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      sku: product?.sku || "",
      price: product?.price ? product.price / 100 : 0, // Convert from cents
      compareAtPrice: product?.compareAtPrice ? product.compareAtPrice / 100 : undefined,
      status: (product?.status as "draft" | "published" | "archived") || "draft",
      categoryId: product?.categoryId || "",
      seoTitle: product?.metadata?.seoTitle || "",
      seoDescription: product?.metadata?.seoDescription || "",
      isAvailableForPurchase: product?.isAvailableForPurchase ?? true,
      availableForPurchase: product?.availableForPurchase || "",
      images: product?.images || [],
      variants: (product?.variants as Array<{
        name?: string;
        price?: number;
        attributes?: Record<string, string>;
        sku?: string;
      }>) || [],
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Convert price back to cents
      const productData = {
        ...data,
        price: Math.round(data.price * 100),
        compareAtPrice: data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null,
        images,
        variants,
        metadata: {
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
        },
      };

      // TODO: Implement actual product creation/update
      console.log("Product data:", productData);

      // Redirect back to products list
      router.push(`/store/${teamSlug}/admin/products`);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const addVariant = () => {
    setVariants([...variants, {
      name: "",
      sku: "",
      price: 0,
      attributes: {},
    }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addImage = () => {
    // TODO: Implement image upload
    const newImage = `https://example.com/image-${Date.now()}.jpg`;
    setImages([...images, newImage]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Product
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SKU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cat1">T-Shirts</SelectItem>
                            <SelectItem value="cat2">Jeans</SelectItem>
                            <SelectItem value="cat3">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="isAvailableForPurchase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Available for purchase</FormLabel>
                          <FormDescription>
                            Allow customers to purchase this product
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compare at Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Original price to show as &quot;was&quot; price
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 border-dashed"
                    onClick={addImage}
                  >
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm">Add Image</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Variants</CardTitle>
                  <Button type="button" onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {variants.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                    <p>No variants added yet</p>
                    <p className="text-sm">Add variants for different sizes, colors, etc.</p>
                  </div>
                ) : (
                  variants.map((variant, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Variant {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              placeholder="e.g., Small, Red"
                              value={(variant as { name?: string }).name || ""}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                (newVariants[index] as { name?: string }).name = e.target.value;
                                setVariants(newVariants);
                              }}
                            />
                          </div>
                          <div>
                            <Label>SKU</Label>
                            <Input
                              placeholder="e.g., TSHIRT-S-RED"
                              value={(variant as { sku?: string }).sku || ""}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                (newVariants[index] as { sku?: string }).sku = e.target.value;
                                setVariants(newVariants);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={(variant as { price?: number }).price || 0}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                (newVariants[index] as { price?: number }).price = parseFloat(e.target.value) || 0;
                                setVariants(newVariants);
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SEO title" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will appear in search results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter SEO description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will appear in search results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
