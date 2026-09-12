"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    TrendingUp,
    Download,
    Calendar,
    Filter,
    ArrowUpRight,
    ShoppingBag,
    CreditCard,
    Percent,
    BarChart3,
    Loader2,
    RefreshCw
} from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function SalesReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/reports.php?type=sales")
            setData(res.data)
        } catch (e: any) {
            toast.error("Failed to load sales analytics")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Analyzing Sales Ledger...</p>
            </div>
        )
    }

    const kpis = [
        { title: "Quarterly Revenue", value: `GH¢ ${data?.kpi.quarterly_revenue.toLocaleString()}`, trend: "+15.2%", icon: ShoppingBag },
        { title: "Avg Order Value", value: `GH¢ ${data?.kpi.aov.toLocaleString()}`, trend: "+2.1%", icon: CreditCard },
        { title: "Conversion Rate", value: `${data?.kpi.conversion_rate}%`, trend: "-0.5%", icon: Percent },
        { title: "Forecasted Sales", value: `GH¢ ${Math.round(data?.kpi.forecast / 1000)}k`, trend: "+8.4%", icon: BarChart3 },
    ]

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Sales Intelligence</h1>
                    <p className="text-muted-foreground text-sm font-medium">In-depth performance tracking and revenue forecasting.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadData}>
                        <RefreshCw className="h-3.5 w-3.5 opacity-50" />
                        Sync Data
                    </Button>
                    <Button className="h-12 px-8 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((stat) => (
                    <Card key={stat.title} className="shadow-sm border-none ring-1 ring-border/50 rounded-[2rem] bg-white overflow-hidden transition-all hover:ring-primary/20">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between pb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">{stat.title}</p>
                                <div className="h-8 w-8 rounded-xl bg-muted/10 flex items-center justify-center">
                                    <stat.icon className="h-4 w-4 text-primary/60" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                                <span className={stat.trend.startsWith('+') ? "text-[10px] font-bold text-success" : "text-[10px] font-bold text-destructive"}>
                                    {stat.trend}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="shadow-sm border-none ring-1 ring-border/50 rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="px-10 py-8 bg-muted/5 border-b border-border/50">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Revenue Growth Matrix (Past 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <div className="h-[400px] flex items-end gap-2 px-4">
                        {data?.trends.map((item: any, i: number) => {
                            const max = Math.max(...data.trends.map((t: any) => parseFloat(t.value)));
                            const height = (parseFloat(item.value) / max) * 100;
                            return (
                                <div key={i} className="flex-1 group relative flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary group-hover:shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                                        style={{ height: `${height || 2}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            GH¢ {parseFloat(item.value).toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-muted-foreground uppercase vertical-lr mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.label}
                                    </span>
                                </div>
                            )
                        })}
                        {data?.trends.length === 0 && (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-40">
                                <BarChart3 className="h-12 w-12 mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest">No transaction data for this period</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
