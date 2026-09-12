"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
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
  Edit,
  Mail,
  Phone,
  Users,
  ShoppingCart,
  DollarSign,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  orders_count: number
  total_spent: number
  outstanding_balance: number
  user_status: string
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const res = await fetchApi("/customers.php")
      setCustomers(res.data || [])
    } catch (e: any) {
      toast.error(e.message || "Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCustomers() }, [])

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)

    const matchesStatus = selectedStatus === "all" || customer.user_status.toLowerCase() === selectedStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.user_status === 'Active').length,
    revenue: customers.reduce((sum, c) => sum + Number(c.total_spent), 0),
    outstanding: customers.reduce((sum, c) => sum + Number(c.outstanding_balance), 0)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customer database and intelligence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCustomers} disabled={loading}>
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
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Network" value={stats.total} icon={Users} color="muted" />
        <StatCard title="Active Profile" value={stats.active} icon={Users} color="success" isIndicator />
        <StatCard title="Total Revenue" value={`GH¢${stats.revenue.toLocaleString()}`} icon={DollarSign} color="success" />
        <StatCard title="Outstanding" value={`GH¢${stats.outstanding.toLocaleString()}`} icon={DollarSign} color="warning" />
      </div>

      {/* Customers table */}
      <Card className="rounded-[2rem] border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name, email, or phone..."
                className="pl-9 h-11 border-none ring-1 ring-border/50 bg-muted/5 rounded-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px] h-11 border-none ring-1 ring-border/50 bg-white font-bold text-[10px] uppercase tracking-widest rounded-2xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-none shadow-2xl rounded-2xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact Intel</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No customers found.</TableCell></TableRow>
                ) : filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-1 ring-border/30">
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-black uppercase">{customer.first_name?.[0]}{customer.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-xs uppercase tracking-tight">{customer.first_name} {customer.last_name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-tighter">ID: {customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                          <Mail className="h-3 w-3 opacity-50" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                          <Phone className="h-3 w-3 opacity-50" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold">{customer.orders_count}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-black italic">
                      GH¢{Number(customer.total_spent).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={customer.user_status.toLowerCase() as any} />
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Intelligence</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/customers/${customer.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Edit feature coming soon")}>
                            <Edit className="mr-2 h-4 w-4" />
                            Update Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast.info("Direct comms coming soon")}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
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

function StatCard({ title, value, icon: Icon, color, isIndicator }: any) {
  const colors: Record<string, string> = {
    warning: "text-orange-500 bg-orange-500/10",
    success: "text-emerald-500 bg-emerald-500/10",
    muted: "text-muted-foreground bg-muted/10"
  }

  return (
    <Card className="border-none ring-1 ring-border/50 shadow-sm rounded-3xl overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-black italic tracking-tighter">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
            {isIndicator ? <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse transition-all" /> : <Icon className="h-6 w-6 opacity-60" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

