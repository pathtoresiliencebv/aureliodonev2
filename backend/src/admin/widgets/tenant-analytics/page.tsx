"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ShoppingCart, Users, DollarSign, Package, Eye } from "lucide-react"

interface TenantAnalytics {
  sales: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  orders: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  customers: {
    total: number
    new: number
    returning: number
  }
  products: {
    total: number
    active: number
    lowStock: number
  }
  views: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
}

export default function TenantAnalyticsWidget() {
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics/tenant")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!analytics) {
    return <div>Error loading analytics</div>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600"
    if (growth < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return "↗"
    if (growth < 0) return "↘"
    return "→"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-gray-600">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.sales.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={getGrowthColor(analytics.sales.growth)}>
                {getGrowthIcon(analytics.sales.growth)} {Math.abs(analytics.sales.growth)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This month: {formatCurrency(analytics.sales.thisMonth)}
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.orders.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={getGrowthColor(analytics.orders.growth)}>
                {getGrowthIcon(analytics.orders.growth)} {Math.abs(analytics.orders.growth)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This month: {formatNumber(analytics.orders.thisMonth)}
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.customers.total)}</div>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600">{analytics.customers.new} new</span>
              <span className="mx-1">•</span>
              <span className="text-blue-600">{analytics.customers.returning} returning</span>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.products.total)}</div>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600">{analytics.products.active} active</span>
              {analytics.products.lowStock > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-orange-600">{analytics.products.lowStock} low stock</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Page Views
            </CardTitle>
            <CardDescription>
              Store traffic and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(analytics.views.total)}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <span className={getGrowthColor(analytics.views.growth)}>
                {getGrowthIcon(analytics.views.growth)} {Math.abs(analytics.views.growth)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This month: {formatNumber(analytics.views.thisMonth)} views
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance
            </CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Conversion Rate</span>
              <Badge variant="secondary">2.3%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Order Value</span>
              <Badge variant="secondary">{formatCurrency(89.50)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <Badge variant="secondary">4.8/5</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
