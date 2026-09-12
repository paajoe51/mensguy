"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Loader2, 
  Save, 
  Lock,
  Bell,
  Activity
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"

export default function AdminProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return
      try {
        const res = await fetchApi(`/staff.php?id=${user.id}`)
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      id: user?.id,
      full_name: formData.get("full_name"),
      email: formData.get("email"),
    }

    try {
      const res = await fetchApi('/staff.php', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      if (res.status === 'success') {
        toast.success("Profile updated.")
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
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="Account Intelligence"
          description="Manage your professional profile and system credentials"
        />
        <div className="flex gap-2">
            <Badge variant="outline" className="h-8 bg-primary/5 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest px-3">
              {profile?.role} Protocol
            </Badge>
            <Badge variant="outline" className="h-8 bg-emerald-500/5 border-emerald-500/20 text-emerald-600 font-black uppercase text-[10px] tracking-widest px-3 italic">
              Level: {profile?.role === 'Administrator' ? 'Superuser' : 'Standard'}
            </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Col: Overview & Quick Info */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-black text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="h-32 w-32 rotate-12" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <Avatar className="h-24 w-24 ring-4 ring-white/10 ring-offset-4 ring-offset-black">
                <AvatarFallback className="bg-primary text-white font-black text-2xl uppercase">
                  {profile?.username?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic tracking-tighter">{profile?.full_name || profile?.username}</h2>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">{profile?.email}</p>
              </div>
              
              <div className="pt-4 space-y-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">System Onboarded</p>
                    <p className="text-xs font-bold">{new Date(profile?.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Live Status</p>
                    <p className="text-xs font-bold uppercase">{profile?.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
             <CardHeader>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Prefs
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                {[
                  { label: "Critical Stock Alerts", checked: true },
                  { label: "New Order Broadcast", checked: true },
                  { label: "Financial Deficit Sync", checked: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-muted/20">
                    <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                    <div className={`h-4 w-8 rounded-full relative ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'} transition-colors`}>
                      <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${item.checked ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>

        {/* Right Col: Edit Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="p-8 pb-0">
               <CardTitle className="text-xl font-bold flex items-center gap-3">
                 <User className="h-5 w-5 text-primary" />
                 Personnel Intel
               </CardTitle>
               <CardDescription className="text-xs">Update your professional identity and system identification</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Universal Username</label>
                    <Input 
                      defaultValue={profile?.username} 
                      disabled 
                      className="h-12 rounded-2xl bg-muted/20 border-none ring-1 ring-border/50 font-bold" 
                    />
                    <p className="text-[9px] text-muted-foreground italic px-1">Username is fixed for security audit logs.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Professional Full Name</label>
                    <Input 
                      name="full_name"
                      defaultValue={profile?.full_name} 
                      className="h-12 rounded-2xl border-none ring-1 ring-border/50 focus-visible:ring-primary font-bold placeholder:font-normal" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Intelligence Relay (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      name="email"
                      defaultValue={profile?.email} 
                      className="h-12 pl-12 rounded-2xl border-none ring-1 ring-border/50 focus-visible:ring-primary font-bold placeholder:font-normal" 
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={saving} className="h-14 px-8 rounded-2xl bg-black hover:bg-primary transition-all font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Synchronize Record
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
             <CardHeader className="p-8 pb-0">
               <CardTitle className="text-xl font-bold flex items-center gap-3">
                 <Lock className="h-5 w-5 text-primary" />
                 Crypto Security
               </CardTitle>
               <CardDescription className="text-xs">Manage system access passwords and authentication protocols</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
               <div className="p-6 rounded-3xl bg-muted/10 border border-dashed border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Last Rotation: 45 days ago</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Standard security requires 90-day rotation</p>
                  </div>
                  <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 border-primary/20 text-primary">
                    Initiate Rotation
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
