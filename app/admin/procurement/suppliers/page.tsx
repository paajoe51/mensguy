"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    Plus,
    Filter,
    MoreVertical,
    Globe,
    Phone,
    Mail,
    ExternalLink,
    Star,
    Package,
    Truck,
    DollarSign
} from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

// Mock suppliers data
const suppliersData = [
    {
        id: "SUP-001",
        name: "Shenzhen Global Electronics",
        region: "China",
        categories: ["Electronics", "Accessories"],
        reliability: 4.8,
        status: "active",
        contact: "Li Wei",
        email: "sales@sg-electronics.cn",
        activeOrders: 5,
        totalSpent: 45000,
    },
    {
        id: "SUP-002",
        name: "Dubai Tech Hub",
        region: "UAE",
        categories: ["Computers", "Mobile"],
        reliability: 4.5,
        status: "active",
        contact: "Ahmed Farooq",
        email: "orders@dubaitech.ae",
        activeOrders: 2,
        totalSpent: 28000,
    },
    {
        id: "SUP-003",
        name: "Amazon US Wholesale",
        region: "USA",
        categories: ["Multi-category"],
        reliability: 4.9,
        status: "active",
        contact: "Customer Support",
        email: "business@amazon.com",
        activeOrders: 0,
        totalSpent: 125000,
    },
    {
        id: "SUP-004",
        name: "Ebay UK Sellers",
        region: "UK",
        categories: ["Used Items", "Collectibles"],
        reliability: 4.2,
        status: "on-hold",
        contact: "Multiple",
        email: "n/a",
        activeOrders: 1,
        totalSpent: 12000,
    },
    {
        id: "SUP-005",
        name: "Turkey Textile Center",
        region: "Turkey",
        categories: ["Apparel", "Home"],
        reliability: 4.6,
        status: "active",
        contact: "Selim Can",
        email: "export@turkeytextile.com",
        activeOrders: 3,
        totalSpent: 15500,
    },
]

export default function SuppliersPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredSuppliers = suppliersData.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.region.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Suppliers Management</h1>
                    <p className="text-muted-foreground">
                        Manage your global procurement network and supplier relationships.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Supplier
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                            <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">{suppliersData.length}</div>
                            <span className="text-xs text-success font-medium">+2 this month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                            <Package className="h-4 w-4 text-info" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">
                                {suppliersData.reduce((acc, curr) => acc + curr.activeOrders, 0)}
                            </div>
                            <span className="text-xs text-muted-foreground">Across all regions</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Avg. Reliability</p>
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">4.6</div>
                            <span className="text-xs text-success font-medium">Excellent</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none ring-1 ring-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Procurement</p>
                            <DollarSign className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">GH¢{suppliersData.reduce((acc, curr) => acc + curr.totalSpent, 0).toLocaleString()}</div>
                            <span className="text-xs text-muted-foreground">Lifetime spend</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main content table */}
            <Card className="shadow-sm border-none ring-1 ring-border/50">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search suppliers by name or region..."
                                className="pl-9 bg-muted/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-9">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="h-9">
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold">Supplier Info</TableHead>
                                <TableHead className="font-bold">Region</TableHead>
                                <TableHead className="font-bold">Categories</TableHead>
                                <TableHead className="font-bold">Active Orders</TableHead>
                                <TableHead className="font-bold">Reliability</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSuppliers.map((supplier) => (
                                <TableRow key={supplier.id} className="cursor-pointer hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 ring-1 ring-border group-hover:ring-primary/20">
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                    {supplier.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{supplier.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{supplier.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Globe className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-sm">{supplier.region}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {supplier.categories.map((cat, i) => (
                                                <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0 font-medium">
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">{supplier.activeOrders}</span>
                                            {supplier.activeOrders > 0 && (
                                                <Truck className="h-3 w-3 text-info animate-pulse" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-bold">{supplier.reliability}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge variant={supplier.status as any} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredSuppliers.length === 0 && (
                        <div className="py-20 text-center">
                            <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                            <p className="text-muted-foreground">No suppliers found matching "{searchTerm}"</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
