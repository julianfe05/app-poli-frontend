"use client"

import React from "react"

import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-green-600 mb-6">
      <Button variant="ghost" size="sm" className="p-1 h-auto">
        <Home className="h-4 w-4" />
      </Button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-green-400" />
          <span
            className={`${
              item.current ? "text-green-800 font-medium" : "text-green-600 hover:text-green-800 cursor-pointer"
            }`}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}
