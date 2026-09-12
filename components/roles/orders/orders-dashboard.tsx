"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CompactStatCard } from "@/components/ui/compact-stat-card"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingBag,
    Calendar,
    Clock,
    MessageSquare,
    ClipboardList,
    UserCheck,
    Zap
} from "lucide-react"

export function OrdersDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CompactStatCard
                    title="Orders Today"
                    value="8"
                    icon={ShoppingBag}
                    variant="primary"
                    trend={{ value: 4, label: "vs yesterday", isPositive: true }}
                />
                <CompactStatCard
                    title="Pending Approvals"
                    value="14"
                    icon={Clock}
                    variant="warning"
                />
                <CompactStatCard
                    title="Active Installments"
                    value="22"
                    icon={Calendar}
                    variant="indigo"
                />
                <CompactStatCard
                    title="Customer Requests"
                    value="5"
                    icon={MessageSquare}
                    variant="purple"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            Latest Customer Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { id: "REQ-992", customer: "Michael K.", item: "MacBook Pro M3", type: "Overseas", status: "under-review" },
                            { id: "REQ-993", customer: "Sarah B.", item: "Designer Kettle", type: "Installment", status: "pending" },
                        ].map((req, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{req.item}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{req.id} · {req.customer}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="text-[9px] uppercase font-black">{req.type}</Badge>
                                    <button className="h-7 w-7 rounded bg-primary text-white flex items-center justify-center shadow-sm">
                                        <Zap className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                            Team Follow-ups
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { person: "John Doe", task: "Confirm delivery time", priority: "high" },
                            { person: "Jane Smith", task: "Installment agreement", priority: "medium" },
                        ].map((task, i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${task.priority === 'high' ? 'bg-destructive' : 'bg-warning'}`} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold leading-none">{task.person}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight mt-1">{task.task}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
