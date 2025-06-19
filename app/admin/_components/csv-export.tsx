"use client"

import { useState } from "react"
import {
  Download,
  FileText,
  Calendar,
  Users,
  Activity,
  CheckCircle
} from "lucide-react"

interface ExportField {
  key: string
  label: string
  selected: boolean
}

interface ExportOption {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  fields: ExportField[]
  getData: () => Promise<Record<string, any>[]>
}

interface CSVExportProps {
  className?: string
}

export default function CSVExport({ className = "" }: CSVExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedExport, setSelectedExport] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFields, setExportFields] = useState<ExportField[]>([])

  const exportOptions: ExportOption[] = [
    {
      id: "activities",
      name: "Activities",
      description: "Export all activity data",
      icon: Activity,
      fields: [
        { key: "id", label: "ID", selected: true },
        { key: "title", label: "Title", selected: true },
        { key: "description", label: "Description", selected: false },
        { key: "price", label: "Price", selected: true },
        { key: "location", label: "Location", selected: true },
        { key: "status", label: "Status", selected: true },
        { key: "createdAt", label: "Created Date", selected: true }
      ],
      getData: async () => {
        // Mock data - in real implementation this would call the API
        return [
          {
            id: "ACT001",
            title: "Jet Ski Adventure",
            description: "Thrilling jet ski experience",
            price: 85,
            location: "Palma Bay",
            status: "active",
            createdAt: "2024-01-15"
          },
          {
            id: "ACT002",
            title: "Boat Tour",
            description: "Scenic coastal boat tour",
            price: 120,
            location: "Port Adriano",
            status: "active",
            createdAt: "2024-01-14"
          }
        ]
      }
    },
    {
      id: "bookings",
      name: "Bookings",
      description: "Export booking information",
      icon: Calendar,
      fields: [
        { key: "id", label: "Booking ID", selected: true },
        { key: "activityTitle", label: "Activity", selected: true },
        { key: "customerName", label: "Customer Name", selected: true },
        { key: "customerEmail", label: "Email", selected: false },
        { key: "totalParticipants", label: "Participants", selected: true },
        { key: "totalAmount", label: "Amount", selected: true },
        { key: "status", label: "Status", selected: true },
        { key: "bookingDate", label: "Booking Date", selected: true },
        { key: "activityDate", label: "Activity Date", selected: true }
      ],
      getData: async () => {
        return [
          {
            id: "BK001",
            activityTitle: "Jet Ski Adventure",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            totalParticipants: 2,
            totalAmount: 170,
            status: "confirmed",
            bookingDate: "2024-01-20",
            activityDate: "2024-01-25"
          }
        ]
      }
    },
    {
      id: "customers",
      name: "Customers",
      description: "Export customer data",
      icon: Users,
      fields: [
        { key: "id", label: "Customer ID", selected: true },
        { key: "name", label: "Name", selected: true },
        { key: "email", label: "Email", selected: true },
        { key: "phone", label: "Phone", selected: false },
        { key: "totalBookings", label: "Total Bookings", selected: true },
        { key: "totalSpent", label: "Total Spent", selected: true },
        { key: "lastBooking", label: "Last Booking", selected: true },
        { key: "createdAt", label: "Registered Date", selected: true }
      ],
      getData: async () => {
        return [
          {
            id: "CUST001",
            name: "John Doe",
            email: "john@example.com",
            phone: "+34 123 456 789",
            totalBookings: 3,
            totalSpent: 450,
            lastBooking: "2024-01-25",
            createdAt: "2024-01-10"
          }
        ]
      }
    }
  ]

  const handleExportSelect = (exportId: string) => {
    const option = exportOptions.find(opt => opt.id === exportId)
    if (option) {
      setSelectedExport(exportId)
      setExportFields([...option.fields])
    }
  }

  const toggleField = (fieldKey: string) => {
    setExportFields(fields =>
      fields.map(field =>
        field.key === fieldKey ? { ...field, selected: !field.selected } : field
      )
    )
  }

  const generateCSV = (data: Record<string, any>[], fields: ExportField[]) => {
    const selectedFields = fields.filter(field => field.selected)
    const headers = selectedFields.map(field => field.label)

    const csvContent = [
      // Headers
      headers.join(","),
      // Data rows
      ...data.map(row =>
        selectedFields
          .map(field => {
            const value = row[field.key]
            // Handle values that might contain commas or quotes
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value ?? ""
          })
          .join(",")
      )
    ].join("\n")

    return csvContent
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleExport = async () => {
    if (!selectedExport) return

    const option = exportOptions.find(opt => opt.id === selectedExport)
    if (!option) return

    setIsExporting(true)

    try {
      const data = await option.getData()
      const csvContent = generateCSV(data, exportFields)

      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `${option.name.toLowerCase()}-export-${timestamp}.csv`

      downloadCSV(csvContent, filename)

      // Success feedback
      setIsOpen(false)
      setSelectedExport(null)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const selectedOption = exportOptions.find(opt => opt.id === selectedExport)
  const selectedFieldsCount = exportFields.filter(f => f.selected).length

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center space-x-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 ${className}`}
      >
        <Download className="size-4" />
        <span>Export CSV</span>
      </button>

      {/* Export Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-700 bg-gray-800">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Export Data
                  </h3>
                  <p className="text-sm text-gray-400">
                    Choose data type and fields to export
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Step 1: Choose Export Type */}
              {!selectedExport && (
                <div>
                  <h4 className="mb-4 text-lg font-medium text-white">
                    Select Data Type
                  </h4>
                  <div className="grid gap-3">
                    {exportOptions.map(option => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleExportSelect(option.id)}
                          className="flex items-center space-x-3 rounded-lg bg-gray-700 p-4 text-left transition-colors hover:bg-gray-600"
                        >
                          <div className="shrink-0 rounded-lg bg-orange-600 p-2">
                            <Icon className="size-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-medium text-white">
                              {option.name}
                            </h5>
                            <p className="text-sm text-gray-400">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Fields */}
              {selectedExport && selectedOption && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-medium text-white">
                      Select Fields for {selectedOption.name}
                    </h4>
                    <button
                      onClick={() => setSelectedExport(null)}
                      className="text-sm text-orange-400 hover:text-orange-300"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="mb-3 text-sm text-gray-400">
                      Choose which fields to include in your export (
                      {selectedFieldsCount} selected)
                    </p>

                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {exportFields.map(field => (
                        <label
                          key={field.key}
                          className="flex cursor-pointer items-center space-x-3 rounded p-2 hover:bg-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={field.selected}
                            onChange={() => toggleField(field.key)}
                            className="size-4 rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-white">
                            {field.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-gray-400 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExport}
                      disabled={selectedFieldsCount === 0 || isExporting}
                      className="flex items-center space-x-2 rounded-lg bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                      {isExporting ? (
                        <>
                          <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Exporting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="size-4" />
                          <span>Export CSV</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
