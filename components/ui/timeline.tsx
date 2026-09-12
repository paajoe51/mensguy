import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Circle, Clock } from "lucide-react"

interface TimelineStep {
  title: string
  description?: string
  timestamp?: string
  status: "completed" | "current" | "upcoming"
}

interface TimelineProps {
  steps: TimelineStep[]
  orientation?: "vertical" | "horizontal"
  className?: string
}

export function Timeline({ steps, orientation = "vertical", className }: TimelineProps) {
  if (orientation === "horizontal") {
    return (
      <div className={cn("w-full", className)}>
        <div className="relative flex items-start justify-between">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${(steps.filter((s) => s.status === "completed").length / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background z-10",
                  step.status === "completed" && "border-primary bg-primary text-primary-foreground",
                  step.status === "current" && "border-primary",
                  step.status === "upcoming" && "border-muted"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : step.status === "current" ? (
                  <Clock className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "upcoming" && "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.timestamp && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, index) => (
        <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Vertical line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "absolute left-4 top-8 h-full w-0.5 -translate-x-1/2",
                step.status === "completed" ? "bg-primary" : "bg-muted"
              )}
            />
          )}

          {/* Step indicator */}
          <div
            className={cn(
              "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
              step.status === "completed" && "border-primary bg-primary text-primary-foreground",
              step.status === "current" && "border-primary bg-background",
              step.status === "upcoming" && "border-muted bg-background"
            )}
          >
            {step.status === "completed" ? (
              <Check className="h-4 w-4" />
            ) : step.status === "current" ? (
              <Clock className="h-4 w-4 text-primary" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {/* Step content */}
          <div className="flex-1 pt-1">
            <p
              className={cn(
                "text-sm font-medium",
                step.status === "upcoming" && "text-muted-foreground"
              )}
            >
              {step.title}
            </p>
            {step.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
            )}
            {step.timestamp && (
              <p className="mt-1 text-xs text-muted-foreground">{step.timestamp}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
