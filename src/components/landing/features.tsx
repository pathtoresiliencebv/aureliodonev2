import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  BarChart3,
  CreditCard,
  Users,
  Truck,
  Headphones,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ShoppingCart,
  Package,
  TrendingUp,
  Settings,
  Smartphone
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Store,
      title: "Multi-Store Management",
      description: "Manage multiple stores from a single dashboard with unified analytics and inventory tracking.",
      features: ["Unlimited stores", "Unified dashboard", "Cross-store analytics", "Centralized inventory"],
      color: "blue"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into your business with real-time analytics and AI-powered recommendations.",
      features: ["Real-time dashboards", "Customer insights", "Revenue forecasting", "AI recommendations"],
      color: "purple"
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Accept payments globally with our integrated payment solutions and fraud protection.",
      features: ["Global payment methods", "Fraud protection", "Automated invoicing", "Multi-currency support"],
      color: "green"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Build lasting relationships with advanced CRM tools and personalized customer experiences.",
      features: ["Customer segmentation", "Loyalty programs", "Email marketing", "Support tickets"],
      color: "orange"
    },
    {
      icon: Truck,
      title: "Order Fulfillment",
      description: "Streamline your order processing with automated workflows and shipping integrations.",
      features: ["Automated workflows", "Shipping integrations", "Order tracking", "Inventory management"],
      color: "red"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help when you need it with our dedicated support team and comprehensive resources.",
      features: ["Live chat support", "Video tutorials", "Community forums", "Priority support"],
      color: "indigo"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SSL encryption, secure payments, and compliance certifications.",
      features: ["SSL encryption", "Secure payments", "GDPR compliance", "SOC 2 certified"],
      color: "emerald"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with global CDN, optimized performance, and 99.9% uptime guarantee.",
      features: ["Global CDN", "Optimized performance", "99.9% uptime", "Fast loading"],
      color: "yellow"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Sell to customers worldwide with multi-language support and local payment methods.",
      features: ["Multi-language", "Local payments", "Currency conversion", "Tax calculation"],
      color: "cyan"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      indigo: "bg-indigo-100 text-indigo-600",
      emerald: "bg-emerald-100 text-emerald-600",
      yellow: "bg-yellow-100 text-yellow-600",
      cyan: "bg-cyan-100 text-cyan-600"
    };
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <section className="py-20 px-4 bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            ✨ Powerful Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From store setup to order fulfillment, Aurelio provides all the tools you need to build a successful e-commerce business.
            Our platform is designed to scale with your business, from startup to enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(feature.color)}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">And Much More...</h3>
            <p className="text-muted-foreground">
              Discover all the features that make Aurelio the perfect choice for your e-commerce business.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Shopping Cart</h4>
              <p className="text-sm text-muted-foreground">Advanced cart functionality</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Inventory</h4>
              <p className="text-sm text-muted-foreground">Smart inventory management</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Growth Tools</h4>
              <p className="text-sm text-muted-foreground">Scale your business</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Customization</h4>
              <p className="text-sm text-muted-foreground">Fully customizable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}