import Link from "next/link"
import { Package, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Electronics", href: "/shop?category=electronics" },
    { name: "Home & Kitchen", href: "/shop?category=home" },
    { name: "Fashion", href: "/shop?category=fashion" },
    { name: "New Arrivals", href: "/shop?sort=newest" },
  ],
  services: [
    { name: "Our Services", href: "/services" },
    { name: "Request Item", href: "/request" },
    { name: "Installment Plans", href: "/services#installments" },
    { name: "Overseas Ordering", href: "/services#overseas" },
    { name: "Delivery Info", href: "/services#delivery" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/services#how-it-works" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/#contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Return Policy", href: "/returns" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold">MENSGUY</span>
            </Link>
            <p className="mt-4 text-sm text-background/70 leading-relaxed max-w-sm">
              Your trusted partner for quality imports. We bring the world to your doorstep with reliable service and flexible payment options.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4" />
                <span>info@mensguyimport.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4" />
                <span>+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4" />
                <span>Accra, Ghana</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/10 pt-8">
          <p className="text-center text-sm text-background/50">
            &copy; {new Date().getFullYear()} MENSGUY IMPORT LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
