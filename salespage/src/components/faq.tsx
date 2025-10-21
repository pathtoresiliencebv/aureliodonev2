import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "How quickly can I launch my store?",
    answer: "You can have your store up and running in under 30 minutes. Our setup wizard guides you through the entire process, from choosing your domain to adding your first products."
  },
  {
    id: 2,
    question: "Can I use my own domain name?",
    answer: "Yes! All plans include the ability to use your own custom domain. You can connect your domain through our simple DNS configuration process."
  },
  {
    id: 3,
    question: "What payment methods do you support?",
    answer: "We support all major payment providers including Stripe, PayPal, Square, and more. You can accept credit cards, digital wallets, and other payment methods."
  },
  {
    id: 4,
    question: "Is there a limit on products or orders?",
    answer: "Our plans have different limits based on your needs. The Starter plan includes 100 products and 200 orders per month, while higher plans offer more capacity."
  },
  {
    id: 5,
    question: "Can I customize the design?",
    answer: "Absolutely! You can upload your logo, choose custom colors, fonts, and even add custom CSS for advanced styling. Your store will look exactly how you want it."
  },
  {
    id: 6,
    question: "What happens if I exceed my plan limits?",
    answer: "We'll notify you when you're approaching your limits. You can upgrade your plan at any time, or we can work with you to find a solution that fits your needs."
  }
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Have a different question? <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Contact us</a>
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <dl className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-200 pb-8">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between text-left"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <span className="mr-6">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 flex-shrink-0 transition-transform ${
                        openItems.includes(faq.id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                </dt>
                {openItems.includes(faq.id) && (
                  <dd className="mt-4 pr-12">
                    <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
