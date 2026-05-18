import { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Check, Bot, X } from 'lucide-react'
import Navbar from './components/Navbar'
import ChatbotPanel from './components/ChatbotPanel'
import BuilderPanel from './components/BuilderPanel'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Checkout from './pages/checkout/Checkout'
import CheckoutSummary from './pages/checkout/CheckoutSummary'
import CheckoutConfirmMercadoPago from './pages/checkout/CheckoutConfirmMercadoPago'
import MyOrders from './pages/MyOrders'
import SearchResults from './pages/SearchResults'
import CryptoPage from './pages/CryptoPage'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import Toast from './components/Toast'
import { useCart } from './context/CartContext'

const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'))

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
        zIndex: 30,
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
  const [chatOpen, setChatOpen] = useState(false)
  const [builderOpen, setBuilderOpen] = useState(false)
  const hideNavbar = location.pathname === '/login' || location.pathname.startsWith('/admin')
  const hideChatbot = location.pathname === '/login' || location.pathname.startsWith('/admin')

  useEffect(() => {
    const open = () => { setBuilderOpen(true); setChatOpen(false) }
    window.addEventListener('builder:open', open)
    return () => window.removeEventListener('builder:open', open)
  }, [])
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResultsRoute />} />
        <Route path="/crypto" element={<CryptoPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/summary/:orderId" element={<CheckoutSummary />} />
        <Route path="/checkout/confirm/mercadopago" element={<CheckoutConfirmMercadoPago />} />
        <Route
          path="/mis-pedidos"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Suspense fallback={null}>
                <AdminPanel />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
      <CartToast />
      <Toast />
      {!hideChatbot && builderOpen && <BuilderPanel onClose={() => setBuilderOpen(false)} />}
      {!hideChatbot && (
        <>
          {chatOpen && !builderOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}
          <button
            onClick={() => { setBuilderOpen(false); setChatOpen((v) => !v) }}
            className="flex items-center justify-center border-none cursor-pointer"
            aria-label={chatOpen ? 'Cerrar chatbot' : 'Abrir chatbot'}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '52px',
              height: '52px',
              borderRadius: '999px',
              backgroundColor: '#0E1424',
              border: '1px solid rgba(0,200,255,0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,200,255,0.60), 0 0 20px rgba(0,200,255,0.12)',
              zIndex: 50,
            }}
          >
            {chatOpen ? <X size={22} color="#FFFFFF" /> : <Bot size={26} color="#FFFFFF" />}
          </button>
        </>
      )}
    </div>
  )
}

export default App
