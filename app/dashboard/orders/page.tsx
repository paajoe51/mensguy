"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, Package } from "lucide-react"
import { fetchApi } from "@/lib/api"

interface Order {
  id: number
  order_number: string
  created_at: string
  total_amount: number
  status: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchApi("/orders.php")
        setOrders(res.data || [])
      } catch { }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const columns: Column<Order>[] = [
    {
      key: "order_number",
      header: "Order ID",
      cell: (order) => (
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="font-medium text-primary hover:underline"
        >
          {order.order_number}
        </Link>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      cell: (order) => new Date(order.created_at).toLocaleDateString(),
    },
    {
      key: "total_amount",
      header: "Total",
      cell: (order) => <span className="font-medium">GH¢{Number(order.total_amount).toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order) => <StatusBadge variant={order.status.toLowerCase() as any} />,
    },
    {
      key: "actions",
      header: "",
      cell: (order) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/orders/${order.id}`}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">View order</span>
          </Link>
        </Button>
      ),
      className: "w-12",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        description="View and track all your orders"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center gap-4 border-dashed">
          <Package className="h-12 w-12 text-muted-foreground opacity-20" />
          <div className="space-y-1">
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </Card>
      ) : (
        <DataTable
          columns={columns as any}
          data={orders as any}
          searchKey="order_number"
          searchPlaceholder="Search orders..."
          emptyMessage="No orders found"
          emptyDescription="You haven't placed any orders yet"
        />
      )}
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  )
}
