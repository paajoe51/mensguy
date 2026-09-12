import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Globe, CreditCard, Truck, Search, ShieldCheck, HeadphonesIcon, BarChart3 } from "lucide-react"

const detailedServices = [
    {
        icon: ShoppingBag,
        title: "Local Warehouse Sales",
        description: "Browse our extensive inventory of products already in our local warehouse. Electronics, home appliances, fashion, and more—ready for immediate pickup or same-day delivery.",
        features: ["Instant Availability", "Quality Inspected", "Local Warranty", "Same-day Delivery"]
    },
    {
        icon: Globe,
        title: "Overseas Sourcing & Procurement",
        description: "Can't find it locally? We source products from major global markets including the USA, UK, China, and Dubai. We handle the entire procurement process for you.",
        features: ["Global Reach", "Logistics Management", "Customs Clearance", "Verified Suppliers"]
    },
    {
        icon: CreditCard,
        title: "Flexible Installment Plans",
        description: "Our unique installment payment option allows you to spread the cost of your purchases over 2 to 6 months. Making high-quality items affordable for everyone.",
        features: ["2-6 Month Payment Plans", "Transparent Terms", "Easy Application", "No Collateral Required"]
    },
    {
        icon: Truck,
        title: "Doorstep Delivery & Logistics",
        description: "We provide reliable delivery services to your home or office. Our logistics team ensures your items arrive safely and on time, whether they're local or international.",
        features: ["Tracked Shipments", "Professional Handling", "Multiple Delivery Zones", "Convenient Pickup Points"]
    },
    {
        icon: Search,
        title: "Custom Product Requests",
        description: "Looking for something specific? Submit a custom request with product details or links, and our sourcing team will provide you with a comprehensive quote within 48 hours.",
        features: ["Detailed Quotes", "Product Comparisons", "Expert Advice", "Price Optimization"]
    },
    {
        icon: HeadphonesIcon,
        title: "Import Assistance & Advisory",
        description: "Get expert advice on importing products for business or personal use. We help you navigate regulations, shipping options, and cost-saving strategies.",
        features: ["Expert Guidance", "Regulatory Compliance", "Cost Estimation", "Risk Assessment"]
    }
]

export default function ServicesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-20">
                {/* Page Header */}
                <div className="bg-secondary/30 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
                        <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl">
                            Our Services
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            From global procurement to local fulfillment, we offer a comprehensive range of services tailored to your needs.
                        </p>
                    </div>
                </div>

                {/* Services Grid */}
                <section className="py-20 lg:py-32">
                    <div className="mx-auto max-w-7xl px-4 lg:px-8">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {detailedServices.map((service, idx) => (
                                <Card key={idx} className="flex flex-col h-full border-2 hover:border-primary/50 transition-all duration-300">
                                    <CardContent className="p-8 flex-1 flex flex-col">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                                            <service.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                        <div className="mt-auto pt-4 border-t">
                                            <ul className="grid grid-cols-1 gap-2">
                                                {service.features.map((feature, fIdx) => (
                                                    <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <ShieldCheck className="h-3 w-3 text-success" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-20 lg:py-32 bg-secondary/10">
                    <div className="mx-auto max-w-7xl px-4 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="font-serif text-3xl font-bold tracking-tight">How We Work</h2>
                            <p className="mt-4 text-muted-foreground">A simple 4-step process to get your international products.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-4 relative">
                            {[
                                { step: "01", title: "Inquiry & Request", desc: "Browse our shop or submit a custom request for any product you want from overseas." },
                                { step: "02", title: "Quotation & Approval", desc: "We provide a detailed quote including all costs. You approve and choose a payment plan." },
                                { step: "03", title: "Procurement & Shipping", desc: "Our global team purchases, inspects, and ships your item through our secure logistics network." },
                                { step: "04", title: "Local Fulfillment", desc: "Your item arrives in our warehouse and is delivered to your doorstep or made ready for pickup." }
                            ].map((item, idx) => (
                                <div key={idx} className="relative z-10 space-y-4 text-center">
                                    <div className="text-5xl font-serif font-black text-primary/10 absolute -top-4 left-1/2 -translate-x-1/2 -z-10">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-bold pt-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                            {/* Connector lines (desktop only) */}
                            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-primary/10 -z-0" />
                        </div>
                    </div>
                </section>

                {/* FAQ CTA */}
                <section className="py-20 bg-card">
                    <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center border p-12 rounded-3xl">
                        <h2 className="text-2xl font-serif font-bold mb-4">Have questions about our services?</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                            We're here to help you understand every part of the import and installment process.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="/#faq" className="inline-flex items-center justify-center rounded-md bg-secondary px-8 py-3 text-sm font-medium transition-colors hover:bg-secondary/80">
                                View FAQs
                            </a>
                            <a href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
