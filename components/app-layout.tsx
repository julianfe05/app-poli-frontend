"use client"

import type React from "react"
import { useState } from "react"
import type { User } from "@/lib/types"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Leaf, LogOut, UserIcon, Settings, Bell, Menu, Shield, Truck } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
  user: User
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function AppLayout({ children, user, title, subtitle, actions }: AppLayoutProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { logout } = useAuth()

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Administrador",
          icon: Shield,
          color: "bg-purple-100 text-purple-800",
          description: "Acceso completo al sistema",
        }
      case "cliente":
        return {
          label: "Cliente",
          icon: UserIcon,
          color: "bg-blue-100 text-blue-800",
          description: "Gestión de recolecciones",
        }
      case "empresa_recolectora":
        return {
          label: "Empresa Recolectora",
          icon: Truck,
          color: "bg-green-100 text-green-800",
          description: "Servicios de recolección",
        }
      default:
        return {
          label: "Usuario",
          icon: UserIcon,
          color: "bg-gray-100 text-gray-800",
          description: "Usuario del sistema",
        }
    }
  }

  const roleInfo = getRoleInfo(user.role)
  const RoleIcon = roleInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-full">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold text-green-800">EcoCollect</h1>
                  <p className="text-sm text-green-600 hidden sm:block">{roleInfo.description}</p>
                </div>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-green-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 hover:bg-green-50">
                    <div className="text-right">
                      <p className="font-medium text-green-800 text-sm">{user.name}</p>
                      <p className="text-xs text-green-600">{user.email}</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <RoleIcon className="h-4 w-4 text-green-600" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile User Info */}
            <div className="md:hidden flex items-center space-x-2">
              <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-green-200 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <RoleIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 text-sm">{user.name}</p>
                    <p className="text-xs text-green-600">{user.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Perfil
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Bell className="mr-2 h-4 w-4" />
                    Notificaciones
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="font-serif text-3xl font-bold text-green-800">{title}</h2>
              {subtitle && <p className="text-green-600 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center space-x-3">{actions}</div>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-green-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600">
                © 2024 EcoCollect. Contribuyendo a un futuro más sostenible.
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-green-600">
              <span>Versión 1.0.0</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Soporte: soporte@ecocollect.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
