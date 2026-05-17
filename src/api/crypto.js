import { apiFetch } from './client'

export const getRates = () => apiFetch('/api/crypto/rates')
