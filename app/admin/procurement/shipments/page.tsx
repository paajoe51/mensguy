"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Truck,
    Ship,
    Plane,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Box,
    Globe,
    Anchor,
    Navigation
} from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

// Mock shipments data
const shipmentsData = [
    {
        id: "SHP-7721",
        supplier: "Shenzhen Global Electronics",
        origin: "China",
        method: "air",
        trackingNum: "DHL-9928110",
        status: "in-transit",
        items: 45,
        value: 12500,
        estArrival: "Mar 30, 2026",
        priority: "high",
    },
    {
        id: "SHP-8812",
        supplier: "Dubai Tech Hub",
        origin: "UAE",
        method: "air",
        trackingNum: "FX-110293",
        status: "customs",
        items: 12,
        value: 8400,
        estArrival: "Mar 28, 2026",
        priority: "medium",
    },
    {
        id: "SHP-6610",
        supplier: "Turkey Textile Center",
        origin: "Turkey",
        method: "sea",
        trackingNum: "MSC-700192",
        status: "ordered",
        items: 120,
        value: 15500,
        estArrival: "Apr 15, 2026",
        priority: "low",
    },
    {
        id: "SHP-9905",
        supplier: "Amazon US Wholesale",
        origin: "USA",
        method: "air",
        trackingNum: "UPS-00129",
        status: "arrived",
        items: 5,
        value: 3200,
        estArrival: "Mar 24, 2026",
        priority: "high",
    },
    {
        id: "SHP-5542",
        supplier: "Ebay UK Sellers",
        origin: "UK",
        method: "sea",
        trackingNum: "MAERSK-991",
        status: "in-transit",
        items: 28,
        value: 5600,
        estArrival: "Apr 05, 2026",
        priority: "medium",
    },
]

export default function ShipmentsPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredShipments = shipmentsData.filter(s =>
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.trackingNum.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getMethodIcon = (method: string) => {
        switch (method) {
            case "air": return <Plane className="h-3.5 w-3.5" />
            case "sea": return <Ship className="h-3.5 w-3.5" />
            default: return <Truck className="h-3.5 w-3.5" />
        }
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Shipments Tracking</h1>
                    <p className="text-muted-foreground">
                        Monitor international logistics and inbound procurement pipeline.
                    </p>
                </div>
                <Button className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Shipment
                </Button>
            </div>

            {/* Analytics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-indigo-50/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">In Transit</p>
                            <Navigation className="h-4 w-4 text-indigo-500 animate-pulse" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">3</div>
                            <span className="text-xs text-muted-foreground">Active voyages</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-amber-50/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-semibold text-amber-600 uppercase tracking-widest">At Customs</p>
                            <Anchor className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">1</div>
                            <span className="text-xs text-amber-600 font-medium">Pending clearance</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-emerald-50/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Arriving Soon</p>
                            <Clock className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">2</div>
                            <span className="text-xs text-emerald-600 font-medium">Within 7 days</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-slate-50/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-widest">Total Pipeline</p>
                            <Box className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">GH¢45.3k</div>
                            <span className="text-xs text-muted-foreground">Inbound value</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Shipments Table */}
            <Card className="shadow-sm border-none ring-1 ring-border/50">
                <CardHeader className="pb-3 px-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search ID, Supplier, or Tracking..."
                                className="pl-9 bg-muted/20 border-none ring-1 ring-border/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-9 border-none ring-1 ring-border/50">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Shipment ID</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Supplier & Origin</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Logistics</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Items/Value</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Est. Arrival</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider">Status</TableHead>
                                <TableHead className="text-right px-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredShipments.map((shp) => (
                                <TableRow key={shp.id} className="cursor-pointer hover:bg-muted/20 transition-colors group">
                                    <TableCell className="px-6 py-4">
                                        <div>
                                            <p className="font-black text-sm text-foreground">{shp.id}</p>
                                            {shp.priority === "high" && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertTriangle className="h-3 w-3 text-destructive" />
                                                    <span className="text-[10px] font-bold text-destructive uppercase">Priority</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold">{shp.supplier}</p>
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <Globe className="h-3 w-3" />
                                                <span className="text-[11px] font-medium">{shp.origin}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <Badge variant="outline" className="text-[10px] h-5 gap-1 font-bold border-muted-foreground/20">
                                                    {getMethodIcon(shp.method)}
                                                    {shp.method.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] font-mono text-muted-foreground uppercase">{shp.trackingNum}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">{shp.items} Items</p>
                                            <p className="text-xs text-muted-foreground font-medium">GH¢{shp.value.toLocaleString()}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{shp.estArrival}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Scheduled</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge variant={
                                            shp.status === "ordered" ? "pending" :
                                                shp.status === "in-transit" ? "in-transit" :
                                                    shp.status === "customs" ? "overseas" :
                                                        shp.status === "arrived" ? "delivered" :
                                                            "cancelled"
                                        } />
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background shadow-sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredShipments.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold">No shipments found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto text-sm mt-1">
                                We couldn't find any shipments matching your current search or filters.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
