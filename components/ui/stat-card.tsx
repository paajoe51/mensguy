import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  type LucideIcon 
} from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label?: string
  }
  className?: string
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "destructive"
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary/5 border-primary/20",
  accent: "bg-accent/5 border-accent/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  destructive: "bg-destructive/5 border-destructive/20",
}

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: StatCardProps) {
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
        ? TrendingDown
        : Minus
    : null

  const trendColor = trend
    ? trend.value > 0
      ? "text-success"
      : trend.value < 0
        ? "text-destructive"
        : "text-muted-foreground"
    : ""

  return (
    <Card className={cn("overflow-hidden", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {(description || trend) && (
              <div className="flex items-center gap-2 text-sm">
                {trend && TrendIcon && (
                  <span className={cn("flex items-center gap-1", trendColor)}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {trend.value > 0 ? "+" : ""}
                      {trend.value}%
                    </span>
                  </span>
                )}
                {(description || trend?.label) && (
                  <span className="text-muted-foreground">
                    {trend?.label || description}
                  </span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-lg p-2.5", iconVariantStyles[variant])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
