"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Camera, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Save,
  ChevronRight,
  Trash2
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user?.customer_id) {
        setLoading(false)
        return
      }
      try {
        const res = await fetchApi(`/customers.php?id=${user.customer_id}`)
        if (res.status === 'success') {
          setProfile(res.data)
        }
      } catch (error) {
        console.error("Failed to load profile", error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      id: user?.customer_id,
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    }

    try {
      const res = await fetchApi('/customers.php', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      if (res.status === 'success') {
        toast.success("Intelligence updated.")
      } else {
        toast.error(res.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <PageHeader
        title="Account Intelligence"
        description="Optimize your personal data for faster procurement and delivery."
      />

      <div className="grid gap-10 md:grid-cols-3">
        {/* Left Column - Card & Quick Info */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute -bottom-6 -right-6 p-8 opacity-10">
              <User className="h-40 w-40" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="relative w-fit">
                <Avatar className="h-24 w-24 ring-4 ring-white/20 ring-offset-4 ring-offset-primary">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-2xl bg-white text-primary font-black uppercase">
                    {user?.username?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg border-2 border-primary"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <p className="font-black text-xl italic tracking-tighter">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em]">{profile?.email}</p>
              </div>
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-[10px] uppercase font-black tracking-widest px-3 py-1">
                {user?.role} Account
              </Badge>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Account Analytics</h3>
            <div className="rounded-[2rem] border-none shadow-sm ring-1 ring-border/50 bg-background p-6 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Total Orders</span>
                  <span className="font-black italic text-primary">{profile?.orders_count || 0}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Total Spent</span>
                  <span className="font-black italic text-foreground">GH¢{Number(profile?.total_spent || 0).toLocaleString()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Personal Intelligence
              </CardTitle>
              <CardDescription className="text-xs">Update your core identification for system records</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">First Name</label>
                    <Input 
                      name="first_name" 
                      defaultValue={profile?.first_name || ""} 
                      className="h-12 rounded-2xl border-none ring-1 ring-border/50 focus-visible:ring-primary font-bold placeholder:font-normal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Last Name</label>
                    <Input 
                      name="last_name" 
                      defaultValue={profile?.last_name || ""} 
                      className="h-12 rounded-2xl border-none ring-1 ring-border/50 focus-visible:ring-primary font-bold placeholder:font-normal"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      Email Relay
                    </label>
                    <Input 
                      defaultValue={user?.email || ""} 
                      disabled 
                      className="h-12 rounded-2xl bg-muted/20 border-none ring-1 ring-border/50 font-bold opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      Mobile Sync
                    </label>
                    <Input 
                      name="phone" 
                      type="tel" 
                      defaultValue={profile?.phone || ""} 
                      className="h-12 rounded-2xl border-none ring-1 ring-border/50 focus-visible:ring-primary font-bold placeholder:font-normal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Delivery Protocol (Address)
                  </label>
                  <Input 
                    name="address" 
                    defaultValue={profile?.address || ""} 
                    className="h-12 rounded-2xl border-none ring-1 ring-border/50 focus-visible:ring-primary font-bold placeholder:font-normal"
                  />
                </div>

                <Button type="submit" size="lg" disabled={saving} className="h-14 px-8 rounded-2xl bg-black hover:bg-primary transition-all font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Synchronize Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50 overflow-hidden group">
            <CardContent className="p-0">
               <button className="w-full flex items-center justify-between p-8 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 text-left">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Security Rotation</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
               </button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-destructive/5 ring-1 ring-destructive/20 overflow-hidden group">
            <CardContent className="p-0">
               <button className="w-full flex items-center justify-between p-8 hover:bg-destructive/10 transition-colors">
                  <div className="flex items-center gap-4 text-left">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-destructive">Account Termination</p>
                      <p className="text-[10px] text-destructive/60 uppercase font-medium tracking-tight">Permanently delete all intelligence data</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-destructive/40 group-hover:translate-x-1 transition-transform" />
               </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
