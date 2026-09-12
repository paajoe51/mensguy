"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    History,
    ShoppingCart,
    CreditCard,
    MessageSquare,
    MoreHorizontal,
    Edit,
    ShieldAlert,
    Loader2,
    RefreshCw,
    Wallet
} from "lucide-react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [customer, setCustomer] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const loadCustomer = async () => {
        try {
            const res = await fetchApi(`/customers.php?id=${id}`)
            setCustomer(res.data)
        } catch (e: any) {
            toast.error(e.message || "Failed to load profile")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadCustomer() }, [id])

    if (loading) return <div className="flex justify-center py-24"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
    if (!customer) return <div className="text-center py-24 font-black uppercase tracking-[0.3em] opacity-20 text-2xl">Intelligence Lost</div>

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between sticky top-0 z-30 -mx-4 px-4 py-6 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 bg-muted/20 hover:bg-black hover:text-white transition-all">
                        <Link href="/admin/customers">
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Customer Briefing</h1>
                            <StatusBadge variant={customer.user_status.toLowerCase() as any} />
                        </div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Operational ID: {customer.id} · Active since {new Date(customer.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-none ring-1 ring-border/50 font-black text-xs uppercase tracking-widest" onClick={loadCustomer}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading && 'animate-spin'}`} />
                        Sync Intel
                    </Button>
                    <Button className="h-12 px-8 rounded-2xl bg-black text-white hover:bg-primary transition-all font-black text-xs uppercase tracking-widest shadow-xl">
                        <Edit className="mr-2 h-4 w-4" />
                        Modify Record
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Profile Identity */}
                <div className="space-y-8">
                    <Card className="rounded-[3rem] border-none ring-1 ring-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-black p-10 flex flex-col items-center">
                            <Avatar className="h-32 w-32 ring-4 ring-white/10 shadow-2xl">
                                <AvatarFallback className="bg-primary text-black text-3xl font-black italic">{customer.first_name?.[0]}{customer.last_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="mt-6 text-center">
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight">{customer.first_name} {customer.last_name}</h2>
                                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">{customer.email}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            {[
                                { icon: Phone, label: "Secure Mobile", value: customer.phone },
                                { icon: MapPin, label: "Primary Logistics Coord", value: customer.address || "No address on record" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-3xl bg-muted/10">
                                    <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                        <p className="text-xs font-bold leading-relaxed">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full h-14 rounded-3xl bg-muted/20 text-black hover:bg-black hover:text-white transition-all font-black text-xs uppercase tracking-widest border-none" asChild>
                                <Link href={`/admin/finance/statements/${customer.id}`}>Generate Ledger</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none ring-1 ring-border/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <Wallet className="h-4 w-4" /> Financial Depth
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {[
                                { label: "Lifetime Valuation", value: `GH¢ ${Number(customer.total_spent).toLocaleString()}`, highlight: true },
                                { label: "Network Liability", value: `GH¢ ${Number(customer.outstanding_balance).toLocaleString()}`, warn: Number(customer.outstanding_balance) > 0 },
                                { label: "Transaction Count", value: customer.orders_count },
                            ].map((stat, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-border/30 last:border-none">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                                    <span className={`font-black tracking-tighter ${stat.highlight ? 'text-xl' : 'text-base'} ${stat.warn ? 'text-warning' : ''}`}>{stat.value}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Interaction History */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[3rem] border-none ring-1 ring-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/10 p-8 border-b border-border/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tighter uppercase italic">Recent Acquisitions</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Latest tactical maneuvers by this client</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild className="rounded-xl border-none ring-1 ring-border/50 bg-white font-black text-[9px] uppercase tracking-widest">
                                    <Link href="/admin/orders">Archive</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/5">
                                    <TableRow className="border-none">
                                        <TableHead className="pl-8">Operation ID</TableHead>
                                        <TableHead>System Entry</TableHead>
                                        <TableHead>Valuation</TableHead>
                                        <TableHead>Logistics Status</TableHead>
                                        <TableHead className="pr-8 w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customer.recent_orders?.length > 0 ? customer.recent_orders.map((order: any) => (
                                        <TableRow key={order.id} className="group border-b border-border/30 last:border-none hover:bg-muted/5 transition-colors">
                                            <TableCell className="pl-8">
                                                <Link href={`/admin/orders/${order.id}`} className="font-black text-xs text-primary hover:underline italic tracking-tighter">
                                                    {order.order_number}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-black">GH¢ {Number(order.total_amount).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <StatusBadge variant={order.status.toLowerCase() as any} />
                                            </TableCell>
                                            <TableCell className="pr-8">
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic font-medium">No tactical history detected.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[3rem] border-none ring-1 ring-border/50 shadow-sm">
                        <CardHeader className="p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tighter uppercase italic">Strategic Notes</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Internal intelligence and behavioral logs</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="p-8 rounded-[2rem] bg-amber-50/50 border border-amber-100/50 space-y-4">
                                <div className="flex items-center gap-2 text-amber-600">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Priority Intel</span>
                                </div>
                                <p className="text-sm font-medium text-amber-900 leading-relaxed italic">
                                    "{customer.notes || "No operational notes recorded for this identity."}"
                                </p>
                            </div>
                            <Button variant="ghost" className="w-full mt-6 h-14 rounded-2xl border-dashed border-2 border-border/50 hover:border-black/20 hover:bg-black/5 transition-all font-black text-xs uppercase tracking-widest">
                                Append Intel Log
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
