"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard,
  Package,
  Truck,
  Save,
  ArrowLeft,
  Plus,
  X
} from "lucide-react";

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerName: z.string().min(1, "Customer name is required"),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  shippingAddress: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    company: z.string().optional(),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    company: z.string().optional(),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().optional(),
  }),
  items: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    productName: z.string().min(1, "Product name is required"),
    variantId: z.string().optional(),
    variantName: z.string().optional(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be positive"),
    total: z.number().min(0, "Total must be positive"),
  })).min(1, "At least one item is required"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  tax: z.number().min(0, "Tax must be positive"),
  shipping: z.number().min(0, "Shipping must be positive"),
  discount: z.number().min(0, "Discount must be positive"),
  total: z.number().min(0, "Total must be positive"),
  notes: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingMethod: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  order?: OrderFormData;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function OrderForm({ order, onSubmit, onCancel, isLoading = false }: OrderFormProps) {
  const [items, setItems] = useState<any[]>(order?.items || []);
  const [useSameAddress, setUseSameAddress] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: order || {
      customerId: "",
      customerEmail: "",
      customerName: "",
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: {
        firstName: "",
        lastName: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      },
      billingAddress: {
        firstName: "",
        lastName: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      },
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      notes: "",
      trackingNumber: "",
      shippingMethod: "",
    },
  });

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      productId: "",
      productName: "",
      variantId: "",
      variantName: "",
      quantity: 1,
      price: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = 10; // Fixed shipping
    const discount = 0;
    const total = subtotal + tax + shipping - discount;

    setValue("subtotal", subtotal);
    setValue("tax", tax);
    setValue("shipping", shipping);
    setValue("discount", discount);
    setValue("total", total);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {order ? "Edit Order" : "Create New Order"}
          </h1>
          <p className="text-muted-foreground">
            {order ? "Update order information" : "Create a new order manually"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
              <CardDescription>
                Customer details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  {...register("customerName")}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...register("customerEmail")}
                  placeholder="Enter customer email"
                />
                {errors.customerEmail && (
                  <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select onValueChange={(value) => setValue("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select onValueChange={(value) => setValue("paymentStatus", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </CardTitle>
              <CardDescription>
                Add products to this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item {items.indexOf(item) + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input
                        value={item.productName}
                        onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input
                        value={item.productId}
                        onChange={(e) => updateItem(item.id, "productId", e.target.value)}
                        placeholder="Product SKU"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value))}
                        placeholder="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-medium">Total: ${item.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Shipping Address
              </CardTitle>
              <CardDescription>
                Where to ship this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingFirstName">First Name *</Label>
                  <Input
                    id="shippingFirstName"
                    {...register("shippingAddress.firstName")}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingLastName">Last Name *</Label>
                  <Input
                    id="shippingLastName"
                    {...register("shippingAddress.lastName")}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingCompany">Company</Label>
                <Input
                  id="shippingCompany"
                  {...register("shippingAddress.company")}
                  placeholder="Company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress1">Address Line 1 *</Label>
                <Input
                  id="shippingAddress1"
                  {...register("shippingAddress.address1")}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress2">Address Line 2</Label>
                <Input
                  id="shippingAddress2"
                  {...register("shippingAddress.address2")}
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCity">City *</Label>
                  <Input
                    id="shippingCity"
                    {...register("shippingAddress.city")}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingState">State *</Label>
                  <Input
                    id="shippingState"
                    {...register("shippingAddress.state")}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingPostalCode">Postal Code *</Label>
                  <Input
                    id="shippingPostalCode"
                    {...register("shippingAddress.postalCode")}
                    placeholder="ZIP code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCountry">Country *</Label>
                  <Input
                    id="shippingCountry"
                    {...register("shippingAddress.country")}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingPhone">Phone</Label>
                <Input
                  id="shippingPhone"
                  {...register("shippingAddress.phone")}
                  placeholder="Phone number"
                />
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
              <CardDescription>
                Billing information for this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useSameAddress"
                  checked={useSameAddress}
                  onChange={(e) => setUseSameAddress(e.target.checked)}
                />
                <Label htmlFor="useSameAddress">Same as shipping address</Label>
              </div>

              {!useSameAddress && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingFirstName">First Name *</Label>
                      <Input
                        id="billingFirstName"
                        {...register("billingAddress.firstName")}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingLastName">Last Name *</Label>
                      <Input
                        id="billingLastName"
                        {...register("billingAddress.lastName")}
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingCompany">Company</Label>
                    <Input
                      id="billingCompany"
                      {...register("billingAddress.company")}
                      placeholder="Company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingAddress1">Address Line 1 *</Label>
                    <Input
                      id="billingAddress1"
                      {...register("billingAddress.address1")}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingAddress2">Address Line 2</Label>
                    <Input
                      id="billingAddress2"
                      {...register("billingAddress.address2")}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">City *</Label>
                      <Input
                        id="billingCity"
                        {...register("billingAddress.city")}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingState">State *</Label>
                      <Input
                        id="billingState"
                        {...register("billingAddress.state")}
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingPostalCode">Postal Code *</Label>
                      <Input
                        id="billingPostalCode"
                        {...register("billingAddress.postalCode")}
                        placeholder="ZIP code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCountry">Country *</Label>
                      <Input
                        id="billingCountry"
                        {...register("billingAddress.country")}
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingPhone">Phone</Label>
                    <Input
                      id="billingPhone"
                      {...register("billingAddress.phone")}
                      placeholder="Phone number"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Order Summary
            </CardTitle>
            <CardDescription>
              Review order totals and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${watch("subtotal")?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${watch("tax")?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${watch("shipping")?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${watch("discount")?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${watch("total")?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add any notes about this order"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  {...register("trackingNumber")}
                  placeholder="Tracking number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <Input
                  id="shippingMethod"
                  {...register("shippingMethod")}
                  placeholder="Shipping method"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={calculateTotals}>
            Calculate Totals
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : order ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
