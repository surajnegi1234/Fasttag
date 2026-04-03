import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // check if user is already logged in on page load
  useEffect(() => {
    authAPI.getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const { user } = await authAPI.login(credentials)
    setUser(user)
    return user
  }

  const register = async (data) => {
    const { user } = await authAPI.register(data)
    setUser(user)
    return user
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  const refreshUser = useCallback(async () => {
    const updated = await authAPI.getMe()
    setUser(updated)
    return updated
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
