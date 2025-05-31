"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, TrendingUp, Package, AlertTriangle, BarChart3, PieChart } from "lucide-react"

const reportTypes = [
  {
    title: "Monthly Inventory Report",
    description: "Comprehensive monthly overview of all inventory movements",
    icon: Calendar,
    lastGenerated: "2 days ago",
    status: "ready",
  },
  {
    title: "Stock Level Analysis",
    description: "Current stock levels and low stock alerts",
    icon: Package,
    lastGenerated: "1 week ago",
    status: "outdated",
  },
  {
    title: "Material Usage Trends",
    description: "Analysis of material consumption patterns",
    icon: TrendingUp,
    lastGenerated: "3 days ago",
    status: "ready",
  },
  {
    title: "Supplier Performance",
    description: "Evaluation of supplier delivery and quality metrics",
    icon: BarChart3,
    lastGenerated: "1 day ago",
    status: "ready",
  },
  {
    title: "Cost Analysis Report",
    description: "Material costs and budget analysis",
    icon: PieChart,
    lastGenerated: "5 days ago",
    status: "pending",
  },
  {
    title: "Critical Alerts Summary",
    description: "Summary of all critical inventory alerts",
    icon: AlertTriangle,
    lastGenerated: "Today",
    status: "ready",
  },
]

const quickStats = [
  { label: "Total Reports Generated", value: "247", period: "This Month" },
  { label: "Pending Reports", value: "3", period: "Awaiting Data" },
  { label: "Automated Reports", value: "12", period: "Scheduled" },
  { label: "Custom Reports", value: "8", period: "This Week" },
]

export function ReportsContent() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "outdated":
        return <Badge className="bg-red-100 text-red-800">Outdated</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download comprehensive inventory reports</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Create Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Pre-configured reports ready for generation and download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <report.icon className="h-8 w-8 text-blue-600" />
                    {getStatusBadge(report.status)}
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="text-sm">{report.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</p>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-3 w-3" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Recently generated reports available for download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Monthly Inventory Report - January 2024",
                type: "PDF",
                size: "2.4 MB",
                generated: "2 hours ago",
              },
              {
                name: "Stock Level Analysis - Week 3",
                type: "Excel",
                size: "1.8 MB",
                generated: "1 day ago",
              },
              {
                name: "Material Usage Trends - Q1 2024",
                type: "PDF",
                size: "3.2 MB",
                generated: "3 days ago",
              },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.size} • Generated {report.generated}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
