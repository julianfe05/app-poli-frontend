"use client"

import type React from "react"
import { useState } from "react"
import type { Collection } from "@/lib/types"
import { DataService } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Trash2, X } from "lucide-react"

interface CollectionFormProps {
  clientId: string
  onSubmit: (collection: Collection) => void
  onCancel: () => void
}

export function CollectionForm({ clientId, onSubmit, onCancel }: CollectionFormProps) {
  const [formData, setFormData] = useState({
    type: "",
    scheduledDate: "",
    scheduledTime: "",
    address: "",
    quantity: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const newCollection: Collection = {
      id: Date.now().toString(),
      clientId,
      type: formData.type as Collection["type"],
      scheduledDate: new Date(formData.scheduledDate),
      scheduledTime: formData.scheduledTime,
      address: formData.address,
      quantity: Number.parseInt(formData.quantity),
      status: "programada",
      notes: formData.notes || undefined,
      createdAt: new Date(),
    }

    DataService.saveCollection(newCollection)
    onSubmit(newCollection)
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get tomorrow's date as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Programar Nueva Recolección
            </CardTitle>
            <CardDescription>Completa los detalles para programar tu recolección de residuos.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-green-600 hover:text-green-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-green-700 font-medium">
              Tipo de residuo
            </Label>
            <Select onValueChange={(value) => handleInputChange("type", value)} required>
              <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Selecciona el tipo de residuo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organicos">Orgánicos</SelectItem>
                <SelectItem value="reciclables">Reciclables</SelectItem>
                <SelectItem value="peligrosos">Peligrosos</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate" className="text-green-700 font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Fecha
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                min={minDate}
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                required
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime" className="text-green-700 font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Hora
              </Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                required
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-green-700 font-medium flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Dirección de recolección
            </Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
              placeholder="Dirección completa donde recoger los residuos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-green-700 font-medium">
              Cantidad estimada (kg)
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              required
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
              placeholder="Peso estimado en kilogramos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-green-700 font-medium">
              Notas adicionales (opcional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
              placeholder="Instrucciones especiales, ubicación específica, etc."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isLoading ? "Programando..." : "Programar Recolección"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-green-200 text-green-700 bg-transparent"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
