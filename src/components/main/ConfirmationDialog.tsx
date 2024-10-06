import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  message: string
  onConfirm: () => void
  confirmText?: string
  confirmVariant?: "outline" | "destructive"
}

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  confirmVariant = "destructive"
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{message}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}