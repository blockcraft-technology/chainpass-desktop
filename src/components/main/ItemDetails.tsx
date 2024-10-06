import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Eye, EyeOff, Share2, Edit, Trash, Trash2 } from "lucide-react"

interface ItemDetailsProps {
  selectedPassword: any
  isSharedView: boolean
  setIsShareModalOpen: (isOpen: boolean) => void
  handleEditItem: () => void
  setIsRemoveConfirmationOpen: (isOpen: boolean) => void
  itemTypeSchemas: any
  showPassword: { [key: string]: boolean }
  togglePasswordVisibility: (key: string) => void
  copyToClipboard: (text: string) => void
  setRevokeWalletAddress: (address: string) => void
  setIsRevokeConfirmationOpen: (isOpen: boolean) => void
}

export function ItemDetails({
  selectedPassword,
  isSharedView,
  setIsShareModalOpen,
  handleEditItem,
  setIsRemoveConfirmationOpen,
  itemTypeSchemas,
  showPassword,
  togglePasswordVisibility,
  copyToClipboard,
  setRevokeWalletAddress,
  setIsRevokeConfirmationOpen
}: ItemDetailsProps) {
  if (!selectedPassword) {
    return (
      <div className="w-1/2 flex items-center justify-center bg-white dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Select an item to view details</p>
      </div>
    )
  }

  return (
    <div className="w-1/2 p-6 overflow-y-auto bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Avatar className="w-16 h-16 rounded-lg mr-4">
            <AvatarFallback>{selectedPassword.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{selectedPassword.name}</h2>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mr-2">{selectedPassword.type}</p>
            </div>
          </div>
        </div>
        {!isSharedView && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" />
            </Button>
            <Button variant="outline" onClick={handleEditItem}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="destructive" onClick={() => setIsRemoveConfirmationOpen(true)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-6">
        {Object.entries(itemTypeSchemas[selectedPassword.type]).map(([key, schema]) => (
          <div key={key}>
            <Label htmlFor={key} className="text-sm font-medium text-gray-700 dark:text-gray-300">{schema.label}</Label>
            <div className="mt-1 relative rounded-md shadow-sm">
              {schema.multiline ? (
                <Textarea
                  id={key}
                  value={selectedPassword[key] || ''}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="flex items-center">
                  <Input
                    id={key}
                    type={schema.type === "password" ? (showPassword[key] ? "text" : "password") : "text"}
                    value={selectedPassword[key] || ''}
                    readOnly
                    className="pr-10 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                  {schema.type === "password" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                      onClick={() => togglePasswordVisibility(key)}
                    >
                      {showPassword[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => copyToClipboard(selectedPassword[key])}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedPassword.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        {selectedPassword.sharedWith && selectedPassword.sharedWith.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shared With</Label>
            <div className="mt-2 space-y-2">
              {selectedPassword.sharedWith.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                  <span className="text-sm">{wallet}</span>
                  {!isSharedView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRevokeWalletAddress(wallet)
                        setIsRevokeConfirmationOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}