import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  // Listen for storage changes to update user when balance changes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Function to manually refresh user data from localStorage
  const refreshUser = () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const updatedUser = JSON.parse(stored)
      setUser(updatedUser)
      return updatedUser
    }
    return user
  }

  const register = (email, password, username) => {
    // Check if user already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    console.log('Current users:', allUsers)
    console.log('Attempting to register:', email)
    
    const existingUser = allUsers.find(user => user.email === email)
    console.log('Existing user found:', existingUser)
    
    if (existingUser) {
      console.log('User already exists, throwing error')
      throw new Error('User already exists')
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashPassword(password),
      balance: 1000,
      createdAt: new Date().toISOString()
    }
    
    console.log('Creating new user:', newUser)
    
    // Store user in current session
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    
    // Also store in all users collection
    allUsers.push(newUser)
    localStorage.setItem('allUsers', JSON.stringify(allUsers))
    
    return newUser
  }

  const login = (email, password) => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const user = allUsers.find(u => u.email === email && u.password === hashPassword(password))
    
    if (user) {
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    }
    return null
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const isAdmin = () => {
    return user && (user.email === 'admin@jak.com' || user.email?.includes('admin'))
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser, isAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function hashPassword(password) {
  return btoa(password)
}
