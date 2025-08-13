export type UserRole = "admin" | "cliente" | "empresa_recolectora"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  address?: string
  company?: string // For empresa_recolectora role
  createdAt: Date
}

export interface Collection {
  id: string
  clientId: string
  companyId?: string // Assigned collection company
  type: "organicos" | "reciclables" | "peligrosos" | "general"
  scheduledDate: Date
  scheduledTime: string
  address: string
  quantity: number // in kg
  status: "programada" | "en_proceso" | "completada" | "cancelada"
  notes?: string
  completedAt?: Date
  createdAt: Date
}

export interface Report {
  id: string
  userId: string
  collectionId: string
  date: Date
  location: string
  quantity: number
  wasteType: string
  status: string
  notes?: string
}

export interface CollectionStats {
  totalCollections: number
  completedCollections: number
  totalQuantity: number
  byType: Record<string, number>
  byMonth: Record<string, number>
}
