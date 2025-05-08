"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      console.log("User already logged in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
  
      if (!user.emailVerified) {
        await auth.signOut() // log them out immediately
  
        toast({
          variant: "destructive",
          title: "Email not verified",
          description: "Please verify your email address before logging in.",
        })
        return
      }
  
      toast({
        title: "Login successful",
        description: "Welcome back to Bits Technologies Resource Management!",
      })
  
      // Add a small delay before redirecting to ensure auth state is updated
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      console.error("Error during login:", error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Ensure user doc exists
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          fullName: user.displayName || "User",
          email: user.email,
          photoURL: user.photoURL,
          role: "resource",
          createdAt: new Date().toISOString(),
        })

        toast({
          title: "Account created",
          description: "Welcome to Bits Technologies Resource Management!",
        })
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back to Bits Technologies Resource Management!",
        })
      }

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      console.error("Error during Google login:", error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "There was an error with Google authentication.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading if auth is still being determined
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image src="/logo.png" alt="Bits Technologies Logo" width={180} height={60} priority />
            <h1 className="text-3xl font-bold text-[#004E98]">Welcome back</h1>
            <p className="text-gray-500">Log in to access your resource dashboard</p>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Log in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-[#F7931E] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#004E98] hover:bg-[#003d77]" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#F7931E] hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}