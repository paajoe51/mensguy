"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  MoreHorizontal,
  Eye,
  Truck,
  Download,
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

interface Order {
  id: number
  order_number: string
  customer_name: string
  items_count: number
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  type: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await fetchApi("/orders.php")
      setOrders(res.data || [])
    } catch (e: any) {
      toast.error(e.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetchApi(`/orders.php?id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      })
      toast.success(`Order status updated to ${status}`)
      loadOrders()
    } catch (e: any) {
      toast.error(e.message || "Update failed")
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'In-Transit').length,
    completed: orders.filter(o => o.status === 'Delivered').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Manage and track all customer transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading && 'animate-spin'}`} />
            Sync
          </Button>
          <Button onClick={() => toast.info("Export feature coming soon")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard title="Total" value={stats.all} icon={ShoppingCart} color="muted" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="warning" />
        <StatCard title="Processing" value={stats.processing} icon={Package} color="info" />
        <StatCard title="In-Transit" value={stats.shipped} icon={Truck} color="primary" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="success" />
      </div>

      {/* Orders list */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search order # or customer..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In-Transit">In-Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No orders found.</TableCell></TableRow>
                ) : filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-bold tracking-tighter">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline text-primary">
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 text-[10px] font-bold">
                          <AvatarFallback>{order.customer_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{order.customer_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">GH¢{Number(order.total_amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] uppercase font-bold">{order.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={order.status.toLowerCase() as any} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`}><Eye className="mr-2 h-4 w-4" />View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground">Update Status</DropdownMenuLabel>
                          {['Pending', 'Processing', 'In-Transit', 'Delivered', 'Cancelled'].map(s => (
                            <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(order.id, s)} disabled={order.status === s}>
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    warning: "text-orange-500",
    info: "text-sky-500",
    primary: "text-primary",
    success: "text-emerald-500",
    muted: "text-muted-foreground"
  }
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
            <p className="text-2xl font-black">{value}</p>
          </div>
          <Icon className={`h-8 w-8 opacity-20 ${colors[color]}`} />
        </div>
      </CardContent>
    </Card>
  )
}
