"use client";

import { useState } from "react";
// import Link from "next/link"; // Removed as all Link components are replaced with <a>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  Heart
} from "lucide-react";
import { useCartStore } from "@/state/cart";

interface StoreHeaderProps {
  storeSlug: string;
}

export function StoreHeader({ storeSlug }: StoreHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, toggleCart } = useCartStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/s/${storeSlug}/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href={`/s/${storeSlug}`} className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl">Aurelio Store</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href={`/s/${storeSlug}`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href={`/s/${storeSlug}/products`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Products
            </a>
            <a
              href={`/s/${storeSlug}/collections`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Collections
            </a>
            <a
              href={`/s/${storeSlug}/about`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  <a
                    href={`/s/${storeSlug}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href={`/s/${storeSlug}/products`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Products
                  </a>
                  <a
                    href={`/s/${storeSlug}/collections`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Collections
                  </a>
                  <a
                    href={`/s/${storeSlug}/about`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    About
                  </a>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
