"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/ui/status-badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  History
} from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function InstallmentManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [request, setRequest] = useState<any>(null)
  const [installmentData, setInstallmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Setup Form State
  const [setupData, setSetupData] = useState({
    duration: 3,
    initial_deposit: 0
  })

  // Payment Form State
  const [payAmount, setPayAmount] = useState("")
  const [showPayForm, setShowPayForm] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    async function loadAll() {
      try {
        const [reqRes, instRes] = await Promise.all([
          fetchApi(`/requests.php?id=${id}`),
          fetchApi(`/installment_management.php?request_id=${id}`)
        ])

        if (reqRes.status === 'success') setRequest(reqRes.data)
        if (instRes.status === 'success') setInstallmentData(instRes.data)
      } catch (error) {
        console.error("Load failed", error)
        toast.error("Failed to load details")
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [id])

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetchApi('/installment_management.php', {
        method: 'POST',
        body: JSON.stringify({
          request_id: id,
          ...setupData
        })
      })
      if (res.status === 'success') {
        toast.success("Installment plan submitted!")
        window.location.reload()
      } else {
        toast.error(res.message || "Failed to setup installment")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(payAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetchApi('/installment_management.php', {
        method: 'PUT',
        body: JSON.stringify({
          order_id: installmentData.order.id,
          amount: amount
        })
      })
      if (res.status === 'success') {
        toast.success("Payment recorded!")
        setPayAmount("")
        setShowPayForm(false)
        // Refresh data
        const instRes = await fetchApi(`/installment_management.php?request_id=${id}`)
        if (instRes.status === 'success') setInstallmentData(instRes.data)
      } else {
        toast.error(res.message || "Payment failed")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

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
        <Button variant="link" onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    )
  }

  const hasInstallment = !!installmentData?.order
  const order = installmentData?.order
  const payments = installmentData?.payments || []
  
  // Calculate progress
  const total = parseFloat(order?.total_amount || 0)
  const paid = parseFloat(order?.amount_paid || 0)
  const balance = parseFloat(order?.outstanding_balance || 0)
  const progress = total > 0 ? (paid / total) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 shrink-0">
          <Link href={`/dashboard/requests/${id}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <PageHeader
          title="Installment Management"
          description={hasInstallment ? `Manage payments for REQ-${id.padStart(3, '0')}` : "Setup your payment plan"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {!hasInstallment ? (
            <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl ring-1 ring-border/50">
              <CardHeader className="bg-primary/5 pb-8">
                <CardTitle className="text-xl font-bold">Setup Payment Plan</CardTitle>
                <CardDescription>Proposed installment timeline for your approved request.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSetup} className="space-y-6">
                  <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Budget</span>
                      <span className="text-lg font-bold">GH¢ {parseFloat(request.budget).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Plan Duration</Label>
                      <select
                        id="duration"
                        className="w-full h-12 rounded-2xl border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={setupData.duration}
                        onChange={(e) => setSetupData({ ...setupData, duration: parseInt(e.target.value) })}
                      >
                        <option value={2}>2 Months</option>
                        <option value={3}>3 Months</option>
                        <option value={4}>4 Months</option>
                        <option value={6}>6 Months</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deposit">Initial Deposit (Optional)</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="0.00"
                        className="h-12 rounded-2xl"
                        value={setupData.initial_deposit}
                        onChange={(e) => setSetupData({ ...setupData, initial_deposit: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 rounded-2xl border p-4 bg-accent/5">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the installment terms and conditions
                        </label>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button type="button" className="text-xs text-primary font-bold text-left hover:underline">
                              Read Terms & Conditions
                            </button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[2rem] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="font-black uppercase tracking-widest text-lg">Installment Policy</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4 text-sm leading-relaxed">
                              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-900">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                <div className="space-y-2">
                                  <p className="font-bold">Late Payment Penalty</p>
                                  <p className="text-xs">If the full amount is not paid by the end of the agreed duration, you risk losing <span className="font-black text-amber-600 font-bold">30% of your total contributions</span> as a penalty.</p>
                                </div>
                              </div>
                              <p>Remaining contributions after the penalty deduction will be refunded to your wallet or original payment method.</p>
                              <p className="font-bold">By proceeding, you acknowledge that:</p>
                              <ul className="list-disc pl-5 space-y-1 text-xs">
                                <li>The item will only be released after 100% payment.</li>
                                <li>The company holds the item during the installment period.</li>
                                <li>You are responsible for completing payments within the selected duration.</li>
                              </ul>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full rounded-[1.5rem] font-black uppercase tracking-widest h-14" 
                    disabled={submitting || !agreedToTerms}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Submit for Approval"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Tracker */}
              <Card className="rounded-[2.5rem] border-none shadow-xl ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-primary/5">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">Payment Progress</CardTitle>
                    <CardDescription>Tracking your bits for REQ-{id.padStart(3, '0')}</CardDescription>
                  </div>
                  <StatusBadge variant={order.status.toLowerCase() as any} />
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paid to date</p>
                        <p className="text-3xl font-black text-primary">GH¢ {paid.toLocaleString()}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Remaining</p>
                        <p className="text-xl font-bold">GH¢ {balance.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="relative pt-2">
                       <Progress value={progress} className="h-4 rounded-full" />
                       <div className="absolute top-[-24px] right-0 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                         {Math.round(progress)}%
                       </div>
                    </div>
                  </div>

                  {order.status !== 'Approved' && order.status !== 'Partially Paid' && order.status !== 'Fully Paid' ? (
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-amber-900 uppercase tracking-tight">Pending Approval</p>
                        <p className="text-xs text-amber-800/80">Your installment plan is being reviewed by our accounts department. We will notify you once approved.</p>
                      </div>
                    </div>
                  ) : order.status === 'Fully Paid' ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-start gap-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Fully Paid</p>
                        <p className="text-xs text-emerald-800/80">Great news! You have completed all payments for this request. Your order is now moving to the next stage.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4">
                      {!showPayForm ? (
                        <Button 
                          onClick={() => setShowPayForm(true)}
                          size="lg" 
                          className="w-full rounded-[1.5rem] font-black uppercase tracking-widest h-14"
                        >
                          Make a Payment ("Bit")
                        </Button>
                      ) : (
                        <Card className="rounded-[2rem] border-primary/20 bg-primary/5">
                          <CardContent className="pt-6">
                            <form onSubmit={handlePayment} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="amount">Enter Amount to Pay (GH¢)</Label>
                                <Input
                                  autoFocus
                                  id="amount"
                                  type="number"
                                  placeholder="0.00"
                                  className="h-12 rounded-2xl border-primary/20"
                                  value={payAmount}
                                  onChange={(e) => setPayAmount(e.target.value)}
                                />
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button type="button" variant="ghost" className="flex-1 rounded-xl" onClick={() => setShowPayForm(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1 rounded-xl" disabled={submitting}>
                                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Confirm Payment"}
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic py-4">No payments recorded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/20">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">GH¢ {parseFloat(p.amount).toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">{p.method}</p>
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">{request.product_name.charAt(0)}</div>
                 <div>
                    <p className="text-sm font-bold truncate max-w-[150px]">{request.product_name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">{request.category_name || "Custom"}</p>
                 </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Original Budget</span>
                  <span className="font-bold">GH¢ {parseFloat(request.budget).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Request Date</span>
                  <span className="font-bold text-right">{new Date(request.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-black text-white p-6">
            <h3 className="text-base font-black italic tracking-tighter">Installment Protocol</h3>
            <div className="mt-6 space-y-4">
               <div className="flex gap-3">
                 <Shield className="h-4 w-4 text-primary shrink-0" />
                 <p className="text-[10px] leading-relaxed opacity-80 uppercase font-bold tracking-tight">Flexible Bits: Pay what you can, when you can within the duration.</p>
               </div>
               <div className="flex gap-3">
                 <Clock className="h-4 w-4 text-primary shrink-0" />
                 <p className="text-[10px] leading-relaxed opacity-80 uppercase font-bold tracking-tight">Agreed Duration: Ensure full payment before the deadline.</p>
               </div>
            </div>
            <Separator className="my-6 bg-white/10" />
            <p className="text-[10px] leading-relaxed opacity-50 uppercase font-black tracking-widest">Support Line: +233 241 000 000</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
