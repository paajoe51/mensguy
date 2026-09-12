"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Progress } from "@/components/ui/progress"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Globe,
  Ship,
  Plane,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
} from "lucide-react"
import Link from "next/link"

// Mock procurement data
const overseasOrders = [
  {
    id: "PO-2024-001",
    supplier: "Tech Imports Co.",
    country: "China",
    items: 25,
    totalValue: 15000,
    orderDate: "Mar 15, 2026",
    estArrival: "Apr 10, 2026",
    status: "in_transit",
    trackingNumber: "SHIP123456789",
    progress: 65,
  },
  {
    id: "PO-2024-002",
    supplier: "Global Electronics Ltd.",
    country: "Japan",
    items: 10,
    totalValue: 8500,
    orderDate: "Mar 18, 2026",
    estArrival: "Apr 05, 2026",
    status: "processing",
    trackingNumber: null,
    progress: 20,
  },
  {
    id: "PO-2024-003",
    supplier: "Fashion Forward Inc.",
    country: "Italy",
    items: 50,
    totalValue: 5200,
    orderDate: "Mar 10, 2026",
    estArrival: "Mar 28, 2026",
    status: "arrived",
    trackingNumber: "AIR987654321",
    progress: 100,
  },
  {
    id: "PO-2024-004",
    supplier: "Home Essentials Corp.",
    country: "Germany",
    items: 30,
    totalValue: 3800,
    orderDate: "Mar 20, 2026",
    estArrival: "Apr 15, 2026",
    status: "ordered",
    trackingNumber: null,
    progress: 10,
  },
]

const statusConfig = {
  ordered: { label: "Ordered", color: "info", icon: Clock },
  processing: { label: "Processing", color: "warning", icon: Package },
  in_transit: { label: "In Transit", color: "info", icon: Ship },
  arrived: { label: "Arrived", color: "success", icon: CheckCircle },
  delayed: { label: "Delayed", color: "error", icon: AlertCircle },
}

export default function ProcurementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredOrders = overseasOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalOrders = overseasOrders.length
  const inTransit = overseasOrders.filter(o => o.status === "in_transit").length
  const processing = overseasOrders.filter(o => o.status === "processing" || o.status === "ordered").length
  const totalValue = overseasOrders.reduce((sum, o) => sum + o.totalValue, 0)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Procurement</h1>
          <p className="text-muted-foreground">
            Manage overseas orders and supplier relationships
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/customers/requests">
              <FileText className="mr-2 h-4 w-4" />
              Sourcing Requests
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/procurement/suppliers">
              <Globe className="mr-2 h-4 w-4" />
              Suppliers
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">{inTransit}</p>
              </div>
              <Ship className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{processing}</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">GH¢{totalValue.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">GH¢</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Est. Arrival</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig]
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <Link href={`/admin/procurement/${order.id}`} className="font-medium hover:underline">
                            {order.id}
                          </Link>
                          <p className="text-xs text-muted-foreground">Ordered: {order.orderDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{order.supplier}</p>
                            <p className="text-xs text-muted-foreground">{order.country}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.items} items</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        GH¢{order.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={order.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{order.progress}%</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge variant={
                          order.status === "pending" ? "pending" :
                            order.status === "approved" ? "approved" :
                              order.status === "shipped" ? "in-transit" :
                                order.status === "delivered" ? "delivered" :
                                  "cancelled"
                        } />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.estArrival}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/procurement/${order.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Ship className="mr-2 h-4 w-4" />
                              Track Shipment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Mark as Arrived
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
