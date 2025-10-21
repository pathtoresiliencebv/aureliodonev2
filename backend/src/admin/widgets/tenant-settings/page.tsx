"use client"

import { useState, useEffect } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

interface TenantSettings {
  id: string
  name: string
  subdomain: string
  plan: string
  status: 'active' | 'suspended' | 'trial'
  limits: {
    products: number
    orders: number
    storage_mb: number
  }
  usage: {
    products: number
    orders: number
    storage_mb: number
  }
  branding: {
    primary_color: string
    secondary_color: string
    font_family: string
    custom_css: string
  }
}

export default function TenantSettingsPage() {
  const [settings, setSettings] = useState<TenantSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSettings({
        id: "tenant_123",
        name: "My Store",
        subdomain: "mystore",
        plan: "pro",
        status: "active",
        limits: {
          products: 1000,
          orders: 2000,
          storage_mb: 5000
        },
        usage: {
          products: 156,
          orders: 892,
          storage_mb: 1200
        },
        branding: {
          primary_color: "#3b82f6",
          secondary_color: "#1e40af",
          font_family: "Inter",
          custom_css: ""
        }
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    // Simulate save operation
    setTimeout(() => {
      setSaving(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  if (loading) {
    return <div>Loading settings...</div>
  }

  if (!settings) {
    return <div>No settings data available</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-gray-600">Manage your store configuration and branding</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Status:</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          settings.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {settings.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <input 
                type="text" 
                value={settings.name} 
                disabled 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Store URL</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input 
                  type="text" 
                  value={`${settings.subdomain}.yourdomain.com`} 
                  disabled 
                  className="flex-1 rounded-l-md border-gray-300"
                />
                <button className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                  Visit
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {settings.plan}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Products</span>
                <span>{settings.usage.products} / {settings.limits.products === -1 ? '∞' : settings.limits.products}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(settings.usage.products / settings.limits.products) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Orders</span>
                <span>{settings.usage.orders} / {settings.limits.orders === -1 ? '∞' : settings.limits.orders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(settings.usage.orders / settings.limits.orders) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>{settings.usage.storage_mb}MB / {settings.limits.storage_mb === -1 ? '∞' : settings.limits.storage_mb}MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(settings.usage.storage_mb / settings.limits.storage_mb) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Branding & Customization</h3>
        <p className="text-sm text-gray-600 mb-6">
          Customize the appearance of your store to match your brand.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="color"
                  id="primary_color"
                  value={settings.branding.primary_color}
                  className="h-10 w-16 rounded-l-md border-gray-300"
                />
                <input
                  type="text"
                  value={settings.branding.primary_color}
                  className="flex-1 rounded-r-md border-gray-300"
                />
              </div>
            </div>
            <div>
              <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700">
                Secondary Color
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="color"
                  id="secondary_color"
                  value={settings.branding.secondary_color}
                  className="h-10 w-16 rounded-l-md border-gray-300"
                />
                <input
                  type="text"
                  value={settings.branding.secondary_color}
                  className="flex-1 rounded-r-md border-gray-300"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="font_family" className="block text-sm font-medium text-gray-700">
              Font Family
            </label>
            <input
              type="text"
              id="font_family"
              value={settings.branding.font_family}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="custom_css" className="block text-sm font-medium text-gray-700">
              Custom CSS
            </label>
            <textarea
              id="custom_css"
              rows={4}
              value={settings.branding.custom_css}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="/* Add your custom CSS here */"
            />
          </div>
          <div>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}