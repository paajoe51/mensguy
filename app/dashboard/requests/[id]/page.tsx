"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  Calendar,
  DollarSign,
  MessageSquare,
  Clock,
  ExternalLink,
  ShieldCheck,
  Loader2,
  ArrowRight
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [request, setRequest] = useState<any>(null)
  const [installmentOrder, setInstallmentOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [reqRes, instRes] = await Promise.all([
          fetchApi(`/requests.php?id=${id}`),
          fetchApi(`/installment_management.php?request_id=${id}`)
        ])

        if (reqRes.status === 'success') {
          setRequest(reqRes.data)
        }
        if (instRes.status === 'success') {
          setInstallmentOrder(instRes.data?.order)
        }
      } catch (error) {
        console.error("Failed to load request data", error)
        toast.error("Failed to load details")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground uppercase tracking-widest font-black">Request not found</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/dashboard/requests">Go Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 shrink-0">
          <Link href="/dashboard/requests">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <PageHeader
          title={`Request #${request.id}`}
          description={`Logged on ${new Date(request.created_at).toLocaleDateString()}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">{request.product_name}</CardTitle>
                <CardDescription>Category: {request.category_name || "Uncategorized"}</CardDescription>
              </div>
              <StatusBadge variant={request.status.toLowerCase() as any} />
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm p-4 rounded-3xl bg-muted/20">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Budget</p>
                    <p className="font-bold">GH¢ {parseFloat(request.budget || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm p-4 rounded-3xl bg-muted/20">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Status</p>
                    <p className="font-bold">{request.status}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Description</h3>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap rounded-3xl bg-muted/10 p-6 border border-border/20">
                  {request.description || "No description provided."}
                </p>
              </div>

              {request.link && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sourcing Link</h3>
                  <a
                    href={request.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary font-bold hover:underline bg-primary/5 w-fit px-4 py-2 rounded-xl"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Source
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Installment Progress Summary (If active) */}
          {installmentOrder && (
            <Card className="rounded-[2.5rem] border-none shadow-xl ring-1 ring-primary/20 bg-primary/5 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Installment Progress</h3>
                    <p className="text-[10px] text-muted-foreground font-bold italic">Pay in bits plan active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black">GH¢ {parseFloat(installmentOrder.amount_paid).toLocaleString()} paid</p>
                    <p className="text-[10px] uppercase font-bold opacity-60">Balance: GH¢ {parseFloat(installmentOrder.outstanding_balance).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                   <Progress value={(parseFloat(installmentOrder.amount_paid) / parseFloat(installmentOrder.total_amount)) * 100} className="h-2" />
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                      <span>Started: {new Date(installmentOrder.created_at).toLocaleDateString()}</span>
                      <Button variant="link" size="sm" asChild className="h-auto p-0 text-primary font-black">
                        <Link href={`/dashboard/requests/${id}/installment`}>Manage Plan <ArrowRight className="ml-1 h-3 w-3" /></Link>
                      </Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quotation Details (Only if approved/review) */}
          {request.status === "Approved" && (
            <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-xl ring-1 ring-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 font-black uppercase tracking-widest">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Quotation Protocol
                </CardTitle>
                <CardDescription>Final values calculated for your sourcing request.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-sm space-y-3 border border-primary/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Evaluation Notes</span>
                  </div>
                  <p className="text-sm italic">{request.notes || "Ready for order conversion."}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row pt-2">
                  {!installmentOrder ? (
                    <>
                      <Button size="lg" className="flex-1 rounded-[1.5rem] font-black uppercase tracking-widest h-14" asChild>
                        <Link href={`/checkout?request=${request.id}`}>
                          Convert to Order
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" className="flex-1 rounded-[1.5rem] font-black uppercase tracking-widest h-14 border-primary/20 text-primary" asChild>
                        <Link href={`/dashboard/requests/${request.id}/installment`}>
                          Request Installment
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button size="lg" className="w-full rounded-[1.5rem] font-black uppercase tracking-widest h-14" asChild>
                      <Link href={`/dashboard/requests/${request.id}/installment`}>
                        View Installment Plan
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Communication Placeholder */}
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground bg-muted/20 p-4 rounded-2xl italic">
                  Messaging with sourcing officers is currently being optimized. Please contact support if you have immediate questions.
                </p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 h-12 rounded-2xl border border-border/50 bg-background px-4 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    placeholder="Type a message..."
                    disabled
                  />
                  <Button size="icon" className="h-12 w-12 rounded-2xl" disabled>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Status/Tracking */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Process Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/50">
                <div className="relative flex items-start gap-6 pl-6">
                  <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-tight">Request Received</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{new Date(request.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-6 pl-6">
                  <div className={`absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full ${request.status === 'Pending' ? 'bg-muted ring-4 ring-muted/10' : 'bg-primary ring-4 ring-primary/10'}`} />
                  <div className="space-y-1">
                    <p className={`text-xs font-black uppercase tracking-tight ${request.status === 'Pending' ? 'text-muted-foreground opacity-50' : ''}`}>Sourcing in Progress</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Automatic Update</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-black text-white p-6">
            <h3 className="text-base font-black italic tracking-tighter">Sourcing Intelligence</h3>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-2">Protocol: Overseas Direct</p>
            <Separator className="my-6 bg-white/10" />
            <p className="text-xs leading-relaxed opacity-80">
              Your request is handled by our specialized sourcing team in Guangzhou/Shenzhen. 
              We verify supplier credibility and quality benchmarks before issuing a quote.
            </p>
            <Button variant="outline" className="w-full mt-6 h-12 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-widest">
              Contact Officer
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
