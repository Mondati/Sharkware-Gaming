import { Search, UserRound, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = ({ cartCount = 0 }) => {
  return (
    <nav
      className="flex items-center w-full"
      style={{ backgroundColor: '#060810', height: '70px', padding: '0 48px', gap: '40px' }}
    >
      {/* Logo */}
      <Link to="/" className="flex flex-col no-underline">
        <span
          style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}
        >
          SHARKWARE
        </span>
        <span
          style={{ color: '#1A9FFF', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}
        >
          GAMING
        </span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div
        className="flex items-center"
        style={{ backgroundColor: '#1E2232', borderRadius: '20px', padding: '8px 16px', gap: '10px', width: '220px' }}
      >
        <Search size={16} color="#8890A4" />
        <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>
          Buscar productos...
        </span>
      </div>

      {/* User */}
      <Link
        to="/login"
        className="flex items-center no-underline"
        style={{ backgroundColor: '#1E2232', borderRadius: '20px', padding: '8px 16px', gap: '8px' }}
      >
        <UserRound size={15} color="#AAB3C5" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
          Ingresar
        </span>
      </Link>

      {/* Cart */}
      <Link
        to="/cart"
        className="flex items-center no-underline"
        style={{ backgroundColor: '#00C8FF', borderRadius: '20px', padding: '8px 20px' }}
      >
        <span style={{ color: '#060810', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>
          🛒&nbsp;&nbsp;Carrito ({cartCount})
        </span>
      </Link>
    </nav>
  )
}

export default Navbar
