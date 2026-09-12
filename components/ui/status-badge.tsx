import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        pending: "bg-warning/15 text-warning-foreground border border-warning/30",
        approved: "bg-success/15 text-success border border-success/30",
        paid: "bg-success/15 text-success border border-success/30",
        "partially-paid": "bg-info/15 text-info border border-info/30",
        overdue: "bg-destructive/15 text-destructive border border-destructive/30",
        completed: "bg-success/15 text-success border border-success/30",
        cancelled: "bg-muted text-muted-foreground border border-border",
        delivered: "bg-success/15 text-success border border-success/30",
        "in-transit": "bg-info/15 text-info border border-info/30",
        active: "bg-primary/15 text-primary border border-primary/30",
        defaulted: "bg-destructive/15 text-destructive border border-destructive/30",
        "in-stock": "bg-success/15 text-success border border-success/30",
        overseas: "bg-accent/15 text-accent border border-accent/30",
        processing: "bg-info/15 text-info border border-info/30",
        rejected: "bg-destructive/15 text-destructive border border-destructive/30",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
)

const statusDotVariants = cva("h-1.5 w-1.5 rounded-full", {
  variants: {
    variant: {
      pending: "bg-warning",
      approved: "bg-success",
      paid: "bg-success",
      "partially-paid": "bg-info",
      overdue: "bg-destructive",
      completed: "bg-success",
      cancelled: "bg-muted-foreground",
      delivered: "bg-success",
      "in-transit": "bg-info",
      active: "bg-primary",
      defaulted: "bg-destructive",
      "in-stock": "bg-success",
      overseas: "bg-accent",
      processing: "bg-info",
      rejected: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "pending",
  },
})

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  "partially-paid": "Partially Paid",
  overdue: "Overdue",
  completed: "Completed",
  cancelled: "Cancelled",
  delivered: "Delivered",
  "in-transit": "In Transit",
  active: "Active",
  defaulted: "Defaulted",
  "in-stock": "In Stock",
  overseas: "Overseas",
  processing: "Processing",
  rejected: "Rejected",
}

function StatusBadge({
  className,
  variant,
  showDot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {showDot && <span className={statusDotVariants({ variant })} />}
      {children || (variant && statusLabels[variant])}
    </span>
  )
}

export { StatusBadge, statusBadgeVariants }
