"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CompactStatCard } from "@/components/ui/compact-stat-card"
import { Badge } from "@/components/ui/badge"
import {
    Truck,
    MapPin,
    Navigation,
    CheckCircle2,
    AlertTriangle,
    Clock,
    LayoutDashboard
} from "lucide-react"

export function DeliveryDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CompactStatCard
                    title="Out for Delivery"
                    value="4"
                    icon={Truck}
                    variant="primary"
                    trend={{ value: 2, label: "morning runs", isPositive: true }}
                />
                <CompactStatCard
                    title="Deliveries Today"
                    value="12"
                    icon={CheckCircle2}
                    variant="success"
                />
                <CompactStatCard
                    title="Pending Assignment"
                    value="6"
                    icon={Navigation}
                    variant="warning"
                />
                <CompactStatCard
                    title="Delayed Parcels"
                    value="1"
                    icon={AlertTriangle}
                    variant="destructive"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4 text-primary" />
                            Active Delivery Queue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 border-t">
                        <div className="divide-y divide-border/50">
                            {[
                                { id: "DLV-001", customer: "Alice Johnson", addr: "East Legon, Accra", time: "10:30 AM", status: "out-for-delivery" },
                                { id: "DLV-002", customer: "Bob Smith", addr: "Tema Comm 10", time: "11:45 AM", status: "ready" },
                                { id: "DLV-003", customer: "Charlie Davis", addr: "Spintex Road", time: "01:20 PM", status: "ready" },
                            ].map((dlv) => (
                                <div key={dlv.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-muted/30 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm">{dlv.customer}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">{dlv.addr} · {dlv.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-primary">{dlv.time}</p>
                                        <Badge variant="outline" className="text-[9px] uppercase font-bold mt-1 border-primary/20">{dlv.status}</Badge>
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
