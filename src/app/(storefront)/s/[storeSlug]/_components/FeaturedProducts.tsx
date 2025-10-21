import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format-currency";
import { ArrowRight, Star } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

interface FeaturedProductsProps {
  storeSlug: string;
}

// Mock data - in real implementation, this would come from the database
const featuredProducts = [
  {
    id: "prod_1",
    name: "Premium Cotton T-Shirt",
    price: 2999, // $29.99 in cents
    compareAtPrice: 3999, // $39.99 in cents
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    badge: "Best Seller",
  },
  {
    id: "prod_2",
    name: "Classic Denim Jeans",
    price: 5999, // $59.99 in cents
    compareAtPrice: null,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    badge: "New",
  },
  {
    id: "prod_3",
    name: "Wireless Headphones",
    price: 12999, // $129.99 in cents
    compareAtPrice: 15999, // $159.99 in cents
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 203,
    badge: "Sale",
  },
  {
    id: "prod_4",
    name: "Smart Watch",
    price: 19999, // $199.99 in cents
    compareAtPrice: null,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    badge: "Featured",
  },
];

export function FeaturedProducts({ storeSlug }: FeaturedProductsProps) {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our handpicked selection of premium products,
          carefully curated for quality and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <a href={`/s/${storeSlug}/products/${product.id}`}>
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <Badge
                    variant={product.badge === "Sale" ? "destructive" : "secondary"}
                    className="absolute top-2 left-2"
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
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

                {/* Price */}
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

                {/* Add to Cart Button */}
                <div className="pt-2">
                  <AddToCartButton
                    product={product}
                    variant="outline"
                    size="sm"
                    showQuantity={false}
                  />
                </div>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href={`/s/${storeSlug}/products`}>
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
