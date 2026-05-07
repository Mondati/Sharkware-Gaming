const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const apiFetch = async (path, { method = 'GET', body } = {}) => {
  const isFormData = body instanceof FormData
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: body && !isFormData ? { 'Content-Type': 'application/json' } : undefined,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message ?? 'Request failed')
    err.status = res.status
    err.code = data?.error
    err.fields = data?.fields
    throw err
  }
  return data
}
