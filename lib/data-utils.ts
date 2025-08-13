import type { User, Collection, Report, CollectionStats } from "./types"
import { mockUsers, mockCollections, mockReports } from "./mock-data"

// Simulate database operations with localStorage
export class DataService {
  private static getStorageKey(type: string): string {
    return `waste-collection-${type}`
  }

  // Users
  static getUsers(): User[] {
    if (typeof window === "undefined") return mockUsers
    const stored = localStorage.getItem(this.getStorageKey("users"))
    return stored ? JSON.parse(stored) : mockUsers
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find((user) => user.id === id)
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((user) => user.email === email)
  }

  static saveUser(user: User): void {
    if (typeof window === "undefined") return
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === user.id)
    if (index >= 0) {
      users[index] = user
    } else {
      users.push(user)
    }
    localStorage.setItem(this.getStorageKey("users"), JSON.stringify(users))
  }

  // Collections
  static getCollections(): Collection[] {
    if (typeof window === "undefined") return mockCollections
    const stored = localStorage.getItem(this.getStorageKey("collections"))
    return stored ? JSON.parse(stored) : mockCollections
  }

  static getCollectionsByUserId(userId: string): Collection[] {
    return this.getCollections().filter(
      (collection) => collection.clientId === userId || collection.companyId === userId,
    )
  }

  static saveCollection(collection: Collection): void {
    if (typeof window === "undefined") return
    const collections = this.getCollections()
    const index = collections.findIndex((c) => c.id === collection.id)
    if (index >= 0) {
      collections[index] = collection
    } else {
      collections.push(collection)
    }
    localStorage.setItem(this.getStorageKey("collections"), JSON.stringify(collections))
  }

  // Reports
  static getReports(): Report[] {
    if (typeof window === "undefined") return mockReports
    const stored = localStorage.getItem(this.getStorageKey("reports"))
    return stored ? JSON.parse(stored) : mockReports
  }

  static getReportsByUserId(userId: string): Report[] {
    return this.getReports().filter((report) => report.userId === userId)
  }

  static generateCollectionStats(userId?: string): CollectionStats {
    const collections = userId ? this.getCollectionsByUserId(userId) : this.getCollections()

    const completed = collections.filter((c) => c.status === "completada")
    const totalQuantity = completed.reduce((sum, c) => sum + c.quantity, 0)

    const byType = collections.reduce(
      (acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + c.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    const byMonth = collections.reduce(
      (acc, c) => {
        const month = c.scheduledDate.toISOString().slice(0, 7)
        acc[month] = (acc[month] || 0) + c.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalCollections: collections.length,
      completedCollections: completed.length,
      totalQuantity,
      byType,
      byMonth,
    }
  }
}
