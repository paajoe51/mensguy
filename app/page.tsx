import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { ServicesSection } from "@/components/landing/services-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FAQSection } from "@/components/landing/faq-section"
import { ContactSection } from "@/components/landing/contact-section"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <HowItWorksSection />
        <FeaturedProducts />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
