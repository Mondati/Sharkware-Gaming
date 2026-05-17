import { apiFetch } from './client'

const buildQuery = (params = {}) => {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    sp.set(k, v)
  })
  const s = sp.toString()
  return s ? `?${s}` : ''
}

export const getProducts = (params = {}) =>
  apiFetch(`/api/products${buildQuery(params)}`)

export const getProduct = (id) =>
  apiFetch(`/api/products/${id}`)

export const getFacets = (params = {}) =>
  apiFetch(`/api/products/facets${buildQuery(params)}`)

export const getCategories = () => apiFetch('/api/categories')

export const listAdminProducts = ({ page = 0, size = 20, q = '' } = {}) =>
  apiFetch(`/api/admin/products${buildQuery({ page, size, q })}`)

export const getAdminStats = () => apiFetch('/api/admin/stats')

export const createProduct = (data, imageFile, galleryFiles = []) => {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  formData.append('image', imageFile)
  galleryFiles.forEach(f => formData.append('gallery', f))
  return apiFetch('/api/admin/products', { method: 'POST', body: formData })
}

export const updateProduct = (id, data, imageFile, galleryFiles = [], keepGalleryUrls = null) => {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  if (imageFile) formData.append('image', imageFile)
  galleryFiles.forEach(f => formData.append('gallery', f))
  if (keepGalleryUrls !== null) {
    formData.append('keepGallery', new Blob([JSON.stringify(keepGalleryUrls)], { type: 'application/json' }))
  }
  return apiFetch(`/api/admin/products/${id}`, { method: 'PUT', body: formData })
}

export const deleteProduct = (id) =>
  apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' })

export const updateProductStock = (id, stock) =>
  apiFetch(`/api/admin/products/${id}/stock`, { method: 'PATCH', body: { stock } })
