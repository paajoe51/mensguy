"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
    Search,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    Calendar,
    DollarSign,
    FileText,
    ChevronLeft,
    Loader2,
    RefreshCw
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
import { cn } from "@/lib/utils"

export default function TransactionsLedgerPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/finance.php?type=transactions")
            setTransactions(res.data)
        } catch (e: any) {
            toast.error("Failed to load ledger entries")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const filtered = transactions.filter(tx =>
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.method.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0)
    const expenses = transactions.filter(t => t.type === 'expense' && t.status === 'approved').reduce((acc, t) => acc + parseFloat(t.amount), 0)

    if (loading && transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Unified Ledger...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-1">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-2xl hover:bg-muted ring-1 ring-border/50">
                        <Link href="/admin/finance">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Transaction Ledger</h1>
                        <p className="text-muted-foreground text-sm font-medium">Detailed audit trail of all verified income and business expenditure.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadData}>
                        <RefreshCw className={cn("h-3.5 w-3.5 opacity-50", loading && "animate-spin")} />
                        Reload
                    </Button>
                    <Button className="h-12 px-8 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl rounded-2xl">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-emerald-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Aggregate Income</p>
                            <ArrowUpRight className="h-5 w-5 text-emerald-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {income.toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Verified payments processed</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-rose-500/[0.03] rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Approved Expenses</p>
                            <ArrowDownRight className="h-5 w-5 text-rose-500/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {expenses.toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Authorized business spending</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-border/50 bg-primary/5 rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Liquidity Yield</p>
                            <TrendingUp className="h-5 w-5 text-primary/50" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">GH¢ {(income - expenses).toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase opacity-60">Net operating cash flow</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-border/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-muted/5 px-10 py-8 border-b border-border/50">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
                            <Input
                                placeholder="Filter ledger by ID, Category..."
                                className="pl-9 h-12 bg-muted/10 border-none ring-1 ring-border/50 text-[10px] font-bold rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-10 px-4 font-black uppercase text-[10px] tracking-widest border-none ring-1 ring-border/50 rounded-xl">
                            <Filter className="mr-2 h-3.5 w-3.5" />
                            Global Filters
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest">TX Identifier</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Category</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Process Method</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Execution Date</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-widest font-black">Net Yield</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((tx) => (
                                    <TableRow key={tx.id} className="hover:bg-muted/5 border-b border-border/30 transition-colors">
                                        <td className="pl-10 py-6 font-black text-[10px] tracking-widest uppercase">{tx.id}</td>
                                        <td>
                                            <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-muted/30 border-none px-2 py-0.5">
                                                {tx.category}
                                            </Badge>
                                        </td>
                                        <td className="text-[10px] font-bold text-muted-foreground uppercase">{tx.method}</td>
                                        <td className="text-[10px] font-bold uppercase">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <StatusBadge
                                                variant={tx.status === "completed" || tx.status === "approved" ? "completed" : "pending"}
                                            />
                                        </td>
                                        <td className={cn(
                                            "text-right pr-10 font-black tracking-tighter text-sm",
                                            tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                                        )}>
                                            {tx.type === "income" ? "+" : "-"} GH¢{parseFloat(tx.amount).toLocaleString()}
                                        </td>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
