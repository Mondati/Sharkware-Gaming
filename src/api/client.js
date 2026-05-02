const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw { status: res.status, ...(data || {}) }
  return data
}
