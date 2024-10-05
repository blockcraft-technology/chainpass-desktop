import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronRight, Copy, Eye, EyeOff, Link, Moon, Plus, Search, Shield, Star, Sun, Tag, User, X, MoreHorizontal, Trash2, Key, Server, Wallet, FileText, Braces, ChevronLeft, ChevronUp, Briefcase, DollarSign, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const initialCategories = [
  { name: "All", icon: <Shield className="w-4 h-4" /> },
  { name: "Personal", icon: <User className="w-4 h-4" /> },
  { name: "Work", icon: <Briefcase className="w-4 h-4" /> },
  { name: "Finance", icon: <DollarSign className="w-4 h-4" /> },
  { name: "Social", icon: <Users className="w-4 h-4" /> },
]

const itemTypes = [
  { name: "Login", icon: <Key className="w-4 h-4" /> },
  { name: "Password", icon: <Shield className="w-4 h-4" /> },
  { name: "Server", icon: <Server className="w-4 h-4" /> },
  { name: "Crypto Wallet", icon: <Wallet className="w-4 h-4" /> },
  { name: "Secure Note", icon: <FileText className="w-4 h-4" /> },
  { name: "Secure JSON", icon: <Braces className="w-4 h-4" /> },
]

const itemTypeSchemas = {
  Login: {
    username: { type: "string", label: "Username", required: true },
    password: { type: "string", label: "Password", required: true },
    website: { type: "string", label: "Website", required: true },
  },
  Password: {
    password: { type: "string", label: "Password", required: true },
    description: { type: "string", label: "Description", required: true },
  },
  Server: {
    hostname: { type: "string", label: "Hostname", required: true },
    username: { type: "string", label: "Username", required: true },
    password: { type: "string", label: "Password", required: true },
    port: { type: "number", label: "Port", required: true },
  },
  "Crypto Wallet": {
    address: { type: "string", label: "Wallet Address", required: true },
    privateKey: { type: "string", label: "Private Key", required: true },
  },
  "Secure Note": {
    title: { type: "string", label: "Title", required: true },
    content: { type: "string", label: "Content", multiline: true, required: true },
  },
  "Secure JSON": {
    json: { type: "string", label: "JSON Content", multiline: true, required: true },
  },
}

export default function ChainPass() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPassword, setSelectedPassword] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState("Personal")
  const [isNewPasswordModalOpen, setIsNewPasswordModalOpen] = useState(false)
  const [newItemType, setNewItemType] = useState(itemTypes[0])
  const [newItemData, setNewItemData] = useState({
    name: "",
    type: "Login",
    tags: [],
    category: "Personal",
    workspace: "Personal",
  })
  const [newTag, setNewTag] = useState("")
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([])
  const [categories, setCategories] = useState(initialCategories)
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState<JSX.Element | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isRemoveConfirmationOpen, setIsRemoveConfirmationOpen] = useState(false)

  const filteredItems = items.filter(item =>
    (selectedCategory === "All" || item.category === selectedCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (selectedItemTypes.length === 0 || selectedItemTypes.includes(item.type))
  )

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItemData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (newTag && !newItemData.tags.includes(newTag)) {
      setNewItemData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewItemData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSaveNewItem = () => {
    const newItem = {
      ...newItemData,
      id: isEditMode ? selectedPassword.id : Date.now(),
      type: newItemType.name,
    }

    if (isEditMode) {
      setItems(prev => prev.map(item => item.id === selectedPassword.id ? newItem : item))
      setSelectedPassword(newItem)
    } else {
      setItems(prev => [...prev, newItem])
    }

    setIsNewPasswordModalOpen(false)
    setNewItemData({
      name: "",
      type: "Login",
      tags: [],
      category: "Personal",
      workspace: "Personal",
    })
    setIsEditMode(false)
  }

  const toggleItemTypeFilter = (type: string) => {
    setSelectedItemTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      const newCategory = {
        name: newCategoryName,
        icon: newCategoryIcon,
      }
      setCategories(prev => [...prev, newCategory])
      setIsNewCategoryModalOpen(false)
      setNewCategoryName("")
      setNewCategoryIcon(null)
    }
  }

  const handleEditItem = () => {
    setNewItemData(selectedPassword)
    setNewItemType(itemTypes.find(type => type.name === selectedPassword.type) || itemTypes[0])
    setIsEditMode(true)
    setIsNewPasswordModalOpen(true)
  }

  const handleRemoveItem = () => {
    setItems(prev => prev.filter(item => item.id !== selectedPassword.id))
    setSelectedPassword(null)
    setIsRemoveConfirmationOpen(false)
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <div className="flex h-screen">
        {/* Sidebar */}
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
                <SelectItem value="Batcave">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Batcave</span>
                  </div>
                </SelectItem>
                <SelectItem value="add_new">
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add new workspace</span>
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
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center w-full px-2 py-1.5 mt-1 text-left text-sm transition-colors rounded-md cursor-pointer ${
                      selectedCategory === category.name
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {category.icon}
                    <span className="ml-3">{category.name}</span>
                  </button>
                ))}
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
          {/* User Profile */}
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
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">0x1234...5678</p>
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

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          <Card className="flex-1 m-6 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-0 flex h-full">
              {/* Item list */}
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
                  </div>
                </div>
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Shield className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add your first item using the 'New' button above</p>
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
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2 self-center" />
                    </div>
                  ))
                )}
              </div>

              {/* Item details */}
              {selectedPassword ? (
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
                          <Badge variant="secondary">{selectedPassword.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleEditItem}>Edit</Button>
                      <Button variant="destructive" onClick={() => setIsRemoveConfirmationOpen(true)}>Remove</Button>
                    </div>
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
                                type={key === "password" || key === "privateKey" ? (showPassword ? "text" : "password") : "text"}
                                value={selectedPassword[key] || ''}
                                readOnly
                                className="pr-10 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              />
                              {(key === "password" || key === "privateKey") && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedPassword[key])
                                  // You might want to add a toast notification here
                                }}
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
                  </div>
                </div>
              ) : (
                <div className="w-1/2 flex items-center justify-center bg-white dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">Select an item to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isNewPasswordModalOpen} onOpenChange={setIsNewPasswordModalOpen}>
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
                  className="text-lg font-semibold bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
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
                      className="mt-1 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
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
                      className="mt-1 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
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
                    className="flex-grow bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} variant="outline" size="sm" className="ml-2">
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
            <Select value={newItemData.category} onValueChange={(value) => setNewItemData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.filter(c => c.name !== "All").map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center">
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSaveNewItem}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isNewCategoryModalOpen} onOpenChange={setIsNewCategoryModalOpen}>
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
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10">
                  <Label htmlFor="icon">Icon</Label>
                </div>
                <Select onValueChange={(value) => setNewCategoryIcon(itemTypes.find(type => type.name === value)?.icon || null)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectItem key={type.name} value={type.name}>
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRemoveConfirmationOpen} onOpenChange={setIsRemoveConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to remove this item?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveConfirmationOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveItem}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}