"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, ShoppingCart, User, Package, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Services", href: "/services" },
  { name: "Request Item", href: "/request" },
  { name: "About", href: "/about" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { user, logout } = useAuth()
  const { totalCount } = useCart()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">
            MENSGUY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          
          <Button variant="ghost" size="icon" asChild className="relative ml-2 rounded-full" aria-label="Shopping Cart">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </div>

        {/* Desktop Actions */}
        {user ? (
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={user.role === 'Customer' ? '/dashboard/orders' : '/admin'}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {user.role === 'Customer' ? 'My Dashboard' : 'Admin Panel'}
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="ghost" size="icon" asChild className="relative rounded-full" aria-label="Shopping Cart">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Package className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-serif text-xl font-bold">MENSGUY</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  {user ? (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href={user.role === 'Customer' ? '/dashboard/orders' : '/admin'}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          {user.role === 'Customer' ? 'My Dashboard' : 'Admin'}
                        </Link>
                      </Button>
                      <Button variant="destructive" className="w-full" onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login">
                          <User className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/shop">Shop Now</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
