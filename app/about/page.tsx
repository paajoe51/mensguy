import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { AboutSection } from "@/components/landing/about-section"
import { CheckCircle2, Target, Eye, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <div className="bg-secondary/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl">
              About MENSGUY IMPORT LTD
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering customers with global access to quality products and local excellence since 2018.
            </p>
          </div>
        </div>

        {/* Existing About Section as part of the page */}
        <AboutSection />

        {/* Vision & Mission */}
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6 p-8 rounded-2xl bg-secondary/20">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-serif font-bold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide seamless access to high-quality international products and 
                  local essentials, bridging the gap between global markets and local 
                  consumers through reliable logistics, transparent pricing, and 
                  flexible payment solutions.
                </p>
              </div>
              <div className="space-y-6 p-8 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-serif font-bold">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the most trusted import and retail partner in the region, 
                  known for our commitment to quality, customer satisfaction, and 
                  innovative commerce solutions that make global shopping accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 lg:py-32 bg-card">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl font-bold tracking-tight">Our Core Values</h2>
              <p className="mt-4 text-muted-foreground">The principles that guide everything we do.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { title: "Integrity", desc: "We are honest, transparent and ethical in all our business dealings." },
                { title: "Quality", desc: "We only source and sell products that meet our high standards of excellence." },
                { title: "Customer Focus", desc: "Our customers are at the heart of everything we do." },
                { title: "Reliability", desc: "We deliver on our promises, from procurement to final doorstep delivery." },
                { title: "Innovation", desc: "We continuously improve our processes to serve you better." },
                { title: "Community", desc: "We believe in building lasting relationships with our customers and partners." }
              ].map((value, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl font-serif font-bold">Ready to start shopping?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              Explore our wide range of in-stock products or request a custom item from anywhere in the world.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/shop" className="inline-flex items-center justify-center rounded-md bg-background px-8 py-3 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Browse Shop
              </a>
              <a href="/request" className="inline-flex items-center justify-center rounded-md border border-primary-foreground px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-primary-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Request Item
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
