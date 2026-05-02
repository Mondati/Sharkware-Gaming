import { createContext, useContext, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (payload) => {
    const u = await authApi.login(payload)
    setUser(u)
    return u
  }

  const register = async (payload) => {
    const u = await authApi.register(payload)
    setUser(u)
    return u
  }

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
