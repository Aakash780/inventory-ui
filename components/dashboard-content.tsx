"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Eye,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Total Items",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Items In",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Items Out",
    value: "89",
    change: "-3%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    title: "Low Stock Alerts",
    value: "23",
    change: "+5",
    trend: "alert",
    icon: AlertTriangle,
  },
]

const recentActivities = [
  {
    id: 1,
    type: "in",
    material: "Steel Rods - 12mm",
    quantity: 150,
    from: "Supplier ABC",
    to: "Storage Area A",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "out",
    material: "Cement Bags - OPC 53",
    quantity: 50,
    from: "Storage Area B",
    to: "Construction Site",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "in",
    material: "Paint Buckets - White",
    quantity: 25,
    from: "Paint Supplier",
    to: "Storage Area C",
    time: "6 hours ago",
  },
  {
    id: 4,
    type: "out",
    material: "Electrical Cables",
    quantity: 100,
    from: "Storage Area A",
    to: "Electrical Department",
    time: "8 hours ago",
  },
]

const lowStockItems = [
  { name: "Safety Helmets", current: 15, minimum: 50, unit: "pieces" },
  { name: "Welding Rods", current: 8, minimum: 25, unit: "kg" },
  { name: "Paint Brushes", current: 12, minimum: 30, unit: "pieces" },
  { name: "Measuring Tape", current: 3, minimum: 10, unit: "pieces" },
]

export function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening in your warehouse today.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/add-entry">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/inventory">
              <Eye className="mr-2 h-4 w-4" />
              View All
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />}
                {stat.trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                {stat.trend === "alert" && <AlertTriangle className="mr-1 h-3 w-3 text-yellow-500" />}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-yellow-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest material movements in your warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${activity.type === "in" ? "bg-green-500" : "bg-blue-500"}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.material}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.quantity} units • {activity.from} → {activity.to}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/inventory">View All Activities</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.current} {item.unit} remaining
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/reports">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions for efficient workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex-col gap-2" asChild>
              <Link href="/add-entry">
                <Plus className="h-6 w-6" />
                Add New Entry
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/inventory">
                <Package className="h-6 w-6" />
                View Inventory
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/reports">
                <FileText className="h-6 w-6" />
                Generate Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
