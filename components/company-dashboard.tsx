"use client"
import { useState, useEffect } from "react"
import type { User, Collection } from "@/lib/types"
import { DataService } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Truck, CheckCircle, TrendingUp } from "lucide-react"
import { AppLayout } from "./app-layout"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { QuickStatsGrid } from "./quick-stats"
import { ReportsDashboard } from "./reports-dashboard"

interface CompanyDashboardProps {
  user: User
}

export function CompanyDashboard({ user }: CompanyDashboardProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [availableCollections, setAvailableCollections] = useState<Collection[]>([])

  useEffect(() => {
    // Get collections assigned to this company
    const assignedCollections = DataService.getCollectionsByUserId(user.id)
    setCollections(assignedCollections)

    // Get unassigned collections that the company can take
    const allCollections = DataService.getCollections()
    const unassigned = allCollections.filter((c) => !c.companyId && c.status === "programada")
    setAvailableCollections(unassigned)
  }, [user.id])

  const handleAcceptCollection = (collectionId: string) => {
    const collection = availableCollections.find((c) => c.id === collectionId)
    if (collection) {
      const updatedCollection = { ...collection, companyId: user.id }
      DataService.saveCollection(updatedCollection)

      setCollections((prev) => [...prev, updatedCollection])
      setAvailableCollections((prev) => prev.filter((c) => c.id !== collectionId))
    }
  }

  const handleCompleteCollection = (collectionId: string) => {
    const collection = collections.find((c) => c.id === collectionId)
    if (collection) {
      const updatedCollection = {
        ...collection,
        status: "completada" as const,
        completedAt: new Date(),
      }
      DataService.saveCollection(updatedCollection)

      setCollections((prev) => prev.map((c) => (c.id === collectionId ? updatedCollection : c)))
    }
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
      title: "Recolecciones Asignadas",
      value: collections.length,
      subtitle: "Total de trabajos",
      icon: Truck,
      color: "green" as const,
    },
    {
      title: "Completadas",
      value: collections.filter((c) => c.status === "completada").length,
      subtitle: `${collections.length > 0 ? Math.round((collections.filter((c) => c.status === "completada").length / collections.length) * 100) : 0}% completadas`,
      icon: CheckCircle,
      color: "blue" as const,
      trend: {
        value: 8,
        isPositive: true,
      },
    },
    {
      title: "Disponibles",
      value: availableCollections.length,
      subtitle: "Nuevas oportunidades",
      icon: Calendar,
      color: "yellow" as const,
    },
    {
      title: "Total Residuos",
      value: `${collections.reduce((sum, c) => sum + c.quantity, 0)} kg`,
      subtitle: "Cantidad procesada",
      icon: TrendingUp,
      color: "purple" as const,
    },
  ]

  const breadcrumbItems = [{ label: "Dashboard", current: true }]

  return (
    <AppLayout
      user={user}
      title={`Bienvenido, ${user.company}`}
      subtitle="Gestiona las recolecciones asignadas y encuentra nuevas oportunidades"
    >
      <BreadcrumbNav items={breadcrumbItems} />

      <QuickStatsGrid stats={stats} />

      <Tabs defaultValue="collections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collections">Recolecciones</TabsTrigger>
          <TabsTrigger value="reports">Reportes y Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6">
          {/* Available Collections */}
          {availableCollections.length > 0 && (
            <div className="mb-8">
              <h3 className="font-serif text-xl font-semibold text-green-800 mb-4">Recolecciones Disponibles</h3>
              <div className="grid gap-4">
                {availableCollections.map((collection) => (
                  <Card key={collection.id} className="border-green-200 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-green-800 flex items-center gap-2">
                            <Truck className="h-5 w-5" />
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
                        <Badge className={getTypeColor(collection.type)}>{collection.type}</Badge>
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
                        </div>
                        <Button
                          onClick={() => handleAcceptCollection(collection.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Aceptar Recolección
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Collections */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-semibold text-green-800">Mis Recolecciones</h3>

            {collections.length === 0 ? (
              <Card className="border-green-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Truck className="h-12 w-12 text-green-400 mb-4" />
                  <h3 className="font-medium text-green-800 mb-2">No tienes recolecciones asignadas</h3>
                  <p className="text-green-600 text-center">
                    Acepta recolecciones disponibles para comenzar a trabajar.
                  </p>
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
                            <Truck className="h-5 w-5" />
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
                              <strong>Completada:</strong>{" "}
                              {new Date(collection.completedAt).toLocaleDateString("es-ES")}
                            </p>
                          )}
                        </div>
                        {collection.status === "programada" && (
                          <Button
                            onClick={() => handleCompleteCollection(collection.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar Completada
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsDashboard user={user} collections={collections} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
