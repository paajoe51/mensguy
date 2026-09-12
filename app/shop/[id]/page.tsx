"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  CreditCard,
  Loader2,
  Package,
  CheckCircle2
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"

interface Product {
  id: number
  name: string
  description: string
  retail_price: number
  type: string
  category_name: string
  sku: string
  stock_quantity: number
  status: string
  images?: string // JSON array string e.g. '["/uploads/products/foo.jpg"]'
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)
  const [submitting, setSubmitting] = React.useState(false)
  const [orderComplete, setOrderComplete] = React.useState(false)
  const { addItem } = useCart()

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchApi(`/products.php?id=${params.id}`)
        setProduct(res.data)
      } catch (e: any) {
        toast.error(e.message || "Failed to load product")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const handleOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order.")
      router.push(`/login?redirect=/shop/${params.id}`)
      return
    }

    if (!product) return

    setSubmitting(true)
    try {
      // Get customer ID for the user
      const custRes = await fetchApi("/customers.php")
      // Actually my orders.php refined handles session if customer_id not passed, 
      // but let's be explicit if we can. 
      // Actually customers.php GET without ID might return the list or current profile? 
      // Let's assume api/orders.php refined (which I just did) handles it via session.

      const payload = {
        type: product.type === 'Overseas' ? 'Pre-Order' : 'In-Stock',
        total_amount: product.retail_price * quantity,
        items: [
          {
            product_id: product.id,
            quantity: quantity,
            unit_price: product.retail_price
          }
        ]
      }

      const res = await fetchApi("/orders.php", {
        method: "POST",
        body: JSON.stringify(payload)
      })

      toast.success("Order placed successfully!")
      setOrderComplete(true)
      setTimeout(() => router.push("/dashboard/orders"), 3000)
    } catch (e: any) {
      toast.error(e.message || "Failed to place order")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddToBag = () => {
    if (!product) return
    let mainImage = ""
    try {
      const imgs = product.images ? JSON.parse(product.images) : []
      mainImage = imgs[0] || ""
    } catch { }

    addItem({
      id: product.id,
      name: product.name,
      price: product.retail_price,
      quantity: quantity,
      image: mainImage
    })
    toast.success(`${product.name} added to bag!`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10 gap-4">
          <Package className="h-16 w-16 text-muted-foreground opacity-20" />
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button asChild variant="outline">
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-12 border-none shadow-2xl rounded-[2.5rem]">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-8 border border-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Order Locked In!</h2>
            <p className="text-muted-foreground font-medium mb-8">
              Your purchase of <strong>{product.name}</strong> was successful.
              Redirecting to your dashboard...
            </p>
            <Button className="w-full h-14 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl" asChild>
              <Link href="/dashboard/orders">My Orders</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link href="/" className="hover:text-black transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/shop" className="hover:text-black transition-colors">Shop</Link></li>
              <li>/</li>
              <li className="text-black">{product.name}</li>
            </ol>
          </nav>

          {/* Product Section */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-[2rem] bg-muted/20 overflow-hidden ring-1 ring-border/50 flex items-center justify-center relative">
                {(() => {
                  try {
                    const imgs = product.images ? JSON.parse(product.images) : []
                    const src = imgs[0]
                    if (src) {
                      return (
                        <img
                          src={src}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )
                    }
                  } catch { }
                  return (
                    <div className="text-center">
                      <span className="text-[120px] font-black italic opacity-5 text-black">{product.category_name?.[0]}</span>
                      <Package className="h-24 w-24 text-muted-foreground/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <StatusBadge variant={product.stock_quantity === 0 ? "cancelled" : product.type === "Overseas" ? "overseas" : "in-stock"} />
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5">{product.category_name}</Badge>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic leading-[0.9]">
                  {product.name}
                </h1>
                <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-50">Ref ID: {product.sku || `PRD-${product.id}`}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-6xl font-black tracking-tighter">GH¢{Number(product.retail_price).toLocaleString()}</span>
              </div>

              <p className="text-muted-foreground font-medium leading-relaxed max-w-lg">{product.description}</p>

              {/* Quantity and Actions */}
              <div className="space-y-6 pt-8 border-t border-border/50">
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Quantity</span>
                  <div className="flex items-center bg-muted/20 rounded-2xl p-1 shrink-0 ring-1 ring-border/50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-white text-muted-foreground hover:text-black transition-all"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-white text-muted-foreground hover:text-black transition-all"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      className="h-16 rounded-3xl bg-black text-white hover:bg-primary transition-all font-black text-xs uppercase tracking-[0.3em] flex-1 shadow-2xl shadow-black/10"
                      onClick={handleAddToBag}
                      disabled={product.stock_quantity === 0}
                    >
                      <ShoppingCart className="mr-3 h-5 w-5" />
                      Add to Bag
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-16 rounded-3xl border-none ring-1 ring-border/50 font-black text-xs uppercase tracking-[0.3em] flex-1 transition-all"
                      onClick={handleOrder}
                      disabled={submitting || product.stock_quantity === 0}
                    >
                      {submitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        product.type === 'Overseas' ? 'Pre-Order Now' : 'Buy Now'
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button size="lg" variant="outline" className="h-14 rounded-2xl border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest transition-all" asChild>
                      <Link href={`/request?item=${encodeURIComponent(product.name)}&type=installment`}>
                        <CreditCard className="mr-2 h-4 w-4 text-primary" />
                        Apply for Installments
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 rounded-2xl border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest transition-all">
                      <Heart className="mr-2 h-4 w-4" />
                      Save for later
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
                {[
                  { icon: Truck, text: "Rapid Logistics" },
                  { icon: Shield, text: "Import Guarantee" },
                  { icon: RotateCcw, text: "Asset Integrity" }
                ].map((badge, idx) => (
                  <div key={idx} className="text-center space-y-2 p-4 rounded-3xl bg-muted/10">
                    <badge.icon className="h-6 w-6 mx-auto text-primary opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{badge.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-20">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-none bg-transparent h-auto p-0 gap-8">
                {['Overview', 'Intelligence', 'Logistics'].map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase()}
                    className="rounded-none border-b-2 border-transparent p-0 pb-4 text-xs font-black uppercase tracking-widest data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-black transition-all opacity-40 data-[state=active]:opacity-100"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Separator className="bg-border/50" />
              <TabsContent value="overview" className="pt-10">
                <div className="prose prose-sm max-w-3xl">
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="intelligence" className="pt-10">
                <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
                  {[
                    ['SKU Protocol', product.sku || 'N/A'],
                    ['Market Segment', product.category_name],
                    ['Sourcing Channel', product.type],
                    ['Authentication', 'Verified Original']
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between py-4 border-b border-border/50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
                      <span className="text-xs font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="logistics" className="pt-10">
                <div className="prose prose-sm max-w-xl space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tighter mb-2">Transit Protocols</h4>
                    <p className="text-muted-foreground font-medium">Standard delivery processed within 24-48 hours. Overseas imports estimated between 7 to 14 business days via air freight.</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tighter mb-2">Asset Protection</h4>
                    <p className="text-muted-foreground font-medium">All items are insured during transit. We offer a 7-day integrity window for verification and returns if defaults are identified.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
