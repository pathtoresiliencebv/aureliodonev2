"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Mail, ArrowRight, Download } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

interface CheckoutSuccessContentProps {
  storeSlug: string;
  orderId?: string;
  sessionId?: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  shippingAddress: any;
  billingAddress: any;
  lineItems: Array<{
    productName: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export function CheckoutSuccessContent({ storeSlug, orderId, sessionId }: CheckoutSuccessContentProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full animate-pulse mb-4" />
          <h1 className="text-3xl font-bold mb-2">Loading order details...</h1>
        </div>
      </div>
    );
  }

  const orderNumber = order?.orderNumber || orderId || "ORD-12345";
  const estimatedDelivery = "3-5 business days";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase. We've received your order and will begin processing it shortly.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Order #{orderNumber}
        </Badge>
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Order Number</p>
              <p className="text-muted-foreground">{orderNumber}</p>
            </div>
            <div>
              <p className="font-medium">Order Date</p>
              <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-muted-foreground">{estimatedDelivery}</p>
            </div>
            <div>
              <p className="font-medium">Payment Status</p>
              <Badge variant="default" className="text-xs">Paid</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">Confirmation Email</h4>
              <p className="text-sm text-muted-foreground">
                We've sent you a confirmation email with your order details and tracking information.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium">Order Processing</h4>
              <p className="text-sm text-muted-foreground">
                Your order is being prepared for shipment. You'll receive a tracking number once it's dispatched.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Your order will be delivered within {estimatedDelivery}. You'll receive updates via email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <a href={`/s/${storeSlug}/products`}>
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>

        <Button variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
      </div>

      {/* Support */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions about your order, please don't hesitate to contact our support team.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              <Button variant="outline" size="sm">
                View Order Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
