"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Settings,
    Store,
    Bell,
    ShieldCheck,
    CreditCard,
    Globe,
    Mail,
    Smartphone,
    Truck,
    Percent,
    Clock,
    Zap,
    MessageSquare,
    Save,
    RotateCcw,
    Lock,
    Wallet,
    Building2,
    DollarSign,
    RefreshCw,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showKey, setShowKey] = useState(false)

    const loadSettings = async () => {
        setLoading(true)
        try {
            const res = await fetchApi("/settings.php")
            setSettings(res.data || {})
        } catch (e: any) {
            toast.error(e.message || "Failed to load settings")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadSettings() }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await fetchApi("/settings.php", {
                method: "PUT",
                body: JSON.stringify(settings)
            })
            toast.success("System configuration persisted")
        } catch (e: any) {
            toast.error(e.message || "Save failed")
        } finally {
            setSaving(false)
        }
    }

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Secure Vault...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">System Configuration</h1>
                    <p className="text-muted-foreground text-sm font-medium">Global platform control, business policy management, and API integrations.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 gap-2 border-none ring-1 ring-border/50 font-black text-[10px] uppercase tracking-widest shadow-sm rounded-2xl" onClick={loadSettings}>
                        <RefreshCw className={cn("h-4 w-4 opacity-50", loading && "animate-spin")} />
                        Reload
                    </Button>
                    <Button
                        className="h-12 px-8 gap-2 bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-primary transition-all rounded-2xl"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Persist Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-8">
                <div className="border-b border-border/50 pb-1">
                    <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none border-none">
                        <TabsTrigger value="general" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">General</TabsTrigger>
                        <TabsTrigger value="payment" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Payment Strategy</TabsTrigger>
                        <TabsTrigger value="installment" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Financial Policy</TabsTrigger>
                        <TabsTrigger value="communications" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-black uppercase tracking-widest text-[10px]">Communications</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="general" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="border-none shadow-sm ring-1 ring-border/50 lg:col-span-2 bg-white rounded-[2rem]">
                            <CardHeader className="bg-muted/5 px-8 pt-8">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <Store className="h-4 w-4 text-primary" />
                                    Corporate Identity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6 px-8 pb-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Business Name</Label>
                                        <Input
                                            value={settings.company_name || ""}
                                            onChange={(e) => updateSetting('company_name', e.target.value)}
                                            className="font-black border-none ring-1 ring-border/50 bg-muted/10 h-12 px-4 rounded-xl"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Support Email</Label>
                                        <Input
                                            value={settings.support_email || ""}
                                            onChange={(e) => updateSetting('support_email', e.target.value)}
                                            className="font-bold border-none ring-1 ring-border/50 bg-muted/10 h-12 px-4 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Global Headquarters</Label>
                                    <Input
                                        value={settings.company_address || ""}
                                        onChange={(e) => updateSetting('company_address', e.target.value)}
                                        className="font-bold border-none ring-1 ring-border/50 bg-muted/10 h-12 px-4 rounded-xl"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-border/50 bg-white rounded-[2rem]">
                            <CardHeader className="bg-muted/5 px-8 pt-8">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-primary" />
                                    Operational Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6 px-8 pb-8">
                                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl ring-1 ring-border/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-black uppercase">Fulfillment Active</Label>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Accept storefront orders</p>
                                    </div>
                                    <Switch
                                        checked={settings.fulfillment_enabled === "true"}
                                        onCheckedChange={(val) => updateSetting('fulfillment_enabled', val ? "true" : "false")}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl ring-1 ring-border/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-black uppercase">Overseas Sourcing</Label>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Enable custom sourcing</p>
                                    </div>
                                    <Switch
                                        checked={settings.sourcing_enabled === "true"}
                                        onCheckedChange={(val) => updateSetting('sourcing_enabled', val ? "true" : "false")}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {/* MoMo - Auto */}
                        <Card className="border-none shadow-sm ring-1 ring-border/50 bg-white rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-emerald-500/5 px-10 py-8 border-b border-emerald-500/10">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-emerald-600" />
                                            Mobile Money - Auto
                                        </CardTitle>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Automated Payment Gateway Integration</p>
                                    </div>
                                    <Switch
                                        checked={settings.momo_auto_enabled === "true"}
                                        onCheckedChange={(val) => updateSetting('momo_auto_enabled', val ? "true" : "false")}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Preferred Gateway</Label>
                                    <Select
                                        value={settings.momo_auto_gateway || "Paystack"}
                                        onValueChange={(val) => updateSetting('momo_auto_gateway', val)}
                                    >
                                        <SelectTrigger className="rounded-xl h-12 bg-muted/10 border-none ring-1 ring-border/50 font-bold text-xs px-4">
                                            <SelectValue placeholder="Select Provider" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl">
                                            <SelectItem value="Paystack" className="font-bold text-xs uppercase tracking-widest">Paystack (Recommended)</SelectItem>
                                            <SelectItem value="Arkesel" className="font-bold text-xs uppercase tracking-widest">Arkesel / Hubtel</SelectItem>
                                            <SelectItem value="Flutterwave" className="font-bold text-xs uppercase tracking-widest">Flutterwave</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground">API Secret Key</Label>
                                        <button onClick={() => setShowKey(!showKey)} className="text-[9px] font-black uppercase text-primary/60 hover:text-primary transition-colors flex items-center gap-1.5">
                                            {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            {showKey ? "Mask" : "Reveal"}
                                        </button>
                                    </div>
                                    <Input
                                        type={showKey ? "text" : "password"}
                                        value={settings.momo_auto_secret_key || ""}
                                        onChange={(e) => updateSetting('momo_auto_secret_key', e.target.value)}
                                        className="font-mono text-xs border-none ring-1 ring-border/50 bg-muted/10 h-14 px-4 rounded-xl"
                                        placeholder="sk_live_..."
                                    />
                                </div>
                                <div className="p-4 bg-muted/5 rounded-2xl flex items-center justify-between ring-1 ring-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Webhook Status: Operational</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase hover:bg-black hover:text-white rounded-lg">Test Ping</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* MoMo - Manual */}
                        <Card className="border-none shadow-sm ring-1 ring-border/50 bg-white rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-amber-500/5 px-10 py-8 border-b border-amber-500/10">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                            <Smartphone className="h-4 w-4 text-amber-600" />
                                            Mobile Money - Manual
                                        </CardTitle>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Direct Transfer to Office Payment Line</p>
                                    </div>
                                    <Switch
                                        checked={settings.momo_manual_enabled === "true"}
                                        onCheckedChange={(val) => updateSetting('momo_manual_enabled', val ? "true" : "false")}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Payment Number</Label>
                                        <Input
                                            value={settings.momo_manual_number || ""}
                                            onChange={(e) => updateSetting('momo_manual_number', e.target.value)}
                                            className="font-black border-none ring-1 ring-border/50 bg-muted/10 h-12 px-4 rounded-xl"
                                            placeholder="+233 24..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Registered Name</Label>
                                        <Input
                                            value={settings.momo_manual_name || ""}
                                            onChange={(e) => updateSetting('momo_manual_name', e.target.value)}
                                            className="font-bold border-none ring-1 ring-border/50 bg-muted/10 h-12 px-4 rounded-xl"
                                            placeholder="MENSGUY IMPORTS"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Network Provider</Label>
                                    <Select
                                        value={settings.momo_manual_network || "MTN"}
                                        onValueChange={(val) => updateSetting('momo_manual_network', val)}
                                    >
                                        <SelectTrigger className="rounded-xl h-12 bg-muted/10 border-none ring-1 ring-border/50 font-bold text-xs px-4">
                                            <SelectValue placeholder="Select Network" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl">
                                            <SelectItem value="MTN" className="font-bold text-xs uppercase tracking-widest text-amber-600">MTN Mobile Money</SelectItem>
                                            <SelectItem value="Telecel" className="font-bold text-xs uppercase tracking-widest text-rose-600">Telecel Cash</SelectItem>
                                            <SelectItem value="AirtelTigo" className="font-bold text-xs uppercase tracking-widest text-primary">AT Money</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[9px] text-muted-foreground font-black italic text-center uppercase tracking-widest leading-relaxed">
                                        Customers will be instructed to send exact amounts to this line and upload evidence for staff verification.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="installment" className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-border/50 bg-white rounded-[2.5rem] max-w-2xl overflow-hidden">
                        <CardHeader className="bg-muted/5 px-10 py-8">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Percent className="h-4 w-4 text-rose-600" />
                                Penalty & Grace Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Standard Grace Period</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            value={settings.installment_grace_days || "7"}
                                            onChange={(e) => updateSetting('installment_grace_days', e.target.value)}
                                            className="font-black border-none ring-1 ring-border/50 bg-muted/10 h-14 w-24 text-center rounded-2xl text-lg"
                                        />
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Business Days</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Default Penalty Rate</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            value={settings.installment_penalty_pct || "30"}
                                            onChange={(e) => updateSetting('installment_penalty_pct', e.target.value)}
                                            className="font-black border-none ring-1 ring-border/50 bg-muted/10 h-14 w-24 text-center rounded-2xl text-lg"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-rose-600">%</span>
                                            <span className="text-[8px] font-black uppercase text-muted-foreground">Of Total</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-rose-500/[0.02] rounded-[1.5rem] ring-1 ring-rose-500/10">
                                <div className="space-y-1">
                                    <Label className="text-xs font-black uppercase">Automated Surcharge</Label>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Auto-apply penalty to overdue accounts after grace period</p>
                                </div>
                                <Switch
                                    checked={settings.auto_penalty_enabled === "true"}
                                    onCheckedChange={(val) => updateSetting('auto_penalty_enabled', val ? "true" : "false")}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="communications" className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-border/50 bg-white rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-primary/5 px-10 py-8 border-b border-primary/10">
                            <div className="flex items-center justify-between font-black">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary" />
                                        Communication Terminal
                                    </CardTitle>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">SMS Gateway & Automated Notifications</p>
                                </div>
                                <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary bg-primary/5">Arkesel Protocol</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">SMS API Key</Label>
                                    <Input
                                        type="password"
                                        value={settings.sms_api_key || ""}
                                        onChange={(e) => updateSetting('sms_api_key', e.target.value)}
                                        className="font-mono text-xs border-none ring-1 ring-border/50 bg-muted/10 h-14 px-4 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Sender Identifier</Label>
                                    <Input
                                        value={settings.sms_sender_id || "MENSGUY"}
                                        onChange={(e) => updateSetting('sms_sender_id', e.target.value)}
                                        className="font-black text-center border-none ring-1 ring-border/50 bg-muted/10 h-14 px-4 rounded-xl text-lg tracking-[0.4em] uppercase"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-6 border-t border-border/50">
                                <div className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl ring-1 ring-border/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Order Updates</span>
                                    <Switch
                                        checked={settings.sms_orders === "true"}
                                        onCheckedChange={(val) => updateSetting('sms_orders', val ? "true" : "false")}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl ring-1 ring-border/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Payment Alerts</span>
                                    <Switch
                                        checked={settings.sms_payments === "true"}
                                        onCheckedChange={(val) => updateSetting('sms_payments', val ? "true" : "false")}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl ring-1 ring-border/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Admin Critical</span>
                                    <Switch
                                        checked={settings.sms_admin === "true"}
                                        onCheckedChange={(val) => updateSetting('sms_admin', val ? "true" : "false")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
