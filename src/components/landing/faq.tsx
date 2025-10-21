import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function FAQ() {
const faqs = [
  {
      question: "What is Aurelio and how does it work?",
      answer: "Aurelio is a comprehensive e-commerce platform that helps you create, manage, and scale your online store. It provides everything from store setup and product management to analytics and customer support tools. You can start with our free trial and scale as your business grows."
    },
    {
      question: "How much does Aurelio cost?",
      answer: "We offer flexible pricing plans starting from $29/month for the Starter plan, $99/month for Professional, and $299/month for Enterprise. All plans include our core features with no hidden fees. We also offer a 14-day free trial so you can try before you buy."
    },
    {
      question: "Can I migrate my existing store to Aurelio?",
      answer: "Yes! We provide free migration services for all new customers. Our team will help you transfer your products, customers, orders, and other data from your current platform to Aurelio. The migration process is typically completed within 1-2 business days."
    },
    {
      question: "Does Aurelio support multiple stores?",
      answer: "Absolutely! Aurelio is designed for multi-store management. You can create and manage unlimited stores from a single dashboard, each with its own branding, products, and settings. This is perfect for businesses with multiple brands or different market segments."
    },
    {
      question: "What payment methods does Aurelio support?",
      answer: "Aurelio supports all major payment methods including credit cards, PayPal, Apple Pay, Google Pay, and many local payment methods. We also support cryptocurrency payments and can integrate with any payment processor you prefer."
    },
    {
      question: "Is Aurelio secure and compliant?",
      answer: "Yes, security is our top priority. Aurelio is SOC 2 certified, GDPR compliant, and uses bank-level encryption. We also provide SSL certificates, secure payment processing, and regular security audits to keep your data safe."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! We provide 24/7 customer support through live chat, email, and phone. Our support team is available to help you with any questions or issues. We also offer comprehensive documentation, video tutorials, and a community forum."
    },
    {
      question: "Can I customize my store's appearance?",
      answer: "Absolutely! Aurelio offers extensive customization options including custom themes, branding, colors, fonts, and layouts. You can also use our drag-and-drop page builder to create unique pages and sections for your store."
    },
    {
      question: "Does Aurelio integrate with other tools?",
      answer: "Yes, Aurelio integrates with hundreds of popular tools and services including email marketing platforms, accounting software, shipping providers, analytics tools, and more. We also provide a robust API for custom integrations."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data is always yours. If you decide to cancel your subscription, you can export all your data including products, customers, orders, and analytics. We'll help you migrate to another platform if needed, and we'll keep your data secure for 30 days after cancellation."
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            ❓ Frequently Asked Questions
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Got Questions? We Have Answers</h2>
          <p className="text-xl text-muted-foreground">
            Find answers to the most common questions about Aurelio. Can't find what you're looking for?
            <a href="#contact" className="text-blue-600 hover:underline ml-1">Contact our support team</a>.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@aurelio.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}