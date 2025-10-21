"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  ArrowLeft,
  Download,
  Mail,
  Phone
} from "lucide-react";

interface OrderDetailProps {
  order: {
    id: string;
    customer: string;
    email: string;
    phone?: string;
    status: string;
    paymentStatus: string;
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    items: Array<{
      id: string;
      name: string;
      variant?: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
    billingAddress: {
      firstName: string;
      lastName: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
    notes?: string;
    trackingNumber?: string;
    shippingMethod?: string;
    createdAt: string;
    updatedAt: string;
  };
  onEdit: () => void;
  onBack: () => void;
}

export function OrderDetail({ order, onEdit, onBack }: OrderDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Order details and customer information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Order Status</div>
                  <div className="text-sm text-muted-foreground capitalize">{order.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Payment Status</div>
                  <div className="text-sm text-muted-foreground capitalize">{order.paymentStatus}</div>
                </div>
              </div>
              
              {order.trackingNumber && (
                <div>
                  <div className="text-sm font-medium">Tracking Number</div>
                  <div className="text-sm text-muted-foreground">{order.trackingNumber}</div>
                </div>
              )}
              
              {order.shippingMethod && (
                <div>
                  <div className="text-sm font-medium">Shipping Method</div>
                  <div className="text-sm text-muted-foreground">{order.shippingMethod}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Products in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.variant && (
                          <div className="text-sm text-muted-foreground">{item.variant}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </div>
                  {order.shippingAddress.company && (
                    <div className="text-sm text-muted-foreground">
                      {order.shippingAddress.company}
                    </div>
                  )}
                  <div className="text-sm">
                    {order.shippingAddress.address1}
                  </div>
                  {order.shippingAddress.address2 && (
                    <div className="text-sm">
                      {order.shippingAddress.address2}
                    </div>
                  )}
                  <div className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </div>
                  <div className="text-sm">
                    {order.shippingAddress.country}
                  </div>
                  {order.shippingAddress.phone && (
                    <div className="text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {order.shippingAddress.phone}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">
                    {order.billingAddress.firstName} {order.billingAddress.lastName}
                  </div>
                  {order.billingAddress.company && (
                    <div className="text-sm text-muted-foreground">
                      {order.billingAddress.company}
                    </div>
                  )}
                  <div className="text-sm">
                    {order.billingAddress.address1}
                  </div>
                  {order.billingAddress.address2 && (
                    <div className="text-sm">
                      {order.billingAddress.address2}
                    </div>
                  )}
                  <div className="text-sm">
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                  </div>
                  <div className="text-sm">
                    {order.billingAddress.country}
                  </div>
                  {order.billingAddress.phone && (
                    <div className="text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {order.billingAddress.phone}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium">{order.customer}</div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {order.email}
                </div>
                {order.phone && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {order.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={onEdit} className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Order Created</div>
                    <div className="text-xs text-muted-foreground">{order.createdAt}</div>
                  </div>
                </div>
                {order.status !== "pending" && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Order Processing</div>
                      <div className="text-xs text-muted-foreground">In progress</div>
                    </div>
                  </div>
                )}
                {order.status === "shipped" && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Order Shipped</div>
                      <div className="text-xs text-muted-foreground">In transit</div>
                    </div>
                  </div>
                )}
                {order.status === "completed" && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Order Delivered</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
