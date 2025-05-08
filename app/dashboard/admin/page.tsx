"use client"

import type React from "react"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Download } from "lucide-react"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    department: "Engineering",
    skills: [
      { name: "React", years: 4 },
      { name: "TypeScript", years: 3 },
      { name: "Node.js", years: 2 },
    ],
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    department: "Design",
    skills: [
      { name: "UI/UX", years: 5 },
      { name: "Figma", years: 4 },
      { name: "React", years: 2 },
    ],
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    department: "Engineering",
    skills: [
      { name: "Python", years: 6 },
      { name: "Django", years: 4 },
      { name: "React", years: 1 },
    ],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    department: "Product",
    skills: [
      { name: "Product Management", years: 7 },
      { name: "Agile", years: 5 },
      { name: "React", years: 1 },
    ],
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@example.com",
    department: "Engineering",
    skills: [
      { name: "Java", years: 8 },
      { name: "Spring", years: 6 },
      { name: "React", years: 3 },
    ],
  },
]

type User = {
  id: number
  name: string
  email: string
  department: string
  skills: { name: string; years: number }[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    if (role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      })
      return
    }

    // Simulate data loading
    const timer = setTimeout(() => {
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = users.filter((user) => user.skills.some((skill) => skill.name.toLowerCase().includes(query)))

    // Sort by years of experience for the matching skill
    filtered.sort((a, b) => {
      const aSkill = a.skills.find((skill) => skill.name.toLowerCase().includes(query))
      const bSkill = b.skills.find((skill) => skill.name.toLowerCase().includes(query))

      const aYears = aSkill ? aSkill.years : 0
      const bYears = bSkill ? bSkill.years : 0

      return bYears - aYears // Descending order
    })

    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const handleSendEmail = () => {
    if (selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "No users selected",
        description: "Please select at least one user to send an email.",
      })
      return
    }

    if (!emailSubject.trim() || !emailBody.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both subject and message for the email.",
      })
      return
    }

    // In a real app, this would send an email to the selected users
    const selectedUserNames = users
      .filter((user) => selectedUsers.includes(user.id))
      .map((user) => user.name)
      .join(", ")

    toast({
      title: "Email sent",
      description: `Email sent to ${selectedUserNames}.`,
    })

    setIsEmailDialogOpen(false)
    setEmailSubject("")
    setEmailBody("")
  }

  const exportUserData = () => {
    // In a real app, this would generate a CSV or Excel file
    toast({
      title: "Data exported",
      description: "User data has been exported successfully.",
    })
  }

  if (userRole !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to access this page.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please contact an administrator if you believe this is an error.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Search for users by skill and manage team communications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Skills Search</CardTitle>
            <CardDescription>Find users with specific skills across the organization</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by skill (e.g., React, Python)"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
              <Button type="button" variant="outline" onClick={exportUserData}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </form>

            <div className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading user data...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex justify-center py-8">
                  <p>No users found with the specified skill.</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="select-all"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={toggleAllUsers}
                      />
                      <Label htmlFor="select-all">Select All</Label>
                    </div>

                    <div className="flex gap-2">
                      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" disabled={selectedUsers.length === 0}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email Selected
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Email</DialogTitle>
                            <DialogDescription>
                              Send an email to {selectedUsers.length} selected user(s).
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="subject">Subject</Label>
                              <Input
                                id="subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Email subject"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="message">Message</Label>
                              <Textarea
                                id="message"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Type your message here..."
                                rows={5}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSendEmail}>Send Email</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Skills</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => {
                          // Find the matching skill for highlighting
                          const matchingSkill = searchQuery
                            ? user.skills.find((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            : null

                          return (
                            <TableRow key={user.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedUsers.includes(user.id)}
                                  onCheckedChange={() => toggleUserSelection(user.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.department}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {user.skills.map((skill) => (
                                    <Badge
                                      key={`${user.id}-${skill.name}`}
                                      variant={matchingSkill?.name === skill.name ? "default" : "outline"}
                                      className={matchingSkill?.name === skill.name ? "bg-teal-600" : ""}
                                    >
                                      {skill.name} ({skill.years} {skill.years === 1 ? "yr" : "yrs"})
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
