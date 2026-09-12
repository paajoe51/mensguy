"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    MessageSquare,
    Loader2,
    RefreshCw,
    FolderTree,
    Tag
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchApi } from "@/lib/api"
import { useCategories } from "@/lib/useCategories"
import { toast } from "sonner"

interface Request {
    id: number
    customer_id: number
    first_name: string
    last_name: string
    product_name: string
    category_id: number | null
    category_name: string | null
    budget: string | null
    description: string
    quantity: number
    notes: string
    status: string
    created_at: string
}

export default function CustomerRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const { categories } = useCategories()

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
    const [updateForm, setUpdateForm] = useState({
        status: "",
        category_id: "" as string,
        notes: ""
    })

    const loadRequests = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/requests.php")
            setRequests(res.data || [])
        } catch (e: any) {
            toast.error(e.message || "Failed to load requests")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadRequests() }, [loadRequests])

    const filtered = requests.filter(req =>
        req.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${req.first_name} ${req.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toString().includes(searchQuery)
    )

    const stats = {
        pending: requests.filter(r => r.status === 'Pending').length,
        review: requests.filter(r => r.status === 'Under Review').length,
        approved: requests.filter(r => r.status === 'Approved').length,
        total: requests.length
    }

    const openUpdate = (req: Request) => {
        setSelectedRequest(req)
        setUpdateForm({
            status: req.status,
            category_id: req.category_id?.toString() || "",
            notes: req.notes || ""
        })
        setIsUpdateDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!selectedRequest) return
        setUpdating(true)
        try {
            await fetchApi("/requests.php", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedRequest.id,
                    status: updateForm.status,
                    category_id: updateForm.category_id ? parseInt(updateForm.category_id) : null,
                    notes: updateForm.notes
                })
            })
            toast.success("Request updated.")
            setIsUpdateDialogOpen(false)
            loadRequests()
        } catch (e: any) {
            toast.error(e.message || "Update failed")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Product Requests</h1>
                    <p className="text-muted-foreground">Review and manage overseas and custom item requests from customers.</p>
                </div>
                <Button variant="outline" size="icon" onClick={loadRequests} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">New Requests</p>
                                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">In Review</p>
                                <p className="text-2xl font-bold mt-1">{stats.review}</p>
                            </div>
                            <Search className="h-8 w-8 text-blue-500 opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Approved</p>
                                <p className="text-2xl font-bold mt-1 text-success">{stats.approved}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-success opacity-20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Total Requests</p>
                                <p className="text-2xl font-bold mt-1 text-primary">{stats.total}</p>
                            </div>
                            <ExternalLink className="h-8 w-8 text-primary opacity-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search requests by ID, customer or item..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="p-20 text-center text-muted-foreground">No requests found.</div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="pl-6">Request ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Requested Item</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-12 pr-6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((req) => (
                                    <TableRow key={req.id} className="hover:bg-muted/30">
                                        <td className="pl-6 py-4 font-mono text-xs">REQ-{req.id.toString().padStart(3, '0')}</td>
                                        <td className="font-medium text-sm">
                                            {req.first_name} {req.last_name}
                                        </td>
                                        <td className="max-w-[200px] truncate text-sm">
                                            {req.product_name}
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(req.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td>
                                            {req.category_name ? (
                                                <Badge variant="secondary" className="text-[10px] font-normal">
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {req.category_name}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Uncategorized</span>
                                            )}
                                        </td>
                                        <td className="font-bold text-sm">
                                            {req.budget ? `GH¢${Number(req.budget).toLocaleString()}` : <span className="text-xs font-normal text-muted-foreground italic">Not set</span>}
                                        </td>
                                        <td>
                                            <StatusBadge variant={req.status.toLowerCase() as any} />
                                        </td>
                                        <td className="pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openUpdate(req)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Update Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Contact Customer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-success" onClick={() => openUpdate(req)}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Approve/Quote
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Update Dialog */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Request Status</DialogTitle>
                        <DialogDescription>
                            Updating REQ-{selectedRequest?.id.toString().padStart(3, '0')} for {selectedRequest?.first_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={updateForm.status}
                                onValueChange={(v) => setUpdateForm({ ...updateForm, status: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Under Review">Under Review</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                    <SelectItem value="Converted to Order">Converted to Order</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Assign Category</label>
                            <Select
                                value={updateForm.category_id}
                                onValueChange={(v) => setUpdateForm({ ...updateForm, category_id: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Categorize item..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Update Notes / Quote Details</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={updateForm.notes}
                                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                                placeholder="Enter details for the customer or internal notes..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={updating}>
                            {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
