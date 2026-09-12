"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the overseas item request work?",
    answer:
      "Simply fill out our request form with details about the item you want, including a product link if available. We'll source the item, provide you with a quote covering product cost, shipping, and any applicable fees, and once you approve, we'll place the order and handle everything until it's delivered to you.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept mobile money (MTN, Vodafone, AirtelTigo), bank transfers, and cash payments. For installment plans, payments are typically made via mobile money for easier tracking and reminders.",
  },
  {
    question: "How do installment payments work?",
    answer:
      "You can request an installment plan for purchases above a certain amount. We'll set up a payment schedule based on your preferences. Items are held until full payment is made, though exceptions can be arranged. Note that defaulting on payments may result in a 30% deduction after the grace period.",
  },
  {
    question: "How long does overseas shipping take?",
    answer:
      "Shipping times vary depending on the source country and shipping method. Typically, items from the US/UK take 2-4 weeks, while items from China may take 3-6 weeks. We'll provide estimated delivery times when you receive your quote.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes! Once your order is placed, you can track its status through your customer dashboard. We provide updates at every stage - from procurement to shipping to delivery.",
  },
  {
    question: "What is your return policy?",
    answer:
      "For in-stock items, we offer returns within 7 days of purchase if the item is unused and in original packaging. Overseas orders are non-refundable once shipped, but we'll work with you to resolve any issues with defective or damaged items.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Find answers to common questions about our services.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-bold hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="lg:col-span-2 relative hidden lg:block">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                <img 
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600" 
                    alt="Customer Support" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Still have questions?</p>
                    <p className="text-lg font-serif font-bold italic">We're here to help you every step of the way.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
