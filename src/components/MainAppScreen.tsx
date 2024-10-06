import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { localStorageService } from '../services/localStorage'
import { Sidebar } from "./main/Sidebar"
import { ItemList } from "./main/ItemList"
import { Key, Shield, Server, Wallet, FileText, Braces } from "lucide-react"
import { ConfirmationDialog } from "./main/ConfirmationDialog"
import { ItemDetails } from "./main/ItemDetails"
import { NewCategoryModal } from "./main/NewCategoryModal"
import { NewItemModal } from "./main/NewItemModal"
import { ShareModal } from "./main/ShareModal"
import { itemTypes, itemTypeSchemas } from "./main/constants"
import { useWallet } from "@/hooks/useWallet"
import ContractService from "@/services/contractService"
import { IExecDataProtectorCore, IExecDataProtectorSharing, getWeb3Provider } from '@iexec/dataprotector';

const initialCategories = ["All", "Personal", "Work", "Finance", "Social"]


export default function ChainPass() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPassword, setSelectedPassword] = useState(null)
  const [showPassword, setShowPassword] = useState({})
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
    sharedWith: [],
  })
  const [newTag, setNewTag] = useState("")  
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([])
  const [categories, setCategories] = useState(() => {
    const storedCategories = localStorageService.getItem("categories")
    return storedCategories || initialCategories
  })
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [items, setItems] = useState(() => {
    const storedItems = localStorageService.getItem("items")
    return storedItems || []
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [isRemoveConfirmationOpen, setIsRemoveConfirmationOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareWalletAddress, setShareWalletAddress] = useState("")
  const [isRevokeConfirmationOpen, setIsRevokeConfirmationOpen] = useState(false)
  const [revokeWalletAddress, setRevokeWalletAddress] = useState("")
  const [isSharedView, setIsSharedView] = useState(false)

  const [chainClient, setChainClient] = useState<ContractService | null>(null);
  const [dataProtectorCore, setDataProtectorCore] = useState<IExecDataProtectorCore>();
  const [dataProtectorSharing, setDataProtectorSharing] = useState<IExecDataProtectorSharing>();

  const filteredItems = items.filter(item =>
    (selectedCategory === "All" || item.category === selectedCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (selectedItemTypes.length === 0 || selectedItemTypes.includes(item.type)) &&
    (isSharedView ? item.isShared : !item.isShared)
  )

  const { wallet } = useWallet();

  useEffect(() => {
    if (!wallet) return;
    const contractAddress = '0x58B19940498f1a15993C6FDC6897BA7b72A71162'; 
    const providerUrl = 'https://bellecour.iex.ec'; 
    const privateKey = wallet.privateKey;
    const web3Provider = getWeb3Provider(wallet.privateKey);
    const dataProtectorCore = new IExecDataProtectorCore(web3Provider);
    const dataProtectorSharing = new IExecDataProtectorSharing(web3Provider);

    const chainService = new ContractService(contractAddress, providerUrl, privateKey);
    setChainClient(chainService);
    setDataProtectorCore(dataProtectorCore);
    setDataProtectorSharing(dataProtectorSharing);

  }, [wallet]);

  useEffect(() => {
    localStorageService.setItem("categories", categories)
  }, [categories])

  useEffect(() => {
    localStorageService.setItem("items", items)
  }, [items])

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

  const handleSaveNewItem = async () => {
    const protectedData = await dataProtectorCore.protectData({
        data: {
          name: `${Date.now()}`,
          file: JSON.stringify(newItemData)
        }
    });

    await dataProtectorCore.grantAccess({
      protectedData: protectedData.address,
      authorizedApp: '0x329f35b4f56956f8f601003508ff506b62fe833c',
      authorizedUser: wallet.address,
      pricePerAccess: 0,
      numberOfAccess: 100000,
    });


    // const data = await dataProtectorCore.processProtectedData({
    //   protectedData: protectedData.address,
    //   app: '0x329f35b4f56956f8f601003508ff506b62fe833c',
    //   maxPrice: 0,
    // });
    // const taskData = await dataProtectorSharing.getResultFromCompletedTask({
    //   taskId: data.taskId
    // });
    // const buff = Buffer.from(taskData.result);
    // const decoder = new TextDecoder();
    // alert(decoder.decode(taskData.result));


    await chainClient!.addDataItem(protectedData.address);

    if (isEditMode) {
      const protectedData = await dataProtectorCore.protectData({
        data: {
          name: `${Date.now()}`,
          file: JSON.stringify(newItemData)
        }
      });
      await chainClient.updateDataItemPointer(selectedPassword.id, protectedData.address);
      const newItem = {
        ...newItemData,
        id: protectedData.address,
        type: newItemType.name,
      }
      setItems(prev => prev.map(item => item.id === selectedPassword.id ?  newItem : item))
      setSelectedPassword(newItem)
    } else {
      const newItem = {
        ...newItemData,
        id: protectedData.address,
        type: newItemType.name,
      }
      setItems(prev => [...prev, newItem])
    }

    setIsNewPasswordModalOpen(false)
    setNewItemData({
      name: "",
      type: "Login",
      tags: [],
      category: "Personal",
      workspace: "Personal",
      sharedWith: [],
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
    if (newCategoryName) {
      setCategories(prev => [...prev, newCategoryName])
      setIsNewCategoryModalOpen(false)
      setNewCategoryName("")
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

  const handleShareItem = async () => {
    if (shareWalletAddress && selectedPassword) {
      await dataProtectorCore.grantAccess({
        protectedData: selectedPassword.id,
        authorizedApp: '0x329f35b4f56956f8f601003508ff506b62fe833c',
        authorizedUser: shareWalletAddress,
        pricePerAccess: 0,
        numberOfAccess: 10000,
      });
      await chainClient.shareDataItem(selectedPassword.id, shareWalletAddress);

      setItems(prev => prev.map(item => {
        if (item.id === selectedPassword.id) {
          return {
            ...item,
            sharedWith: [...(item.sharedWith || []), shareWalletAddress]
          }
        }
        return item
      }))
      setSelectedPassword(prev => ({
        ...prev,
        sharedWith: [...(prev.sharedWith || []), shareWalletAddress]
      }))
      setShareWalletAddress("")
      setIsShareModalOpen(false)
    }
  }

  const handleRevokeAccess = async() => {
    if (revokeWalletAddress && selectedPassword) {

      await chainClient.removeSharedDataItem(revokeWalletAddress, selectedPassword.id);
      const grant = await dataProtectorCore.getGrantedAccess({
        protectedData: selectedPassword.id,
        authorizedApp: '0x329f35b4f56956f8f601003508ff506b62fe833c',
        authorizedUser: revokeWalletAddress,
      });

      await dataProtectorCore.revokeOneAccess(grant.grantedAccess[0]);
      setItems(prev => prev.map(item => {
        if (item.id === selectedPassword.id) {
          return {
            ...item,
            sharedWith: item.sharedWith.filter(wallet => wallet !== revokeWalletAddress)
          }
        }
        return item
      }))
      setSelectedPassword(prev => ({
        ...prev,
        sharedWith: prev.sharedWith.filter(wallet => wallet !== revokeWalletAddress)
      }))
      setRevokeWalletAddress("")
      setIsRevokeConfirmationOpen(false)
    }
  }

  const togglePasswordVisibility = (key: string) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You might want to add a toast notification here
  }

  if (!wallet ) {
    return <>Loading Wallet</>
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <div className="flex h-screen">
        <Sidebar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setIsNewCategoryModalOpen={setIsNewCategoryModalOpen}
          itemTypes={itemTypes}
          selectedItemTypes={selectedItemTypes}
          toggleItemTypeFilter={toggleItemTypeFilter}
          isSharedView={isSharedView}
          setIsSharedView={setIsSharedView}
        />

        <div className="flex-1 flex overflow-hidden">
          <Card className="flex-1 m-6 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-0 flex h-full">
              <ItemList
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSharedView={isSharedView}
                itemTypes={itemTypes}
                setNewItemType={setNewItemType}
                setNewItemData={setNewItemData}
                setIsNewPasswordModalOpen={setIsNewPasswordModalOpen}
                filteredItems={filteredItems}
                setSelectedPassword={setSelectedPassword}
                selectedPassword={selectedPassword}
              />
              <ItemDetails
                key={selectedPassword.id}
                selectedPassword={selectedPassword}
                isSharedView={isSharedView}
                setIsShareModalOpen={setIsShareModalOpen}
                handleEditItem={handleEditItem}
                setIsRemoveConfirmationOpen={setIsRemoveConfirmationOpen}
                itemTypeSchemas={itemTypeSchemas}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                copyToClipboard={copyToClipboard}
                setRevokeWalletAddress={setRevokeWalletAddress}
                setIsRevokeConfirmationOpen={setIsRevokeConfirmationOpen}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <NewItemModal
        isOpen={isNewPasswordModalOpen}
        onOpenChange={setIsNewPasswordModalOpen}
        isEditMode={isEditMode}
        newItemType={newItemType}
        newItemData={newItemData}
        handleInputChange={handleInputChange}
        itemTypeSchemas={itemTypeSchemas}
        newTag={newTag}
        setNewTag={setNewTag}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        categories={categories}
        handleSaveNewItem={handleSaveNewItem}
      />

      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onOpenChange={setIsNewCategoryModalOpen}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleAddCategory={handleAddCategory}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        shareWalletAddress={shareWalletAddress}
        setShareWalletAddress={setShareWalletAddress}
        handleShareItem={handleShareItem}
      />
      <ConfirmationDialog
        isOpen={isRemoveConfirmationOpen}
        onOpenChange={setIsRemoveConfirmationOpen}
        title="Confirm Removal"
        message="Are you sure you want to remove this item?"
        onConfirm={handleRemoveItem}
        confirmText="Remove"
        confirmVariant="destructive"
      />

      <ConfirmationDialog
        isOpen={isRevokeConfirmationOpen}
        onOpenChange={setIsRevokeConfirmationOpen}
        title="Revoke Access"
        message={`Are you sure you want to revoke access for ${revokeWalletAddress}?`}
        onConfirm={handleRevokeAccess}
        confirmText="Revoke Access"
        confirmVariant="destructive"
      />
    </div>
  )
}