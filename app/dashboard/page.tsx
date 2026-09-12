"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { StatCard } from "@/components/ui/stat-card"
import { PageHeader } from "@/components/page-header"
import { fetchApi } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { 
  ShoppingBag, 
  FileText, 
  CreditCard, 
  Calendar,
  ArrowRight,
  Package,
  Loader2
} from "lucide-react"

export default function CustomerDashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetchApi('/customer_dashboard_stats.php')
        if (res.status === 'success') {
          setStats(res.data)
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.total_orders || "0",
      icon: ShoppingBag,
      description: "All time",
    },
    {
      title: "Pending Orders",
      value: stats?.pending_orders || "0",
      icon: Package,
      description: "Awaiting delivery",
    },
    {
      title: "Active Installments",
      value: stats?.active_installments || "0",
      icon: Calendar,
      description: "In progress",
    },
    {
      title: "Total Spent",
      value: `GH¢ ${stats?.total_spent?.toLocaleString() || "0"}`,
      icon: CreditCard,
      description: "Aggregate spend",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${(user as any)?.full_name || user?.username}! Here's an overview of your account.`}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_orders?.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <Link 
                      href={`/dashboard/orders/${order.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {order.order_number}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium">GH¢ {parseFloat(order.total_amount).toLocaleString()}</p>
                    <StatusBadge variant={order.status.toLowerCase()} />
                  </div>
                </div>
              ))}
              {(!stats?.recent_orders || stats.recent_orders.length === 0) && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No orders found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Requests</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/requests">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_requests?.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <Link 
                      href={`/dashboard/requests/${request.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {request.product_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      ID: {request.id} · {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge variant={request.status.toLowerCase()} />
                </div>
              ))}
              {(!stats?.recent_requests || stats.recent_requests.length === 0) && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No requests yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Shop
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/request">
                <FileText className="mr-2 h-4 w-4" />
                Request Item
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/installments">
                <Calendar className="mr-2 h-4 w-4" />
                View Installments
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
