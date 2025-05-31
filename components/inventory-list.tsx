"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  Calendar,
  ArrowUpDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  status: "completed" | "pending" | "returned"
}

const sampleEntries: InventoryEntry[] = [
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
    status: "completed",
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
    status: "pending",
  },
  {
    id: "3",
    date: new Date("2024-01-17"),
    from: "Storage Area C",
    to: "Construction Site",
    returnTo: "",
    materialDescription: "Paint Buckets - White Emulsion, 20L",
    units: "Buckets",
    quantity: 25,
    orderBy: "Mike Wilson",
    remark: "For exterior painting work",
    createdAt: new Date("2024-01-17T09:45:00"),
    status: "completed",
  },
  {
    id: "4",
    date: new Date("2024-01-18"),
    from: "Electrical Supplier",
    to: "Storage Area A",
    returnTo: "Electrical Supplier",
    materialDescription: "Copper Cables - 2.5mm, 100m rolls",
    units: "Rolls",
    quantity: 50,
    orderBy: "David Brown",
    remark: "Defective items to be returned",
    createdAt: new Date("2024-01-18T16:20:00"),
    status: "returned",
  },
]

export function InventoryList() {
  const [entries, setEntries] = useState<InventoryEntry[]>(sampleEntries)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch =
        entry.materialDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.orderBy.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof InventoryEntry]
      const bValue = b[sortField as keyof InventoryEntry]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "returned":
        return <Badge className="bg-blue-100 text-blue-800">Returned</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Records</h1>
          <p className="text-muted-foreground">View and manage all material movement records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filter
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by material, location, or person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Entries</CardTitle>
          <CardDescription>
            {filteredEntries.length} of {entries.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sr.No</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("date")} className="h-auto p-0 font-semibold">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Return To</TableHead>
                  <TableHead>Material Description</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" onClick={() => handleSort("quantity")} className="h-auto p-0 font-semibold">
                      Quantity
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Order By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                      No entries found. Try adjusting your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(entry.date, "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>{entry.from}</TableCell>
                      <TableCell>{entry.to}</TableCell>
                      <TableCell>{entry.returnTo || "-"}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={entry.materialDescription}>
                          {entry.materialDescription}
                        </div>
                      </TableCell>
                      <TableCell>{entry.units || "-"}</TableCell>
                      <TableCell className="text-right font-medium">{entry.quantity}</TableCell>
                      <TableCell>{entry.orderBy || "-"}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="max-w-[150px]">
                        <div className="truncate" title={entry.remark}>
                          {entry.remark || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(entry.createdAt, "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Entry
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Entry
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
  )
}
