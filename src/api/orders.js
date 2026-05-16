import { apiFetch } from './client'

export const createOrder = (items) =>
  apiFetch('/api/orders', {
    method: 'POST',
    body: { paymentMethod: 'MERCADOPAGO', items },
  })

export const listOrders = () => apiFetch('/api/orders')

export const getOrder = (id) => apiFetch(`/api/orders/${id}`)

export const createMpPreference = (orderId) =>
  apiFetch('/api/payments/mercadopago/preference', {
    method: 'POST',
    body: { orderId },
  })

export const syncPayment = (orderId) => apiFetch(`/api/orders/${orderId}/sync-payment`)
