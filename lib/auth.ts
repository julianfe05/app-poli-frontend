import type { User } from "./types"
import { DataService } from "./data-utils"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export class AuthService {
  private static STORAGE_KEY = "waste-collection-auth"

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return null

    const authData = JSON.parse(stored)
    return DataService.getUserById(authData.userId) || null
  }

  static login(email: string, password: string): User | null {
    // Simple mock authentication - in real app would validate against backend
    const user = DataService.getUserByEmail(email)
    if (user && password === "password123") {
      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ userId: user.id }))
      }
      return user
    }
    return null
  }

  static register(userData: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    DataService.saveUser(newUser)

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ userId: newUser.id }))
    }

    return newUser
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}
