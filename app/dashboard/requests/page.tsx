"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { PageHeader } from "@/components/page-header"
import {
    FileText,
    Search,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Loader2,
    Package
} from "lucide-react"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface Request {
    id: number
    product_name: string
    created_at: string
    status: string
    budget: string | null
    description: string
    category_name: string | null
}

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchApi("/requests.php")
                setRequests(res.data || [])
            } catch { }
            finally { setLoading(true) }
            // Wait, I should set loading false. 
            setLoading(false)
        }
        load()
    }, [])

    const filtered = requests.filter(r =>
        r.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending' || r.status === 'Under Review').length,
        approved: requests.filter(r => r.status === 'Approved').length,
        rejected: requests.filter(r => r.status === 'Rejected').length,
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader
                    title="My Requests"
                    description="Track your overseas and custom product requests."
                />
                <Button asChild>
                    <Link href="/request">
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Link>
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Requests", value: stats.total, icon: FileText },
                    { label: "Pending Review", value: stats.pending, icon: Clock },
                    { label: "Approved", value: stats.approved, icon: CheckCircle2 },
                    { label: "Rejected", value: stats.rejected, icon: XCircle },
                ].map((stat, idx) => (
                    <Card key={idx}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                                <stat.icon className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Requests List */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-lg">All Requests</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                            <p className="text-muted-foreground">No requests found.</p>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/request">Create Request</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((request) => (
                                <div
                                    key={request.id}
                                    className="group relative flex flex-col gap-4 rounded-xl border p-4 transition-all hover:bg-accent/5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-base leading-none">
                                                    {request.product_name}
                                                </h3>
                                                <StatusBadge variant={request.status.toLowerCase() as any} />
                                                {request.category_name && (
                                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{request.category_name}</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Request ID: REQ-{request.id.toString().padStart(3, '0')} · Date: {new Date(request.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                                                {request.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:gap-2">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                                Target Budget
                                            </p>
                                            <p className="text-base font-bold text-foreground">
                                                {request.budget ? `GH¢ ${Number(request.budget).toLocaleString()}` : 'N/A'}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/requests/${request.id}`}>
                                                View Details
                                                <Eye className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
