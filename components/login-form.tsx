"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Recycle, Shield } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Credenciales inválidas, por favor intenta de nuevo.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header with eco-friendly branding */}
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
            <CardTitle className="font-serif text-2xl text-green-800">¡Bienvenido de vuelta! 🌍</CardTitle>
            <CardDescription className="text-green-600">
              Inicia sesión para gestionar tu recolección de residuos de manera eficiente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700 font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                  placeholder="tu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-700 font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                  placeholder="••••••••"
                />
              </div>

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
                {isLoading ? "Iniciando sesión..." : "Acceder al Dashboard"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-green-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="font-medium text-green-700 hover:text-green-800 underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 font-medium mb-2">Credenciales de prueba:</p>
              <div className="text-xs text-green-600 space-y-1">
                <p>Admin: admin@residuos.com / password123</p>
                <p>Cliente: juan.cliente@email.com / password123</p>
                <p>Empresa: empresa@ecolimpia.com / password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
