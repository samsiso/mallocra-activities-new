"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

export interface SortableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  width?: string
}

export interface SortableTableProps<T> {
  columns: SortableColumn[]
  data: T[]
  defaultSort?: {
    key: string
    direction: "asc" | "desc"
  }
  className?: string
  rowClassName?: (row: T) => string
  onRowClick?: (row: T) => void
}

type SortDirection = "asc" | "desc" | null

export default function SortableTable<T extends Record<string, any>>({
  columns,
  data,
  defaultSort,
  className = "",
  rowClassName,
  onRowClick
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(
    defaultSort?.key || null
  )
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    defaultSort?.direction || null
  )

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column?.sortable) return

    if (sortKey === columnKey) {
      // Cycle through: asc -> desc -> none -> asc
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortKey(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortKey(columnKey)
      setSortDirection("asc")
    }
  }

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortDirection === "asc" ? 1 : -1
      if (bValue == null) return sortDirection === "asc" ? -1 : 1

      // Handle different types
      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        return sortDirection === "asc" ? result : -result
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const result = aValue - bValue
        return sortDirection === "asc" ? result : -result
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        const result = aValue.getTime() - bValue.getTime()
        return sortDirection === "asc" ? result : -result
      }

      // Fallback to string comparison
      const result = String(aValue).localeCompare(String(bValue))
      return sortDirection === "asc" ? result : -result
    })
  }, [data, sortKey, sortDirection])

  const getSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return <ChevronsUpDown className="size-4 text-gray-500" />
    }

    if (sortDirection === "asc") {
      return <ChevronUp className="size-4 text-orange-500" />
    }

    if (sortDirection === "desc") {
      return <ChevronDown className="size-4 text-orange-500" />
    }

    return <ChevronsUpDown className="size-4 text-gray-500" />
  }

  const getCellValue = (column: SortableColumn, row: T) => {
    const value = row[column.key]

    if (column.render) {
      return column.render(value, row)
    }

    // Default formatting for common types
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }

    if (
      typeof value === "number" &&
      column.key.toLowerCase().includes("amount")
    ) {
      return `€${value.toLocaleString()}`
    }

    if (value == null) {
      return <span className="text-gray-500">-</span>
    }

    return String(value)
  }

  if (data.length === 0) {
    return (
      <div
        className={`rounded-lg border border-gray-700 bg-gray-800 ${className}`}
      >
        <div className="p-8 text-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-700 bg-gray-800 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-700 bg-gray-900">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 ${
                    column.width || "w-auto"
                  } ${
                    column.sortable
                      ? "cursor-pointer select-none transition-colors hover:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={`
                  ${onRowClick ? "hover:bg-gray-750 cursor-pointer" : ""} 
                  ${rowClassName ? rowClassName(row) : ""} 
                  transition-colors
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-300"
                  >
                    {getCellValue(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="border-t border-gray-700 bg-gray-900 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            Showing {sortedData.length} of {data.length} results
          </span>
          {sortKey && sortDirection && (
            <span>
              Sorted by {columns.find(col => col.key === sortKey)?.label}(
              {sortDirection === "asc" ? "ascending" : "descending"})
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
