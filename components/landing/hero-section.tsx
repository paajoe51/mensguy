import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Shield, Truck } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary animate-in fade-in slide-in-from-left-4 duration-1000">
                <Globe className="h-3 w-3" />
                Live Global Procurement
              </div>
              <h1 className="font-serif text-5xl font-bold tracking-tighter sm:text-6xl lg:text-7xl text-balance leading-[0.9]">
                Premium Goods.<br />
                <span className="text-primary italic">No Boundaries.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty font-medium border-l-2 border-primary/20 pl-6">
                Direct imports from global hubs. Shop our local inventory or request
                bespoke procurement with flexible installment plans tailored for you.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary transition-all group" asChild>
                <Link href="/shop">
                  Explore Inventory
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-none ring-1 ring-border/50 font-black text-xs uppercase tracking-widest" asChild>
                <Link href="/request">Sourcing Portal</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Global Reach</p>
                  <p className="text-[9px] text-muted-foreground font-bold">USA · UK · CHINA</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Safe Capital</p>
                  <p className="text-[9px] text-muted-foreground font-bold">BUY NOW PAY LATER</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Express Flow</p>
                  <p className="text-[9px] text-muted-foreground font-bold">DOORSTEP DELIVERY</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual - Premium Montage */}
          <div className="relative group lg:ml-auto">
            <div className="relative w-full max-w-[540px] aspect-square rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-border/5">
              {/* Main Visual - Electronics/Luxury */}
              <img
                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1200"
                alt="Premium Electronics"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Decorative Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating Cards */}
              <div className="absolute top-8 left-8 p-4 rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl ring-1 ring-black/5 animate-bounce-slow max-w-[180px]">
                <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                  <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=300" alt="Watch" className="w-full h-full object-cover" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-0.5">Overseas Request</p>
                <p className="text-[10px] font-bold truncate">Premium Chronograph</p>
              </div>

              <div className="absolute bottom-8 right-8 p-4 rounded-3xl bg-black text-white shadow-2xl animate-pulse-slow max-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Inventory</span>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden mb-3">
                  <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=300" alt="Air Fryer" className="w-full h-full object-cover opacity-80" />
                </div>
                <p className="text-[10px] font-black italic">Smart Air Fryer</p>
              </div>
            </div>

            {/* Background floating circles */}
            <div className="absolute -z-10 -top-12 -right-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -z-10 -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

