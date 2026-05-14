import { createContext, use, useReducer, useEffect, useState, useRef } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'sw_cart'

const loadCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(data)) return []
    return data.reduce((acc, i) => {
      if (i.id != null) acc.push({ ...i, quantity: i.quantity ?? 1, price_ars: i.price_ars ?? 0 })
      return acc
    }, [])
  } catch {
    return []
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action
      const existing = state.find(i => i.id === product.id)
      if (existing) {
        return state.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...state, {
        id: product.id,
        brand: product.brand,
        name: product.name,
        spec: product.spec,
        price_ars: product.price_ars,
        image_url: product.image_url,
        quantity,
      }]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
      )
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
    dispatch({ type: 'ADD_ITEM', product, quantity })
    showToast()
  }

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id })

  const updateQty = (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, cartCount, toastVisible }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = use(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
