import { Star } from "lucide-react"

const testimonials = [
  {
    body: "This platform saved us months of development time. We launched our store in just 2 days and sales have been incredible.",
    author: {
      name: "Sarah Johnson",
      handle: "sarahj",
      company: "Boutique Fashion Co.",
    },
  },
  {
    body: "The customization options are amazing. We were able to create a store that perfectly matches our brand identity.",
    author: {
      name: "Mike Chen",
      handle: "mikechen",
      company: "Tech Gadgets Inc.",
    },
  },
  {
    body: "Customer support is outstanding. They helped us set up payment processing and answered all our questions quickly.",
    author: {
      name: "Emily Rodriguez",
      handle: "emilyr",
      company: "Artisan Crafts",
    },
  },
]

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by thousands of merchants
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See what our customers are saying about their experience with our platform.
          </p>
        </div>
        
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div key={testimonialIdx} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                  <div className="flex gap-x-1 text-indigo-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 flex-none" fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-2 text-gray-900">
                    <p>"{testimonial.body}"</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-900">
                        {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                      <div className="text-gray-600">@{testimonial.author.handle}</div>
                      <div className="text-gray-500">{testimonial.author.company}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
