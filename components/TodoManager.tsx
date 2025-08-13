"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function TodoManager() {
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = () => {
    setIsComplete(true)
  }

  return (
    <div className="p-4">
      <Button onClick={handleComplete} disabled={isComplete}>
        {isComplete ? "Proyecto Completado" : "Marcar como Completado"}
      </Button>
    </div>
  )
}
