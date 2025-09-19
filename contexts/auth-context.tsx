"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type AuthState, getCurrentUser, saveCurrentUser, registerUser, loginUser, logoutUser } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    // Load user from localStorage on mount
    const user = getCurrentUser()
    setAuthState({ user, isLoading: false })
  }, [])

  const login = async (email: string, password: string) => {
    const result = loginUser(email, password)
    if (result.success && result.user) {
      saveCurrentUser(result.user)
      setAuthState({ user: result.user, isLoading: false })
    }
    return result
  }

  const register = async (email: string, password: string, name: string) => {
    const result = registerUser(email, password, name)
    if (result.success && result.user) {
      saveCurrentUser(result.user)
      setAuthState({ user: result.user, isLoading: false })
    }
    return result
  }

  const logout = () => {
    logoutUser()
    setAuthState({ user: null, isLoading: false })
  }

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
