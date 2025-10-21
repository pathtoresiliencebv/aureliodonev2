"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StripeCheckout } from "@/components/payment/StripeCheckout";
import { CreditCard, DollarSign, ShoppingCart, AlertCircle } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  images?: string[];
}

export default function PaymentsPage() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "1",
      name: "Premium T-Shirt",
      description: "High-quality cotton t-shirt",
      price: 29.99,
      quantity: 1,
      images: ["/placeholder-tshirt.jpg"]
    },
    {
      id: "2",
      name: "Designer Jeans",
      description: "Comfortable denim jeans",
      price: 79.99,
      quantity: 1,
      images: ["/placeholder-jeans.jpg"]
    }
  ]);

  const [showCheckout, setShowCheckout] = useState(false);
  const [teamId] = useState("demo-team-123"); // In real app, get from session
  const [customerEmail, setCustomerEmail] = useState("");

  const addToCart = (item: Omit<CartItem, "id">) => {
    const newItem = { ...item, id: Date.now().toString() };
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutSuccess = (sessionId: string) => {
    console.log("Checkout successful:", sessionId);
    setShowCheckout(false);
    setCart([]);
    // In real app, redirect to success page
    alert("Payment successful! (Demo mode)");
  };

  const handleCheckoutError = (error: string) => {
    console.error("Checkout error:", error);
    alert(`Payment failed: ${error}`);
  };

  if (showCheckout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Button variant="outline" onClick={() => setShowCheckout(false)}>
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <StripeCheckout
              items={cart}
              teamId={teamId}
              customerEmail={customerEmail}
              onSuccess={handleCheckoutSuccess}
              onError={handleCheckoutError}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Processing</h1>
          <p className="text-muted-foreground">
            Test Stripe payment integration with demo products
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <CreditCard className="h-3 w-3 mr-1" />
            Stripe Demo
          </Badge>
        </div>
      </div>

      {/* Demo Products */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Products</CardTitle>
          <CardDescription>
            Add products to cart to test the payment flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Premium T-Shirt", price: 29.99, description: "High-quality cotton" },
              { name: "Designer Jeans", price: 79.99, description: "Comfortable denim" },
              { name: "Running Shoes", price: 129.99, description: "Athletic footwear" },
              { name: "Smart Watch", price: 299.99, description: "Latest technology" },
              { name: "Wireless Headphones", price: 199.99, description: "Noise cancelling" },
              { name: "Laptop Bag", price: 49.99, description: "Professional carry" }
            ].map((product, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">${product.price}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shopping Cart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart ({cart.length} items)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some products to test the payment flow</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <span className="font-semibold w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Customer Email (for demo)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                  disabled={cart.length === 0}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Setup Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Environment Variables Required:</h4>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div>STRIPE_SECRET_KEY=sk_test_...</div>
                <div>STRIPE_WEBHOOK_SECRET=whsec_...</div>
                <div>STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Webhook Endpoint:</h4>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                {process.env.SITE_URL || "https://your-domain.com"}/api/payments/webhook
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Test Cards:</h4>
              <div className="space-y-2 text-sm">
                <div>• 4242 4242 4242 4242 (Visa)</div>
                <div>• 4000 0566 5566 5556 (Visa Debit)</div>
                <div>• 5555 5555 5555 4444 (Mastercard)</div>
                <div>• 3782 822463 10005 (American Express)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
