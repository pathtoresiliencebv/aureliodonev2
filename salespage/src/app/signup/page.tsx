import { SignupForm } from "@/components/signup-form"
import { getPlanById } from "@/lib/plans"

interface SignupPageProps {
  searchParams: {
    plan?: string
  }
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const selectedPlan = searchParams.plan || "starter"
  const plan = getPlanById(selectedPlan)

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create Your Store
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {plan?.description}
          </p>
        </div>
        
        <SignupForm selectedPlan={selectedPlan} />
      </div>
    </main>
  )
}
