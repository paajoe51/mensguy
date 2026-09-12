"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
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
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Package,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"

// Mock delivery data
const deliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-2024-001",
    customer: { name: "John Doe", phone: "+1 234 567 8900", address: "123 Main Street, New York, NY" },
    driver: { name: "Mike Driver", phone: "+1 234 567 9999" },
    scheduledDate: "Mar 26, 2026",
    scheduledTime: "10:00 AM - 12:00 PM",
    status: "scheduled",
    items: 3,
  },
  {
    id: "DEL-002",
    orderId: "ORD-2024-003",
    customer: { name: "Jane Smith", phone: "+1 234 567 8901", address: "456 Oak Avenue, Brooklyn, NY" },
    driver: { name: "Tom Courier", phone: "+1 234 567 8888" },
    scheduledDate: "Mar 25, 2026",
    scheduledTime: "2:00 PM - 4:00 PM",
    status: "in_progress",
    items: 5,
  },
  {
    id: "DEL-003",
    orderId: "ORD-2024-005",
    customer: { name: "Sarah Williams", phone: "+1 234 567 8902", address: "789 Pine Road, Queens, NY" },
    driver: { name: "Mike Driver", phone: "+1 234 567 9999" },
    scheduledDate: "Mar 25, 2026",
    scheduledTime: "4:00 PM - 6:00 PM",
    status: "completed",
    items: 2,
  },
  {
    id: "DEL-004",
    orderId: "ORD-2024-007",
    customer: { name: "David Brown", phone: "+1 234 567 8903", address: "321 Elm Street, Bronx, NY" },
    driver: null,
    scheduledDate: "Mar 27, 2026",
    scheduledTime: "Not assigned",
    status: "pending",
    items: 1,
  },
]

const drivers = [
  { id: "DRV-001", name: "Mike Driver", phone: "+1 234 567 9999", deliveriesToday: 5, status: "active" },
  { id: "DRV-002", name: "Tom Courier", phone: "+1 234 567 8888", deliveriesToday: 3, status: "active" },
  { id: "DRV-003", name: "Lisa Express", phone: "+1 234 567 7777", deliveriesToday: 0, status: "off_duty" },
]

const statusConfig = {
  pending: { label: "Pending", color: "default" },
  scheduled: { label: "Scheduled", color: "info" },
  in_progress: { label: "In Progress", color: "warning" },
  completed: { label: "Completed", color: "success" },
  failed: { label: "Failed", color: "error" },
}

export default function DeliveryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const pendingCount = deliveries.filter(d => d.status === "pending").length
  const scheduledCount = deliveries.filter(d => d.status === "scheduled").length
  const inProgressCount = deliveries.filter(d => d.status === "in_progress").length
  const completedCount = deliveries.filter(d => d.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-muted-foreground">
            Manage deliveries and driver assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/delivery/drivers">
              <User className="mr-2 h-4 w-4" />
              Drivers
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/delivery/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{scheduledCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
              <Truck className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Deliveries list */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Deliveries</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 w-full md:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.map((delivery) => {
                    const status = statusConfig[delivery.status as keyof typeof statusConfig]
                    return (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{delivery.id}</p>
                            <Link href={`/admin/orders/${delivery.orderId}`} className="text-xs text-primary hover:underline">
                              {delivery.orderId}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{delivery.customer.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {delivery.customer.address}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {delivery.driver ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{delivery.driver.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{delivery.driver.name}</span>
                            </div>
                          ) : (
                            <Badge variant="outline">Unassigned</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{delivery.scheduledDate}</p>
                            <p className="text-xs text-muted-foreground">{delivery.scheduledTime}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge variant={
                            delivery.status === "pending" ? "pending" :
                              delivery.status === "scheduled" ? "processing" :
                                delivery.status === "in_progress" ? "in-transit" :
                                  delivery.status === "completed" ? "completed" :
                                    "cancelled"
                          } />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Assign Driver
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Complete
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

        {/* Drivers sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Drivers</CardTitle>
            <CardDescription>Today's driver status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{driver.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.deliveriesToday} deliveries today</p>
                    </div>
                  </div>
                  <StatusBadge
                    variant={driver.status === "active" ? "active" : "cancelled"}
                  />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/admin/delivery/drivers">
                Manage Drivers
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
