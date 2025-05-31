"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InventoryList } from "@/components/inventory-list"

export default function InventoryPage() {
  return (
    <DashboardLayout>
      <InventoryList />
    </DashboardLayout>
  )
}
