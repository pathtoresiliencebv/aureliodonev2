import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CollectionsProps {
  storeSlug: string;
}

// Mock data - in real implementation, this would come from the database
const collections = [
  {
    id: "coll_1",
    name: "Summer Collection",
    description: "Light and breezy styles for the warm season",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    productCount: 24,
  },
  {
    id: "coll_2",
    name: "Winter Essentials",
    description: "Cozy and warm pieces for cold weather",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    productCount: 18,
  },
  {
    id: "coll_3",
    name: "Accessories",
    description: "Complete your look with our accessories",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    productCount: 32,
  },
];

export function Collections({ storeSlug }: CollectionsProps) {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Shop by Collection</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collections designed to match your style and needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <a href={`/s/${storeSlug}/collections/${collection.id}`}>
              <div className="relative">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{collection.description}</p>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {collection.productCount} products
                  </span>
                </div>
              </div>
            </a>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <a href={`/s/${storeSlug}/collections`}>
            View All Collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
