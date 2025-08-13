"use client"

import { useAuth } from "@/components/auth-provider"
import { CompanyDashboard } from "@/components/company-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function EmpresaPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "empresa_recolectora")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!user || user.role !== "empresa_recolectora") {
    return null
  }

  return <CompanyDashboard user={user} />
}
