"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
    Plus, Search, Edit, Trash2, MoreHorizontal, FolderTree, Loader2, RefreshCw
} from "lucide-react"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { fetchApi } from "@/lib/api"
import { useCategories } from "@/lib/useCategories"

export default function CategoriesPage() {
    const { categories, loading, reload } = useCategories()
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({ id: null as number | null, name: "", description: "" })

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const openAdd = () => {
        setForm({ id: null, name: "", description: "" })
        setIsDialogOpen(true)
    }

    const openEdit = (cat: typeof categories[0]) => {
        setForm({ id: cat.id, name: cat.name, description: cat.description || "" })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!form.name.trim()) { toast.error("Category name is required."); return }
        setSaving(true)
        try {
            if (form.id) {
                await fetchApi("/products.php?resource=categories", { method: "PUT", body: JSON.stringify(form) })
                toast.success("Category updated.")
            } else {
                await fetchApi("/products.php?resource=categories", { method: "POST", body: JSON.stringify(form) })
                toast.success("Category created.")
            }
            setIsDialogOpen(false)
            reload()
        } catch (e: any) {
            toast.error(e.message || "Save failed")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Delete category "${name}"? Products in this category will become uncategorized.`)) return
        try {
            await fetchApi(`/products.php?resource=categories&id=${id}`, { method: "DELETE" })
            toast.success("Category deleted.")
            reload()
        } catch (e: any) {
            toast.error(e.message || "Delete failed")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Product Categories</h1>
                    <p className="text-muted-foreground">Organize your catalog into logical groups for the shop and admin.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={reload} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
                    <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Add Category</Button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
                {/* Sidebar stats */}
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle className="text-base">Insights</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold">{categories.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Visible in Shop</p>
                            <p className="text-2xl font-bold text-success">{categories.length}</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            All categories are automatically shown in the customer shop's filter ribbon and on product filter sidebars.
                        </p>
                    </CardContent>
                </Card>

                {/* Main table */}
                <Card className="lg:col-span-3">
                    <CardHeader className="pb-3">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search categories..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                                <FolderTree className="h-10 w-10 opacity-30" />
                                <p className="text-sm font-medium">No categories yet</p>
                                <Button size="sm" onClick={openAdd}><Plus className="mr-1 h-3 w-3" />Create your first</Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Category Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map(cat => (
                                            <TableRow key={cat.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                                            <FolderTree className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{cat.name}</p>
                                                            <p className="text-xs text-muted-foreground">ID: {cat.id}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                                    {cat.description || <span className="italic opacity-40">No description</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEdit(cat)}>
                                                                <Edit className="mr-2 h-4 w-4" />Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cat.id, cat.name)}>
                                                                <Trash2 className="mr-2 h-4 w-4" />Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{form.id ? "Edit Category" : "Add Category"}</DialogTitle>
                        <DialogDescription>Categories appear in the customer shop filter and all product forms.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Category Name *</Label>
                            <Input placeholder="e.g. Electronics" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Brief description shown in the shop..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : form.id ? "Save Changes" : "Create Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
