"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface QuickStatProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "green" | "blue" | "yellow" | "red" | "purple"
}

export function QuickStat({ title, value, subtitle, icon: Icon, trend, color = "green" }: QuickStatProps) {
  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    purple: "text-purple-600",
  }

  return (
    <Card className="border-green-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-600">{title}</p>
            <p className="text-2xl font-bold text-green-800">{value}</p>
            {subtitle && <p className="text-xs text-green-500">{subtitle}</p>}
            {trend && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  trend.isPositive ? "text-green-700 border-green-300" : "text-red-700 border-red-300"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </Badge>
            )}
          </div>
          <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickStatsGridProps {
  stats: QuickStatProps[]
}

export function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <QuickStat key={index} {...stat} />
      ))}
    </div>
  )
}
