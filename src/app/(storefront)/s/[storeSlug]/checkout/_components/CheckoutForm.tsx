"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CreditCard, MapPin, Truck } from "lucide-react";
import { useCartStore } from "@/state/cart";
import { toast } from "sonner";

// Validation schemas
const addressSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  company: z.string().optional(),
  address1: z.string().min(5, "Address must be at least 5 characters"),
  address2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().optional(),
});

const checkoutSchema = z.object({
  // Billing Address
  billingAddress: addressSchema,

  // Shipping Address
  shippingAddress: addressSchema,
  sameAsBilling: z.boolean(),

  // Shipping Method
  shippingMethod: z.string().min(1, "Please select a shipping method"),

  // Payment Method
  paymentMethod: z.string().min(1, "Please select a payment method"),

  // Additional Options
  saveAddress: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  storeSlug: string;
}

export function CheckoutForm({ storeSlug }: CheckoutFormProps) {
  const { items, total } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsBilling: true,
      saveAddress: false,
      newsletter: false,
      terms: false,
    },
  });

  const { watch, setValue } = form;
  const sameAsBilling = watch("sameAsBilling");

  // Update shipping address when sameAsBilling changes
  const handleSameAsBillingChange = (checked: boolean) => {
    setValue("sameAsBilling", checked);
    if (checked) {
      const billingAddress = form.getValues("billingAddress");
      form.setValue("shippingAddress", billingAddress);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // Here you would integrate with your payment processor (Stripe, etc.)
      console.log("Checkout data:", data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Order placed successfully!");

      // Clear cart and redirect to success page
      useCartStore.getState().clearCart();
      window.location.href = `/s/${storeSlug}/checkout/success`;

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-4">
            Add some items to your cart to proceed with checkout.
          </p>
          <Button asChild>
            <a href={`/s/${storeSlug}/products`}>
              Continue Shopping
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={currentStep.toString()} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1" disabled={currentStep < 1}>
              <MapPin className="w-4 h-4 mr-2" />
              Address
            </TabsTrigger>
            <TabsTrigger value="2" disabled={currentStep < 2}>
              <Truck className="w-4 h-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="3" disabled={currentStep < 3}>
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
          </TabsList>

          {/* Step 1: Address Information */}
          <TabsContent value="1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingAddress.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingAddress.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="billingAddress.company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="billingAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="NL">Netherlands</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingAddress.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onCheckedChange={handleSameAsBillingChange}
                  />
                  <Label htmlFor="sameAsBilling">
                    Same as billing address
                  </Label>
                </div>

                {!sameAsBilling && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingAddress.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="shippingAddress.address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingAddress.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="button" onClick={nextStep}>
                Continue to Shipping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 2: Shipping Method */}
          <TabsContent value="2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <div className="font-medium">Standard Shipping</div>
                                  <div className="text-sm text-muted-foreground">
                                    5-7 business days
                                  </div>
                                </div>
                                <div className="font-medium">$5.99</div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <div className="font-medium">Express Shipping</div>
                                  <div className="text-sm text-muted-foreground">
                                    2-3 business days
                                  </div>
                                </div>
                                <div className="font-medium">$12.99</div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="overnight" id="overnight" />
                            <Label htmlFor="overnight" className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <div className="font-medium">Overnight Shipping</div>
                                  <div className="text-sm text-muted-foreground">
                                    Next business day
                                  </div>
                                </div>
                                <div className="font-medium">$24.99</div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Address
              </Button>
              <Button type="button" onClick={nextStep}>
                Continue to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 3: Payment */}
          <TabsContent value="3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex-1">
                              <div className="flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Credit or Debit Card
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="flex-1">
                              <div className="flex items-center">
                                <div className="mr-2 h-4 w-4 bg-blue-600 rounded"></div>
                                PayPal
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveAddress"
                    {...form.register("saveAddress")}
                  />
                  <Label htmlFor="saveAddress">
                    Save this address for future orders
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    {...form.register("newsletter")}
                  />
                  <Label htmlFor="newsletter">
                    Subscribe to our newsletter for updates and special offers
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    {...form.register("terms")}
                  />
                  <Label htmlFor="terms">
                    I agree to the{" "}
                    <a href={`/s/${storeSlug}/terms`} className="text-primary hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href={`/s/${storeSlug}/privacy`} className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                {form.formState.errors.terms && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.terms.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shipping
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : `Place Order - $${(total / 100).toFixed(2)}`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
