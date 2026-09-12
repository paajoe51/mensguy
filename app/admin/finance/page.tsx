"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompactStatCard } from "@/components/ui/compact-stat-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  History,
  ShieldCheck,
  Search,
  Loader2,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function FinancePage() {
  const [kpi, setKpi] = useState<any>(null)
  const [ledger, setLedger] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [kpiRes, ledgerRes, chartRes, transRes] = await Promise.all([
        fetchApi("/finance.php?type=dashboard"),
        fetchApi("/finance.php?type=ledger"),
        fetchApi("/finance.php?type=chart"),
        fetchApi("/finance.php?type=transactions")
      ])
      setKpi(kpiRes.data)
      setLedger(ledgerRes.data)
      setChartData(chartRes.data)
      setTransactions(transRes.data.slice(0, 5))
    } catch (e: any) {
      toast.error("Failed to load financial records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  if (loading && !kpi) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Secure Ledger...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-1">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Financial Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Cash flow tracking, trial balance, and automated ledger auditing.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadData}>
            <RefreshCw className={cn("h-3.5 w-3.5 opacity-50", loading && "animate-spin")} />
            Reload
          </Button>
          <Button className="h-12 px-8 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl">
            <Download className="mr-2 h-4 w-4" />
            Statements
          </Button>
          <Button className="h-12 px-8 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl" asChild>
            <Link href="/admin/finance/expenses">
              <Plus className="mr-2 h-4 w-4" />
              Record Expense
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CompactStatCard
          title="Total Revenue"
          value={`GH¢ ${kpi?.revenue.toLocaleString()}`}
          icon={TrendingUp}
          variant="primary"
          trend={{ value: 12.5, label: "Realized", isPositive: true }}
        />
        <CompactStatCard
          title="Net Profit"
          value={`GH¢ ${kpi?.profit.toLocaleString()}`}
          icon={ShieldCheck}
          variant="success"
          trend={{ value: 8.3, label: "After Expenses", isPositive: true }}
        />
        <CompactStatCard
          title="Expenditure"
          value={`GH¢ ${kpi?.expenses.toLocaleString()}`}
          icon={TrendingDown}
          variant="destructive"
          trend={{ value: 5.1, label: "Official", isPositive: false }}
        />
        <CompactStatCard
          title="Outstanding"
          value={`GH¢ ${kpi?.outstanding.toLocaleString()}`}
          icon={Wallet}
          variant="warning"
          trend={{ value: 3.2, label: "Pending", isPositive: false }}
        />
        <CompactStatCard
          title="Capital/Loans"
          value={`GH¢ ${kpi?.loans.toLocaleString()}`}
          icon={CreditCard}
          variant="purple"
          trend={{ value: 10, label: "Injection", isPositive: true }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none border-none">
            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Overview</TabsTrigger>
            <TabsTrigger value="ledger" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Trial Balance</TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Audit Trail</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-muted/5 px-10 py-8 border-b border-border/50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Flow Dynamics: Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }}
                        tickFormatter={(v) => `GH¢${v / 1000}k`}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                      <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} strokeDasharray="6 6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-muted/5 px-10 py-8 border-b border-border/50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Recent Flux</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-muted/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center", tx.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10')}>
                          {tx.type === 'income' ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : <ArrowDownRight className="h-4 w-4 text-rose-600" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black tracking-tight uppercase">{tx.id}</span>
                          <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-60">Status: {tx.status}</span>
                        </div>
                      </div>
                      <span className={cn("text-sm font-black", tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600')}>
                        {tx.type === 'income' ? '+' : '-'} GH¢{parseFloat(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-border/50">
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest h-10 hover:bg-black hover:text-white rounded-xl transition-all" asChild>
                    <Link href="/admin/finance/transactions">View High-Intensity Ledger</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-6 outline-none">
          <Card className="border-none shadow-sm ring-1 ring-border/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-muted/5 px-10 py-8 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  Trial Balance (Calculated)
                </CardTitle>
                <Badge variant="outline" className="font-black text-[9px] uppercase tracking-tighter bg-black text-white border-none py-1">UNAUDITED · REAL-TIME</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-10 py-6 font-black text-[10px] uppercase tracking-widest">Account & Classification</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">GL Code</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right">Debit (GH¢)</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right px-10">Credit (GH¢)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/5 border-b border-border/30">
                      <TableCell className="px-10 py-6">
                        <span className="text-xs font-black tracking-tight uppercase">{item.account}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] font-bold text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">{item.code}</span>
                      </TableCell>
                      <TableCell className="text-right text-xs font-black">
                        {item.debit > 0 ? `GH¢${item.debit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right text-xs font-black px-10">
                        {item.credit > 0 ? `GH¢${item.credit.toLocaleString()}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-black text-white hover:bg-black/90 font-black border-none">
                    <TableCell className="px-10 py-8 text-sm uppercase tracking-[0.3em]">Total Balance</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right text-sm">GH¢{ledger.reduce((acc, curr) => acc + curr.debit, 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm px-10">GH¢{ledger.reduce((acc, curr) => acc + curr.credit, 0).toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 outline-none">
          <Card className="border-none shadow-sm ring-1 ring-border/50 rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="bg-muted/5 px-10 py-8 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Cryptographic Audit Trail
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
                  <Input placeholder="Search ledger..." className="pl-9 h-10 w-[250px] text-[10px] font-bold bg-muted/10 border-none ring-1 ring-border/50 rounded-xl" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-20">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-24 w-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 animate-pulse">
                  <ShieldCheck className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest mb-2">Digital Audit Vault Engaged</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 max-w-[400px] leading-relaxed">
                  Every transaction within the finance module is timestamped and logged for multi-level auditing.
                  Account Heads can export cryptographic statements for external compliance reviews.
                </p>
                <Button className="mt-8 h-12 px-10 font-black uppercase tracking-widest text-[10px] bg-black text-white rounded-2xl shadow-xl hover:bg-primary transition-all">
                  Generate Compliance Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
