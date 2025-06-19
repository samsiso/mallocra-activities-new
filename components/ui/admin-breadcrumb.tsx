"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-400">
      <Link
        href="/admin/dashboard"
        className="flex items-center transition-colors hover:text-orange-400"
      >
        <Home className="mr-1 size-4" />
        Dashboard
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="size-4 text-gray-600" />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-orange-400"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-300">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
