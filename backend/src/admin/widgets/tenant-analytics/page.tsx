"use client"

import { useState, useEffect } from "react"

interface TenantAnalytics {
  sales: {
    total: number
    thisMonth: number
    growth: number
  }
  orders: {
    total: number
    thisMonth: number
    growth: number
  }
  customers: {
    total: number
    thisMonth: number
    growth: number
  }
  products: {
    total: number
    active: number
    growth: number
  }
  performance: {
    pageViews: number
    bounceRate: number
    avgOrderValue: number
    conversionRate: number
  }
  trends: {
    salesGrowth: number
    revenue: number
    customerSatisfaction: number
  }
}

export default function TenantAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        sales: {
          total: 125430,
          thisMonth: 15420,
          growth: 12.5
        },
        orders: {
          total: 892,
          thisMonth: 134,
          growth: 8.3
        },
        customers: {
          total: 2456,
          thisMonth: 189,
          growth: 15.2
        },
        products: {
          total: 156,
          active: 142,
          growth: 5.7
        },
        performance: {
          pageViews: 45678,
          bounceRate: 34.2,
          avgOrderValue: 89.50,
          conversionRate: 2.3
        },
        trends: {
          salesGrowth: 12.5,
          revenue: 125430,
          customerSatisfaction: 4.8
        }
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!analytics) {
    return <div>No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold">${analytics.sales.total.toLocaleString()}</p>
          <p className="text-sm text-green-600">+{analytics.sales.growth}% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Orders</h3>
          <p className="text-2xl font-bold">{analytics.orders.total}</p>
          <p className="text-sm text-green-600">+{analytics.orders.growth}% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Customers</h3>
          <p className="text-2xl font-bold">{analytics.customers.total}</p>
          <p className="text-sm text-green-600">+{analytics.customers.growth}% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Products</h3>
          <p className="text-2xl font-bold">{analytics.products.total}</p>
          <p className="text-sm text-green-600">+{analytics.products.growth}% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-xl font-bold">{analytics.performance.pageViews.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-xl font-bold">{analytics.performance.bounceRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-xl font-bold">${analytics.performance.avgOrderValue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-xl font-bold">{analytics.performance.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Sales Growth</p>
              <p className="text-xl font-bold text-green-600">+{analytics.trends.salesGrowth}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold">${analytics.trends.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
              <p className="text-xl font-bold">{analytics.trends.customerSatisfaction}/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}