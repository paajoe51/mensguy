"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Bell,
    Mail,
    MessageSquare,
    Calendar,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    Plus,
    MoreHorizontal,
    Trash2,
    BarChart3,
    History,
    RefreshCw,
    Info,
    Smartphone,
    Users,
    Zap
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const notificationLogs = [
    { id: "NOT-001", type: "SMS", recipient: "John Doe (+233 24 555 0122)", category: "Payment Received", status: "delivered", time: "10 mins ago", transcript: "Hello John, your payment of GH¢500 has been received. Balance: GH¢1,200. Thank you!" },
    { id: "NOT-002", type: "System", recipient: "Admin Team", category: "Low Stock Alert", status: "sent", time: "1 hour ago", transcript: "Urgent: iPhone 15 Pro stock is below 5 units. Please restock." },
    { id: "NOT-003", type: "SMS", recipient: "Jane Smith (+233 50 111 2222)", category: "Installment Reminder", status: "failed", time: "2 hours ago", transcript: "Reminder: Your installment for Order #8812 is due tomorrow. Amount: GH¢450." },
    { id: "NOT-004", type: "Push", recipient: "Kwame Antwi", category: "Order Ready", status: "delivered", time: "Yesterday", transcript: "Your order #9921 is ready for pickup at our Osu warehouse." },
    { id: "NOT-005", type: "SMS", recipient: "Araba Atta (+233 55 222 3333)", category: "Grace Period Warning", status: "scheduled", time: "In 2 days", transcript: "Final Notice: Grace period for your overdue installment ends in 48 hours." },
]

