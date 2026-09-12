"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ShieldCheck,
    Mail,
    Lock,
    MoreHorizontal,
    UserPlus,
    CheckCircle2,
    XCircle,
    Info,
    ShieldAlert,
    Eye,
    Zap,
    Scale,
    Loader2,
    RefreshCw,
    User
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

const OFFICIAL_ROLES = [
    { id: "Administrator", name: "Administrator", description: "Universal platform control and system configuration." },
    { id: "Accounts Head", name: "Accounts Head", description: "Executive financial oversight and expenditure final approval." },
    { id: "Accounts Officer", name: "Accounts Officer", description: "Ledger entries, payment verification, and daily bookkeeping." },
    { id: "Product Sourcing Officer", name: "Product Sourcing Officer", description: "International supplier relations and procurement pipeline." },
    { id: "Order Manager", name: "Order Manager", description: "Customer fulfillment, installment plans, and sales operations." },
    { id: "Delivery Personnel", name: "Delivery Personnel", description: "Final-mile logistics, dispatch, and route execution." },
]

const MODULES = [
    "Executive Dashboard",
    "Finance Ledger",
    "Expenditure Approval",
    "Procurement / Sourcing",
    "Installment Config",
    "Logistics / Dispatch",
    "Staff & Governance"
]

const ROLE_MAP: Record<string, string> = {
    "Administrator": "admin",
    "Accounts Head": "accounts_head",
    "Accounts Officer": "accounts_officer",
    "Product Sourcing Officer": "sourcing_officer",
    "Order Manager": "order_manager",
    "Delivery Personnel": "delivery"
}

