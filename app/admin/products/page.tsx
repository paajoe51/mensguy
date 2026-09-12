"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Loader2,
  RefreshCw,
  ImageUp,
  X,
} from "lucide-react"
import { fetchApi } from "@/lib/api"

interface Product {
  id: number
  name: string
  category_name: string
  category_id: number | null
  retail_price: number
  wholesale_price: number | null
  description: string
  type: string
  stock_quantity: number
  status: string
  images?: string // JSON array string e.g. '["/uploads/products/foo.jpg"]'
}

interface Category {
  id: number
  name: string
}

const emptyForm = {
  id: null as number | null,
  name: "",
  category_id: "" as string,
  description: "",
  retail_price: "",
  wholesale_price: "",
  promo_price: "",
  type: "Warehouse",
  stock_quantity: "",
  status: "active",
  image_path: "" as string, // local URL or uploaded path
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (selectedCategory !== "all") params.set("category_id", selectedCategory)
      const res = await fetchApi(`/products.php?${params.toString()}`)
      setProducts(res.data || [])
    } catch (e: any) {
      toast.error(e.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory])

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchApi("/products.php?resource=categories")
      setCategories(res.data || [])
    } catch { }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(), 300)
    return () => clearTimeout(timer)
  }, [loadProducts])

  const openAddDialog = () => {
    setForm({ ...emptyForm })
    setImageFile(null)
    setImagePreview("")
    setIsDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      category_id: product.category_id?.toString() ?? "",
      description: product.description,
      retail_price: product.retail_price?.toString() ?? "",
      wholesale_price: product.wholesale_price?.toString() ?? "",
      promo_price: "",
      type: product.type,
      stock_quantity: product.stock_quantity?.toString() ?? "",
      status: product.status,
      image_path: "",
    })
    // Show existing image if available
    try {
      const imgs = product.images ? JSON.parse(product.images) : []
      setImagePreview(imgs[0] ?? "")
    } catch { setImagePreview("") }
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.name || !form.retail_price) {
      toast.error("Product name and selling price are required.")
      return
    }
    setSaving(true)
    try {
      let imagePath = form.image_path

      // Upload the image file first if one was selected
      if (imageFile) {
        const fd = new FormData()
        fd.append("image", imageFile)
        fd.append("product_name", form.name)
        if (form.id) fd.append("product_id", String(form.id))

        const baseUrl = (process.env.NEXT_PUBLIC_PHP_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")
        const uploadRes = await fetch(`${baseUrl}/upload_image.php`, { method: "POST", body: fd })
        const uploadJson = await uploadRes.json()
        if (uploadJson.status !== "success") throw new Error(uploadJson.message || "Image upload failed")
        imagePath = uploadJson.path
      }

      const payload = {
        ...form,
        id: form.id,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        retail_price: parseFloat(form.retail_price),
        wholesale_price: form.wholesale_price ? parseFloat(form.wholesale_price) : null,
        promo_price: form.promo_price ? parseFloat(form.promo_price) : null,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        images: imagePath ? JSON.stringify([imagePath]) : (form.id ? undefined : "[]"),
      }
      if (form.id) {
        await fetchApi("/products.php", { method: "PUT", body: JSON.stringify(payload) })
        toast.success("Product updated successfully.")
      } else {
        await fetchApi("/products.php", { method: "POST", body: JSON.stringify(payload) })
        toast.success("Product added successfully.")
      }
      setIsDialogOpen(false)
      loadProducts()
    } catch (e: any) {
      toast.error(e.message || "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async (id: number, name: string) => {
    if (!confirm(`Archive "${name}"? It will be hidden from the catalog.`)) return
    try {
      await fetchApi(`/products.php?id=${id}`, { method: "DELETE" })
      toast.success("Product archived.")
      loadProducts()
    } catch (e: any) {
      toast.error(e.message || "Archive failed")
    }
  }

  const toggleProductSelection = (id: number) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map(p => p.id)
    )
  }

  const stockVariant = (qty: number) => {
    if (qty === 0) return "destructive"
    if (qty <= 5) return "warning"
    return "success"
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={loadProducts} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Products</p><p className="text-2xl font-bold">{products.length}</p></div><Package className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold">{products.filter(p => p.status === "active").length}</p></div><div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-success" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Low Stock (≤5)</p><p className="text-2xl font-bold">{products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length}</p></div><AlertCircle className="h-8 w-8 text-warning" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Out of Stock</p><p className="text-2xl font-bold">{products.filter(p => p.stock_quantity === 0).length}</p></div><AlertCircle className="h-8 w-8 text-destructive" /></div></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {selectedProducts.length > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted p-2">
              <span className="text-sm text-muted-foreground">{selectedProducts.length} selected</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground gap-2">
              <Package className="h-12 w-12 opacity-30" />
              <p className="text-sm font-medium">No products found</p>
              <Button size="sm" onClick={openAddDialog}><Plus className="mr-1 h-3 w-3" />Add your first product</Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox checked={selectedProducts.length === products.length && products.length > 0} onCheckedChange={toggleAllProducts} />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Price (GH¢)</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox checked={selectedProducts.includes(product.id)} onCheckedChange={() => toggleProductSelection(product.id)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {(() => { try { const imgs = product.images ? JSON.parse(product.images) : []; return imgs[0] ? <img src={imgs[0]} alt={product.name} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" /> } catch { return <Package className="h-5 w-5 text-muted-foreground" /> } })()}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category_name || "Uncategorized"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{Number(product.retail_price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.stock_quantity === 0 ? "destructive" : "outline"}>{product.stock_quantity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "default" : "destructive"}>{product.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(product)}>
                              <Edit className="mr-2 h-4 w-4" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleArchive(product.id, product.name)}>
                              <Trash2 className="mr-2 h-4 w-4" />Archive
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

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>Fill in the product details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" placeholder="Enter product name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warehouse">Warehouse (In Stock)</SelectItem>
                    <SelectItem value="Overseas">Overseas (Pre-Order)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retail_price">Retail Price (GH¢) *</Label>
                <Input id="retail_price" type="number" placeholder="0.00" value={form.retail_price} onChange={e => setForm(f => ({ ...f, retail_price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wholesale_price">Wholesale Price</Label>
                <Input id="wholesale_price" type="number" placeholder="0.00" value={form.wholesale_price} onChange={e => setForm(f => ({ ...f, wholesale_price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Qty</Label>
                <Input id="stock_quantity" type="number" placeholder="0" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} />
              </div>
            </div>
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div
                className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors overflow-hidden"
                onClick={() => document.getElementById("product-image-input")?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" className="h-full w-full object-contain p-2" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                      onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview("") }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageUp className="h-8 w-8 opacity-40" />
                    <span className="text-xs font-medium">Click to upload an image</span>
                    <span className="text-[10px] opacity-60">JPG, PNG, WEBP up to 5MB</span>
                  </div>
                )}
              </div>
              <input
                id="product-image-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              {imagePreview && !imageFile && (
                <p className="text-[10px] text-muted-foreground italic">Current saved image. Upload a new one to replace it.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter product description" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : form.id ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
