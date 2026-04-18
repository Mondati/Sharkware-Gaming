import { createBrowserRouter, useLocation } from 'react-router-dom'
import Home from '../pages/Home'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Login from '../pages/Login'
import Checkout from '../pages/Checkout'
import CheckoutConfirmMercadoPago from '../pages/CheckoutConfirmMercadoPago'
import CheckoutCrypto from '../pages/CheckoutCrypto'
import CheckoutConfirmCrypto from '../pages/CheckoutConfirmCrypto'
import AdminPanel from '../pages/AdminPanel'
import SearchResults from '../pages/SearchResults'
import ProtectedRoute from '../components/ProtectedRoute'

const SearchResultsRoute = () => {
  const location = useLocation()
  return <SearchResults key={location.search} />
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/product/:id', element: <ProductDetail /> },
  { path: '/search', element: <SearchResultsRoute /> },
  { path: '/cart', element: <Cart /> },
  { path: '/login', element: <Login /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/checkout/confirm/mercadopago', element: <CheckoutConfirmMercadoPago /> },
  { path: '/checkout/crypto', element: <CheckoutCrypto /> },
  { path: '/checkout/confirm/crypto', element: <CheckoutConfirmCrypto /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
])

export default router
