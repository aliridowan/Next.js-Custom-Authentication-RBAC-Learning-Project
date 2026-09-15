'use client'

import { AuthConetxtType, Role, User } from "../api/types"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "../lib/apiClient"

const AuthContext = createContext<AuthConetxtType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getUserData()
        setUser(userData || null)
      } catch (error) {
        console.error("Failed to load user", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const logout = async () => {
    try {
      await apiClient.logout()
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  const hasPermission = (requiredRole: Role): boolean => {
    if (!user) return false
    const roleHierarchy = {
      [Role.GUEST]: 0,
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    }
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}

export default AuthProvider


// 'use client'
//
// import { AuthConetxtType, Role, User } from "../api/types";
// import { createContext, useActionState, useContext, useEffect, useState } from "react";
// import { apiClient } from "../lib/apiClient";
//
// const AuthContext = createContext<AuthConetxtType | undefined>(undefined)
//
// type loginState = {
//   success?: boolean,
//   user?: User | null,
//   error?: string,
// }
//
//
// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null)
//
//   // React 19 useActionState for login user
//   const [loginState, loginAction, isLoggingPending] = useActionState(
//
//     async (previousState: loginState, formData: FormData): Promise<loginState> => {
//       const email = formData.get('email') as string
//       const password = formData.get('password') as string
//
//       try {
//         const data = await apiClient.login(email, password) as unknown as { user: User }
//         setUser(data.user)
//         return { success: true, user: data.user }
//
//       } catch (error) {
//         console.error("Error", error)
//         return {
//           error: error instanceof Error ? error.message : "Login failed"
//         }
//       }
//     }, { error: undefined, success: undefined, user: null } as loginState)
//
//
//   const logout = async () => {
//     try {
//
//       await apiClient.logout()
//       setUser(null)
//       window.location.href = '/'
//     } catch (error) {
//       console.error("Logout error", error)
//     }
//   }
//
//   const hasPermission = (requiredRole: Role): boolean => {
//     if (!user) return false
//
//     const roleHierarchy = {
//       [Role.GUEST]: 0,
//       [Role.USER]: 1,
//       [Role.MANAGER]: 2,
//       [Role.ADMIN]: 3,
//     };
//     return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
//   }
//
//
//   useEffect(() => {
//     const loadUser = async () => {
//
//       try {
//         const userData = await apiClient.getUserData()
//         setUser(userData || null)
//
//       } catch (error) {
//         console.error("Failed to mount data ", error)
//       }
//     }
//     loadUser()
//   }, [])
//
//   return (
//     <AuthContext.Provider value={
//       {
//         user,
//         login: loginAction,
//         logout,
//         hasPermission
//       }
//     }>
//       {children}
//     </AuthContext.Provider>
//
//   )
// }
//
//
// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be in a authProvider ')
//   }
//   return context
// }
//
// export default AuthProvider
