"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock data
const mockUserData = {
  name: "Sphamandla Mbuyazi",
  role: "Software Developer",
  department: "Engineering",
  skillsCount: 12,
  completedProfile: 85,
  recentActivity: [
    { id: 1, action: "Added React skill", date: "2 days ago" },
    { id: 2, action: "Updated TypeScript experience", date: "5 days ago" },
    { id: 3, action: "Uploaded certification for AWS", date: "1 week ago" },
  ],
  popularSkills: [
    { name: "React", count: 24 },
    { name: "TypeScript", count: 18 },
    { name: "Node.js", count: 15 },
    { name: "Python", count: 12 },
  ],
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState(mockUserData)
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Modified authentication check
  useEffect(() => {
    // Only redirect if loading is complete AND we've waited a reasonable time for auth
    if (!loading && !user && authChecked) {
      console.log("User not found after auth check. Redirecting to login") 
      router.push("/login")
    }
  }, [loading, user, router, authChecked])
  
  // Add a separate effect to set authChecked after a delay
  useEffect(() => {
    const authTimer = setTimeout(() => {
      setAuthChecked(true)
    }, 1500) // Give Firebase auth a bit more time to initialize
    
    return () => clearTimeout(authTimer)
  }, [loading])
  
  // Debug output
  useEffect(() => {
    console.log("Auth state:", { loading, user: !!user, authChecked })
  }, [loading, user, authChecked])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Modified loading state to include authentication check
  if (loading || (!user && !authChecked) || isLoading) {
    return <div className="p-4 text-center">Loading dashboard...</div>
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userData.name}! Here's an overview of your profile and company skills.
        </p>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="company">Company Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.completedProfile}%</div>
                  <Progress value={userData.completedProfile} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Complete your profile to improve visibility</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Skills</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.skillsCount}</div>
                  <p className="text-xs text-muted-foreground mt-2">Skills added to your profile</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Department</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.department}</div>
                  <p className="text-xs text-muted-foreground mt-2">{userData.role}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
                <CardDescription>Here are some tips to make the most of the platform</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-teal-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-teal-600"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Upload Certifications</p>
                    <p className="text-sm text-muted-foreground">
                      Add certifications to verify your skills and increase visibility.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-teal-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-teal-600"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Update Experience</p>
                    <p className="text-sm text-muted-foreground">
                      Keep your years of experience up to date for each skill.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {userData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Popular Skills</CardTitle>
                <CardDescription>Most common skills across the company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {userData.popularSkills.map((skill) => (
                    <div key={skill.name} className="flex items-center">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">{skill.name}</p>
                        <div className="flex items-center pt-2">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-teal-600"
                              style={{ width: `${(skill.count / 25) * 100}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">{skill.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}