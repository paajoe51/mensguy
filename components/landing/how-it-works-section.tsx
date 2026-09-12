import { Search, FileText, CreditCard, Package, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse or Request",
    description: "Explore our in-stock products or submit a custom request for any item from overseas markets.",
    color: "bg-indigo-50 text-indigo-600",
    bar: "bg-indigo-500",
  },
  {
    icon: FileText,
    step: "02",
    title: "Get a Quote",
    description: "We'll provide a detailed quote including product cost, shipping, duties, and timeline.",
    color: "bg-violet-50 text-violet-600",
    bar: "bg-violet-500",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Secure Payment",
    description: "Pay in full or spread over 2–6 months via Mobile Money, bank transfer, or cash.",
    color: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
  },
  {
    icon: Package,
    step: "04",
    title: "Receive Your Order",
    description: "Doorstep delivery or convenient pickup from our Accra warehouse. Fully tracked.",
    color: "bg-orange-50 text-orange-600",
    bar: "bg-orange-500",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-40 bg-black text-white overflow-hidden relative">
      {/* Background image decor */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1600" 
            alt="Logistics background" 
            className="w-full h-full object-cover opacity-10 grayscale"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Background glow decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-30 pointer-events-none z-10" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center space-y-6 mb-24">
          <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <div className="h-px w-8 bg-primary/40" />
            The Process
            <div className="h-px w-8 bg-primary/40" />
          </div>
          <h2 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl leading-[0.95]">
            Four Steps.<br />
            <span className="text-primary italic">Zero Complexity.</span>
          </h2>
          <p className="mx-auto max-w-xl text-white/50 font-medium text-sm leading-relaxed">
            Getting your products has never been more seamless. A structured flow from discovery to delivery.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line for desktop */}
          <div className="absolute top-14 left-[12.5%] right-[12.5%] hidden lg:block">
            <div className="h-px bg-gradient-to-r from-indigo-500 via-violet-500 via-emerald-500 to-orange-500 opacity-30" />
          </div>

          {steps.map((item, index) => (
            <div key={index} className="group relative flex flex-col">
              {/* Step Bubble */}
              <div className="relative mb-8 mx-auto">
                <div className={`h-28 w-28 rounded-[2rem] ${item.color} flex flex-col items-center justify-center shadow-xl ring-1 ring-white/10 transition-transform group-hover:scale-110 duration-300`}>
                  <item.icon className="h-7 w-7 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">{item.step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-[calc(50%+1rem)] top-1/2 -translate-y-1/2 items-center">
                    <ArrowRight className="h-4 w-4 text-white/20" />
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="text-center space-y-3 flex-1">
                <h3 className="text-base font-black tracking-tight uppercase">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{item.description}</p>
              </div>
              {/* Progress bar */}
              <div className="mt-8 h-1 w-full rounded-full bg-white/5">
                <div className={`h-1 rounded-full ${item.bar} opacity-50`} style={{ width: `${(index + 1) * 25}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
