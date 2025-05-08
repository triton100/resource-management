"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock user data
const mockUserData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "Software Developer",
  department: "Engineering",
  bio: "Experienced software developer with a passion for building scalable web applications.",
  location: "Cape Town, South Africa",
  phone: "+27 12 345 6789",
  joinDate: "January 2022",
}

export default function ProfilePage() {
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockUserData)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserData(formData)
    setIsEditing(false)

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleCancel = () => {
    setFormData(userData)
    setIsEditing(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and account settings</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </div>
                  {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userData.name} />
                      <AvatarFallback>
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Job Title</Label>
                          <Input id="role" name="role" value={formData.role} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                          <p>{userData.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                          <p>{userData.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Job Title</h3>
                          <p>{userData.role}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                          <p>{userData.department}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                          <p>{userData.location}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                          <p>{userData.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                          <p>{userData.bio}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Account Information</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium">Member Since</div>
                        <div className="text-sm text-muted-foreground">{userData.joinDate}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Account Type</div>
                        <div className="text-sm text-muted-foreground">Employee</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Password</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Change your password</div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Notifications</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Manage your notification preferences</div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="ml-auto">
                  Delete Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
