import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  ArrowRight,
  Star,
  Truck,
  Shield,
  Package
} from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/20" />

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                🎉 New Collection Available
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                Discover Amazing
                <span className="text-primary block">Products</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Shop the latest trends and find everything you need in one place.
                Quality products, great prices, and exceptional service.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.9</span>
                <span className="text-muted-foreground">(2,847 reviews)</span>
              </div>
              <div className="text-muted-foreground">•</div>
              <div className="text-muted-foreground">10,000+ happy customers</div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/products">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-muted/40 rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Your Store</h3>
                <p className="text-muted-foreground">
                  Beautiful products await
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
