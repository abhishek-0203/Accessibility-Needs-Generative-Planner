import { createContext, useState, useEffect, useCallback } from 'react'
import * as authService from '../services/authService'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/profile')
      setUser(data.user || data)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token, fetchProfile])

  const login = async (email, password) => {
    const { data } = await authService.login(email, password)
    const newToken = data.token || data.access_token
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(data.user)
    return data
  }

  const register = async (email, password, fullName) => {
    const { data } = await authService.register(email, password, fullName)
    const newToken = data.token || data.access_token
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // proceed even if server logout fails
    }
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token
  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, isAuthenticated, isAdmin, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
