import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

interface NewItemModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  isEditMode: boolean
  newItemType: { name: string; icon: JSX.Element }
  newItemData: any
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  itemTypeSchemas: any
  newTag: string
  setNewTag: (tag: string) => void
  handleAddTag: () => void
  handleRemoveTag: (tag: string) => void
  categories: string[]
  handleSaveNewItem: () => void
}

export function NewItemModal({
  isOpen,
  onOpenChange,
  isEditMode,
  newItemType,
  newItemData,
  handleInputChange,
  itemTypeSchemas,
  newTag,
  setNewTag,
  handleAddTag,
  handleRemoveTag,
  categories,
  handleSaveNewItem
}: NewItemModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <DialogTitle className="text-lg font-semibold">
            {isEditMode ? "Edit" : "New"} {newItemType.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              {React.cloneElement(newItemType.icon, { className: "w-8 h-8 text-blue-600 dark:text-blue-400" })}
            </div>
            <div className="flex-grow space-y-2">
              <Input
                id="name"
                name="name"
                value={newItemData.name}
                onChange={handleInputChange}
                placeholder={`${newItemType.name} Name`}
                className="text-lg font-semibold bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-gray-200 dark:focus:border-gray-600"
                required
              />
              <Label className="text-sm text-gray-500 dark:text-gray-400">{newItemType.name}</Label>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(itemTypeSchemas[newItemType.name]).map(([key, schema]) => (
              <div key={key}>
                <Label htmlFor={key} className="text-sm text-gray-500 dark:text-gray-400">{schema.label}</Label>
                {schema.multiline ? (
                  <Textarea
                    id={key}
                    name={key}
                    value={newItemData[key] || ""}
                    onChange={handleInputChange}
                    placeholder={schema.label}
                    className="mt-1 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-gray-200 dark:focus:border-gray-600"
                    required={schema.required}
                  />
                ) : (
                  <Input
                    id={key}
                    name={key}
                    type={schema.type}
                    value={newItemData[key] || ""}
                    onChange={handleInputChange}
                    placeholder={schema.label}
                    className="mt-1 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-gray-200 dark:focus:border-gray-600"
                    required={schema.required}
                  />
                )}
              </div>
            ))}
            <div>
              <Label className="text-sm text-gray-500 dark:text-gray-400">tags</Label>
              <div className="flex items-center mt-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-grow bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-gray-200 dark:focus:border-gray-600"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button onClick={handleAddTag} variant="outline" size="sm"
                  className="ml-2 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-gray-200 dark:focus:border-gray-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newItemData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <Select value={newItemData.category} onValueChange={(value) => handleInputChange({ target: { name: 'category', value } })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c !== "All").map((category) => (
                <SelectItem key={category} value={category}>
                  <span className="ml-2">{category}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSaveNewItem}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}