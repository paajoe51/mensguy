"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    FileText,
    Download,
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    ArrowRight,
    Calculator,
    Briefcase,
    History
} from "lucide-react"

export default function FinanceReportsPage() {
    const reports = [
        {
            title: "Profit & Loss Statement",
            description: "Comprehensive view of revenue, costs, and net income.",
            icon: BarChart3,
            lastGenerated: "Mar 25, 2026",
            type: "Monthly",
        },
        {
            title: "Trial Balance",
            description: "Audit-ready summary of all ledger accounts.",
            icon: Calculator,
            lastGenerated: "Mar 01, 2026",
            type: "Quarterly",
        },
        {
            title: "Inventory Asset Report",
            description: "Current value of warehouse stock and inbound pipeline.",
            icon: Briefcase,
            lastGenerated: "Mar 20, 2026",
            type: "Real-time",
        },
        {
            title: "Logistics Burn Analysis",
            description: "Breakdown of shipping, clearing, and delivery costs.",
            icon: PieChartIcon,
            lastGenerated: "Feb 28, 2026",
            type: "Monthly",
        },
    ]

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financial Intelligence Reports</h1>
                    <p className="text-muted-foreground text-sm">
                        Access deep business analytics and audit-ready statements.
                    </p>
                </div>
                <Button className="font-bold text-xs uppercase tracking-widest shadow-md">
                    <History className="mr-2 h-4 w-4" />
                    Archive
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {reports.map((report) => (
                    <Card key={report.title} className="shadow-sm border-none ring-1 ring-border/50 group hover:ring-primary/30 transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center ring-1 ring-primary/10 group-hover:bg-primary/10 transition-colors">
                                <report.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">{report.type}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground">Generated: {report.lastGenerated}</p>
                                </div>
                                <CardTitle className="text-lg mt-0.5">{report.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-6">{report.description}</CardDescription>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 h-9 border-none ring-1 ring-border/50 text-[10px] font-black uppercase tracking-widest">
                                    Preview
                                </Button>
                                <Button className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest">
                                    <Download className="mr-2 h-3 w-3" />
                                    Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <section className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/70">Governance & Compliance</h2>
                <Card className="shadow-sm border-none ring-1 ring-border/50 bg-indigo-50/10">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-bold">Quarterly Audit Ready</p>
                                    <p className="text-xs text-muted-foreground">System logs are verified for the current period.</p>
                                </div>
                            </div>
                            <Progress value={85} className="w-32 h-2" />
                        </div>
                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Efficiency Score: 92%</p>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
