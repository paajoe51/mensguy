"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowRight, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/lib/cart"
import { toast } from "sonner"

const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium sound quality with active noise cancellation and 40-hour battery life.",
    price: 650.00,
    originalPrice: 850.00,
    status: "in-stock" as const,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "2",
    name: "Smart Air Fryer 5.5L",
    description: "Digital touchscreen with 8 preset cooking modes and rapid air technology.",
    price: 1200.00,
    status: "in-stock" as const,
    category: "Home & Kitchen",
    image: "https://gh.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/68/7027003/1.jpg?2231?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "3",
    name: "Designer Leather Watch",
    description: "Genuine leather strap with Japanese quartz movement and waterproof design.",
    price: 450.00,
    status: "overseas" as const,
    category: "Fashion",
    image: "https://m.media-amazon.com/images/I/61LaictMkgL._AC_SL1500_.jpg?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "4",
    name: "Robot Vacuum Cleaner",
    description: "Smart mapping with app control, auto-charging, and HEPA filtration system.",
    price: 2400.00,
    originalPrice: 3000.00,
    status: "in-stock" as const,
    category: "Electronics",
    image: "https://cdn.ishtari.com.gh/files/media/cache/product/10000/9000/9211/product_images/74892/650800018A_1000x1000_3-800x1091.jpg?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "5",
    name: "Stainless Steel Cookware Set",
    description: "12-piece professional grade tri-ply encapsulated bottom cooking set.",
    price: 1800.00,
    status: "overseas" as const,
    category: "Home & Kitchen",
    image: "https://gh.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/86/9826003/1.jpg?2974?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "6",
    name: "Portable Power Station",
    description: "1000W output with solar charging capability and multiple output ports.",
    price: 4500.00,
    status: "in-stock" as const,
    category: "Electronics",
    image: "https://deus.com.gh/media/catalog/product/cache/3cd6cf52e8c52aa8d0553ab15aad220c/3/5/3557_powerbox_b_.jpg?auto=format&fit=crop&q=80&w=600"
  },
]

export function FeaturedProducts() {
  const { addItem } = useCart()

  const handleAddToBag = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    })
    toast.success(`${product.name} added to bag!`)
  }

  return (
    <section className="py-24 lg:py-40 bg-[#FDFDFD]">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="h-px w-8 bg-primary/30" />
              Curated Selection
            </div>
            <h2 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl leading-[0.95]">
              Our Premium <br />
              <span className="text-primary italic">Best Sellers.</span>
            </h2>
          </div>
          <Button variant="ghost" className="h-14 px-8 rounded-2xl group font-black text-xs uppercase tracking-widest border border-border/40 hover:bg-black hover:text-white transition-all shadow-sm" asChild>
            <Link href="/shop">
              Browse Marketplace
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="group border-none bg-transparent shadow-none overflow-hidden hover:translate-y-[-8px] transition-all duration-500">
              <CardContent className="p-0 space-y-6">
                {/* Product Image Wrapper */}
                <div className="relative aspect-[4/5] bg-white overflow-hidden rounded-[2.5rem] shadow-sm ring-1 ring-border/20 group-hover:shadow-2xl group-hover:ring-primary/20 transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Floating Interaction */}
                  <div className="absolute top-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <button className="h-12 w-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl text-black hover:bg-primary hover:text-white transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <StatusBadge variant={product.status} className="h-7 text-[8px] sm:text-[9px]" />
                    {product.originalPrice && (
                      <span className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-[9px] font-black uppercase tracking-tighter text-white shadow-lg">
                        -25%
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="px-4 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{product.category}</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-70">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      {product.originalPrice && (
                        <span className="text-[10px] text-muted-foreground line-through font-bold opacity-40">
                          GH¢ {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-lg font-black tracking-tighter">
                        GH¢ {product.price.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className={cn(
                        "h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl",
                        product.status === "in-stock" ? "bg-black hover:bg-primary" : "bg-white text-black ring-1 ring-border/50 hover:bg-secondary"
                      )}
                      onClick={() => product.status === "in-stock" ? handleAddToBag(product) : null}
                    >
                      {product.status === "in-stock" ? (
                        <>
                          <ShoppingCart className="mr-2 h-3 w-3" />
                          Add to Bag
                        </>
                      ) : (
                        "Request Quote"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
