import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ShareModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  shareWalletAddress: string
  setShareWalletAddress: (address: string) => void
  handleShareItem: () => void
}

export function ShareModal({
  isOpen,
  onOpenChange,
  shareWalletAddress,
  setShareWalletAddress,
  handleShareItem
}: ShareModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Share Item</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="walletAddress">Wallet Address or ENS</Label>
          <Input
            id="walletAddress"
            value={shareWalletAddress}
            onChange={(e) => setShareWalletAddress(e.target.value)}
            placeholder="0x... or name.eth"
            className="mt-1 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-gray-200 dark:focus:border-gray-600"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleShareItem}>Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}