import { useState } from 'react'
import { Search, UserRound, ShoppingCart, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import MobileSidebar from './MobileSidebar'

const Navbar = ({ cartCount = 0 }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* ── Mobile Navbar (visible on small screens) ── */}
      <nav
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: '#060810', height: '56px', padding: '0 16px' }}
      >
        {/* Logo */}
        <Link to="/" className="flex flex-col no-underline" style={{ gap: '0' }}>
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>
            SHARKWARE
          </span>
          <span style={{ color: '#1A9FFF', fontFamily: 'Inter', fontSize: '7px', fontWeight: '700', letterSpacing: '2px', marginTop: '-2px' }}>
            GAMING
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Icons row */}
        <div className="flex items-center" style={{ gap: '4px' }}>
          {/* Search icon */}
          <button
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '8px' }}
          >
            <Search size={20} color="#AAB3C5" />
          </button>

          {/* User icon */}
          <Link
            to="/login"
            className="flex items-center justify-center no-underline"
            style={{ width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '8px' }}
          >
            <UserRound size={20} color="#AAB3C5" />
          </Link>

          {/* Cart icon */}
          <Link
            to="/cart"
            className="flex items-center justify-center no-underline"
            style={{ position: 'relative', width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '8px' }}
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

          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '8px' }}
          >
            <Menu size={22} color="#AAB3C5" />
          </button>
        </div>
      </nav>

      {/* ── Desktop Navbar (hidden on small screens) ── */}
      <nav
        className="hidden md:flex items-center w-full"
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

      {/* ── Mobile Sidebar ── */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default Navbar
