"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Package,
    TrendingUp,
    AlertTriangle,
    Download,
    Box,
    RefreshCw,
    Search,
    Filter,
    Loader2
} from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function InventoryReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/reports.php?type=inventory")
            setData(res.data)
        } catch (e: any) {
            toast.error("Failed to load inventory analytics")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Auditing Warehouse Assets...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Inventory & Assets</h1>
                    <p className="text-muted-foreground text-sm font-medium">Warehouse valuation, category distribution, and stock efficiency.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadData}>
                        <RefreshCw className="h-3.5 w-3.5 opacity-50" />
                        Sync Stock
                    </Button>
                    <Button className="h-12 px-8 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl">
                        <Download className="mr-2 h-4 w-4" />
                        Full Audit
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-white rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Warehouse Value</p>
                            <Box className="h-4 w-4 text-primary/40" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {data?.kpi.warehouse_value.toLocaleString()}</div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase opacity-60">Total retail asset valuation</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-white rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Stock Turnover</p>
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">{data?.kpi.stock_turnover}x</div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase opacity-60">Avg. replenishment frequency</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-white rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Depreciation Risk</p>
                            <AlertTriangle className="h-4 w-4 text-rose-400" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">{data?.kpi.depreciation_risk}%</div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase opacity-60">Slow-moving stock segments</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="shadow-sm border-none ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 bg-muted/5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 border-t">
                        <div className="space-y-8">
                            {data?.distribution.map((cat: any, i: number) => {
                                const total = data.kpi.warehouse_value;
                                const pct = (parseFloat(cat.value) / total) * 100;
                                return (
                                    <div key={cat.name} className="space-y-3">
                                        <div className="flex items-baseline justify-between">
                                            <p className="font-black text-sm tracking-tight uppercase">{cat.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {cat.count} SKUs · GH¢{(parseFloat(cat.value) / 1000).toFixed(1)}k
                                            </p>
                                        </div>
                                        <div className="h-3 w-full bg-muted/20 rounded-full overflow-hidden ring-1 ring-border/30">
                                            <div
                                                className={cn("h-full opacity-90 transition-all duration-1000", i % 2 === 0 ? "bg-primary" : "bg-black")}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 bg-rose-500/[0.02]">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Crucial Stock Shortages
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 border-t">
                        <div className="divide-y divide-border/30">
                            {data?.low_stock.map((item: any) => (
                                <div key={item.name} className="p-6 flex items-center justify-between hover:bg-rose-500/[0.02] transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm tracking-tight">{item.name}</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">MSRP: GH¢ {parseFloat(item.retail_price).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-rose-600">{item.stock}</div>
                                        <p className="text-[9px] font-black uppercase text-muted-foreground">Units Left</p>
                                    </div>
                                </div>
                            ))}
                            {data?.low_stock.length === 0 && (
                                <div className="p-10 text-center opacity-40">
                                    <Package className="h-10 w-10 mx-auto mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest">Inventory Fully Optimized</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
