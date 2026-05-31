import { createContext, use, useReducer, useEffect, useState, useRef } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'sw_cart'

const loadCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(data)) return []
    return data.reduce((acc, i) => {
      if (i.id != null) acc.push({
        ...i,
        quantity: i.quantity ?? 1,
        price_ars: i.price_ars ?? 0,
        stock: typeof i.stock === 'number' ? i.stock : null,
      })
      return acc
    }, [])
  } catch {
    return []
  }
}

const capQty = (qty, stock) => {
  const safe = Math.max(1, qty)
  if (typeof stock !== 'number') return safe
  if (stock <= 0) return 0
  return Math.min(safe, stock)
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action
      const stock = typeof product.stock === 'number' ? product.stock : null
      if (stock === 0) return state
      const existing = state.find(i => i.id === product.id)
      if (existing) {
        return state.map(i =>
          i.id === product.id
            ? { ...i, stock, quantity: capQty(i.quantity + quantity, stock) }
            : i
        )
      }
      return [...state, {
        id: product.id,
        brand: product.brand,
        name: product.name,
        spec: product.spec,
        price_ars: product.price_ars,
        image_url: product.image_url,
        stock,
        quantity: capQty(quantity, stock),
      }]
    }
    case 'ADD_ITEMS': {
      let next = state
      for (const { product, quantity } of action.entries) {
        const stock = typeof product.stock === 'number' ? product.stock : null
        if (stock === 0) continue
        const existing = next.find(i => i.id === product.id)
        if (existing) {
          next = next.map(i =>
            i.id === product.id
              ? { ...i, stock, quantity: capQty(i.quantity + quantity, stock) }
              : i
          )
        } else {
          next = [...next, {
            id: product.id,
            brand: product.brand,
            name: product.name,
            spec: product.spec,
            price_ars: product.price_ars,
            image_url: product.image_url,
            stock,
            quantity: capQty(quantity, stock),
          }]
        }
      }
      return next
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: capQty(action.quantity, i.stock) } : i
      ).filter(i => i.quantity > 0)
    case 'SYNC_STOCK': {
      const map = action.stockById
      return state
        .map(i => {
          if (!(i.id in map)) return i
          const stock = map[i.id]
          return { ...i, stock, quantity: capQty(i.quantity, stock) }
        })
        .filter(i => i.quantity > 0)
    }
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, [], loadCart)
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const showToast = () => {
    setToastVisible(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500)
  }

  const addItem = (product, quantity = 1) => {
    if (!product) return
    if (product.stock === 0) return
    if (!quantity || quantity < 1 || !isFinite(quantity)) return
    const existing = items.find(i => i.id === product.id)
    if (existing && typeof product.stock === 'number' && existing.quantity >= product.stock) return
    dispatch({ type: 'ADD_ITEM', product, quantity })
    showToast()
  }

  const addItems = (entries) => {
    const valid = (entries ?? []).filter(({ product, quantity }) =>
      product && product.id != null && quantity > 0 && isFinite(quantity)
    )
    if (!valid.length) return 0
    dispatch({ type: 'ADD_ITEMS', entries: valid })
    return valid.length
  }

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id })

  const updateQty = (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity })

  const syncStock = (stockById) => dispatch({ type: 'SYNC_STOCK', stockById })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, addItems, removeItem, updateQty, syncStock, clearCart, cartCount, toastVisible }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = use(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
