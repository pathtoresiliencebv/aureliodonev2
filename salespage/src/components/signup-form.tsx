"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { pricingPlans, getPlanById } from "@/lib/plans"
import { CheckCircle, Loader2 } from "lucide-react"

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  subdomain: z.string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(20, "Subdomain must be less than 20 characters")
    .regex(/^[a-z0-9-]+$/, "Subdomain can only contain lowercase letters, numbers, and hyphens"),
})

type SignupFormData = z.infer<typeof signupSchema>

interface SignupFormProps {
  selectedPlan?: string
}

export function SignupForm({ selectedPlan = "starter" }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [subdomainError, setSubdomainError] = useState<string | null>(null)
  
  const plan = getPlanById(selectedPlan)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      subdomain: ""
    }
  })

  const subdomain = watch("subdomain")
  const storeUrl = subdomain ? `${subdomain}.yourdomain.com` : "yourdomain.com"

  const checkSubdomain = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) return
    
    try {
      // This would be an API call to check if subdomain is available
      // For now, we'll simulate it
      const response = await fetch(`/api/check-subdomain?subdomain=${subdomain}`)
      const data = await response.json()
      
      if (!data.available) {
        setSubdomainError("This subdomain is already taken")
        setError("subdomain", { message: "This subdomain is already taken" })
      } else {
        setSubdomainError(null)
      }
    } catch (error) {
      console.error("Error checking subdomain:", error)
    }
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true)
    
    try {
      // This would be an API call to create the tenant
      const response = await fetch("/api/admin/tenants/provision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          plan: selectedPlan
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to create account")
      }
      
      const result = await response.json()
      setIsSuccess(true)
      
      // Redirect to the new store admin
      setTimeout(() => {
        window.location.href = `https://${data.subdomain}.yourdomain.com/admin`
      }, 2000)
      
    } catch (error) {
      console.error("Signup error:", error)
      // Handle error - show message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Your store is being set up. You'll be redirected to your admin dashboard shortly.
        </p>
        <div className="text-sm text-gray-500">
          Store URL: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{storeUrl}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Your Store</CardTitle>
              <CardDescription>
                Get started with your {plan?.name} plan
              </CardDescription>
            </div>
            <Badge variant="secondary">${plan?.price}/month</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                {...register("storeName")}
                placeholder="My Awesome Store"
              />
              {errors.storeName && (
                <p className="text-sm text-red-600">{errors.storeName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subdomain">Store URL</Label>
              <div className="flex">
                <Input
                  id="subdomain"
                  {...register("subdomain", {
                    onChange: (e) => {
                      const value = e.target.value.toLowerCase()
                      checkSubdomain(value)
                    }
                  })}
                  placeholder="mystore"
                  className="rounded-r-none"
                />
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md">
                  .yourdomain.com
                </span>
              </div>
              {subdomain && (
                <p className="text-sm text-gray-600">
                  Your store will be available at: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{storeUrl}</span>
                </p>
              )}
              {(errors.subdomain || subdomainError) && (
                <p className="text-sm text-red-600">
                  {errors.subdomain?.message || subdomainError}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">What's included in your {plan?.name} plan:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {plan?.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !!subdomainError}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your store...
                </>
              ) : (
                "Create Store & Start Free Trial"
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
              Your 14-day free trial starts immediately.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
