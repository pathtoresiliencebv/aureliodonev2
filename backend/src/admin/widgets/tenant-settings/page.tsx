"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Save, ExternalLink, Settings } from "lucide-react"

interface TenantSettings {
  id: string
  name: string
  subdomain: string
  plan: string
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
    logo_url?: string
    primary_color?: string
    secondary_color?: string
    font_family?: string
    custom_css?: string
  }
  status: string
}

export default function TenantSettingsWidget() {
  const [settings, setSettings] = useState<TenantSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    primary_color: "",
    secondary_color: "",
    font_family: "",
    custom_css: ""
  })

  useEffect(() => {
    fetchTenantSettings()
  }, [])

  const fetchTenantSettings = async () => {
    try {
      const response = await fetch("/api/admin/tenants/current")
      const data = await response.json()
      setSettings(data)
      setFormData({
        primary_color: data.branding?.primary_color || "#3b82f6",
        secondary_color: data.branding?.secondary_color || "#1e40af",
        font_family: data.branding?.font_family || "Inter",
        custom_css: data.branding?.custom_css || ""
      })
    } catch (error) {
      console.error("Error fetching tenant settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/tenants/current", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branding: formData
        })
      })

      if (response.ok) {
        await fetchTenantSettings()
        alert("Settings saved successfully!")
      } else {
        alert("Error saving settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  if (loading) {
    return <div>Loading tenant settings...</div>
  }

  if (!settings) {
    return <div>Error loading tenant settings</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Store Settings</h2>
          <p className="text-gray-600">Manage your store configuration and branding</p>
        </div>
        <Badge variant={settings.status === 'active' ? 'default' : 'destructive'}>
          {settings.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Store Information
            </CardTitle>
            <CardDescription>
              Basic information about your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <Input value={settings.name} disabled />
            </div>
            <div>
              <Label>Store URL</Label>
              <div className="flex items-center gap-2">
                <Input value={`${settings.subdomain}.yourdomain.com`} disabled />
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Plan</Label>
              <Badge variant="secondary" className="capitalize">
                {settings.plan}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>
              Current usage vs. plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Products</span>
                <span>{settings.usage.products} / {settings.limits.products === -1 ? '∞' : settings.limits.products}</span>
              </div>
              <Progress 
                value={getUsagePercentage(settings.usage.products, settings.limits.products)} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Orders (this month)</span>
                <span>{settings.usage.orders} / {settings.limits.orders === -1 ? '∞' : settings.limits.orders}</span>
              </div>
              <Progress 
                value={getUsagePercentage(settings.usage.orders, settings.limits.orders)} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Storage</span>
                <span>{settings.usage.storage_mb}MB / {settings.limits.storage_mb === -1 ? '∞' : `${settings.limits.storage_mb}MB`}</span>
              </div>
              <Progress 
                value={getUsagePercentage(settings.usage.storage_mb, settings.limits.storage_mb)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Branding & Customization</CardTitle>
            <CardDescription>
              Customize your store's appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                    placeholder="#1e40af"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="font_family">Font Family</Label>
              <Input
                id="font_family"
                value={formData.font_family}
                onChange={(e) => setFormData({...formData, font_family: e.target.value})}
                placeholder="Inter, sans-serif"
              />
            </div>
            <div>
              <Label htmlFor="custom_css">Custom CSS</Label>
              <textarea
                id="custom_css"
                value={formData.custom_css}
                onChange={(e) => setFormData({...formData, custom_css: e.target.value})}
                placeholder="/* Add your custom CSS here */"
                className="w-full h-32 p-3 border rounded-md resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
