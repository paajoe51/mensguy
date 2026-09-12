"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Search,
    Filter,
    MoreHorizontal,
    Calendar,
    AlertTriangle,
    CreditCard,
    Bell,
    CheckCircle2,
    ExternalLink,
    User,
    ShoppingBag,
    ArrowUpRight,
    Hash,
    Loader2,
    RefreshCw,
    Plus
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"

export default function InstallmentsPage() {
    const { user } = useAuth()
    const [installments, setInstallments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
    const [customerFilter, setCustomerFilter] = useState("")
    const [recording, setRecording] = useState(false)
    const [paymentForm, setPaymentForm] = useState({
        method: "Mobile Money",
        transactionId: "",
        amount: "",
    })

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/finance.php?type=installments")
            setInstallments(res.data)
        } catch (e: any) {
            toast.error("Failed to load installments")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const filteredPlans = installments.filter(plan => {
        const fullName = `${plan.first_name} ${plan.last_name}`.toLowerCase()
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            plan.id.toString().includes(searchQuery) ||
            plan.item_name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || plan.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const handleLogPayment = async () => {
        if (!selectedPlanId) return
        setRecording(true)
        try {
            await fetchApi("/finance.php?type=installment_payment", {
                method: "POST",
                body: JSON.stringify({
                    plan_id: selectedPlanId,
                    amount: paymentForm.amount,
                    method: paymentForm.method,
                    transaction_id: paymentForm.transactionId,
                    officer_id: user?.id
                })
            })
            toast.success("Payment recorded and ledger updated")
            setIsModalOpen(false)
            loadData()
            setSelectedPlanId(null)
            setPaymentForm({ method: "Mobile Money", transactionId: "", amount: "" })
        } catch (e: any) {
            toast.error(e.message || "Failed to record payment")
        } finally {
            setRecording(false)
        }
    }

    const openModalWithPlan = (id: string, balance: number) => {
        setSelectedPlanId(id)
        setPaymentForm(prev => ({ ...prev, amount: balance.toString() }))
        setIsModalOpen(true)
    }

    const activeCount = installments.filter(p => p.status === "Active").length
    const overdueCount = installments.filter(p => {
        const dueDate = new Date(p.due_date)
        return p.status === "Active" && dueDate < new Date()
    }).length
    const totalOutstanding = installments.reduce((acc, curr) => acc + parseFloat(curr.outstanding_balance), 0)

    if (loading && installments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Installment Portfolio...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Installment Portfolio</h1>
                    <p className="text-muted-foreground text-sm font-medium">Monitor payment plans, track defaults, and manage active collections.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadData}>
                        <RefreshCw className={cn("h-3.5 w-3.5 opacity-50", loading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="h-12 px-8 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Log Payment
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md bg-white border-none shadow-2xl p-0 overflow-hidden rounded-[2.5rem] ring-1 ring-border/50">
                    <div className="bg-black p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CreditCard className="h-24 w-24" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter mb-2">Record Payment</DialogTitle>
                        <DialogDescription className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Post transaction to customer's financial plan</DialogDescription>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Search Active Plan</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Customer name or Order #"
                                    className="pl-9 h-12 bg-muted/20 border-none ring-1 ring-border/50 rounded-xl text-xs font-bold"
                                    value={customerFilter}
                                    onChange={(e) => setCustomerFilter(e.target.value)}
                                />
                            </div>
                            <ScrollArea className="h-[140px] rounded-xl border border-border/50 p-1 bg-muted/5 mt-2">
                                <div className="space-y-1">
                                    {installments.filter(p => p.status !== "Completed" && (`${p.first_name} ${p.last_name}`.toLowerCase().includes(customerFilter.toLowerCase()) || p.order_number.includes(customerFilter))).map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => {
                                                setSelectedPlanId(plan.id)
                                                setPaymentForm(prev => ({ ...prev, amount: plan.outstanding_balance }))
                                            }}
                                            className={cn(
                                                "w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group",
                                                selectedPlanId === plan.id ? "bg-primary text-white shadow-lg" : "hover:bg-muted"
                                            )}
                                        >
                                            <div>
                                                <p className="text-xs font-black tracking-tight uppercase">{plan.first_name} {plan.last_name}</p>
                                                <p className={cn("text-[9px] font-bold uppercase tracking-widest opacity-60", selectedPlanId === plan.id ? "text-white" : "text-muted-foreground")}>{plan.order_number} · Bal: GH¢{parseFloat(plan.outstanding_balance).toLocaleString()}</p>
                                            </div>
                                            {selectedPlanId === plan.id && <CheckCircle2 className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Method</Label>
                                <Select value={paymentForm.method} onValueChange={(val) => setPaymentForm(prev => ({ ...prev, method: val }))}>
                                    <SelectTrigger className="h-12 bg-muted/20 border-none ring-1 ring-border/50 font-bold text-[10px] uppercase rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mobile Money">MTN Momo</SelectItem>
                                        <SelectItem value="Telecel Cash">Telecel Cash</SelectItem>
                                        <SelectItem value="Cash">Direct Cash</SelectItem>
                                        <SelectItem value="Manual Transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Amount (GH¢)</Label>
                                <Input
                                    type="number"
                                    className="h-12 bg-muted/20 border-none ring-1 ring-border/50 font-black text-sm rounded-xl"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Ref / Transaction ID</Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-40" />
                                <Input
                                    placeholder="MOMO_REF_XXXX"
                                    className="pl-9 h-12 bg-muted/20 border-none ring-1 ring-border/50 font-mono text-xs font-black uppercase rounded-xl"
                                    value={paymentForm.transactionId}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-muted/5 border-t border-border/10">
                        <Button
                            variant="ghost"
                            className="font-black text-[10px] uppercase tracking-widest h-12 flex-1 rounded-xl"
                            onClick={() => setIsModalOpen(false)}
                            disabled={recording}
                        >
                            Dismiss
                        </Button>
                        <Button
                            className="bg-primary font-black text-[10px] uppercase tracking-widest shadow-xl h-12 flex-1 rounded-xl"
                            disabled={!selectedPlanId || !paymentForm.amount || !paymentForm.transactionId || recording}
                            onClick={handleLogPayment}
                        >
                            {recording ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post Transaction"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-indigo-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Active Pipeline</p>
                            <Calendar className="h-5 w-5 text-indigo-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">{activeCount} Plan(s)</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Currently servicing</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-rose-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Collection Risk</p>
                            <AlertTriangle className="h-5 w-5 text-rose-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">{overdueCount} Default(s)</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Past due date threshold</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-emerald-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Portfolio Equity</p>
                            <ArrowUpRight className="h-5 w-5 text-emerald-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {(totalOutstanding / 1000).toFixed(1)}k</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Total uncollected capital</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-muted/5 px-10 py-8 border-b border-border/50">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
                            <Input
                                placeholder="Filter portfolio by customer or item..."
                                className="pl-9 h-12 bg-muted/10 border-none ring-1 ring-border/50 text-[10px] font-bold rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] h-10 text-[10px] uppercase font-black bg-white/50 border-none ring-1 ring-border/50 rounded-xl">
                                    <SelectValue placeholder="Protocol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Global Flow</SelectItem>
                                    <SelectItem value="Active">Active Plans</SelectItem>
                                    <SelectItem value="Completed">Settled Plans</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" className="h-10 w-10 border-none ring-1 ring-border/50 rounded-xl">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 border-t border-border/50">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest">Customer & Asset</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Realized Capital</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Outstanding</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Plan Progress</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Temporal Status</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Protocol</TableHead>
                                <TableHead className="w-12 px-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlans.map((plan) => {
                                const total = parseFloat(plan.total_amount)
                                const paid = parseFloat(plan.amount_paid)
                                const prog = Math.min(Math.round((paid / total) * 100), 100)
                                const isOverdue = new Date(plan.due_date) < new Date() && plan.status === 'Active'

                                return (
                                    <TableRow key={plan.id} className="hover:bg-muted/5 border-b border-border/30 transition-colors group">
                                        <TableCell className="pl-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                                                    <ShoppingBag className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm tracking-tight uppercase italic">{plan.first_name} {plan.last_name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">{plan.order_number} · {plan.item_name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm font-black tracking-tight text-emerald-600">GH¢{paid.toLocaleString()}</p>
                                            <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Total Received</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm font-black tracking-tight text-rose-600">GH¢{parseFloat(plan.outstanding_balance).toLocaleString()}</p>
                                            <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Uncollected</p>
                                        </TableCell>
                                        <TableCell className="w-[180px]">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                                    <span>Yield</span>
                                                    <span>{prog}%</span>
                                                </div>
                                                <Progress value={prog} className="h-1.5 bg-muted rounded-full overflow-hidden" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {plan.status === 'Completed' ? (
                                                <Badge className="bg-emerald-500 text-white font-black text-[8px] uppercase tracking-tighter px-2">Settled</Badge>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className={cn("text-xs font-black uppercase tracking-tight", isOverdue ? "text-rose-600" : "text-black")}>{new Date(plan.due_date).toLocaleDateString()}</span>
                                                    <span className="text-[9px] font-black text-muted-foreground/40 uppercase">Periodic Deadline</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge variant={plan.status === "Active" ? (isOverdue ? "processing" : "active") : "completed"} />
                                        </TableCell>
                                        <TableCell className="px-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-black hover:text-white rounded-xl transition-all shadow-sm ring-1 ring-border/5">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl ring-1 ring-border/50 p-2">
                                                    <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 py-3 px-4">Plan Protocol</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild className="rounded-xl py-3 px-4 font-bold text-xs cursor-pointer">
                                                        <Link href={`/admin/orders/${plan.order_id}`}>
                                                            <ExternalLink className="mr-3 h-4 w-4 opacity-40" />
                                                            Audit Parent Order
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {plan.status !== 'Completed' && (
                                                        <DropdownMenuItem
                                                            onClick={() => openModalWithPlan(plan.id, parseFloat(plan.outstanding_balance))}
                                                            className="rounded-xl py-3 px-4 font-black text-xs text-primary cursor-pointer hover:bg-primary/5"
                                                        >
                                                            <CreditCard className="mr-3 h-4 w-4" />
                                                            Inject Payment
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="rounded-xl py-3 px-4 font-black text-xs text-rose-600 cursor-pointer">
                                                        <Bell className="mr-3 h-4 w-4 opacity-40" />
                                                        Dispatch Penalty SMS
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="border-none ring-1 ring-rose-500/20 bg-rose-500/[0.02] rounded-[2rem] overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                        <div className="h-12 w-12 rounded-[1.2rem] bg-rose-500/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-6 w-6 text-rose-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Recovery Enforcement Protocol</p>
                            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase opacity-60">
                                Installment defaults beyond the 7-day grace period trigger automated notifications.
                                Persistent delinquency allows for a 30% operational fee deduction upon item repossession
                                as per MENSGUY IMPORT LTD standard corporate terms.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