export default function NotificationsPage() {
    const [selectedLog, setSelectedLog] = useState<any>(null)
    const [showBroadcast, setShowBroadcast] = useState(false)

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic">Communications Hub</h1>
                    <p className="text-muted-foreground text-sm font-medium">Automated SMS management, system logs, and marketing broadcasts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 gap-2 border-none ring-1 ring-border/50 font-bold shadow-sm hover:bg-muted transition-all">
                        <History className="h-4 w-4 opacity-50" />
                        Usage History
                    </Button>
                    <Button
                        onClick={() => setShowBroadcast(true)}
                        className="h-10 gap-2 bg-primary font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all"
                    >
                        <Send className="h-4 w-4" />
                        Direct Broadcast
                    </Button>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "SMS Sent (MTD)", value: "1,240", icon: smartphone_icon, color: "primary" },
                    { label: "Delivery Rate", value: "98.4%", icon: check_icon, color: "emerald" },
                    { label: "Queued Alerts", value: "45", icon: clock_icon, color: "amber" },
                    { label: "API Provider", value: "Arkesel", icon: zap_icon, color: "indigo" },
                ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm ring-1 ring-border/50 bg-white group hover:ring-primary/20 transition-all">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-500/5 flex items-center justify-center ring-1 ring-${stat.color}-500/10 group-hover:bg-${stat.color}-500/10 transition-colors`}>
                                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                                    <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-1">
                    <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none border-none">
                        <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Transmission Logs</TabsTrigger>
                        <TabsTrigger value="scheduled" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Scheduled Automations</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search logs..." className="pl-9 h-9 w-[240px] text-xs font-bold border-none ring-1 ring-border/50 bg-white" />
                        </div>
                    </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="px-6 py-5 font-black text-[10px] uppercase tracking-widest">Type / ID</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Target Personnel</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Intent</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Timestamp</TableHead>
                                    <TableHead className="w-12 px-6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notificationLogs.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        className="group hover:bg-primary/[0.01] border-b border-border/20 transition-colors cursor-pointer"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <TableCell className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center ring-1 ring-border/50 group-hover:bg-white transition-colors">
                                                    {log.type === 'SMS' ? <Smartphone className="h-3.5 w-3.5 text-primary" /> : <Bell className="h-3.5 w-3.5 text-indigo-500" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black tracking-tight">{log.type}</span>
                                                    <span className="text-[9px] font-mono text-muted-foreground uppercase">{log.id}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold tracking-tight">{log.recipient}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-background ring-1 ring-border/50 border-none px-2 shadow-sm">
                                                {log.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${log.status === 'delivered' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : log.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{log.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.time}</TableCell>
                                        <TableCell className="px-6 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                                                <Info className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="scheduled" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-none shadow-sm ring-1 ring-border/50 bg-white">
                            <CardHeader className="bg-muted/5">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    Active Automations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {[
                                    { title: "Installment Day-Before Reminder", desc: "Sent 24h before due date.", status: "enabled" },
                                    { title: "Penalty Grace Period Warning", desc: "Sent when grace period starts.", status: "enabled" },
                                    { title: "Inventory Low Stock Alert", desc: "Sent to Procurement unit.", status: "disabled" },
                                ].map((auto) => (
                                    <div key={auto.title} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl ring-1 ring-border/50 hover:ring-primary/20 transition-all">
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-sm tracking-tight">{auto.title}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase">{auto.desc}</p>
                                        </div>
                                        <Badge variant={auto.status === 'enabled' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-widest">
                                            {auto.status}
                                        </Badge>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full h-10 border-none ring-1 ring-border/50 bg-white text-[10px] font-black uppercase tracking-widest gap-2">
                                    <Plus className="h-3 w-3" /> New Automation Rule
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-border/50 bg-white">
                            <CardHeader className="bg-muted/5">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-primary" />
                                    Communication Efficiency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 flex flex-col items-center justify-center h-[200px] text-center">
                                <AlertCircle className="h-10 w-10 text-muted-foreground/20 mb-4" />
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Aggregating Delivery Stats...</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Transcript Dialog */}
            <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="max-w-md border-none shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight italic">Message Transcript</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Target Log ID: {selectedLog?.id} · Delivered via {selectedLog?.type}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-6 py-4">
                            <div className="p-4 bg-muted/30 rounded-2xl ring-1 ring-border/50">
                                <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                                    "{selectedLog.transcript}"
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Recipient</p>
                                    <p className="text-xs font-bold">{selectedLog.recipient}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Provider</p>
                                    <p className="text-xs font-bold">Arkesel SMS Gateway</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button className="w-full font-black text-xs uppercase tracking-widest shadow-lg" onClick={() => setSelectedLog(null)}>
                            Close Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Broadcast Dialog */}
            <Dialog open={showBroadcast} onOpenChange={setShowBroadcast}>
                <DialogContent className="max-w-lg border-none shadow-2xl rounded-[2rem] p-8">
                    <DialogHeader className="space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                            <Send className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">Direct SMS Broadcast</DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Reach your customer segments in real-time via primary Hubtel/Arkesel API.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest">Target Segment</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="h-10 text-[10px] font-bold uppercase tracking-widest ring-1 ring-border/50 border-none bg-muted/20">All Customers</Button>
                                <Button variant="outline" className="h-10 text-[10px] font-bold uppercase tracking-widest ring-1 ring-primary/30 border-none bg-primary/5 text-primary">Overdue Accounts</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest">Compose Message</Label>
                            <Textarea
                                placeholder="Dear Customer, this is a message from MENSGUY..."
                                className="min-h-[120px] rounded-2xl border-none ring-1 ring-border/50 bg-muted/10 font-medium text-sm p-4 focus-visible:ring-primary shadow-inner"
                            />
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[10px] font-bold text-muted-foreground">CHARACTERS: 0 / 160</p>
                                <p className="text-[10px] font-bold text-primary italic uppercase">1 CREDIT PER SMS</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-3 sm:gap-2">
                        <Button variant="ghost" className="font-black text-xs uppercase tracking-widest" onClick={() => setShowBroadcast(false)}>Cancel</Button>
                        <Button className="flex-1 font-black text-xs uppercase tracking-widest shadow-xl py-6">Initiate Transmission</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Icons for map
const smartphone_icon = Smartphone
const check_icon = CheckCircle2
const clock_icon = Clock
const zap_icon = Zap
