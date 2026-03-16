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

  const register = (email, password, username) => {
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashPassword(password),
      balance: 1000,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const login = (email, password) => {
    const stored = localStorage.getItem('user')
    if (!stored) return null
    
    const user = JSON.parse(stored)
    if (user.email === email && user.password === hashPassword(password)) {
      setUser(user)
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

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
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
