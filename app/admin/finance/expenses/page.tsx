"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
    Filter,
    Plus,
    Download,
    TrendingDown,
    Calendar,
    Receipt,
    Tag,
    CheckCheck,
    MoreHorizontal,
    Loader2,
    RefreshCw,
    XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"

export default function ExpensesPage() {
    const { user } = useAuth()
    const [expenses, setExpenses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [approving, setApproving] = useState<string | null>(null)

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/finance.php?type=expenses")
            setExpenses(res.data)
        } catch (e: any) {
            toast.error("Failed to load expenses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
        setApproving(id)
        try {
            await fetchApi("/finance.php", {
                method: "PUT",
                body: JSON.stringify({
                    id,
                    status,
                    approver_id: user?.id
                })
            })
            toast.success(`Expense ${status.toLowerCase()} successfully`)
            loadData()
        } catch (e: any) {
            toast.error(e.message || "Action failed")
        } finally {
            setApproving(null)
        }
    }

    const filtered = expenses.filter(exp =>
        exp.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pendingTotal = expenses.filter(e => e.approval_status === "Pending").reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
    const approvedTotal = expenses.filter(e => e.approval_status === "Approved").reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

    if (loading && expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Expenditure Ledger...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Expense Management</h1>
                    <p className="text-muted-foreground text-sm font-medium">Coordinate business expenditure and logistics costs.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadData}>
                        <RefreshCw className={cn("h-3.5 w-3.5 opacity-50", loading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button className="h-12 px-8 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl">
                        <Download className="mr-2 h-4 w-4" />
                        Audit Log
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-rose-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Authorized Spend</p>
                            <TrendingDown className="h-5 w-5 text-rose-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {approvedTotal.toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Verified disbursements</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-indigo-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Pending Review</p>
                            <Receipt className="h-5 w-5 text-indigo-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {pendingTotal.toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">{expenses.filter(e => e.approval_status === "Pending").length} Request(s) await approval</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-emerald-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Logistics Ratio</p>
                            <Tag className="h-5 w-5 text-emerald-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">68%</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Of total business cost</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-muted/5 px-10 py-8 border-b border-border/50">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
                            <Input
                                placeholder="Search by recipient or category..."
                                className="pl-9 h-12 bg-muted/10 border-none ring-1 ring-border/50 text-[10px] font-bold rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-10 px-4 font-black uppercase text-[10px] tracking-widest border-none ring-1 ring-border/50 rounded-xl">
                            <Filter className="mr-2 h-3.5 w-3.5" />
                            Type Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest">Allocation Detail</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Category</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Recording Officer</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right">Amount</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Protocol</TableHead>
                                <TableHead className="pr-10 font-black text-[10px] uppercase tracking-widest text-right">Approval Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((exp) => (
                                <TableRow key={exp.id} className={cn("hover:bg-muted/5 border-b border-border/30 transition-colors", exp.approval_status === "Pending" && "bg-primary/5")}>
                                    <TableCell className="pl-10 py-6">
                                        <div className="space-y-1">
                                            <p className="font-black text-sm tracking-tight uppercase">{exp.notes || "No Narration Provided"}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground uppercase opacity-60">ID: EXP-{exp.id} · Dt: {new Date(exp.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-muted/30 border-none px-2 py-0.5">
                                            {exp.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-bold uppercase text-primary/70">{exp.officer || "SYSTEM"}</TableCell>
                                    <TableCell className="text-right font-black tracking-tighter text-sm">GH¢ {parseFloat(exp.amount).toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                        <StatusBadge variant={exp.approval_status === "Approved" ? "delivered" : exp.approval_status === "Rejected" ? "cancelled" : "pending"} />
                                    </TableCell>
                                    <TableCell className="pr-10 text-right">
                                        {exp.approval_status === "Pending" ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAction(exp.id, 'Rejected')}
                                                    disabled={approving === exp.id}
                                                    className="h-9 px-4 bg-muted text-muted-foreground hover:bg-rose-500 hover:text-white font-black text-[9px] uppercase tracking-widest border-none rounded-xl"
                                                >
                                                    <XCircle className="h-3.5 w-3.5 mr-2" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAction(exp.id, 'Approved')}
                                                    disabled={approving === exp.id}
                                                    className="h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-widest shadow-xl rounded-xl"
                                                >
                                                    {approving === exp.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5 mr-2" />}
                                                    Authorize
                                                </Button>
                                            </div>
                                        ) : (
                                            <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40">Entry Finalized</p>
                                        )}
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
