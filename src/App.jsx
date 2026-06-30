import { useState, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Check, Bot, X } from 'lucide-react'
import Navbar from './components/Navbar'
import ChatbotPanel from './components/ChatbotPanel'
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
import BuilderPage from './pages/BuilderPage'
import AboutPage from './pages/AboutPage'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import PendingOrderRedirect from './components/PendingOrderRedirect'
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
        backgroundColor: 'var(--surface)',
        border: '1px solid rgba(var(--accent-rgb),0.3)',
        borderRadius: '12px',
        padding: '12px 20px',
        gap: '10px',
        zIndex: 30,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
      }}
    >
      <Check size={16} color="var(--success)" />
      <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
        ¡Agregado al carrito!
      </span>
    </div>
  )
}

const App = () => {
  const location = useLocation()
  const [chatOpen, setChatOpen] = useState(false)
  const hideNavbar = location.pathname === '/login' || location.pathname.startsWith('/admin')
  const hideChatbot = location.pathname === '/login' || location.pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <PendingOrderRedirect />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResultsRoute />} />
        <Route path="/crypto" element={<CryptoPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
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
      {!hideChatbot && (
        <>
          {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}
          <button
            onClick={() => setChatOpen((v) => !v)}
            className="flex items-center justify-center border-none cursor-pointer"
            aria-label={chatOpen ? 'Cerrar chatbot' : 'Abrir chatbot'}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '52px',
              height: '52px',
              borderRadius: '999px',
              backgroundColor: 'var(--elev)',
              border: '1px solid rgba(var(--accent-bright-rgb),0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(var(--accent-bright-rgb),0.60), 0 0 20px rgba(var(--accent-bright-rgb),calc(0.12 * var(--glow-strength)))',
              zIndex: 50,
            }}
          >
            {chatOpen ? <X size={22} color="var(--text-strong)" /> : <Bot size={26} color="var(--text-strong)" />}
          </button>
        </>
      )}
    </div>
  )
}

export default App
