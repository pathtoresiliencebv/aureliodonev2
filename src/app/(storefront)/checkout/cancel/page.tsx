import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Checkout Cancelled</CardTitle>
            <CardDescription>
              Your payment was not processed. No charges have been made to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Don't worry - your items are still in your cart and you can try again anytime.
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Return to Cart
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need help? Contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
