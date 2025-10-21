import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image?: string;
  productCount: number;
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
          <Link href={`/categories/${category.id}`}>
            <CardContent className="p-0">
              {/* Category Image */}
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-muted/40 flex items-center justify-center">
                    <Package className="h-12 w-12 text-primary" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Product Count Badge */}
                <Badge className="absolute top-2 right-2 bg-white/90 text-black">
                  {category.productCount} products
                </Badge>
              </div>

              {/* Category Info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {category.name}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
