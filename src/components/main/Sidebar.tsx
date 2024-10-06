import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, Moon, Plus, Search, Shield, Star, Sun, Tag, User, LogOut, Share2 } from "lucide-react"
import { useWallet } from '@/hooks/useWallet'

interface SidebarProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
  selectedWorkspace: string
  setSelectedWorkspace: (workspace: string) => void
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  setIsNewCategoryModalOpen: (isOpen: boolean) => void
  itemTypes: { name: string; icon: JSX.Element }[]
  selectedItemTypes: string[]
  toggleItemTypeFilter: (type: string) => void
  isSharedView: boolean
  setIsSharedView: (isShared: boolean) => void
  hasNewSharedItems: boolean
  setHasNewSharedItems: (hasNew: boolean) => void
}

export function Sidebar({
  isDarkMode,
  toggleDarkMode,
  selectedWorkspace,
  setSelectedWorkspace,
  categories,
  selectedCategory,
  setSelectedCategory,
  setIsNewCategoryModalOpen,
  itemTypes,
  selectedItemTypes,
  toggleItemTypeFilter,
  isSharedView,
  setIsSharedView,
}: SidebarProps) {
    const { wallet } = useWallet();
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ChainPass</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Personal">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Personal</span>
              </div>
            </SelectItem>
            <SelectItem value="add_new" disabled>
              <div className="flex items-center text-gray-400">
                <Plus className="w-4 h-4 mr-2" />
                <span>Add new workspace (Coming Soon)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="flex-1">
        <nav className="mt-4">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categories</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsNewCategoryModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setIsSharedView(false)
                }}
                className={`flex items-center w-full px-2 py-1.5 mt-1 text-left text-sm transition-colors rounded-md cursor-pointer ${
                  selectedCategory === category && !isSharedView
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="ml-3">{category}</span>
              </button>
            ))}
            <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
              <button
                onClick={() => {
                  setIsSharedView(true)
                  setSelectedCategory("All")
                }}
                className={`flex items-center w-full px-2 py-1.5 mt-1 text-left text-sm transition-colors rounded-md cursor-pointer ${
                  isSharedView
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span className="ml-3">Shared with me</span>
              </button>
            </div>
          </div>
          <div className="px-4 py-2 mt-4">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Types</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {itemTypes.map((type) => (
                <Badge
                  key={type.name}
                  variant={selectedItemTypes.includes(type.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleItemTypeFilter(type.name)}
                >
                  {type.icon}
                  <span className="ml-1">{type.name}</span>
                </Badge>
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>WA</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{`${wallet.address.substring(0, 6)}..${wallet.address.substring(wallet.address.length - 6, wallet.address.length)}`}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}