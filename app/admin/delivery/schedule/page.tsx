"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Truck,
    MapPin,
    User,
    AlertCircle,
    Plus
} from "lucide-react"

export default function DeliverySchedulePage() {
    const [currentDate, setCurrentDate] = useState("March 26, 2026")

    const slots = [
        { time: "09:00 AM", task: "DEL-005", destination: "Kumasi Central", driver: "Mike Driver", status: "completed" },
        { time: "11:30 AM", task: "DEL-008", destination: "East Legon", driver: "Mike Driver", status: "in-transit" },
        { time: "02:00 PM", task: "DEL-012", destination: "Spintex Road", driver: "Lisa Express", status: "pending" },
        { time: "04:30 PM", task: "DEL-015", destination: "Tema Harbour", driver: "Tom Courier", status: "pending" },
    ]

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Logistics Scheduler</h1>
                    <p className="text-muted-foreground text-sm">
                        Optimize routes and manage daily dispatch windows.
                    </p>
                </div>
                <Button className="font-bold text-xs uppercase tracking-widest shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Assign Route
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Calendar Control */}
                <Card className="lg:col-span-1 shadow-sm border-none ring-1 ring-border/50">
                    <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Timeline</CardTitle>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <p className="text-lg font-black tracking-tight">{currentDate}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-7 gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black text-muted-foreground/50 py-2">{d}</div>
                            ))}
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`text-center text-xs font-bold py-2 rounded-md cursor-pointer transition-colors ${i + 1 === 26 ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule List */}
                <Card className="lg:col-span-2 shadow-sm border-none ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Daily Dispatch</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 border-t">
                        <div className="divide-y divide-border/50">
                            {slots.map((slot) => (
                                <div key={slot.task} className="p-4 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                                    <div className="flex flex-col items-center pt-1 min-w-[70px]">
                                        <span className="text-xs font-black tracking-tight">{slot.time}</span>
                                        <Clock className="h-3 w-3 text-muted-foreground/50 mt-1" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{slot.task}</p>
                                                <div className="flex items-center gap-1.5 opacity-60 mt-0.5">
                                                    <MapPin className="h-3 w-3 text-primary" />
                                                    <span className="text-[11px] font-medium">{slot.destination}</span>
                                                </div>
                                            </div>
                                            <Badge variant={slot.status === "completed" ? "default" : slot.status === "in-transit" ? "secondary" : "outline"} className="text-[9px] font-black uppercase tracking-widest">
                                                {slot.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[11px] font-bold text-muted-foreground/80 uppercase">{slot.driver}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Truck className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-tighter">MG-TRK-2024</span>
                                            </div>
                                        </div>
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
