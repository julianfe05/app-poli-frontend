"use client"
import { useState, useEffect } from "react"
import type { User, Collection } from "@/lib/types"
import { DataService } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Trash2, Plus, TrendingUp, CheckCircle } from "lucide-react"
import { AppLayout } from "./app-layout"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { QuickStatsGrid } from "./quick-stats"
import { CollectionForm } from "./collection-form"
import { ReportsDashboard } from "./reports-dashboard"

interface ClientDashboardProps {
  user: User
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const userCollections = DataService.getCollectionsByUserId(user.id)
    setCollections(userCollections)
  }, [user.id])

  const handleNewCollection = (collection: Collection) => {
    setCollections((prev) => [...prev, collection])
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "programada":
        return "bg-blue-100 text-blue-800"
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800"
      case "completada":
        return "bg-green-100 text-green-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "organicos":
        return "bg-green-100 text-green-800"
      case "reciclables":
        return "bg-blue-100 text-blue-800"
      case "peligrosos":
        return "bg-red-100 text-red-800"
      case "general":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate stats
  const stats = [
    {
      title: "Total Recolecciones",
      value: collections.length,
      subtitle: "Programadas y completadas",
      icon: Trash2,
      color: "green" as const,
    },
    {
      title: "Completadas",
      value: collections.filter((c) => c.status === "completada").length,
      subtitle: `${collections.length > 0 ? Math.round((collections.filter((c) => c.status === "completada").length / collections.length) * 100) : 0}% tasa de éxito`,
      icon: CheckCircle,
      color: "blue" as const,
      trend: {
        value: 12,
        isPositive: true,
      },
    },
    {
      title: "Total Residuos",
      value: `${collections.reduce((sum, c) => sum + c.quantity, 0)} kg`,
      subtitle: "Cantidad total gestionada",
      icon: TrendingUp,
      color: "purple" as const,
    },
    {
      title: "Próximas",
      value: collections.filter((c) => c.status === "programada").length,
      subtitle: "Recolecciones pendientes",
      icon: Calendar,
      color: "yellow" as const,
    },
  ]

  const breadcrumbItems = [{ label: "Dashboard", current: true }]

  return (
    <AppLayout
      user={user}
      title={`Bienvenido, ${user.name.split(" ")[0]}`}
      subtitle="Gestiona tus recolecciones de residuos de manera eficiente y sostenible"
      actions={
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700 text-white font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Recolección
        </Button>
      }
    >
      <BreadcrumbNav items={breadcrumbItems} />

      <QuickStatsGrid stats={stats} />

      <Tabs defaultValue="collections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collections">Mis Recolecciones</TabsTrigger>
          <TabsTrigger value="reports">Reportes y Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6">
          {collections.length === 0 ? (
            <Card className="border-green-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trash2 className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="font-medium text-green-800 mb-2">No tienes recolecciones programadas</h3>
                <p className="text-green-600 text-center mb-4">
                  Programa tu primera recolección para comenzar a gestionar tus residuos.
                </p>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Programar Recolección
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {collections.map((collection) => (
                <Card key={collection.id} className="border-green-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-green-800 flex items-center gap-2">
                          <Trash2 className="h-5 w-5" />
                          Recolección #{collection.id}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(collection.scheduledDate).toLocaleDateString("es-ES")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {collection.scheduledTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {collection.address}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(collection.status)}>{collection.status}</Badge>
                        <Badge className={getTypeColor(collection.type)}>{collection.type}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-green-700">
                          <strong>Cantidad:</strong> {collection.quantity} kg
                        </p>
                        {collection.notes && (
                          <p className="text-sm text-green-600">
                            <strong>Notas:</strong> {collection.notes}
                          </p>
                        )}
                        {collection.completedAt && (
                          <p className="text-sm text-green-600">
                            <strong>Completada:</strong> {new Date(collection.completedAt).toLocaleDateString("es-ES")}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsDashboard user={user} collections={collections} />
        </TabsContent>
      </Tabs>

      {/* Collection Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CollectionForm clientId={user.id} onSubmit={handleNewCollection} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </AppLayout>
  )
}
