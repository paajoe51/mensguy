import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 lg:py-40 bg-[#F8F8F6] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative rounded-[3.5rem] bg-black text-white overflow-hidden min-h-[480px] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1600"
              alt="Shopping marketplace"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />

          {/* Floating visual badge */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center h-64 w-64 rounded-[3rem] bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-2xl">
            <Globe className="h-16 w-16 text-primary/60 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 text-center px-6">
              Sourcing from<br />4 Global Hubs
            </p>
          </div>

          {/* Content */}
          <div className="relative z-10 px-12 lg:px-20 py-20 max-w-2xl space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Limited Stock Available
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl leading-[0.95]">
                Start Your Order.<br />
                <span className="text-primary italic">Today.</span>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed font-medium max-w-md">
                Join 1,200+ satisfied customers who trust MENSGUY IMPORT for quality products, reliable delivery, and flexible payments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                size="lg"
                className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary/90 transition-all group"
                asChild
              >
                <Link href="/shop">
                  Explore the Marketplace
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-14 px-10 rounded-2xl text-white/70 hover:text-white hover:bg-white/10 font-black text-xs uppercase tracking-widest border border-white/10"
                asChild
              >
                <Link href="/request">Request an Item</Link>
              </Button>
            </div>

            {/* Mini trust badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              {["Verified Suppliers", "Secure Payments", "Free Returns"].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
