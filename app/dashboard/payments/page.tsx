"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { PageHeader } from "@/components/page-header"
import {
  Search,
  Download,
  Filter,
  ArrowUpRight,
  Calendar,
  Wallet,
  Receipt,
  Loader2
} from "lucide-react"
import { fetchApi } from "@/lib/api"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetchApi('/customer_payments.php')
        if (res.status === 'success') {
          setPayments(res.data)
          setSummary(res.summary)
        }
      } catch (error) {
        console.error("Failed to load payments", error)
      } finally {
        setLoading(false)
      }
    }
    loadPayments()
  }, [])

  const filtered = payments.filter(p => 
    p.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Payment History"
          description="View all your transactions and payment records."
        />
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Statements
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Paid</p>
                <p className="text-3xl font-bold mt-1 text-emerald-600">GH¢ {summary?.total_paid?.toLocaleString() || "0"}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-600" />
                  Aggregate spend
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Outstanding</p>
                <p className="text-3xl font-bold mt-1 text-amber-600">GH¢ {summary?.outstanding?.toLocaleString() || "0"}</p>
                <p className="text-xs text-muted-foreground mt-1 text-amber-400">
                  Across all active orders
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Transactions</p>
                <p className="text-3xl font-bold mt-1">{summary?.transaction_count || "0"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recorded payments
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Receipt className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table/List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <CardDescription>A list of all your payments recorded in the system.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Order ID or Receipt ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold border-b">Receipt ID</th>
                  <th className="px-4 py-3 font-semibold border-b">Order ID</th>
                  <th className="px-4 py-3 font-semibold border-b">Amount</th>
                  <th className="px-4 py-3 font-semibold border-b">Date</th>
                  <th className="px-4 py-3 font-semibold border-b">Method</th>
                  <th className="px-4 py-3 font-semibold border-b text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filtered.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-accent/5">
                    <td className="px-4 py-4 font-medium text-foreground">{payment.receipt_number}</td>
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/orders/${payment.order_id}`} className="text-primary hover:underline font-medium">
                        {payment.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-4 font-bold text-foreground">GH¢ {parseFloat(payment.amount).toLocaleString()}</td>
                    <td className="px-4 py-4 text-muted-foreground">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className="text-foreground">{payment.method}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`#receipt-${payment.id}`}>
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
