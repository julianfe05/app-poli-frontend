"use client"
import { useState, useEffect } from "react"
import type { User, Collection } from "@/lib/types"
import { DataService } from "@/lib/data-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, Truck, BarChart3 } from "lucide-react"
import { AppLayout } from "./app-layout"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { QuickStatsGrid } from "./quick-stats"
import { ReportsDashboard } from "./reports-dashboard"

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const allCollections = DataService.getCollections()
    const allUsers = DataService.getUsers()
    setCollections(allCollections)
    setUsers(allUsers)
  }, [])

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "cliente":
        return "bg-blue-100 text-blue-800"
      case "empresa_recolectora":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate stats
  const stats = [
    {
      title: "Total Recolecciones",
      value: collections.length,
      subtitle: "En todo el sistema",
      icon: BarChart3,
      color: "green" as const,
    },
    {
      title: "Completadas",
      value: collections.filter((c) => c.status === "completada").length,
      subtitle: `${collections.length > 0 ? Math.round((collections.filter((c) => c.status === "completada").length / collections.length) * 100) : 0}% tasa global`,
      icon: Calendar,
      color: "blue" as const,
      trend: {
        value: 15,
        isPositive: true,
      },
    },
    {
      title: "Total Usuarios",
      value: users.length,
      subtitle: `${users.filter((u) => u.role === "cliente").length} clientes, ${users.filter((u) => u.role === "empresa_recolectora").length} empresas`,
      icon: Users,
      color: "purple" as const,
    },
    {
      title: "Total Residuos",
      value: `${collections.reduce((sum, c) => sum + c.quantity, 0)} kg`,
      subtitle: "Cantidad total procesada",
      icon: Truck,
      color: "yellow" as const,
    },
  ]

  const breadcrumbItems = [{ label: "Panel de Administración", current: true }]

  return (
    <AppLayout
      user={user}
      title="Panel de Administración"
      subtitle="Supervisa todas las operaciones del sistema de gestión de residuos"
    >
      <BreadcrumbNav items={breadcrumbItems} />

      <QuickStatsGrid stats={stats} />

      <Tabs defaultValue="collections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collections">Recolecciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="reports">Reportes Globales</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6">
          <h3 className="font-serif text-xl font-semibold text-green-800">Todas las Recolecciones</h3>
          <div className="grid gap-4">
            {collections.map((collection) => {
              const client = users.find((u) => u.id === collection.clientId)
              const company = users.find((u) => u.id === collection.companyId)

              return (
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
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-green-700">
                          <strong>Cliente:</strong> {client?.name || "No asignado"}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Cantidad:</strong> {collection.quantity} kg
                        </p>
                      </div>
                      {company && (
                        <p className="text-sm text-green-600">
                          <strong>Empresa:</strong> {company.company || company.name}
                        </p>
                      )}
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
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <h3 className="font-serif text-xl font-semibold text-green-800">Todos los Usuarios</h3>
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="border-green-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-green-800 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {user.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {user.email} • {user.phone}
                      </CardDescription>
                    </div>
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {user.address && (
                      <p className="text-sm text-green-600">
                        <strong>Dirección:</strong> {user.address}
                      </p>
                    )}
                    {user.company && (
                      <p className="text-sm text-green-600">
                        <strong>Empresa:</strong> {user.company}
                      </p>
                    )}
                    <p className="text-sm text-green-600">
                      <strong>Registrado:</strong> {new Date(user.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsDashboard user={user} collections={collections} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
