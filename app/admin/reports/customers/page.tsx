"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Search,
    Filter,
    Download,
    Mail,
    UserPlus,
    TrendingUp,
    PieChart,
    UserCheck,
    Loader2,
    RefreshCw
} from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function CustomerReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/reports.php?type=customers")
            setData(res.data)
        } catch (e: any) {
            toast.error("Failed to load customer metrics")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Mapping Engagement Matrix...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Engagement Matrix</h1>
                    <p className="text-muted-foreground text-sm font-medium">Analysis of acquisition, retention, and customer lifetime value.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadData}>
                        <RefreshCw className="h-3.5 w-3.5 opacity-50" />
                        Sync Data
                    </Button>
                    <Button className="h-12 px-8 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl">
                        <Download className="mr-2 h-4 w-4" />
                        LTV Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-white rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retention Rate</p>
                            <UserCheck className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">{data?.kpi.retention_rate}%</div>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${data?.kpi.retention_rate}%` }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-white rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Acquisitions</p>
                            <UserPlus className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">{data?.kpi.acquisitions}</div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase opacity-60">Verified signups (Past 30d)</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-white rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg Lifetime Value</p>
                            <TrendingUp className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {Math.round(data?.kpi.avg_ltv).toLocaleString()}</div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase opacity-60">Cumulative value per entity</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="shadow-sm border-none ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 bg-muted/5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Premier Value Entities (Top Spenders)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 border-t">
                        <div className="divide-y divide-border/30">
                            {data?.top_customers.map((cust: any, i: number) => (
                                <div key={cust.name} className="p-6 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-black text-sm tracking-tight uppercase flex items-center gap-2">
                                            {cust.name}
                                            {i < 3 && <Badge variant="default" className="text-[8px] h-4">TOP {i + 1}</Badge>}
                                        </p>
                                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase">{cust.orders} Orders Executed</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black">GH¢ {parseFloat(cust.value).toLocaleString()}</div>
                                        <p className="text-[9px] font-black uppercase text-primary/60 tracking-widest">Total Yield</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 bg-indigo-500/[0.02]">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-indigo-600">Advanced Segmentation</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] flex flex-col items-center justify-center text-center p-10">
                        <div className="h-20 w-20 bg-indigo-500/5 rounded-[2rem] flex items-center justify-center mb-6">
                            <PieChart className="h-10 w-10 text-indigo-500/30" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Psychographic Clusters</h3>
                        <p className="text-xs text-muted-foreground font-medium max-w-xs uppercase leading-relaxed opacity-60">
                            Advanced clustering algorithms are currently cross-referencing order frequency with regional demand vectors for predictive modeling.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
