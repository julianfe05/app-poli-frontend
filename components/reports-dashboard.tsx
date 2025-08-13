"use client"

import { useState, useMemo } from "react"
import type { User, Collection } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import { Calendar, MapPin, TrendingUp, Trash2, BarChart3, PieChartIcon, Download } from "lucide-react"

interface ReportsDashboardProps {
  user: User
  collections: Collection[]
}

export function ReportsDashboard({ user, collections }: ReportsDashboardProps) {
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter collections based on selected filters
  const filteredCollections = useMemo(() => {
    let filtered = collections

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((c) => new Date(c.scheduledDate) >= filterDate)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((c) => c.type === typeFilter)
    }

    return filtered
  }, [collections, dateFilter, typeFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = filteredCollections.filter((c) => c.status === "completada")
    const totalQuantity = completed.reduce((sum, c) => sum + c.quantity, 0)

    // Group by type
    const byType = filteredCollections.reduce(
      (acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + c.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    // Group by month
    const byMonth = filteredCollections.reduce(
      (acc, c) => {
        const month = new Date(c.scheduledDate).toLocaleDateString("es-ES", { month: "short", year: "numeric" })
        acc[month] = (acc[month] || 0) + c.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    // Group by location (simplified)
    const byLocation = filteredCollections.reduce(
      (acc, c) => {
        const location = c.address.split(",")[0] // Take first part of address
        acc[location] = (acc[location] || 0) + c.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    // Group by status
    const byStatus = filteredCollections.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalCollections: filteredCollections.length,
      completedCollections: completed.length,
      totalQuantity,
      averageQuantity: completed.length > 0 ? Math.round(totalQuantity / completed.length) : 0,
      byType,
      byMonth,
      byLocation,
      byStatus,
      completionRate:
        filteredCollections.length > 0 ? Math.round((completed.length / filteredCollections.length) * 100) : 0,
    }
  }, [filteredCollections])

  // Prepare chart data
  const typeChartData = Object.entries(stats.byType).map(([type, quantity]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    quantity,
    fill: getTypeColor(type),
  }))

  const monthChartData = Object.entries(stats.byMonth).map(([month, quantity]) => ({
    month,
    quantity,
  }))

  const locationChartData = Object.entries(stats.byLocation)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 locations
    .map(([location, quantity]) => ({
      location: location.length > 15 ? location.substring(0, 15) + "..." : location,
      quantity,
    }))

  const statusChartData = Object.entries(stats.byStatus).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    fill: getStatusChartColor(status),
  }))

  function getTypeColor(type: string) {
    switch (type) {
      case "organicos":
        return "#16a34a"
      case "reciclables":
        return "#2563eb"
      case "peligrosos":
        return "#dc2626"
      case "general":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  function getStatusChartColor(status: string) {
    switch (status) {
      case "programada":
        return "#2563eb"
      case "en_proceso":
        return "#eab308"
      case "completada":
        return "#16a34a"
      case "cancelada":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const exportReport = () => {
    const reportData = {
      user: user.name,
      dateRange: dateFilter,
      typeFilter,
      stats,
      collections: filteredCollections,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-residuos-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-green-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reportes y Estadísticas
          </h3>
          <p className="text-green-600 text-sm">Análisis detallado de tus recolecciones de residuos</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px] border-green-200">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el tiempo</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] border-green-200">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="organicos">Orgánicos</SelectItem>
              <SelectItem value="reciclables">Reciclables</SelectItem>
              <SelectItem value="peligrosos">Peligrosos</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={exportReport}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Recolecciones</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalCollections}</p>
              </div>
              <Trash2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completadas</p>
                <p className="text-2xl font-bold text-green-800">{stats.completedCollections}</p>
                <p className="text-xs text-green-500">{stats.completionRate}% tasa de éxito</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Residuos</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalQuantity} kg</p>
                <p className="text-xs text-green-500">Promedio: {stats.averageQuantity} kg</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Ubicaciones</p>
                <p className="text-2xl font-bold text-green-800">{Object.keys(stats.byLocation).length}</p>
                <p className="text-xs text-green-500">Diferentes direcciones</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="types" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types">Por Tipo</TabsTrigger>
          <TabsTrigger value="timeline">Cronología</TabsTrigger>
          <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
          <TabsTrigger value="status">Estados</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Distribución por Tipo de Residuo
              </CardTitle>
              <CardDescription>Cantidad total de residuos por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              {typeChartData.length > 0 ? (
                <ChartContainer
                  config={{
                    quantity: {
                      label: "Cantidad (kg)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, quantity }) => `${type}: ${quantity}kg`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="quantity"
                      >
                        {typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-green-600">
                  No hay datos para mostrar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Evolución Temporal
              </CardTitle>
              <CardDescription>Cantidad de residuos recolectados por mes</CardDescription>
            </CardHeader>
            <CardContent>
              {monthChartData.length > 0 ? (
                <ChartContainer
                  config={{
                    quantity: {
                      label: "Cantidad (kg)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="quantity"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ fill: "#16a34a" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-green-600">
                  No hay datos para mostrar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Ubicaciones
              </CardTitle>
              <CardDescription>Ubicaciones con mayor cantidad de residuos recolectados</CardDescription>
            </CardHeader>
            <CardContent>
              {locationChartData.length > 0 ? (
                <ChartContainer
                  config={{
                    quantity: {
                      label: "Cantidad (kg)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationChartData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="location" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="quantity" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-green-600">
                  No hay datos para mostrar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estado de Recolecciones
              </CardTitle>
              <CardDescription>Distribución por estado de las recolecciones</CardDescription>
            </CardHeader>
            <CardContent>
              {statusChartData.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Cantidad",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-green-600">
                  No hay datos para mostrar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Collections Table */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Recolecciones Recientes</CardTitle>
          <CardDescription>Últimas recolecciones con detalles de fecha, ubicación y cantidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCollections.slice(0, 10).map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-green-800">
                      {new Date(collection.scheduledDate).toLocaleDateString("es-ES")} - {collection.scheduledTime}
                    </span>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {collection.address}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {collection.quantity} kg
                  </Badge>
                  <Badge className={`${getTypeColor(collection.type)} text-white`}>{collection.type}</Badge>
                </div>
              </div>
            ))}
            {filteredCollections.length === 0 && (
              <div className="text-center py-8 text-green-600">
                No hay recolecciones que coincidan con los filtros seleccionados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
