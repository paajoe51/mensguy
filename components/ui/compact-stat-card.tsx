import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
    TrendingUp,
    TrendingDown,
    Minus,
    type LucideIcon
} from "lucide-react"

interface CompactStatCardProps {
    title: string
    value: string | number
    trend?: {
        value: number
        isPositive?: boolean // Force positive/negative color regardless of value
        label?: string
    }
    icon?: LucideIcon
    variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info" | "indigo" | "purple"
    className?: string
}

const variantStyles = {
    default: "hover:bg-accent/10 transition-all duration-300",
    primary: "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
    success: "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300",
    warning: "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300",
    destructive: "bg-destructive/5 border-destructive/20 hover:bg-destructive/10 hover:shadow-lg hover:shadow-destructive/5 transition-all duration-300",
    info: "bg-sky-500/5 border-sky-500/20 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300",
    indigo: "bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300",
    purple: "bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300",
}

const iconColors = {
    default: "text-muted-foreground",
    primary: "text-primary",
    success: "text-emerald-600",
    warning: "text-amber-600",
    destructive: "text-destructive",
    info: "text-sky-600",
    indigo: "text-indigo-600",
    purple: "text-purple-600",
}

export function CompactStatCard({
    title,
    value,
    trend,
    icon: Icon,
    variant = "default",
    className,
}: CompactStatCardProps) {
    const isPositiveStatus = trend ? (trend.isPositive ?? trend.value > 0) : false
    const TrendIcon = trend ? (isPositiveStatus ? TrendingUp : TrendingDown) : null

    return (
        <Card className={cn(
            "group overflow-hidden rounded-xl border-none shadow-sm ring-1 ring-border/50 backdrop-blur-sm",
            variantStyles[variant],
            className
        )}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "p-1.5 rounded-lg bg-background/50 ring-1 ring-border/50 shadow-sm group-hover:scale-110 transition-transform duration-300",
                            iconColors[variant]
                        )}>
                            {Icon && <Icon className="h-4 w-4" />}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70">
                            {title}
                        </p>
                    </div>
                </div>
                <div className="flex items-baseline justify-between">
                    <div className="flex flex-col">
                        <p className="text-2xl font-black tracking-tighter text-foreground drop-shadow-sm">
                            {value}
                        </p>
                        {trend?.label && (
                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mt-0.5">
                                {trend.label}
                            </span>
                        )}
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black bg-background/50 ring-1 shadow-sm",
                            isPositiveStatus
                                ? "text-emerald-600 ring-emerald-500/20"
                                : "text-destructive ring-destructive/20"
                        )}>
                            {TrendIcon && <TrendIcon className="h-3 w-3" />}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                {/* Subtle bottom accent line */}
                <div className={cn(
                    "absolute bottom-0 left-0 h-0.5 w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100 transition-all duration-500 origin-left",
                    variant === 'primary' ? 'bg-primary' :
                        variant === 'success' ? 'bg-emerald-500' :
                            variant === 'destructive' ? 'bg-destructive' : 'bg-muted-foreground/20'
                )} />
            </CardContent>
        </Card>
    )
}
