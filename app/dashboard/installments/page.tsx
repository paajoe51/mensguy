"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, CreditCard, AlertCircle, Loader2 } from "lucide-react"
import { fetchApi } from "@/lib/api"

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi('/installments.php')
        if (res.status === 'success') {
          setInstallments(res.data)
        }
      } catch (error) {
        console.error("Failed to load installments", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Installments"
        description="Manage your installment payment plans"
      />

      {/* Active Installments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Plans</h2>
        {installments.length > 0 ? (
          installments.map((plan) => {
            const paid = parseFloat(plan.total_amount) - parseFloat(plan.outstanding_balance)
            const progress = (paid / parseFloat(plan.total_amount)) * 100
            
            return (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Plan Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{plan.order_number}</h3>
                          <p className="text-sm text-muted-foreground">Plan ID: INS-{plan.id}</p>
                        </div>
                        <StatusBadge variant={plan.status.toLowerCase()} />
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Payment Progress</span>
                          <span className="font-medium">
                            {Math.round(progress)}% Complete
                          </span>
                        </div>
                        <Progress 
                          value={progress} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600 font-bold">
                            GH¢ {paid.toLocaleString()} paid
                          </span>
                          <span className="text-muted-foreground">
                            GH¢ {parseFloat(plan.outstanding_balance).toLocaleString()} remaining
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="lg:w-64 space-y-4 lg:pl-6 lg:border-l">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Due</p>
                          <p className="font-medium">{new Date(plan.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Plan Amount</p>
                          <p className="font-medium">GH¢ {parseFloat(plan.total_amount).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/dashboard/orders/${plan.order_id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No active installment plans found.</p>
              <Button variant="link" asChild>
                <Link href="/shop" className="mt-2">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 text-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold">Installment Policy</p>
              <p className="text-amber-800/80 mt-1">
                Items are held until full payment is made. Missing payments beyond the grace 
                period may result in a 30% deduction. Please ensure timely payments to avoid 
                any penalties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
