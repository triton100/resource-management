"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

type UserRole = "admin" | "resource"

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
}

interface AuthContextType {
  user: UserData | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Auth provider initializing...")
    
    // Set a longer initial loading state to ensure Firebase initializes properly
    const initialLoadingTimer = setTimeout(() => {
      console.log("Initial auth loading period complete")
    }, 1500)
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? `User: ${firebaseUser.email}` : "No user")
      
      try {
        if (firebaseUser) {
          // Check if email is verified for email/password users
          if (firebaseUser.providerData.some(provider => provider.providerId === 'password') && 
              !firebaseUser.emailVerified) {
            console.log("Email not verified, setting user to null")
            setUser(null)
            setLoading(false)
            return
          }
          
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.fullName || null,
              photoURL: firebaseUser.photoURL,
              role: userData.role || "resource",
            })
          } else {
            // If user document doesn't exist yet, use default values
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: "resource", // Default role
            })
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // Use basic Firebase user data if Firestore fetch fails
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: "resource", // Default role
          })
        } else {
          setUser(null)
        }
      } finally {
        // Add a slight delay to ensure everything is properly initialized
        setTimeout(() => {
          setLoading(false)
          console.log("Auth loading complete, user state:", user ? "Logged in" : "Not logged in")
        }, 500)
      }
    })

    return () => {
      clearTimeout(initialLoadingTimer)
      unsubscribe()
    }
  }, [])

  const isAdmin = user?.role === "admin"

  return <AuthContext.Provider value={{ user, loading, isAdmin }}>{children}</AuthContext.Provider>
}