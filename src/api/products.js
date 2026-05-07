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

export const listAdminProducts = ({ page = 0, size = 50, q = '' } = {}) =>
  apiFetch(`/api/products${buildQuery({ page, size, q })}`)

export const createProduct = (data, imageFile, galleryFiles = []) => {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  formData.append('image', imageFile)
  galleryFiles.forEach(f => formData.append('gallery', f))
  return apiFetch('/api/admin/products', { method: 'POST', body: formData })
}
