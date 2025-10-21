"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface StripeCheckoutProps {
  items: CartItem[];
  teamId: string;
  customerEmail?: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

export function StripeCheckout({
  items,
  teamId,
  customerEmail,
  onSuccess,
  onError
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(customerEmail || "");
  const [isEmailValid, setIsEmailValid] = useState(!!customerEmail);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!isEmailValid) {
      onError?.("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          teamId,
          customerEmail: email,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (error) {
      console.error("Checkout error:", error);
      onError?.(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Secure Checkout</span>
        </CardTitle>
        <CardDescription>
          Powered by Stripe - Your payment information is secure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={isEmailValid ? "border-green-500" : email ? "border-red-500" : ""}
          />
          {email && !isEmailValid && (
            <p className="text-sm text-red-500">Please enter a valid email address</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-2">
          <Label>Order Summary</Label>
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
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

        {/* Security Features */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>256-bit SSL encryption</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4" />
          <span>PCI DSS compliant</span>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isLoading || !isEmailValid || items.length === 0}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ${total.toFixed(2)}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You will be redirected to Stripe's secure checkout page
        </p>
      </CardContent>
    </Card>
  );
}
