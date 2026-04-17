import { useState } from 'react'
import { Search, UserRound, ShoppingCart, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import MobileSidebar from './MobileSidebar'

const Navbar = ({ cartCount = 0 }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  return (
    <>
      {/* ── Mobile Navbar ── */}
      <nav
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: '#060810', height: '56px', padding: '0 16px' }}
      >
        <Link to="/" className="flex flex-col no-underline" style={{ gap: '0' }}>
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>
            SHARKWARE
          </span>
          <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '7px', fontWeight: '700', letterSpacing: '2px', marginTop: '-2px' }}>
            GAMING
          </span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center" style={{ gap: '4px' }}>
          <button
            onMouseEnter={() => setHoveredBtn('search')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '36px', height: '36px', backgroundColor: hoveredBtn === 'search' ? '#1E2232' : 'transparent', borderRadius: '8px', transition: 'background-color 0.15s ease' }}
          >
            <Search size={20} color="#AAB3C5" />
          </button>

          <Link
            to="/login"
            onMouseEnter={() => setHoveredBtn('user')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center no-underline"
            style={{ width: '36px', height: '36px', backgroundColor: hoveredBtn === 'user' ? '#1E2232' : 'transparent', borderRadius: '8px', transition: 'background-color 0.15s ease' }}
          >
            <UserRound size={20} color="#AAB3C5" />
          </Link>

          <Link
            to="/cart"
            onMouseEnter={() => setHoveredBtn('cart')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center no-underline"
            style={{ position: 'relative', width: '36px', height: '36px', backgroundColor: hoveredBtn === 'cart' ? '#1E2232' : 'transparent', borderRadius: '8px', transition: 'background-color 0.15s ease' }}
          >
            <ShoppingCart size={20} color="#AAB3C5" />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#24A8F5',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            onMouseEnter={() => setHoveredBtn('menu')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '36px', height: '36px', backgroundColor: hoveredBtn === 'menu' ? '#1E2232' : 'transparent', borderRadius: '8px', transition: 'background-color 0.15s ease' }}
          >
            <Menu size={22} color="#AAB3C5" />
          </button>
        </div>
      </nav>

      {/* ── Desktop Navbar ── */}
      <nav
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: '#060810', height: '70px', padding: '0 400px', gap: '40px' }}
      >
        <Link to="/" className="flex flex-col no-underline">
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>
            SHARKWARE
          </span>
          <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>
            GAMING
          </span>
        </Link>

        <div className="flex-1" />

        <div
          className="flex items-center"
          style={{ backgroundColor: '#1E2232', borderRadius: '20px', padding: '8px 16px', gap: '10px', width: '220px' }}
        >
          <Search size={16} color="#8890A4" />
          <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>
            Buscar productos...
          </span>
        </div>

        <Link
          to="/login"
          onMouseEnter={() => setHoveredBtn('login')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="flex items-center no-underline"
          style={{ backgroundColor: hoveredBtn === 'login' ? '#252840' : '#1E2232', borderRadius: '20px', padding: '8px 16px', gap: '8px', transition: 'background-color 0.15s ease' }}
        >
          <UserRound size={15} color="#AAB3C5" />
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
            Ingresar
          </span>
        </Link>

        <Link
          to="/cart"
          onMouseEnter={() => setHoveredBtn('cartDesktop')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="flex items-center no-underline"
          style={{ backgroundColor: hoveredBtn === 'cartDesktop' ? '#00B8EF' : '#00C8FF', borderRadius: '20px', padding: '8px 20px', transition: 'background-color 0.15s ease' }}
        >
          <span style={{ color: '#060810', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>
            🛒&nbsp;&nbsp;Carrito ({cartCount})
          </span>
        </Link>
      </nav>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default Navbar
