import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronRight, Plus, Search, Shield } from "lucide-react"

interface ItemListProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSharedView: boolean
  itemTypes: { name: string; icon: JSX.Element }[]
  setNewItemType: (type: { name: string; icon: JSX.Element }) => void
  setNewItemData: (data: any) => void
  setIsNewPasswordModalOpen: (isOpen: boolean) => void
  filteredItems: any[]
  setSelectedPassword: (password: any) => void
  selectedPassword: any
}

export function ItemList({
  searchQuery,
  setSearchQuery,
  isSharedView,
  itemTypes,
  setNewItemType,
  setNewItemData,
  setIsNewPasswordModalOpen,
  filteredItems,
  setSelectedPassword,
  selectedPassword
}: ItemListProps) {
  return (
    <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="search"
              placeholder="Search vault"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </div>
          {!isSharedView && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {itemTypes.map((type) => (
                  <DropdownMenuItem 
                    key={type.name}
                    onClick={() => {
                      setNewItemType(type)
                      setNewItemData(prev => ({ ...prev, type: type.name }))
                      setIsNewPasswordModalOpen(true)
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      {type.icon}
                      <span className="ml-2">{type.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Shield className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isSharedView ? "No shared items yet" : "Add your first item using the 'New' button above"}
          </p>
        </div>
      ) : (
        filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPassword(item)}
            className={`flex items-start px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
              selectedPassword?.id === item.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
            }`}
          >
            <Avatar className="w-10 h-10 rounded-full mr-3 flex-shrink-0">
              <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.name}</h3>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.category}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.type}</p>
              <div className="flex flex-wrap mt-1 -mx-1">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="m-1 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {item.sharedWith && item.sharedWith.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Shared with {item.sharedWith.length} wallet{item.sharedWith.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2 self-center" />
          </div>
        ))
      )}
    </div>
  )
}