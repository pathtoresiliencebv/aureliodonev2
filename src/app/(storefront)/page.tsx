import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Star,
  Truck,
  Shield,
  ArrowRight,
  Package,
  Users,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { HeroSection } from "@/components/storefront/HeroSection";
import { FeaturedCategories } from "@/components/storefront/FeaturedCategories";

// Mock data for demo
const featuredProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality sound with noise cancellation",
    price: 199.99,
    image: "/placeholder-headphones.jpg",
    teamId: "demo-team",
    rating: 4.8,
    reviews: 124
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Track your health and fitness goals",
    price: 299.99,
    image: "/placeholder-watch.jpg",
    teamId: "demo-team",
    rating: 4.6,
    reviews: 89
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    description: "Comfortable seating for long work sessions",
    price: 399.99,
    image: "/placeholder-chair.jpg",
    teamId: "demo-team",
    rating: 4.9,
    reviews: 67
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    description: "Professional typing experience",
    price: 149.99,
    image: "/placeholder-keyboard.jpg",
    teamId: "demo-team",
    rating: 4.7,
    reviews: 156
  }
];

const categories = [
  {
    id: "1",
    name: "Electronics",
    image: "/placeholder-electronics.jpg",
    productCount: 45
  },
  {
    id: "2",
    name: "Fashion",
    image: "/placeholder-fashion.jpg",
    productCount: 32
  },
  {
    id: "3",
    name: "Home & Garden",
    image: "/placeholder-home.jpg",
    productCount: 28
  },
  {
    id: "4",
    name: "Sports",
    image: "/placeholder-sports.jpg",
    productCount: 19
  }
];

export default function StorefrontHomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={featuredProducts} />
          </Suspense>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you're looking for
            </p>
          </div>

          <Suspense fallback={<CategoryGridSkeleton />}>
            <FeaturedCategories categories={categories} />
          </Suspense>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $50
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment information is safe
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">
                  30-day return policy
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  We're here to help you
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Start Shopping
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Best Sellers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-48 bg-muted rounded-md" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded-md" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
