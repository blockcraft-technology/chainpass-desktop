import { Key, Shield, Server, Wallet, FileText, Braces } from "lucide-react"

export const itemTypes = [
  { name: "Login", icon: <Key className="w-4 h-4" /> },
  { name: "Password", icon: <Shield className="w-4 h-4" /> },
  { name: "Server", icon: <Server className="w-4 h-4" /> },
  { name: "Crypto Wallet", icon: <Wallet className="w-4 h-4" /> },
  { name: "Secure Note", icon: <FileText className="w-4 h-4" /> },
  { name: "Secure JSON", icon: <Braces className="w-4 h-4" /> },
]

export const itemTypeSchemas = {
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
