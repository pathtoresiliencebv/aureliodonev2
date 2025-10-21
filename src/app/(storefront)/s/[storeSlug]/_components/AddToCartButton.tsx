"use client";

import { useState } from "react";
import { useCartStore } from "@/state/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    attributes?: Record<string, string>;
  };
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showQuantity?: boolean;
}

export function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  showQuantity = false
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      attributes: product.attributes,
    });

    toast.success("Added to cart!");
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (showQuantity) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="px-2 py-1 min-w-[2rem] text-center text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateQuantity(quantity + 1)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button onClick={handleAddToCart} variant={variant} size={size}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleAddToCart} variant={variant} size={size}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
