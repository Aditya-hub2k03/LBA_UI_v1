"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Shield, Camera, Lock, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { isAuthenticated, user, updateProfile } = useAuth()
  const router = useRouter()
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=80&width=80")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
    // Load profile image from localStorage
    const savedImage = localStorage.getItem(`profile_image_${user?.id}`)
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [isAuthenticated, router, user])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        setProfileImage(imageData)
        if (user) {
          localStorage.setItem(`profile_image_${user.id}`, imageData)
        }
        setImageDialogOpen(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }
    // In a real app, verify currentPassword against backend
    alert("Password changed successfully!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordDialogOpen(false)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
      <div className="absolute inset-0 bg-[url('/abstract-sports-pattern.png')] opacity-5 bg-cover bg-center bg-fixed" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{"My Profile"}</h1>
            <p className="text-muted-foreground">{"Manage your account information"}</p>
          </div>

          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>{"Account Information"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center overflow-hidden border-4 border-primary/20">
                      {profileImage.includes("placeholder") ? (
                        <User className="h-10 w-10 text-white" />
                      ) : (
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                      <DialogTrigger asChild>
                        <button className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition-colors">
                          <Camera className="h-3 w-3" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{"Change Profile Picture"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              {profileImage.includes("placeholder") ? (
                                <User className="h-16 w-16 text-muted-foreground" />
                              ) : (
                                <img
                                  src={profileImage || "/placeholder.svg"}
                                  alt="Preview"
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <Label htmlFor="image-upload" className="cursor-pointer">
                              <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                                <Upload className="h-4 w-4" />
                                {"Upload Image"}
                              </div>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </Label>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{user.name}</h3>
                    <Badge className="mt-2 capitalize">{user.role}</Badge>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{"Email"}</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{"Role"}</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Lock className="mr-2 h-4 w-4" />
                        {"Change Password"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{"Change Password"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">{"Current Password"}</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-password">{"New Password"}</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">{"Confirm New Password"}</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                          {"Cancel"}
                        </Button>
                        <Button onClick={handlePasswordChange}>{"Update Password"}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
