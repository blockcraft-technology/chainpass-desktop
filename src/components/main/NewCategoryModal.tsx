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

interface NewCategoryModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  newCategoryName: string
  setNewCategoryName: (name: string) => void
  handleAddCategory: () => void
}

export function NewCategoryModal({
  isOpen,
  onOpenChange,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory
}: NewCategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-1 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-0 focus:border-gray-200 dark:focus:border-gray-600"
                required
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}