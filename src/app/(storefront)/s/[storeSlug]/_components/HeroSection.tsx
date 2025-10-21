import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

interface HeroSectionProps {
  storeSlug: string;
}

export function HeroSection({ storeSlug }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="text-primary">Aurelio Store</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing products with exceptional quality and unbeatable prices.
              Your perfect shopping experience starts here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href={`/s/${storeSlug}/products`}>
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <a href={`/s/${storeSlug}/collections`}>
                Browse Collections
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 Customer Rating</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-muted-foreground/20" />
            <div>Free Shipping on Orders $50+</div>
            <div className="hidden sm:block w-px h-4 bg-muted-foreground/20" />
            <div>30-Day Returns</div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  );
}
