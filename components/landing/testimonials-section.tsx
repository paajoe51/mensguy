import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Kwame Asante",
    role: "Business Owner, Accra",
    content: "I've been ordering electronics through MENSGUY for over 2 years. Their overseas sourcing is exceptional — they found equipment I couldn't get anywhere locally.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Ama Serwaa",
    role: "Home Chef & Entrepreneur",
    content: "The installment plan made it possible to get my dream kitchen appliances without financial stress. The process was seamless and the team were super helpful.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Kofi Mensah",
    role: "Tech Enthusiast",
    content: "Fast delivery, genuine products, excellent customer care. What more could you ask for? MENSGUY is now my go-to for all premium tech purchases.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-40 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="h-px w-8 bg-primary/30" />
              Client Voices
            </div>
            <h2 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl leading-[0.95]">
              Trusted by <br />
              <span className="text-primary italic">1,200+ Customers.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-[#F8F8F6] px-8 py-5 rounded-[2rem] ring-1 ring-border/30 max-w-xs">
            <div className="flex -space-x-3">
              {testimonials.map((t, i) => (
                <img
                  key={i}
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">4.9 / 5 Rating</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group flex flex-col justify-between p-10 rounded-[2.5rem] bg-[#F8F8F6] ring-1 ring-black/5 hover:bg-black hover:text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="space-y-6">
                <Quote className="h-8 w-8 text-primary/30 group-hover:text-primary/50 transition-colors" />
                <p className="text-sm leading-relaxed font-medium text-muted-foreground group-hover:text-white/70 transition-colors">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-10 pt-8 border-t border-black/5 group-hover:border-white/10 transition-colors">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-black/5 group-hover:ring-white/10 transition-colors"
                />
                <div>
                  <p className="text-sm font-black tracking-tight uppercase">{testimonial.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 group-hover:text-white/40 uppercase tracking-widest transition-colors">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
