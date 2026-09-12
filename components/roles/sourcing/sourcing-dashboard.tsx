"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CompactStatCard } from "@/components/ui/compact-stat-card"
import { Badge } from "@/components/ui/badge"
import {
    Globe,
    Package,
    Truck,
    Ship,
    Plane,
    AlertCircle,
    Link,
    Users
} from "lucide-react"

export function SourcingDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CompactStatCard
                    title="Overseas Requests"
                    value="12"
                    icon={Globe}
                    variant="primary"
                    trend={{ value: 15, label: "spike today", isPositive: true }}
                />
                <CompactStatCard
                    title="Active Shipments"
                    value="5"
                    icon={Truck}
                    variant="info"
                />
                <CompactStatCard
                    title="Total Suppliers"
                    value="18"
                    icon={Users}
                    variant="success"
                />
                <CompactStatCard
                    title="Low Stock SKUs"
                    value="4"
                    icon={AlertCircle}
                    variant="warning"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            Unprocessed Procurement Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { id: "REQ-201", item: "Solar Panel System", supplier: "Multiple", value: "¢4,200", status: "pending" },
                            { id: "REQ-202", item: "Gaming Keyboard Pro", supplier: "Shenzhen Electronics", value: "¢350", status: "review" },
                        ].map((req, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{req.item}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{req.id} · {req.supplier}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="text-[9px] uppercase font-black">{req.status}</Badge>
                                    <button className="text-primary hover:underline text-xs font-bold">Process</button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Ship className="h-4 w-4 text-emerald-600" />
                            Active Voyage Tracking
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { id: "SHP-001", mode: "Sea", origin: "Turkey", est: "Apr 15" },
                            { id: "SHP-002", mode: "Air", origin: "UAE", est: "Mar 28" },
                        ].map((v, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {v.mode === 'Air' ? <Plane className="h-4 w-4 text-muted-foreground" /> : <Ship className="h-4 w-4 text-muted-foreground" />}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{v.id}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase">{v.origin} → Accra</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold">{v.est}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">EST. ARRIVAL</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
