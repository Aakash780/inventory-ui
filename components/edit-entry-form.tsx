"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Save, ArrowLeft } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface InventoryEntry {
  id: string
  date: string
  from: string
  to: string
  returnTo: string | null
  materialDescription: string
  units: string | null
  quantity: number
  orderBy: string | null
  remark: string | null
  createdAt: string
  status: "completed" | "pending" | "returned"
}

interface EditEntryFormProps {
  entryId: string
}

export function EditEntryForm({ entryId }: EditEntryFormProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    returnTo: "",
    materialDescription: "",
    units: "",
    quantity: "",
    orderBy: "",
    remark: "",
    status: "completed" as "completed" | "pending" | "returned"
  })

  const fetchEntryData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/inventory/${entryId}`)
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Inventory entry not found")
        } else {
          throw new Error(`Failed to fetch entry: ${res.status}`)
        }
      }
      
      const entry: InventoryEntry = await res.json()
      
      setFormData({
        from: entry.from,
        to: entry.to,
        returnTo: entry.returnTo || "",
        materialDescription: entry.materialDescription,
        units: entry.units || "",
        quantity: entry.quantity.toString(),
        orderBy: entry.orderBy || "",
        remark: entry.remark || "",
        status: entry.status
      })
      
      // Parse the date string to Date object
      setDate(new Date(entry.date))
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load entry details"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    if (entryId) {
      fetchEntryData()
    }
  }, [entryId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    if (!formData.from || !formData.to || !formData.materialDescription || !formData.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Send data to API
    try {
      const res = await fetch(`/api/inventory/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.toISOString(),
          from: formData.from,
          to: formData.to,
          returnTo: formData.returnTo || null,
          materialDescription: formData.materialDescription,
          units: formData.units || null,
          quantity: Number(formData.quantity),
          orderBy: formData.orderBy || null,
          remark: formData.remark || null,
          status: formData.status
        }),
      })
      
      if (!res.ok) throw new Error("Failed to update entry")
      
      toast({
        title: "Success",
        description: "Inventory entry updated successfully",
      })
      
      // Navigate back to inventory page after successful update
      setTimeout(() => {
        router.push('/inventory')
        router.refresh()
      }, 1000)
      
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update entry",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-gray-200 animate-pulse"></div>
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-72 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-60 bg-gray-200 rounded-md animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Date and Order By skeleton */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              {/* From, To, Return To skeleton */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              {/* Material Description skeleton */}
              <div className="h-24 bg-gray-200 rounded-md animate-pulse"></div>
              
              {/* Units, Quantity, Status skeleton */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              {/* Remark skeleton */}
              <div className="h-20 bg-gray-200 rounded-md animate-pulse"></div>
              
              {/* Buttons skeleton */}
              <div className="flex gap-4 pt-4">
                <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-muted-foreground">
          Loading inventory data...
        </div>
      </div>
    )
  }
  
  // Show error state with retry option
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Inventory Entry</h1>
            <p className="text-muted-foreground">Update material details in the inventory system</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="mb-4 text-center text-muted-foreground">
                We couldn't load the inventory entry data. Please try again.
              </p>
              <div className="flex gap-4">
                <Button onClick={fetchEntryData}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Inventory Entry</h1>
          <p className="text-muted-foreground">Update material details in the inventory system</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Edit Material Entry
          </CardTitle>
          <CardDescription>Update the information for this inventory entry</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Order By */}
              <div className="space-y-2">
                <Label htmlFor="orderBy">Order By</Label>
                <Input
                  id="orderBy"
                  placeholder="Person who ordered the material"
                  value={formData.orderBy}
                  onChange={(e) => handleInputChange("orderBy", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* From */}
              <div className="space-y-2">
                <Label htmlFor="from">From *</Label>
                <Input
                  id="from"
                  placeholder="Source location or supplier"
                  value={formData.from}
                  onChange={(e) => handleInputChange("from", e.target.value)}
                  required
                />
              </div>

              {/* To */}
              <div className="space-y-2">
                <Label htmlFor="to">To *</Label>
                <Input
                  id="to"
                  placeholder="Destination location"
                  value={formData.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  required
                />
              </div>

              {/* Return To */}
              <div className="space-y-2">
                <Label htmlFor="returnTo">Return To</Label>
                <Input
                  id="returnTo"
                  placeholder="Return location (if applicable)"
                  value={formData.returnTo}
                  onChange={(e) => handleInputChange("returnTo", e.target.value)}
                />
              </div>
            </div>

            {/* Material Description */}
            <div className="space-y-2">
              <Label htmlFor="materialDescription">Material Description *</Label>
              <Textarea
                id="materialDescription"
                placeholder="Detailed description of the material including specifications, grade, size, etc."
                value={formData.materialDescription}
                onChange={(e) => handleInputChange("materialDescription", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Units */}
              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Input
                  id="units"
                  placeholder="e.g., Pieces, Kg, Liters, Meters"
                  value={formData.units}
                  onChange={(e) => handleInputChange("units", e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Remark */}
            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Textarea
                id="remark"
                placeholder="Additional notes, comments, or special instructions"
                value={formData.remark}
                onChange={(e) => handleInputChange("remark", e.target.value)}
                rows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Entry...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Entry
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}
