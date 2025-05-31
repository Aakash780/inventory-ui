"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Plus, Save } from "lucide-react"
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

export function AddEntryForm() {
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    returnTo: "",
    materialDescription: "",
    units: "",
    quantity: "",
    orderBy: "",
    remark: "",
  })

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
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.toISOString(),
          from: formData.from,
          to: formData.to,
          returnTo: formData.returnTo,
          materialDescription: formData.materialDescription,
          units: formData.units,
          quantity: Number(formData.quantity),
          orderBy: formData.orderBy,
          remark: formData.remark,
        }),
      })
      if (!res.ok) throw new Error("Failed to add entry")
      // Optionally, trigger a refresh or redirect
      setFormData({
        from: "",
        to: "",
        returnTo: "",
        materialDescription: "",
        units: "",
        quantity: "",
        orderBy: "",
        remark: "",
      })
      setDate(undefined)
      toast({
        title: "Success",
        description: "Material entry added successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add entry",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAsDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your entry has been saved as a draft",
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Entry</h1>
        <p className="text-muted-foreground">Register new material movement in the warehouse inventory system.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Material Entry Form
          </CardTitle>
          <CardDescription>Fill in all the required details to register the material movement</CardDescription>
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

            <div className="grid gap-6 md:grid-cols-2">
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
                    Adding Entry...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleSaveAsDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}

// NOTE: This form only uses Date objects for the local date picker (not for rendering lists/tables)
// All data sent to the API is in ISO string format (date.toISOString())
// Make sure your InventoryEntry type uses string for date/createdAt everywhere else
