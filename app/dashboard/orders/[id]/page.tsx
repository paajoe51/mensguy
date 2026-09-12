"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Timeline } from "@/components/ui/timeline"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Download, MessageSquare, Loader2, Package } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchApi(`/orders.php?id=${id}`)
        setOrder(res.data)
      } catch (e: any) {
        toast.error(e.message || "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!order) return <div className="text-center py-24 font-bold uppercase tracking-widest text-muted-foreground">Order not found</div>

  const timelineSteps: any[] = [
    {
      title: "Order Placed",
      description: "Your order has been confirmed and locked in.",
      timestamp: new Date(order.created_at).toLocaleString(),
      status: "completed" as const,
    },
    {
      title: "Processing",
      description: "Our logistics team is verifying and preparing your items.",
      status: (order.status === 'Processing' || order.status === 'In-Transit' || order.status === 'Delivered') ? "completed" : order.status === 'Pending' ? "current" : "upcoming",
    },
    {
      title: "In Transit",
      description: "Your order is on the way to your delivery coordinates.",
      status: (order.status === 'In-Transit' || order.status === 'Delivered') ? "completed" : order.status === 'Processing' ? "current" : "upcoming",
    },
    {
      title: "Delivered",
      description: "Package handed over and finalized.",
      status: order.status === 'Delivered' ? "completed" : order.status === 'In-Transit' ? "current" : "upcoming",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 shrink-0">
          <Link href="/dashboard/orders">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <PageHeader
          title={`Order ${order.order_number}`}
          description={`Logged on ${new Date(order.created_at).toLocaleDateString()}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Logistics Timeline</CardTitle>
                <StatusBadge variant={order.status.toLowerCase() as any} />
              </div>
            </CardHeader>
            <CardContent>
              <Timeline steps={timelineSteps} />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
            <CardHeader className="bg-muted/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Purchased Assets</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-6 group">
                    <div className="h-20 w-20 rounded-3xl bg-muted/20 shrink-0 flex items-center justify-center ring-1 ring-border/20 transition-all group-hover:ring-primary/20">
                      <span className="text-3xl font-black italic opacity-5">{item.name[0]}</span>
                      <Package className="h-8 w-8 text-black/5 absolute" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs uppercase tracking-tight truncate">{item.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
                        Quantity: {item.quantity} units
                      </p>
                    </div>
                    <p className="font-black text-lg tracking-tighter">
                      GH¢ {Number(item.unit_price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-8 opacity-50" />

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Gross Subtotal</span>
                  <span>GH¢ {Number(order.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Logistics/Delivery</span>
                  <span className="text-primary italic">Included</span>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex justify-between font-black text-2xl tracking-tighter">
                  <span>Total Payable</span>
                  <span className="text-primary italic">GH¢ {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Coordinates */}
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destination Protocols</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="p-6 rounded-3xl bg-muted/20 space-y-1">
                <p className="font-black uppercase text-xs tracking-tight">{order.first_name} {order.last_name}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{order.phone}</p>
                <Separator className="my-3 opacity-20" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                  {order.address}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Intelligence */}
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Settlement Intel</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 pt-0">
              <div className="flex justify-between items-center py-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Flow type</span>
                <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/5">{order.type}</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Ledger Status</span>
                <StatusBadge variant={(order.payment_status || 'Paid').toLowerCase() as any} />
              </div>
            </CardContent>
          </Card>

          {/* Operations */}
          <Card className="rounded-[2.5rem] border-none shadow-xl ring-1 ring-border/50 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-50">Operation Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-widest">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-widest">
                <MessageSquare className="mr-2 h-4 w-4" />
                Signal Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
