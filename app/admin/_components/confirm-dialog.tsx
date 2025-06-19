"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

interface ConfirmDialogProps {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: "danger" | "warning" | "info"
}

export default function ConfirmDialog({
  show,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger"
}: ConfirmDialogProps) {
  const variants = {
    danger: {
      icon: <AlertTriangle className="size-6 text-red-500" />,
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
      titleColor: "text-red-500"
    },
    warning: {
      icon: <AlertTriangle className="size-6 text-yellow-500" />,
      confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
      titleColor: "text-yellow-500"
    },
    info: {
      icon: <AlertTriangle className="size-6 text-blue-500" />,
      confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
      titleColor: "text-blue-500"
    }
  }

  const currentVariant = variants[variant]

  if (!show) return null

  return (
    <Dialog open={show} onOpenChange={onCancel}>
      <DialogContent className="max-w-md border-gray-700 bg-gray-900 text-white">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {currentVariant.icon}
            <DialogTitle
              className={`text-lg font-semibold ${currentVariant.titleColor}`}
            >
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-300">{message}</p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {cancelText}
          </Button>
          <Button onClick={onConfirm} className={currentVariant.confirmButton}>
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
