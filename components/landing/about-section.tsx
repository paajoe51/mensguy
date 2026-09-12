import { CheckCircle2, TrendingUp, Users, Package } from "lucide-react"

const highlights = [
  "Wide range of electronics, home items, fashion, and more",
  "Direct imports from trusted international suppliers",
  "Flexible installment payment options available",
  "Professional customer support every step of the way",
  "Secure transactions and quality guarantees",
  "Fast local delivery or convenient pickup options",
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-40 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          {/* Visual Side */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] shadow-2xl ring-1 ring-black/5 group">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1200"
                alt="Our Logistics"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-10 left-10 text-white space-y-2">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">Est. 2018</p>
                <h3 className="text-3xl font-serif font-bold italic">Driven by Quality.</h3>
              </div>
            </div>

            {/* Overlapping Card 1: Happy Customers */}
            <div className="absolute -top-10 -right-10 hidden sm:flex flex-col items-center gap-2 p-6 rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5 animate-in fade-in zoom-in duration-700">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black tracking-tighter">1,200+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Active Clients</p>
              </div>
            </div>

            {/* Overlapping Card 2: Units Delivered */}
            <div className="absolute -bottom-10 -left-10 hidden sm:flex items-center gap-4 p-6 rounded-[2.5rem] bg-black text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tighter">5,000+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Items Fulfilled</p>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em]">
                <TrendingUp className="h-4 w-4" />
                The MENSGUY Standard
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl leading-[0.95]">
                Your Gateway to <br />
                <span className="text-primary italic">Global Excellence.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                MENSGUY IMPORT LTD isn&apos;t just a shop—it&apos;s a bridges between you
                and the world&apos;s finest goods. We specialize in sourcing luxury
                electronics, robust home appliances, and high-street fashion brands
                directly from their origins.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-black text-xs uppercase tracking-widest text-black">Local Speed</h4>
                  <p className="text-xs text-muted-foreground font-medium">Full inventory available in our Accra warehouse for instant dispatch.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-xs uppercase tracking-widest text-black">Global Depth</h4>
                  <p className="text-xs text-muted-foreground font-medium">Bespoke sourcing for any item from USA, UK, or China upon request.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">Core Competitive Advantages</p>
              <ul className="grid gap-4 sm:grid-cols-1">
                {highlights.map((item, index) => (
                  <li key={index} className="flex items-center gap-4 group">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground/80 group-hover:text-black transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
