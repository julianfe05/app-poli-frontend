"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Recycle, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/types"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    role: "" as UserRole,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await register(formData)
    } catch (err) {
      setError("Error al crear la cuenta. Por favor intenta de nuevo.")
    }
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <div className="bg-green-600 p-3 rounded-full">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-green-800">EcoCollect</h1>
          </div>
          <div className="flex justify-center space-x-4 text-green-600">
            <Recycle className="h-5 w-5" />
            <Shield className="h-5 w-5" />
            <Leaf className="h-5 w-5" />
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-serif text-2xl text-green-800">
              ¡Únete a nosotros para crear un futuro más limpio!
            </CardTitle>
            <CardDescription className="text-green-600">
              Regístrate para comenzar a gestionar tus residuos de manera efectiva.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-700 font-medium">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700 font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-green-700 font-medium">
                  Tipo de usuario
                </Label>
                <Select onValueChange={(value) => handleInputChange("role", value)} required>
                  <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="empresa_recolectora">Empresa Recolectora</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-green-700 font-medium">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                  placeholder="+1234567890"
                />
              </div>

              {formData.role === "cliente" && (
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-green-700 font-medium">
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                    placeholder="Tu dirección completa"
                  />
                </div>
              )}

              {formData.role === "empresa_recolectora" && (
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-green-700 font-medium">
                    Nombre de la empresa
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 transition-all duration-200 hover:shadow-lg"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
