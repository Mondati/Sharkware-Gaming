export const searchProducts = (query, products) => {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return products.filter((p) => {
    if (!p.active) return false
    return `${p.name} ${p.brand}`.toLowerCase().includes(q)
  })
}
