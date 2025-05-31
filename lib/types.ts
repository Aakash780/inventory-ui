export interface InventoryEntry {
  id: string
  date: Date
  from: string
  to: string
  returnTo: string
  materialDescription: string
  units: string
  quantity: number
  orderBy: string
  remark: string
  createdAt: Date
  status?: "completed" | "pending" | "returned"
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "operator" | "viewer"
  avatar?: string
}

export interface DashboardStats {
  totalItems: number
  itemsIn: number
  itemsOut: number
  lowStockAlerts: number
}
