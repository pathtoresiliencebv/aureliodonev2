"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "./CartProvider";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    teamId: string;
    variant?: {
      id: string;
      name: string;
      value: string;
    }[];
  };
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        {/* Quantity Selector */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="lg"
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        {/* Price Display */}
        <div className="text-center">
          <span className="text-2xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          {quantity > 1 && (
            <div className="text-sm text-muted-foreground">
              Total: ${(product.price * quantity).toFixed(2)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
