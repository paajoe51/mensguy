"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Search,
    History,
    TrendingDown,
    TrendingUp,
    AlertTriangle,
    MoveDown,
    MoveUp,
    Filter,
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

interface Product {
    id: number
    name: string
    category_name: string | null
    category_id: number | null
    stock_quantity: number
    type: string
    status: string
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const { categories } = useCategories()

    const loadProducts = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/products.php")
            setProducts(res.data || [])
        } catch (e: any) {
            toast.error(e.message || "Failed to load inventory")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadProducts() }, [loadProducts])

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toString().includes(searchQuery)
        const matchesCategory = selectedCategory === "all" || p.category_id?.toString() === selectedCategory
        return matchesSearch && matchesCategory
    })

    const lowStockThreshold = 10
    const stats = {
        totalSKUs: products.length,
        lowStock: products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold).length,
        outOfStock: products.filter(p => p.stock_quantity <= 0).length,
        warehouse: products.filter(p => p.type === 'Warehouse').length
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Stock & Inventory</h1>
                    <p className="text-muted-foreground">Track stock levels and inventory movement history.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={loadProducts}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="outline">
                        <History className="mr-2 h-4 w-4" />
                        History
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Adjust Stock
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase font-semibold">Total SKUs</p>
                                <p className="text-2xl font-bold mt-1">{stats.totalSKUs}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Filter className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase font-semibold">Low Stock</p>
                                <p className="text-2xl font-bold mt-1">{stats.lowStock}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase font-semibold">Out of Stock</p>
                                <p className="text-2xl font-bold mt-1 text-destructive">{stats.outOfStock}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                                <MoveDown className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase font-semibold">Warehouse Items</p>
                                <p className="text-2xl font-bold mt-1 text-blue-500">{stats.warehouse}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <MoveUp className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle>Current Stock Levels</CardTitle>
                            <CardDescription>Real-time inventory from the database.</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search stock..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="p-20 text-center text-muted-foreground italic">No products found for this criteria.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((item) => {
                                    const isLow = item.stock_quantity > 0 && item.stock_quantity <= lowStockThreshold
                                    const isOut = item.stock_quantity <= 0

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">ID: {item.id} · {item.category_name || 'Uncategorized'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`font-bold ${isOut ? 'text-destructive' : isLow ? 'text-orange-500' : ''}`}>
                                                    {item.stock_quantity}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs">{item.type}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={isOut ? 'destructive' : isLow ? 'outline' : 'default'} className="text-[10px] font-normal">
                                                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/products?edit=${item.id}`}>Adjust</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
