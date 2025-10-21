import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Package
} from "lucide-react";
import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aurelio Store</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted online shopping destination. Quality products,
              great prices, and exceptional service.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                All Products
              </Link>
              <Link href="/categories" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/deals" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Special Deals
              </Link>
              <Link href="/new-arrivals" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                New Arrivals
              </Link>
              <Link href="/best-sellers" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Best Sellers
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="/shipping" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Returns & Exchanges
              </Link>
              <Link href="/size-guide" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Size Guide
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="space-y-2">
              <Input placeholder="Enter your email" />
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <CreditCard className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>SSL Protected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>Easy Returns</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span>© 2024 Aurelio Store. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
