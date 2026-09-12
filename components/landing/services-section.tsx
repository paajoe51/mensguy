import { ShoppingBag, Globe, CreditCard, Truck, ArrowUpRight } from "lucide-react"

const services = [
  {
    icon: ShoppingBag,
    title: "Shop In-Stock",
    description: "Browse our warehouse inventory. Quality-inspected items ready for same-day dispatch or pickup.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600",
    accent: "from-emerald-500/10 to-teal-500/5",
    tag: "Available Now",
  },
  {
    icon: Globe,
    title: "Overseas Sourcing",
    description: "Request any product from the USA, UK, China, or Dubai. We handle every step of the import.",
    image: "https://www.merchantnavydecoded.com/wp-content/uploads/2023/09/types-of-ships-3.jpg?auto=format&fit=crop&q=80&w=600",
    accent: "from-blue-500/10 to-indigo-500/5",
    tag: "7–14 Days",
  },
  {
    icon: CreditCard,
    title: "Installment Plans",
    description: "Spread payments over 2–6 months with transparent terms and zero hidden charges.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600",
    accent: "from-violet-500/10 to-purple-500/5",
    tag: "Buy Now, Pay Later",
  },
  {
    icon: Truck,
    title: "Doorstep Delivery",
    description: "Professional logistics to your home or office. Tracked, insured, and on time.",
    image: "https://d23xypyp2dkdqm.cloudfront.net/wp-content/uploads/2022/01/31034059/woman-hand-accepting-delivery-boxes-from-deliveryman-1.jpg?auto=format&fit=crop&q=80&w=600",
    accent: "from-orange-500/10 to-amber-500/5",
    tag: "Express Available",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 lg:py-40 bg-[#F8F8F6]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div className="space-y-5 max-w-lg">
            <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="h-px w-8 bg-primary/30" />
              Our Core Offerings
            </div>
            <h2 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl leading-[0.95]">
              Everything at<br />
              <span className="text-primary italic">One Address.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed font-medium text-sm">
            From bespoke global procurement to flexible payment structures, MENSGUY delivers a fully integrated commerce experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${service.accent} ring-1 ring-black/5 hover:-translate-y-2 transition-all duration-500 cursor-pointer`}
            >
              {/* Service Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                {/* Tag */}
                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                  {service.tag}
                </div>
              </div>
              {/* Content */}
              <div className="p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center text-primary">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight uppercase">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 font-medium">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
