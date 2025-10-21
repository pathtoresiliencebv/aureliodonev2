export interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  limits: {
    products: number | 'unlimited'
    orders: number | 'unlimited'
    storage: number | 'unlimited' // in MB
  }
  popular?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    period: 'month',
    description: 'Perfect for small businesses getting started',
    features: [
      '1 custom domain',
      'Basic branding',
      'Up to 100 products',
      'Up to 200 orders/month',
      'Email support',
      'Standard templates'
    ],
    limits: {
      products: 100,
      orders: 200,
      storage: 1000 // 1GB
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: 'month',
    description: 'For growing businesses that need more power',
    features: [
      'Custom branding',
      'Payment integrations (Stripe, Mollie)',
      'Up to 1,000 products',
      'Up to 2,000 orders/month',
      'Priority support',
      'Advanced analytics',
      'Custom CSS'
    ],
    limits: {
      products: 1000,
      orders: 2000,
      storage: 5000 // 5GB
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    period: 'month',
    description: 'For large businesses with advanced needs',
    features: [
      'Unlimited products',
      'Unlimited orders',
      'API access',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated account manager'
    ],
    limits: {
      products: 'unlimited',
      orders: 'unlimited',
      storage: 'unlimited'
    }
  }
]

export function getPlanById(id: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.id === id)
}
