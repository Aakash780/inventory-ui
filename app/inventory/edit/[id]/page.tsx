"use client"

import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import the EditEntryForm component with lazy loading
const EditEntryForm = dynamic(
  () => import("@/components/edit-entry-form").then((mod) => mod.EditEntryForm),
  {
    loading: () => (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading inventory editor...</p>
          </div>
        </div>
      </div>
    ),
    ssr: false, // Disable server-side rendering for this component
  }
)

export default function EditInventoryPage() {
  const params = useParams()
  const entryId = params.id as string

  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading inventory editor...</p>
            </div>
          </div>
        </div>
      }>
        <EditEntryForm entryId={entryId} />
      </Suspense>
    </DashboardLayout>
  )
}
