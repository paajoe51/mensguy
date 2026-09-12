"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ChevronRight, 
  ArrowLeft,
  Package
} from "lucide-react"
import { useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalCount } = useCart()
  const router = useRouter()

  if (totalCount === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10 gap-6">
          <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-20" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Your bag is empty</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Looks like you haven't added anything to your bag yet. Start shopping to find the best items!
            </p>
          </div>
          <Button asChild className="rounded-2xl px-8 h-12 font-bold uppercase tracking-widest text-xs">
            <Link href="/shop">Start Sourcing</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Your Shopping Bag</h1>
            <Badge variant="outline" className="ml-2 font-black">{totalCount} Items</Badge>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="rounded-[2rem] border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-6">
                      <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-muted/20 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-2xl" />
                        ) : (
                          <Package className="h-10 w-10 text-muted-foreground/20" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-black tracking-tight leading-tight uppercase italic">{item.name}</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Ref ID: PRD-{item.id}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center bg-muted/20 rounded-xl p-1 shadow-inner ring-1 ring-border/50">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-white transition-all scale-90"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-white transition-all scale-90"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-black text-lg">GH¢ {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="ghost" asChild className="group mt-4">
                <Link href="/shop" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Continue Sourcing
                </Link>
              </Button>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card className="rounded-[2.5rem] border-none shadow-xl ring-1 ring-border/50 bg-card overflow-hidden">
                <div className="bg-primary/5 p-6 border-b border-border/50">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Order Summary</h3>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Subtotal</span>
                      <span className="font-bold uppercase tabular-nums">GH¢ {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Logistics Est.</span>
                      <span className="font-bold text-emerald-600 uppercase tracking-tighter">Calculated at Checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-lg font-black uppercase tracking-tighter italic">Total Est.</span>
                      <div className="text-right">
                        <p className="text-3xl font-black tabular-nums">GH¢ {subtotal.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">VAT Included where applicable</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-14 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl group" asChild>
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed text-center">
                      Payments secured via 128-bit encryption protocol. 
                      Terms of service apply to all transactions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: "outline" | "default", className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${variant === "outline" ? "border border-border text-foreground" : "bg-primary text-primary-foreground"} ${className}`}>
      {children}
    </span>
  )
}
