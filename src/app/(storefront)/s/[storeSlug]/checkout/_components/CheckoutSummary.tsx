"use client";

import { useCartStore } from "@/state/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutSummaryProps {
  storeSlug: string;
}

export function CheckoutSummary({ storeSlug }: CheckoutSummaryProps) {
  const { items, total, itemCount, removeItem, updateQuantity } = useCartStore();

  // Calculate shipping (this would be dynamic based on selected shipping method)
  const shippingCost = 599; // $5.99 in cents
  const taxRate = 0.08; // 8% tax
  const subtotal = total;
  const tax = Math.round(subtotal * taxRate);
  const finalTotal = subtotal + shippingCost + tax;

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.name}</h4>
                {item.attributes && Object.keys(item.attributes).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(item.attributes).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)} each
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        {/* Promo Code */}
        <div className="space-y-2">
          <label htmlFor="promo-code" className="text-sm font-medium">
            Promo Code
          </label>
          <div className="flex space-x-2">
            <input
              id="promo-code"
              type="text"
              placeholder="Enter promo code"
              className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
            />
            <Button type="button" variant="outline" size="sm">
              Apply
            </Button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <span>Secure checkout with SSL encryption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
