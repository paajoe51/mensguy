"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { Timeline } from "@/components/ui/timeline"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  Package,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadOrder = async () => {
    try {
      const res = await fetchApi(`/orders.php?id=${id}`)
      setOrder(res.data)
    } catch (e: any) {
      toast.error(e.message || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrder() }, [id])

  const handleStatusUpdate = async (status: string) => {
    try {
      await fetchApi(`/orders.php?id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      })
      toast.success(`Status updated to ${status}`)
      loadOrder()
    } catch (e: any) {
      toast.error(e.message || "Update failed")
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!order) return <div className="text-center py-20 font-bold uppercase tracking-widest text-muted-foreground">Order not found</div>

  const timelineSteps: any[] = [
    { title: "Order Placed", timestamp: new Date(order.created_at).toLocaleString(), status: "completed" },
    { title: "Processing", status: (order.status === 'Processing' || order.status === 'In-Transit' || order.status === 'Delivered') ? "completed" : order.status === 'Pending' ? "current" : "upcoming" },
    { title: "Delivering", status: (order.status === 'In-Transit' || order.status === 'Delivered') ? "completed" : order.status === 'Processing' ? "current" : "upcoming" },
    { title: "Finalized", status: order.status === 'Delivered' ? "completed" : order.status === 'In-Transit' ? "current" : "upcoming" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">{order.order_number}</h1>
              <StatusBadge variant={order.status.toLowerCase() as any} />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              SYSTEM ENTRY: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Invoice</Button>
          <Select value={order.status} onValueChange={handleStatusUpdate}>
            <SelectTrigger className="w-[180px] h-10 border-none ring-1 ring-border/50 font-bold uppercase text-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-none shadow-2xl rounded-2xl">
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="In-Transit">In-Transit</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-[2rem] border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
            <CardHeader className="bg-muted/10">
              <CardTitle className="flex items-center gap-2 text-sm uppercase font-black tracking-widest">
                <Package className="h-4 w-4 text-primary" /> Manifest
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center shrink-0 ring-1 ring-border/20 transition-all group-hover:ring-primary/30">
                      <span className="text-xl font-black italic opacity-10">{item.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs uppercase tracking-tight truncate">{item.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black">GH¢{Number(item.unit_price).toLocaleString()}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-8 opacity-50" />
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Gross Valuation</span>
                  <span>GH¢{Number(order.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-xl tracking-tighter">
                  <span>Total Amount</span>
                  <span className="text-primary font-black italic">GH¢{Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm uppercase font-black tracking-widest">
                <CreditCard className="h-4 w-4" /> Transaction Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Revenue Stream</span>
                    <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/5">{order.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Internal Ledger</span>
                    <StatusBadge variant={(order.payment_status || 'Pending').toLowerCase() as any} />
                  </div>
                </div>
                <div className="rounded-3xl bg-muted/20 p-6 flex flex-col justify-center items-center gap-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Status Summary</p>
                  <p className="text-xl font-black italic uppercase tracking-tighter text-primary">{order.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl ring-1 ring-border/50 overflow-hidden">
            <CardHeader className="bg-black text-white p-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Client Identity</CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <Avatar className="h-14 w-14 ring-2 ring-white/10">
                  <AvatarFallback className="bg-primary text-black font-black">{order.customer_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-black text-lg tracking-tighter">{order.customer_name}</p>
                  <p className="text-xs font-bold opacity-50 lowercase">{order.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-muted/20 flex items-center justify-center shrink-0"><Phone className="h-4 w-4" /></div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Encrypted Mobile</p>
                    <p className="text-xs font-black">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-muted/20 flex items-center justify-center shrink-0"><MapPin className="h-4 w-4" /></div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Delivery Coordinates</p>
                    <p className="text-xs font-black leading-relaxed">{order.address}</p>
                  </div>
                </div>
              </div>
              <Button className="w-full h-12 rounded-2xl bg-muted/20 text-black hover:bg-black hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border-none shadow-none" asChild>
                <Link href={`/admin/customers/${order.customer_id}`}>Intel Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logistics Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline steps={timelineSteps} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
