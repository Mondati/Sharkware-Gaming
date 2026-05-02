import { createContext, useContext, useState } from 'react'
import { register as apiRegister } from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const register = async (payload) => {
    const u = await apiRegister(payload)
    setUser(u)
    return u
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
