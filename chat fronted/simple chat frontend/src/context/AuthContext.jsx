"use client"

import { createContext, useState, useContext, useEffect } from "react"

// Create a context for authentication data
const AuthContext = createContext()

// Custom hook to easily access auth context from any component
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  // State to store the current user information
  const [user, setUser] = useState(null)
  // Loading state to handle initial auth check
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On component mount, check if user is stored in localStorage (persistent login)
    const storedUser = localStorage.getItem("chatUser")
    if (storedUser) {
      // If found, parse and set the user data
      setUser(JSON.parse(storedUser))
    }
    // Mark loading as complete
    setLoading(false)
  }, [])

  // Function to handle user login
  const login = (username) => {
    // Create user object with username and authentication flag
    const userData = { username, isAuthenticated: true }
    // Update state with user data
    setUser(userData)
    // Store user data in localStorage for persistence across page refreshes
    localStorage.setItem("chatUser", JSON.stringify(userData))
    return userData
  }

  // Function to handle user logout
  const logout = () => {
    // Clear user state
    setUser(null)
    // Remove user data from localStorage
    localStorage.removeItem("chatUser")
  }

  // Create value object with all auth-related data and functions
  const value = {
    user,
    login,
    logout,
    loading,
  }

  // Provide the auth context to all child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
