"use client";

import { useState } from "react";
// import Link from "next/link"; // Removed as all Link components are replaced with <a>
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/format-currency";
import { Star, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  storeSlug: string;
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    price_min?: string;
    price_max?: string;
    sort?: string;
  };
}

// Mock data - in real implementation, this would come from the database
const products = [
  {
    id: "prod_1",
    name: "Premium Cotton T-Shirt",
    price: 2999,
    compareAtPrice: 3999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "prod_2",
    name: "Classic Denim Jeans",
    price: 5999,
    compareAtPrice: null,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    badge: "New",
    inStock: true,
  },
  {
    id: "prod_3",
    name: "Wireless Headphones",
    price: 12999,
    compareAtPrice: 15999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 203,
    badge: "Sale",
    inStock: false,
  },
  {
    id: "prod_4",
    name: "Smart Watch",
    price: 19999,
    compareAtPrice: null,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    badge: null,
    inStock: true,
  },
  {
    id: "prod_5",
    name: "Running Shoes",
    price: 8999,
    compareAtPrice: 10999,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 78,
    badge: "Featured",
    inStock: true,
  },
  {
    id: "prod_6",
    name: "Backpack",
    price: 4999,
    compareAtPrice: null,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.4,
    reviewCount: 92,
    badge: null,
    inStock: true,
  },
];

export function ProductGrid({ storeSlug, searchParams }: ProductGridProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(urlSearchParams);
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    router.push(`/s/${storeSlug}/products?${params.toString()}`);
  };

  const currentPage = parseInt(searchParams.page || "1");
  const productsPerPage = 12;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, products.length)} of {products.length} products
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort */}
          <Select value={searchParams.sort || "name"} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="price">Price Low-High</SelectItem>
              <SelectItem value="price_desc">Price High-Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {paginatedProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <a href={`/s/${storeSlug}/products/${product.id}`}>
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "grid" ? "h-64" : "h-32 w-32"
                  }`}
                />
                {product.badge && (
                  <Badge
                    variant={product.badge === "Sale" ? "destructive" : "secondary"}
                    className="absolute top-2 left-2"
                  >
                    {product.badge}
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
              <CardContent className={viewMode === "grid" ? "p-4 space-y-3" : "p-4"}>
                {viewMode === "list" ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {formatCurrency(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </a>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => {
              const params = new URLSearchParams(urlSearchParams);
              params.set("page", (currentPage - 1).toString());
              router.push(`/s/${storeSlug}/products?${params.toString()}`);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(urlSearchParams);
                params.set("page", (i + 1).toString());
                router.push(`/s/${storeSlug}/products?${params.toString()}`);
              }}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => {
              const params = new URLSearchParams(urlSearchParams);
              params.set("page", (currentPage + 1).toString());
              router.push(`/s/${storeSlug}/products?${params.toString()}`);
            }}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
