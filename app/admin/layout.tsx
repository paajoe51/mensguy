"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Truck,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  Boxes,
  ClipboardList,
  TrendingUp,
  Calculator,
  ShoppingBag,
  Globe,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const getNavigation = (role: string, permissions: Record<string, string> = {}) => {
  const nav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, module: "Executive Dashboard" },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      module: "Procurement / Sourcing",
      children: [
        { name: "All Products", href: "/admin/products" },
        { name: "Categories", href: "/admin/products/categories" },
        { name: "Inventory", href: "/admin/products/inventory" },
      ]
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      module: "Installment Config",
      children: [
        { name: "All Orders", href: "/admin/orders" },
        { name: "Pending", href: "/admin/orders?status=pending" },
        { name: "Processing", href: "/admin/orders?status=processing" },
        { name: "Completed", href: "/admin/orders?status=completed" },
      ]
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
      module: "Executive Dashboard",
      children: [
        { name: "All Customers", href: "/admin/customers" },
      ]
    },
    {
      name: "Finance",
      href: "/admin/finance",
      icon: DollarSign,
      module: "Finance Ledger",
      children: [
        { name: "Overview", href: "/admin/finance" },
        { name: "Transactions", href: "/admin/finance/transactions" },
        { name: "Installments", href: "/admin/finance/installments" },
        { name: "Expenses", href: "/admin/finance/expenses" },
        { name: "Reports", href: "/admin/finance/reports" },
      ]
    },
    {
      name: "Procurement",
      href: "/admin/procurement",
      icon: Globe,
      module: "Procurement / Sourcing",
      children: [
        { name: "Sourcing Requests", href: "/admin/customers/requests" },
        { name: "Overseas Orders", href: "/admin/procurement" },
        { name: "Suppliers", href: "/admin/procurement/suppliers" },
        { name: "Shipments", href: "/admin/procurement/shipments" },
      ]
    },
    {
      name: "Delivery",
      href: "/admin/delivery",
      icon: Truck,
      module: "Logistics / Dispatch",
      children: [
        { name: "All Deliveries", href: "/admin/delivery" },
        { name: "Schedule", href: "/admin/delivery/schedule" },
        { name: "Drivers", href: "/admin/delivery/drivers" },
      ]
    },
    {
      name: "Staff",
      href: "/admin/staff",
      icon: Users,
      module: "Staff & Governance",
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: FileText,
      module: "Executive Dashboard",
      children: [
        { name: "Sales Reports", href: "/admin/reports/sales" },
        { name: "Inventory Reports", href: "/admin/reports/inventory" },
        { name: "Customer Reports", href: "/admin/reports/customers" },
      ]
    },
    { name: "Settings", href: "/admin/settings", icon: Settings, module: "Administrator" },
  ];

  if (role === 'Administrator') return nav;

  return nav.filter(item => {
    if (item.module === 'Administrator') return role === 'Administrator';
    const level = permissions[item.module] || 'none';
    return level !== 'none';
  });
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    children: [
      { name: "All Products", href: "/admin/products" },
      { name: "Categories", href: "/admin/products/categories" },
      { name: "Inventory", href: "/admin/products/inventory" },
    ]
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    children: [
      { name: "All Orders", href: "/admin/orders" },
      { name: "Pending", href: "/admin/orders?status=pending" },
      { name: "Processing", href: "/admin/orders?status=processing" },
      { name: "Completed", href: "/admin/orders?status=completed" },
    ]
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    children: [
      { name: "All Customers", href: "/admin/customers" },
    ]
  },
  {
    name: "Finance",
    href: "/admin/finance",
    icon: DollarSign,
    children: [
      { name: "Overview", href: "/admin/finance" },
      { name: "Transactions", href: "/admin/finance/transactions" },
      { name: "Installments", href: "/admin/finance/installments" },
      { name: "Expenses", href: "/admin/finance/expenses" },
      { name: "Reports", href: "/admin/finance/reports" },
    ]
  },
  {
    name: "Procurement",
    href: "/admin/procurement",
    icon: Globe,
    children: [
      { name: "Sourcing Requests", href: "/admin/customers/requests" },
      { name: "Overseas Orders", href: "/admin/procurement" },
      { name: "Suppliers", href: "/admin/procurement/suppliers" },
      { name: "Shipments", href: "/admin/procurement/shipments" },
    ]
  },
  {
    name: "Delivery",
    href: "/admin/delivery",
    icon: Truck,
    children: [
      { name: "All Deliveries", href: "/admin/delivery" },
      { name: "Schedule", href: "/admin/delivery/schedule" },
      { name: "Drivers", href: "/admin/delivery/drivers" },
    ]
  },
  {
    name: "Staff",
    href: "/admin/staff",
    icon: Users,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: FileText,
    children: [
      { name: "Sales Reports", href: "/admin/reports/sales" },
      { name: "Inventory Reports", href: "/admin/reports/inventory" },
      { name: "Customer Reports", href: "/admin/reports/customers" },
    ]
  },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

function NavItem({ item, pathname, isCollapsed }: {
  item: any,
  pathname: string,
  isCollapsed: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/") || pathname.startsWith(item.href + "?")
  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon

  if (hasChildren && !isCollapsed) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <span className="flex items-center gap-3">
            <Icon className="h-4 w-4 shrink-0" />
            {item.name}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
            {item.children?.map((child: any) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      title={isCollapsed ? item.name : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && item.name}
    </Link>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role === 'Customer')) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!user || user.role === 'Customer') {
    return null
  }

  const activeNavigation = getNavigation(user.role, user.permissions)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 lg:relative",
          isCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                MG
              </div>
              <span className="font-semibold text-sidebar-foreground">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-sidebar-foreground hover:bg-sidebar-accent lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {activeNavigation.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* User section */}
        {!isCollapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.username}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 overflow-hidden">
            <Link href="/admin" className="hover:text-primary transition-colors">Business Hub</Link>
            {pathname.split('/').filter(Boolean).slice(1).map((segment, idx, arr) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-border" />
                <span className={cn(idx === arr.length - 1 ? "text-primary/80" : "hover:text-primary transition-colors cursor-pointer capitalize")}>
                  {segment.replace(/-/g, ' ')}
                </span>
              </div>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">Order #1234 from John Doe</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">GH¢500 installment from Jane Smith</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Low stock alert</p>
                    <p className="text-xs text-muted-foreground">iPhone 15 Pro is running low</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Link href="/admin/notifications" className="w-full text-primary">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block truncate max-w-[100px]">{user?.username}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
