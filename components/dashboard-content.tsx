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
import { useEffect, useState } from "react"

export function DashboardContent() {
  const [stats, setStats] = useState([
    { title: "Total Items", value: "-", change: "", trend: "up", icon: Package },
    { title: "Items In", value: "-", change: "", trend: "up", icon: TrendingUp },
    { title: "Items Out", value: "-", change: "", trend: "down", icon: TrendingDown },
    { title: "Low Stock Alerts", value: "-", change: "", trend: "alert", icon: AlertTriangle },
  ])
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [lowStockItems, setLowStockItems] = useState<any[]>([])
  const [loadingLowStock, setLoadingLowStock] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        setStats([
          { title: "Total Items", value: data.totalItems?.toLocaleString() ?? "0", change: "", trend: "up", icon: Package },
          { title: "Items In", value: data.itemsIn?.toLocaleString() ?? "0", change: "", trend: "up", icon: TrendingUp },
          { title: "Items Out", value: data.itemsOut?.toLocaleString() ?? "0", change: "", trend: "down", icon: TrendingDown },
          { title: "Low Stock Alerts", value: data.lowStockAlerts?.toLocaleString() ?? "0", change: "", trend: "alert", icon: AlertTriangle },
        ])
      } catch (e) {
        // fallback to dashes
        setStats([
          { title: "Total Items", value: "-", change: "", trend: "up", icon: Package },
          { title: "Items In", value: "-", change: "", trend: "up", icon: TrendingUp },
          { title: "Items Out", value: "-", change: "", trend: "down", icon: TrendingDown },
          { title: "Low Stock Alerts", value: "-", change: "", trend: "alert", icon: AlertTriangle },
        ])
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  useEffect(() => {
    async function fetchRecent() {
      setLoadingActivities(true)
      try {
        const res = await fetch("/api/inventory?limit=5")
        const data = await res.json()
        setRecentActivities(
          data.map((entry: any) => ({
            id: entry.id,
            type: entry.status === "completed" ? "in" : "out",
            material: entry.materialDescription,
            quantity: entry.quantity,
            from: entry.from,
            to: entry.to,
            time: new Date(entry.createdAt).toLocaleString(),
          }))
        )
      } catch {
        setRecentActivities([])
      }
      setLoadingActivities(false)
    }
    fetchRecent()
  }, [])

  useEffect(() => {
    async function fetchLowStock() {
      setLoadingLowStock(true)
      try {
        const res = await fetch("/api/inventory?lowStock=1")
        const data = await res.json()
        setLowStockItems(
          data.map((entry: any) => ({
            name: entry.materialDescription,
            current: entry.quantity,
            unit: entry.units,
          }))
        )
      } catch {
        setLowStockItems([])
      }
      setLoadingLowStock(false)
    }
    fetchLowStock()
  }, [])

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
            </div>            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/inventory">
                <FileText className="mr-2 h-4 w-4" />
                View All Items
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
