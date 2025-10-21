"use client";

import { useState } from "react";
import { useCartStore } from "@/state/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { Star, Heart, Share2, Truck, Shield, RotateCcw, ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ProductDetailProps {
  storeSlug: string;
  productId: string;
}

// Mock product data - in real app, this would come from the database
const mockProduct = {
  id: "prod_1",
  name: "Premium Cotton T-Shirt",
  description: "A comfortable and stylish cotton t-shirt made from 100% organic cotton. Perfect for everyday wear with a modern fit and soft feel.",
  price: 2999, // $29.99 in cents
  compareAtPrice: 3999, // $39.99 in cents
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop",
  ],
  variants: [
    { id: "var_1", name: "Small", attributes: { Size: "S", Color: "Black" }, price: 2999, stock: 10 },
    { id: "var_2", name: "Medium", attributes: { Size: "M", Color: "Black" }, price: 2999, stock: 15 },
    { id: "var_3", name: "Large", attributes: { Size: "L", Color: "Black" }, price: 2999, stock: 8 },
    { id: "var_4", name: "Small White", attributes: { Size: "S", Color: "White" }, price: 2999, stock: 12 },
    { id: "var_5", name: "Medium White", attributes: { Size: "M", Color: "White" }, price: 2999, stock: 20 },
    { id: "var_6", name: "Large White", attributes: { Size: "L", Color: "White" }, price: 2999, stock: 5 },
  ],
  rating: 4.8,
  reviewCount: 124,
  inStock: true,
  sku: "TSHIRT-001",
  category: "Clothing",
  tags: ["cotton", "organic", "casual", "comfortable"],
  specifications: {
    "Material": "100% Organic Cotton",
    "Care Instructions": "Machine wash cold, tumble dry low",
    "Origin": "Made in USA",
    "Weight": "180 GSM",
  },
  shipping: {
    freeShipping: true,
    estimatedDelivery: "3-5 business days",
    returnPolicy: "30 days return policy",
  }
};

export function ProductDetail({ storeSlug, productId }: ProductDetailProps) {
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(mockProduct.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock available");
      return;
    }

    addItem({
      productId: mockProduct.id,
      variantId: selectedVariant.id,
      name: mockProduct.name,
      price: selectedVariant.price,
      quantity,
      image: mockProduct.images[0],
      attributes: selectedVariant.attributes,
    });

    toast.success("Added to cart!");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockProduct.name,
        text: mockProduct.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <Image
            src={mockProduct.images[selectedImage]}
            alt={mockProduct.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {mockProduct.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {mockProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative overflow-hidden rounded-md border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image
                  src={image}
                  alt={`${mockProduct.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{mockProduct.category}</Badge>
            {mockProduct.compareAtPrice && (
              <Badge variant="destructive">Sale</Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{mockProduct.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(mockProduct.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {mockProduct.rating} ({mockProduct.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold">
              {formatCurrency(selectedVariant.price)}
            </span>
            {mockProduct.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">
                {formatCurrency(mockProduct.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{mockProduct.description}</p>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex gap-2">
              {Array.from(new Set(mockProduct.variants.map(v => v.attributes.Size))).map(size => (
                <Button
                  key={size}
                  variant={selectedVariant.attributes.Size === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const variant = mockProduct.variants.find(v =>
                      v.attributes.Size === size && v.attributes.Color === selectedVariant.attributes.Color
                    );
                    if (variant) setSelectedVariant(variant);
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex gap-2">
              {Array.from(new Set(mockProduct.variants.map(v => v.attributes.Color))).map(color => (
                <Button
                  key={color}
                  variant={selectedVariant.attributes.Color === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const variant = mockProduct.variants.find(v =>
                      v.attributes.Color === color && v.attributes.Size === selectedVariant.attributes.Size
                    );
                    if (variant) setSelectedVariant(variant);
                  }}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= selectedVariant.stock}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {selectedVariant.stock} in stock
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="lg"
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Shipping Info */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  {mockProduct.shipping.freeShipping ? "Free shipping" : "Shipping calculated at checkout"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{mockProduct.shipping.returnPolicy}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Estimated delivery: {mockProduct.shipping.estimatedDelivery}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Details Tabs */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p>{mockProduct.description}</p>
              <p className="mt-4">
                This premium cotton t-shirt is designed for comfort and style. Made from 100% organic cotton,
                it features a modern fit that flatters all body types. The soft, breathable fabric makes it
                perfect for everyday wear, whether you're running errands or relaxing at home.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(mockProduct.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Reviews will be displayed here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
