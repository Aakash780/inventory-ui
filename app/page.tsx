"use client"

import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"

import { useState } from "react"
import { CalendarIcon, Plus, Package, Warehouse } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

interface InventoryEntry {
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
}

export default function DashboardPage() {
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entries, setEntries] = useState<InventoryEntry[]>([
    {
      id: "1",
      date: new Date("2024-01-15"),
      from: "Main Warehouse",
      to: "Production Unit A",
      returnTo: "Main Warehouse",
      materialDescription: "Steel Rods - 12mm diameter, Grade 500",
      units: "Pieces",
      quantity: 150,
      orderBy: "John Smith",
      remark: "Urgent requirement for Project Alpha",
      createdAt: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "2",
      date: new Date("2024-01-16"),
      from: "Supplier ABC",
      to: "Quality Control",
      returnTo: "Storage Area B",
      materialDescription: "Cement bags - OPC 53 Grade",
      units: "Bags",
      quantity: 200,
      orderBy: "Sarah Johnson",
      remark: "Quality inspection required before storage",
      createdAt: new Date("2024-01-16T14:15:00"),
    },
  ])

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newEntry: InventoryEntry = {
      id: Date.now().toString(),
      date: date,
      from: formData.from,
      to: formData.to,
      returnTo: formData.returnTo,
      materialDescription: formData.materialDescription,
      units: formData.units,
      quantity: Number.parseInt(formData.quantity),
      orderBy: formData.orderBy,
      remark: formData.remark,
      createdAt: new Date(),
    }

    setEntries((prev) => [newEntry, ...prev])

    // Reset form
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
    setIsSubmitting(false)

    toast({
      title: "Success",
      description: "Material entry added successfully",
    })
  }

  return (
    <DashboardLayout>
      <DashboardContent>
        <div className="min-h-screen bg-gray-50/50">
          {/* Header Section */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Warehouse className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Material Inventory Register</h1>
                  <p className="text-sm text-gray-600 mt-1">Dahisar Godown • Warehouse Management System</p>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-5">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add New Entry
                    </CardTitle>
                    <CardDescription>Fill in the details to register new material movement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Date Picker */}
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
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

                      {/* Material Description */}
                      <div className="space-y-2">
                        <Label htmlFor="materialDescription">Material Description *</Label>
                        <Textarea
                          id="materialDescription"
                          placeholder="Detailed description of the material"
                          value={formData.materialDescription}
                          onChange={(e) => handleInputChange("materialDescription", e.target.value)}
                          rows={3}
                          required
                        />
                      </div>

                      {/* Units and Quantity */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="units">Units</Label>
                          <Input
                            id="units"
                            placeholder="e.g., Pieces, Kg, Liters"
                            value={formData.units}
                            onChange={(e) => handleInputChange("units", e.target.value)}
                          />
                        </div>
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

                      {/* Remark */}
                      <div className="space-y-2">
                        <Label htmlFor="remark">Remark</Label>
                        <Textarea
                          id="remark"
                          placeholder="Additional notes or comments"
                          value={formData.remark}
                          onChange={(e) => handleInputChange("remark", e.target.value)}
                          rows={2}
                        />
                      </div>

                      {/* Submit Button */}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
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
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Data Table Section */}
              <div className="lg:col-span-7">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Inventory Records
                    </CardTitle>
                    <CardDescription>{entries.length} total entries • Latest entries shown first</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Sr.No</TableHead>
                            <TableHead className="min-w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[120px]">From</TableHead>
                            <TableHead className="min-w-[120px]">To</TableHead>
                            <TableHead className="min-w-[120px]">Return To</TableHead>
                            <TableHead className="min-w-[200px]">Material Description</TableHead>
                            <TableHead className="min-w-[80px]">Units</TableHead>
                            <TableHead className="min-w-[80px]">Quantity</TableHead>
                            <TableHead className="min-w-[120px]">Order By</TableHead>
                            <TableHead className="min-w-[150px]">Remark</TableHead>
                            <TableHead className="min-w-[140px]">Created At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entries.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                                No entries found. Add your first material entry using the form.
                              </TableCell>
                            </TableRow>
                          ) : (
                            entries.map((entry, index) => (
                              <TableRow key={entry.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{format(entry.date, "dd/MM/yyyy")}</TableCell>
                                <TableCell>{entry.from}</TableCell>
                                <TableCell>{entry.to}</TableCell>
                                <TableCell>{entry.returnTo || "-"}</TableCell>
                                <TableCell className="max-w-[200px]">
                                  <div className="truncate" title={entry.materialDescription}>
                                    {entry.materialDescription}
                                  </div>
                                </TableCell>
                                <TableCell>{entry.units || "-"}</TableCell>
                                <TableCell className="text-right">{entry.quantity}</TableCell>
                                <TableCell>{entry.orderBy || "-"}</TableCell>
                                <TableCell className="max-w-[150px]">
                                  <div className="truncate" title={entry.remark}>
                                    {entry.remark || "-"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {format(entry.createdAt, "dd/MM/yyyy HH:mm")}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Toaster />
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
