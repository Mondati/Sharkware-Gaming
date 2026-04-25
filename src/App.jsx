import { Routes, Route, useLocation } from 'react-router-dom'
import { Check, Bot } from 'lucide-react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import CheckoutConfirmMercadoPago from './pages/CheckoutConfirmMercadoPago'
import CheckoutCrypto from './pages/CheckoutCrypto'
import CheckoutConfirmCrypto from './pages/CheckoutConfirmCrypto'
import AdminPanel from './pages/AdminPanel'
import SearchResults from './pages/SearchResults'
import ProtectedRoute from './components/ProtectedRoute'
import { useCart } from './context/CartContext'

const SearchResultsRoute = () => {
  const location = useLocation()
  const q = new URLSearchParams(location.search).get('q') ?? ''
  return <SearchResults key={q} />
}

const CartToast = () => {
  const { toastVisible } = useCart()
  if (!toastVisible) return null
  return (
    <div
      className="flex items-center"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1E2232',
        border: '1px solid rgba(36,168,245,0.3)',
        borderRadius: '12px',
        padding: '12px 20px',
        gap: '10px',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
      }}
    >
      <Check size={16} color="#22C55E" />
      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
        ¡Agregado al carrito!
      </span>
    </div>
  )
}

const App = () => {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login' || location.pathname.startsWith('/admin')
  const hideChatbot = location.pathname === '/login' || location.pathname.startsWith('/admin')
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResultsRoute />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/confirm/mercadopago" element={<CheckoutConfirmMercadoPago />} />
        <Route path="/checkout/crypto" element={<CheckoutCrypto />} />
        <Route path="/checkout/confirm/crypto" element={<CheckoutConfirmCrypto />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
      <CartToast />
      {!hideChatbot && (
        <button
          className="flex items-center justify-center border-none cursor-pointer"
          aria-label="Chatbot"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '64px',
            height: '64px',
            borderRadius: '999px',
            backgroundColor: '#0E1424',
            border: '1px solid rgba(0,200,255,0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,200,255,0.60), 0 0 20px rgba(0,200,255,0.12)',
            zIndex: 50,
          }}
        >
          <Bot size={32} color="#FFFFFF" />
        </button>
      )}
    </div>
  )
}

export default App
