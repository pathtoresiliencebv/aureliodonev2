import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  teamId: string;
  rating?: number;
  reviews?: number;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              {/* Rating Badge */}
              {product.rating && (
                <Badge className="absolute top-2 left-2 bg-white/90 text-black">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  {product.rating}
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {product.reviews && (
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <AddToCartButton product={product} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
