import { apiFetch } from './client'

export const register = (payload) =>
  apiFetch('/api/auth/register', { method: 'POST', body: payload })