export default function StaffPage() {
    const [staff, setStaff] = useState<any[]>([])
    const [permissions, setPermissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [permLoading, setPermLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [updatingPerm, setUpdatingPerm] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const loadStaff = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/staff.php")
            setStaff(res.data || [])
        } catch (e: any) {
            toast.error(e.message || "Failed to load staff records")
        } finally {
            setLoading(false)
        }
    }

    const loadPermissions = async () => {
        setPermLoading(true)
        try {
            const res = await fetchApi("/permissions.php")
            setPermissions(res.data || [])
        } catch (e: any) {
            toast.error(e.message || "Failed to load permission matrix")
        } finally {
            setPermLoading(false)
        }
    }

    useEffect(() => {
        loadStaff()
        loadPermissions()
    }, [])

    const handleOnboard = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)

        setSubmitting(true)
        try {
            await fetchApi("/staff.php", {
                method: "POST",
                body: JSON.stringify(data)
            })
            toast.success("Personnel onboarded successfully")
            setOpen(false)
            loadStaff()
        } catch (e: any) {
            toast.error(e.message || "Onboarding failed")
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdatePermission = async (role: string, module: string, newLevel: string) => {
        const key = `${role}-${module}`
        setUpdatingPerm(key)
        try {
            await fetchApi("/permissions.php", {
                method: "PUT",
                body: JSON.stringify({ role, module, level: newLevel })
            })
            toast.success(`Access level adjusted for ${role}`)
            loadPermissions()
        } catch (e: any) {
            toast.error(e.message || "Adjustment failed")
        } finally {
            setUpdatingPerm(null)
        }
    }

    const getPermissionLevel = (role: string, module: string) => {
        const found = permissions.find(p => p.role === role && p.module === module)
        return found ? found.level : 'none'
    }

    const handleRevoke = async (id: number) => {
        if (!confirm("Are you sure you want to revoke all access for this personnel?")) return
        try {
            await fetchApi(`/staff.php?id=${id}`, { method: "DELETE" })
            toast.success("Access revoked")
            loadStaff()
        } catch (e: any) {
            toast.error(e.message || "Revoke failed")
        }
    }

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await fetchApi("/staff.php", {
                method: "PUT",
                body: JSON.stringify({ id, status })
            })
            toast.success(`Staff status updated to ${status}`)
            loadStaff()
        } catch (e: any) {
            toast.error(e.message || "Update failed")
        }
    }

    const filteredStaff = staff.filter(m =>
        m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.full_name && m.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="space-y-8 pb-10 sm:px-4 lg:px-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Governance Hub</h1>
                    <p className="text-muted-foreground text-sm font-medium">Organizational structure and granular permission matrices.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 gap-2 bg-black text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-all rounded-2xl px-6">
                            <UserPlus className="h-5 w-5" />
                            Onboard Personnel
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">New Personnel</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Assign credentials and departmental role.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleOnboard} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</label>
                                <Input name="full_name" placeholder="e.g. John Doe Mensah" required className="rounded-2xl h-12 bg-muted/5 border-none ring-1 ring-border/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">System Username</label>
                                <Input name="username" placeholder="e.g. john_officer" required className="rounded-2xl h-12 bg-muted/5 border-none ring-1 ring-border/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                <Input name="email" type="email" placeholder="john@mensguy.com" required className="rounded-2xl h-12 bg-muted/5 border-none ring-1 ring-border/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Temporary Password</label>
                                <Input name="password" type="password" required className="rounded-2xl h-12 bg-muted/5 border-none ring-1 ring-border/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Role</label>
                                <Select name="role" required>
                                    <SelectTrigger className="rounded-2xl h-12 bg-muted/5 border-none ring-1 ring-border/50 font-bold text-xs">
                                        <SelectValue placeholder="Select Designation" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        {OFFICIAL_ROLES.map(role => (
                                            <SelectItem key={role.id} value={role.id} className="font-bold text-xs">{role.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="pt-6">
                                <Button type="submit" disabled={submitting} className="w-full h-14 bg-black text-white hover:bg-primary font-black text-xs uppercase tracking-[0.2em] rounded-3xl">
                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Onboarding"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="members" className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-1">
                    <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none border-none">
                        <TabsTrigger value="members" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 font-black uppercase tracking-widest text-[10px]">Staff Directory</TabsTrigger>
                        <TabsTrigger value="roles" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 font-black uppercase tracking-widest text-[10px]">Permission Matrix</TabsTrigger>
                    </TabsList>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-rose-600 bg-rose-500/5 px-3 py-1.5 rounded-full ring-1 ring-rose-500/10">
                        <ShieldAlert className="h-3 w-3" />
                        CRITICAL: FINANCE APPROVAL RESTRICTED
                    </div>
                </div>

                <TabsContent value="members" className="space-y-6 outline-none">
                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Summary Stats */}
                        <div className="lg:col-span-1 space-y-4">
                            <Card className="border-none shadow-sm ring-1 ring-border/50 bg-primary/5 rounded-[2rem]">
                                <CardHeader className="pb-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Total Strength</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black tracking-tighter italic">{staff.length} Officers</div>
                                    <div className="mt-4 flex gap-1">
                                        <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary transition-all" style={{ width: `${staff.length > 0 ? (staff.filter(s => s.status === 'active').length / staff.length) * 100 : 0}%` }} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">{staff.filter(s => s.status === 'active').length} Active across units</p>
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Unit Distribution</p>
                                {OFFICIAL_ROLES.map((role) => (
                                    <div key={role.id} className="flex items-center justify-between p-4 bg-white ring-1 ring-border/50 rounded-2xl shadow-sm hover:ring-primary/20 transition-all group">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">{role.name}</span>
                                            <span className="text-[8px] text-muted-foreground/50 font-medium">Departmental Unit</span>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] font-black h-5 px-1.5 min-w-[20px] justify-center bg-muted/30">
                                            {staff.filter(m => m.role === role.id).length}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Staff Table */}
                        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-white rounded-[2.5rem]">
                            <CardHeader className="bg-muted/5 pb-4 px-8 pt-8">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-sm font-black uppercase tracking-widest">Team Ledger</CardTitle>
                                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase italic opacity-50">Internal Personnel Record</p>
                                    </div>
                                    <div className="relative w-full max-w-xs flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Search officer..."
                                                className="pl-9 h-11 bg-background border-none ring-1 ring-border/50 text-xs font-bold rounded-2xl"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-none ring-1 ring-border/50 bg-white" onClick={loadStaff}>
                                            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 border-t border-border/50">
                                <Table>
                                    <TableHeader className="bg-muted/10">
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="px-8 py-4 font-black text-[10px] uppercase tracking-widest">Personnel Identity</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest">Designation</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest">Onboarded</TableHead>
                                            <TableHead className="w-12 px-8"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                                        ) : filteredStaff.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold uppercase tracking-widest opacity-20">No matching records</TableCell></TableRow>
                                        ) : filteredStaff.map((member) => (
                                            <TableRow key={member.id} className="group border-b border-border/30 last:border-none transition-colors">
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-11 w-11 ring-1 ring-border/50 shadow-sm transition-all group-hover:ring-primary/30 group-hover:scale-105 rounded-2xl overflow-hidden">
                                                            <AvatarFallback className="text-xs font-black text-primary bg-primary/5 rounded-2xl">
                                                                {(member.full_name || member.username).split(/[._\s]/).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-xs text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">{member.full_name || member.username}</span>
                                                            <span className="text-[10px] text-muted-foreground font-bold opacity-50">{member.email} · @{member.username}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-background shadow-xs px-2.5 py-1 ring-1 ring-border/30 border-none">
                                                        {member.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <div className={cn(
                                                            "flex items-center gap-2 px-2.5 py-1 rounded-full ring-1 transition-all",
                                                            member.status === 'active' ? 'bg-emerald-500/5 ring-emerald-500/20 text-emerald-600' : 'bg-amber-500/5 ring-amber-500/20 text-amber-600'
                                                        )}>
                                                            <div className={cn("h-1.5 w-1.5 rounded-full", member.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                                {member.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{new Date(member.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="px-8 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-black hover:text-white rounded-xl transition-all">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[220px] border-none shadow-2xl rounded-[1.5rem]">
                                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-4 pt-4">Command Terminal</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="my-3 mx-2 opacity-50" />

                                                            {member.status === 'active' ? (
                                                                <DropdownMenuItem className="text-[10px] uppercase font-black gap-3 px-4 py-3 cursor-pointer" onClick={() => handleUpdateStatus(member.id, 'disabled')}>
                                                                    <XCircle className="h-4 w-4 text-amber-500" /> Suspend Access
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem className="text-[10px] uppercase font-black gap-3 px-4 py-3 cursor-pointer" onClick={() => handleUpdateStatus(member.id, 'active')}>
                                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Reactivate Access
                                                                </DropdownMenuItem>
                                                            )}

                                                            <DropdownMenuItem className="text-[10px] uppercase font-black gap-3 px-4 py-3 cursor-pointer">
                                                                <Lock className="h-4 w-4 text-primary" /> Key Rotation
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-2 mx-2 opacity-30" />
                                                            <DropdownMenuItem
                                                                className="text-rose-600 font-black text-[10px] uppercase gap-3 px-4 py-3 cursor-pointer"
                                                                onClick={() => handleRevoke(member.id)}
                                                                disabled={member.role === 'Administrator'}
                                                            >
                                                                <Trash2 className="h-4 w-4" /> Revoke Commission
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="roles" className="space-y-6 outline-none">
                    <Card className="border-none shadow-2xl shadow-primary/5 ring-1 ring-border/50 bg-white overflow-hidden rounded-[3rem]">
                        <CardHeader className="bg-muted/10 pb-8 px-10 pt-10 border-b border-border/50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                                        <ShieldCheck className="h-6 w-6 text-primary" />
                                        Unified Permission Matrix
                                    </CardTitle>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Cross-departmental module exposure mapping</p>
                                </div>
                                <div className="flex items-center gap-8 border-l pl-8 border-border/50">
                                    {[
                                        { icon: Zap, label: "Full", color: "text-emerald-500" },
                                        { icon: Scale, label: "Edit", color: "text-primary" },
                                        { icon: Eye, label: "View", color: "text-muted-foreground/60" }
                                    ].map(leg => (
                                        <div key={leg.label} className="flex items-center gap-2.5">
                                            <leg.icon className={cn("h-3.5 w-3.5", leg.color)} />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{leg.label}</span>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-none ring-1 ring-border/50 bg-white" onClick={loadPermissions}>
                                        <RefreshCw className={cn("h-3.5 w-3.5", permLoading && "animate-spin")} />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/5">
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="px-10 py-6 font-black text-[10px] uppercase tracking-[0.2em] w-[240px] text-muted-foreground/40">Module Segment</TableHead>
                                            {OFFICIAL_ROLES.map(role => (
                                                <TableHead key={role.id} className="text-center font-black text-[9px] uppercase tracking-[0.2em] leading-tight min-w-[130px]">
                                                    {role.name}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permLoading ? (
                                            <TableRow><TableCell colSpan={OFFICIAL_ROLES.length + 1} className="h-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                                        ) : MODULES.map((module, idx) => (
                                            <TableRow key={idx} className="hover:bg-primary/[0.01] border-b border-border/20 last:border-none group">
                                                <TableCell className="px-10 py-7">
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-black transition-colors">{module}</span>
                                                </TableCell>
                                                {OFFICIAL_ROLES.map(role => (
                                                    <TableCell key={role.id} className="text-center">
                                                        <LevelSelector
                                                            level={getPermissionLevel(role.id, module)}
                                                            onUpdate={(newLevel: any) => handleUpdatePermission(role.id, module, newLevel)}
                                                            loading={updatingPerm === `${role.id}-${module}`}
                                                            disabled={role.id === "Administrator" && module === "Staff & Governance"} // Protect core access
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function LevelSelector({ level, onUpdate, loading, disabled }: any) {
    const levels = [
        { id: 'full', icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/30" },
        { id: 'edit', icon: Scale, color: "text-primary", bg: "bg-primary/10", ring: "ring-primary/30" },
        { id: 'view', icon: Eye, color: "text-muted-foreground/60", bg: "bg-muted/50", ring: "ring-border/50" },
        { id: 'none', icon: XCircle, color: "text-rose-500/30", bg: "bg-rose-500/[0.03]", ring: "ring-rose-500/5" }
    ]

    const current = levels.find(l => l.id === level) || levels[3]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={loading || disabled}>
                <Button variant="ghost" className={cn(
                    "h-10 w-10 p-0 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                    current.bg,
                    current.ring,
                    loading && "opacity-50 grayscale"
                )}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <current.icon className={cn("h-4 w-4", current.color)} />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl border-none shadow-2xl p-2 min-w-[140px]">
                {levels.map(l => (
                    <DropdownMenuItem
                        key={l.id}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer font-black text-[10px] uppercase tracking-widest",
                            level === l.id && "bg-muted font-black"
                        )}
                        onClick={() => onUpdate(l.id)}
                    >
                        <l.icon className={cn("h-3.5 w-3.5", l.color)} />
                        {l.id}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
