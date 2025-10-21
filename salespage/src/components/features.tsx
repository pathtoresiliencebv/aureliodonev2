import { 
  ShoppingCart, 
  Palette, 
  Zap, 
  Shield, 
  BarChart3, 
  Smartphone,
  Globe,
  CreditCard
} from "lucide-react"

const features = [
  {
    name: "Beautiful Storefronts",
    description: "Create stunning, mobile-responsive storefronts that convert visitors into customers.",
    icon: ShoppingCart,
  },
  {
    name: "Custom Branding",
    description: "Upload your logo, choose colors, and customize every aspect of your store's appearance.",
    icon: Palette,
  },
  {
    name: "Lightning Fast",
    description: "Built on modern technology for blazing fast page loads and smooth user experience.",
    icon: Zap,
  },
  {
    name: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee and automatic backups.",
    icon: Shield,
  },
  {
    name: "Analytics & Insights",
    description: "Track sales, customer behavior, and performance with detailed analytics dashboard.",
    icon: BarChart3,
  },
  {
    name: "Mobile Optimized",
    description: "Your store looks perfect on all devices with responsive design and mobile-first approach.",
    icon: Smartphone,
  },
  {
    name: "Custom Domains",
    description: "Use your own domain name to build trust and brand recognition with your customers.",
    icon: Globe,
  },
  {
    name: "Payment Processing",
    description: "Accept payments with Stripe, PayPal, and other major payment providers.",
    icon: CreditCard,
  },
]

export function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools and features you need to build, launch, and grow your online store.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
