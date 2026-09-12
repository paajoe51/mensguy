"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CompactStatCard } from "@/components/ui/compact-stat-card"
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    FileCheck,
    Building2,
    PieChart
} from "lucide-react"

export function AccountsDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CompactStatCard
                    title="Total Invested Capital"
                    value="GH¢ 245,000"
                    icon={Building2}
                    variant="primary"
                    trend={{ value: 2.5, label: "from last month", isPositive: true }}
                />
                <CompactStatCard
                    title="Available Funds"
                    value="GH¢ 89,450"
                    icon={Wallet}
                    variant="success"
                />
                <CompactStatCard
                    title="Total Expenditure"
                    value="GH¢ 12,200"
                    icon={TrendingDown}
                    variant="destructive"
                    trend={{ value: 12, label: "vs last month", isPositive: false }}
                />
                <CompactStatCard
                    title="Net Profit"
                    value="GH¢ 42,300"
                    icon={PieChart}
                    variant="indigo"
                    trend={{ value: 8.4, label: "growth", isPositive: true }}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-emerald-600" />
                            Pending Finance Approvals
                        </CardTitle>
                        <CardDescription>Expenditure requests requiring head office authorization.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* List of pending approvals */}
                        <div className="space-y-4">
                            {[
                                { id: "EXP-889", desc: "Sourcing for iPhone Batch 02", amount: "GH¢ 14,500", date: "Mar 25" },
                                { id: "EXP-890", desc: "Warehouse Rental - Accra North", amount: "GH¢ 2,500", date: "Mar 24" },
                            ].map((req) => (
                                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{req.desc}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase">{req.id} · Submitted {req.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-foreground">{req.amount}</span>
                                        <div className="flex gap-1.5">
                                            <button className="h-7 w-7 rounded bg-success/10 text-success flex items-center justify-center hover:bg-success/20 transition-colors">
                                                <TrendingUp className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-indigo-600" />
                            Recent Cash Flow
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { type: "in", label: "Installment - ORD-102", amount: "+ ¢1,200", date: "2h ago" },
                                { type: "out", label: "Fuel - Delivery Fleet", amount: "- ¢450", date: "5h ago" },
                                { type: "in", label: "Pre-order - ORD-105", amount: "+ ¢3,500", date: "1d ago" },
                            ].map((entry, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${entry.type === 'in' ? 'bg-success' : 'bg-destructive'}`} />
                                        <span className="text-xs font-semibold">{entry.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-bold ${entry.type === 'in' ? 'text-success' : 'text-destructive'}`}>{entry.amount}</p>
                                        <p className="text-[10px] text-muted-foreground">{entry.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
