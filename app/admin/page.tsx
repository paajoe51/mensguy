"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ShoppingBag,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
  BarChart,
  TrendingUp,
  Percent,
  Truck,
  DollarSign,
  Briefcase,
  Wallet,
  Building2,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Globe,
  Zap,
  ArrowUpRight,
  Monitor,
  Loader2
} from "lucide-react"
import { CompactStatCard } from "@/components/ui/compact-stat-card"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

interface DashboardStats {
  total_sales: number
  order_counts: Record<string, number>
  inventory: {
    total: number
    low: number
    out: number
  }
  customers: number
  pending_requests: number
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await fetchApi("/dashboard_stats.php")
      setStats(res.data)
    } catch (err: any) {
      toast.error(err.message || "Failed to load dashboard metrics.")
    } finally { setLoading(false) }
  }

  useEffect(() => { loadStats() }, [])

  const hasAccess = (module: string) => {
    if (!user) return false;
    if (user.role === 'Administrator') return true;
    const level = user.permissions?.[module] || 'none';
    return level !== 'none';
  }

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Control Center...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Premium Floating Header */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 flex flex-col gap-6 md:flex-row md:items-center md:justify-between shadow-[0_1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-sm">
            <Monitor className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-foreground sm:text-3xl">Business Control Center</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] uppercase font-black bg-primary/5 border-primary/20 text-primary px-1.5 py-0 h-4">System Live</Badge>
              <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest hidden sm:inline">MENSGUY IMPORT LTD COMMAND HUB</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-6 pr-6 border-r border-border/50 hidden lg:flex">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">USD / GHS</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black tracking-tighter">GH¢12.45</span>
                <span className="text-[10px] text-success font-bold">+0.2%</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">CNY / GHS</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black tracking-tighter">GH¢1.72</span>
                <span className="text-[10px] text-destructive font-bold">-0.05%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              disabled={loading}
              className="h-10 px-4 gap-2 border-none ring-1 ring-border/50 hover:bg-muted/50 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 opacity-50", loading && "animate-spin")} />
              Sync
            </Button>
            <Button size="sm" className="h-10 px-4 gap-2 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all font-bold text-xs uppercase tracking-widest shadow-md">
              <BarChart className="h-3.5 w-3.5" />
              Reports
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* FINANCIAL INTELLIGENCE */}
        {hasAccess("Finance Ledger") && (
          <section className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-emerald-500/20 rounded-full blur-[1px]" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Financial Intelligence
              </h2>
              <span className="text-[10px] font-black text-muted-foreground/50 uppercase">FY-2026 Q1</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <CompactStatCard
                title="Total Sales"
                value={`GH¢ ${stats?.total_sales.toLocaleString() || '0'}`}
                icon={ShoppingBag}
                variant="primary"
                trend={{ value: 0, label: "Gross Revenue", isPositive: true }}
              />
              <CompactStatCard
                title="Business Capital"
                value="GH¢ 245,000"
                icon={Building2}
                variant="info"
                trend={{ value: 0, label: "Asset Value", isPositive: true }}
              />
              <CompactStatCard
                title="Total Customers"
                value={stats?.customers.toString() || '0'}
                icon={Users}
                variant="indigo"
              />
              <CompactStatCard
                title="Pending Value"
                value="GH¢ 12.5k"
                icon={Wallet}
                variant="success"
              />
            </div>
          </section>
        )}

        {/* OPERATIONAL PULSE */}
        {(hasAccess("Logistics / Dispatch") || hasAccess("Installment Config")) && (
          <section className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-sky-500/20 rounded-full blur-[1px]" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-sky-600 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                Operational Pulse
              </h2>
              <span className="text-[10px] font-black text-muted-foreground/50 uppercase">Real-time Stream</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <CompactStatCard title="Pending Orders" value={stats?.order_counts['Pending']?.toString() || '0'} icon={Clock} variant="warning" />
              <CompactStatCard title="Processing" value={stats?.order_counts['Processing']?.toString() || '0'} icon={Package} variant="info" />
              <CompactStatCard title="Completed" value={stats?.order_counts['Delivered']?.toString() || '0'} icon={CheckCircle2} variant="success" />
              <CompactStatCard title="In Transit" value={stats?.order_counts['In-Transit']?.toString() || '0'} icon={Truck} variant="primary" />
              <Link href="/admin/customers/requests" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <CompactStatCard title="Sourcing Req." value={stats?.pending_requests.toString() || '0'} icon={Globe} variant="warning" />
              </Link>
            </div>
          </section>
        )}

        {/* MARKET & INVENTORY DEPTH */}
        {(hasAccess("Procurement / Sourcing")) && (
          <section className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full blur-[1px]" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              Market & Inventory Depth
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <CompactStatCard title="Live SKUs" value={stats?.inventory.total.toString() || '0'} icon={Package} variant="info" />
              <CompactStatCard title="Low Stock" value={stats?.inventory.low.toString() || '0'} icon={AlertTriangle} variant="warning" />
              <CompactStatCard title="Out of Stock" value={stats?.inventory.out.toString() || '0'} icon={AlertTriangle} variant="destructive" />
              <CompactStatCard title="Categories" value="8" icon={Briefcase} variant="primary" />
              <CompactStatCard title="Total Base" value={stats?.customers.toString() || '0'} icon={Users} variant="success" />
              <CompactStatCard title="Retention" value="84%" icon={Zap} variant="indigo" />
            </div>
          </section>
        )}
      </div>

      {/* Footer Branding */}
      <div className="pt-10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
        <span>© 2026 MENSGUY IMPORT LTD</span>
        <div className="flex gap-4">
          <span>Security Compliant</span>
          <span>Real-time Ledger</span>
        </div>
      </div>
    </div>
  )
}
