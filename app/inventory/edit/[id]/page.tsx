"use client"

import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
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
  // Make sure params.id is correctly extracted and handled
  const id = params?.id
  const entryId = Array.isArray(id) ? id[0] : (id as string)
  
  console.log('Edit page params:', params)
  console.log('Extracted entry ID:', entryId)

  if (!entryId) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-bold">Error: Missing Entry ID</h2>
              <p className="text-muted-foreground">No inventory entry ID was provided.</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
