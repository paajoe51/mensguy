"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
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
    Phone,
    Mail,
    Truck,
    Star,
    MoreVertical,
    MapPin,
    Calendar
} from "lucide-react"

// Mock drivers data
const drivers = [
    {
        id: "DRV-001",
        name: "Mike Driver",
        email: "mike@mensguy.com",
        phone: "+233 24 555 0101",
        status: "active",
        trips: 152,
        rating: 4.8,
        vehicle: "MG-TRK-2024",
        location: "Accra Central",
    },
    {
        id: "DRV-002",
        name: "Tom Courier",
        email: "tom@mensguy.com",
        phone: "+233 24 555 0102",
        status: "active",
        trips: 89,
        rating: 4.5,
        vehicle: "MG-VAN-9921",
        location: "Spintex",
    },
    {
        id: "DRV-003",
        name: "Lisa Express",
        email: "lisa@mensguy.com",
        phone: "+233 24 555 0103",
        status: "on-leave",
        trips: 210,
        rating: 4.9,
        vehicle: "MG-MOT-8812",
        location: "Off-duty",
    },
]

export default function DriversPage() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Driver Fleet Management</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your delivery personnel, performance, and vehicle assignments.
                    </p>
                </div>
                <Button className="font-bold text-xs uppercase tracking-widest shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Driver
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-4 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Fleet</p>
                        <p className="text-2xl font-black">12</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-4 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Active Now</p>
                        <p className="text-2xl font-black">8</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-4 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Avg Rating</p>
                        <div className="flex items-center gap-1.5">
                            <p className="text-2xl font-black">4.7</p>
                            <Star className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-4 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Total Deliveries</p>
                        <p className="text-2xl font-black">1.2k</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <Card className="shadow-sm border-none ring-1 ring-border/50">
                <CardHeader className="px-6 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-base font-bold uppercase tracking-widest text-muted-foreground/70">Driver List</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search driver name or phone..."
                                className="pl-9 bg-muted/20 border-none ring-1 ring-border/50 h-9 text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-[0.2em]">Personnel</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Contact</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Assignment</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Activity</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Status</TableHead>
                                <TableHead className="w-12 px-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {drivers.map((driver) => (
                                <TableRow key={driver.id} className="hover:bg-muted/10 transition-colors group">
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-lg border-none ring-1 ring-border/50">
                                                <AvatarFallback className="text-[10px] font-black uppercase tracking-tighter">
                                                    {driver.name.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{driver.name}</p>
                                                <p className="text-[10px] font-mono text-muted-foreground uppercase">{driver.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                                <Phone className="h-3 w-3 text-primary" />
                                                {driver.phone}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {driver.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <Truck className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs font-bold">{driver.vehicle}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[10px] font-bold text-muted-foreground/80 uppercase">{driver.location}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold">{driver.trips} Trips</span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-black uppercase text-muted-foreground">{driver.rating}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge variant={driver.status === "active" ? "active" : "cancelled"} />
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
