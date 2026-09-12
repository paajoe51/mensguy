"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { StatusBadge } from "@/components/ui/status-badge"
import { Search, SlidersHorizontal, ShoppingCart, X, ArrowRight, Heart, Filter, RefreshCw, ChevronLeft, Loader2, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/lib/useCategories"
import { fetchApi } from "@/lib/api"

interface Product {
  id: number
  name: string
  description: string
  retail_price: number
  type: string
  category_name: string
  category_id: number | null
  stock_quantity: number
  status: string
  images?: string // JSON array string e.g. '["/uploads/products/foo.jpg"]'
}

export default function ShopPage() {
  const { categories } = useCategories()
  const [products, setProducts] = React.useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [searchInput, setSearchInput] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false)
  const [previewResults, setPreviewResults] = React.useState<Product[]>([])
  const [showPreview, setShowPreview] = React.useState(false)
  const [loadingPreview, setLoadingPreview] = React.useState(false)

  // Live search preview logic
  React.useEffect(() => {
    if (searchInput.length < 2) {
      setPreviewResults([])
      setShowPreview(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoadingPreview(true)
      try {
        const res = await fetchApi(`/products.php?search=${encodeURIComponent(searchInput)}`)
        setPreviewResults(res.data?.slice(0, 5) || [])
        setShowPreview(true)
      } catch { }
      finally { setLoadingPreview(false) }
    }, 200)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Debounced load from API
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      setLoadingProducts(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.set("search", searchTerm)
        if (activeCategory !== "all") params.set("category_id", activeCategory)
        const res = await fetchApi(`/products.php?${params.toString()}`)
        setProducts(res.data || [])
      } catch { }
      finally { setLoadingProducts(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm, activeCategory])

  React.useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 100) }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] pt-20">
      <Header />

      {/* Dynamic Header - Sticky on Mobile */}
      <div className={cn(
        "sticky top-16 z-40 transition-all duration-300 lg:static",
        isScrolled ? "bg-white/90 backdrop-blur-xl border-b shadow-sm py-2" : "bg-transparent py-4"
      )}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-2">
            {/* Responsive Header Grid */}
            <div className="flex items-center justify-between">
              {/* Header Text */}
              {!isSearchExpanded && (
                <div className="transition-all duration-300">
                  <h1 className={cn(
                    "font-black tracking-tighter uppercase italic transition-all",
                    isScrolled ? "text-xl" : "text-2xl sm:text-5xl"
                  )}>Marketplace</h1>
                  {!isScrolled && (
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Direct imports & installments</p>
                  )}
                </div>
              )}

              {/* Desktop Search (Always Visible) */}
              <div className="hidden lg:flex relative items-center flex-1 max-w-md ml-8 group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="Search premium inventory..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => searchInput.length >= 2 && setShowPreview(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchTerm(searchInput)
                      setShowPreview(false)
                    }
                  }}
                  className="pl-9 h-11 border-none ring-1 ring-border/50 bg-white shadow-sm font-bold text-xs rounded-2xl"
                />
                <SearchPreview
                  show={showPreview}
                  loading={loadingPreview}
                  results={previewResults}
                  onClose={() => setShowPreview(false)}
                />
              </div>

              {/* Mobile Search & Filter Actions */}
              <div className={cn(
                "flex items-center gap-2 transition-all duration-300",
                isSearchExpanded ? "w-full" : "w-auto"
              )}>
                {/* Expandable Search Input (Mobile Only) */}
                {isSearchExpanded ? (
                  <div className="flex items-center gap-2 flex-1 animate-in slide-in-from-right-4 duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:bg-transparent"
                      onClick={() => setIsSearchExpanded(false)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                      <Input
                        autoFocus
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onFocus={() => searchInput.length >= 2 && setShowPreview(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setSearchTerm(searchInput)
                            setShowPreview(false)
                          }
                        }}
                        className="pl-9 h-11 border-none ring-2 ring-primary/20 bg-white shadow-inner font-bold text-xs rounded-2xl"
                      />
                      {searchInput && (
                        <button
                          onClick={() => {
                            setSearchInput("")
                            setSearchTerm("")
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-black"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <SearchPreview
                        show={showPreview}
                        loading={loadingPreview}
                        results={previewResults}
                        onClose={() => setShowPreview(false)}
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden flex-shrink-0 border-none ring-1 ring-border/50 bg-white rounded-2xl h-11 w-11 transition-all"
                    onClick={() => setIsSearchExpanded(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}

                {!isSearchExpanded && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="flex-shrink-0 border-none ring-1 ring-border/50 bg-white rounded-2xl h-11 w-11 transition-all shadow-sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-[2.5rem] h-[80vh] border-none shadow-2xl p-8">
                      <SheetHeader className="pb-6 border-b border-border/50">
                        <SheetTitle className="text-2xl font-black tracking-tighter uppercase italic">Refine Results</SheetTitle>
                      </SheetHeader>
                      <div className="py-8 space-y-8 overflow-y-auto max-h-full">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Market Arrangement</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Newest first', 'Price: Low', 'Price: High', 'Demand'].map(sort => (
                              <Button key={sort} variant="outline" className="h-11 text-[10px] font-black uppercase tracking-widest ring-1 ring-border/50 border-none justify-start px-4">{sort}</Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price Bracket (GH¢)</Label>
                          <div className="flex items-center gap-4">
                            <Input type="number" placeholder="Min" className="h-12 rounded-2xl bg-muted/20 border-none ring-1 ring-border/50" />
                            <div className="h-px w-4 bg-muted-foreground/30" />
                            <Input type="number" placeholder="Max" className="h-12 rounded-2xl bg-muted/20 border-none ring-1 ring-border/50" />
                          </div>
                        </div>
                        <Button className="w-full h-14 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl">Apply Transformations</Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 mt-2 sticky top-[4.25rem] lg:top-0 z-30 bg-[#FDFDFD]/90 backdrop-blur-sm py-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "whitespace-nowrap rounded-full px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all ring-1 shrink-0",
                activeCategory === "all" ? "bg-black text-white ring-black shadow-lg scale-105" : "bg-white text-muted-foreground ring-border/50 hover:ring-primary/30"
              )}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id.toString())}
                className={cn(
                  "whitespace-nowrap rounded-full px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all ring-1 shrink-0",
                  activeCategory === cat.id.toString() ? "bg-black text-white ring-black shadow-lg scale-105" : "bg-white text-muted-foreground ring-border/50 hover:ring-primary/30"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:gap-12">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-40 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sort Intelligence</h3>
                  <Select defaultValue="newest">
                    <SelectTrigger className="h-12 border-none ring-1 ring-border/50 bg-white font-black text-[10px] uppercase tracking-widest rounded-2xl">
                      <SelectValue placeholder="Market Sort" />
                    </SelectTrigger>
                    <SelectContent className="border-none shadow-2xl rounded-2xl">
                      <SelectItem value="newest" className="text-xs font-bold uppercase">Latest Collection</SelectItem>
                      <SelectItem value="price-low" className="text-xs font-bold uppercase">Price: Ascending</SelectItem>
                      <SelectItem value="price-high" className="text-xs font-bold uppercase">Price: Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <Checkbox id="desk-in-stock" />
                      <Label htmlFor="desk-in-stock" className="text-xs font-black uppercase cursor-pointer">In-House Inventory</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <Checkbox id="desk-overseas" />
                      <Label htmlFor="desk-overseas" className="text-xs font-black uppercase cursor-pointer">Overseas (7-14 Days)</Label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <Skeleton className="aspect-[4/5] w-full rounded-[1.5rem] sm:rounded-[2.5rem]" />
                      <div className="space-y-2 px-1">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-3 w-1/4" />
                          <Skeleton className="h-4 w-1/5" />
                        </div>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-8 sm:h-11 w-full rounded-lg sm:rounded-2xl mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center py-24 gap-3 text-muted-foreground">
                  <Package className="h-12 w-12 opacity-30" />
                  <p className="text-sm font-black uppercase tracking-widest">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-2 xl:grid-cols-3">
                  {products.map(product => (
                    <div key={product.id} className="group flex flex-col items-start gap-2.5">
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/20 rounded-[1.5rem] sm:rounded-[2.5rem] ring-1 ring-border/20 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:ring-primary/20">
                        <Link href={`/shop/${product.id}`} className="absolute inset-0 z-10">
                          <span className="sr-only">View {product.name}</span>
                        </Link>
                        {(() => {
                          try {
                            const imgs = product.images ? JSON.parse(product.images) : []
                            const src = imgs[0]
                            return src ? (
                              <img
                                src={src}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted/30 flex items-center justify-center">
                                <Package className="h-16 w-16 text-muted-foreground/20" />
                              </div>
                            )
                          } catch {
                            return (
                              <div className="h-full w-full bg-muted/30 flex items-center justify-center">
                                <Package className="h-16 w-16 text-muted-foreground/20" />
                              </div>
                            )
                          }
                        })()}
                        <button className="absolute top-2.5 right-2.5 sm:top-6 sm:right-6 z-20 h-7 w-7 sm:h-10 sm:w-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm text-foreground hover:bg-primary hover:text-white transition-all">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <div className="absolute top-2.5 left-2.5 sm:top-6 sm:left-6 flex flex-col gap-1 z-20">
                          <StatusBadge variant={product.stock_quantity === 0 ? "cancelled" : product.type === "Overseas" ? "overseas" : "in-stock"} className="h-4 sm:h-6 text-[7px] sm:text-[9px]" />
                        </div>
                      </div>
                      <div className="space-y-0.5 w-full flex flex-col items-start px-0.5">
                        <div className="flex flex-row items-center justify-between w-full">
                          <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-primary/60">{product.category_name}</span>
                          <span className="text-[10px] sm:text-base font-black tracking-tighter">GH¢{Number(product.retail_price).toLocaleString()}</span>
                        </div>
                        <h3 className="text-[11px] sm:text-lg font-black tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-1">{product.name}</h3>
                        <p className="text-[9px] sm:text-xs text-muted-foreground font-medium line-clamp-1 opacity-70">{product.description}</p>
                        <div className="w-full pt-1.5">
                          <Button className="w-full h-8 sm:h-11 rounded-lg sm:rounded-2xl bg-black text-white font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] gap-1.5 shadow-lg shadow-black/5 hover:bg-primary transition-all">
                            <span>Discover</span><ArrowRight className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="h-16 lg:hidden" />
      <Footer />
    </div>
  )
}

function SearchPreview({ show, loading, results, onClose }: { show: boolean, loading: boolean, results: Product[], onClose: () => void }) {
  if (!show) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl animate-in fade-in zoom-in-95 duration-200 origin-top">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            results.map(product => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-white hover:shadow-md group"
              >
                <div className="h-12 w-12 rounded-xl bg-muted/20 overflow-hidden flex items-center justify-center shrink-0">
                  {(() => {
                    try {
                      const imgs = product.images ? JSON.parse(product.images) : []
                      return imgs[0] ? <img src={imgs[0]} alt="" className="h-full w-full object-cover" /> : <Package className="h-6 w-6 text-muted-foreground/30" />
                    } catch { return <Package className="h-6 w-6 text-muted-foreground/30" /> }
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{product.name}</p>
                  <p className="text-[9px] font-bold text-muted-foreground lowercase tracking-tighter">GH¢ {Number(product.retail_price).toLocaleString()}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center space-y-2">
              <Package className="h-8 w-8 mx-auto text-muted-foreground/20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intelligence reports no matches</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
