import { useState } from 'react'
import { Search, UserRound, ShoppingCart, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import MobileSidebar from './MobileSidebar'
import { useWindowWidth } from '../hooks/useWindowWidth'

const Navbar = ({ cartCount = 0 }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileSearchTerm, setMobileSearchTerm] = useState('')
  const { sidePadding } = useWindowWidth()
  const navigate = useNavigate()

  const handleDesktopSearch = (e) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setSearchTerm('')
  }

  const handleMobileSearch = (e) => {
    e.preventDefault()
    const q = mobileSearchTerm.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setMobileSearchOpen(false)
    setMobileSearchTerm('')
  }

  return (
    <>
      {/* ── Mobile Navbar ── */}
      <nav
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: '#060810', height: '56px', padding: '0 16px', position: 'sticky', top: 0, zIndex: 50 }}
      >
        {mobileSearchOpen ? (
          /* ── Mobile search bar mode ── */
          <form onSubmit={handleMobileSearch} className="flex items-center w-full" style={{ gap: '8px' }}>
            <button
              type="button"
              onClick={() => { setMobileSearchOpen(false); setMobileSearchTerm('') }}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '8px', flexShrink: 0 }}
            >
              <X size={20} color="#AAB3C5" />
            </button>
            <input
              autoFocus
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              style={{
                flex: 1,
                backgroundColor: '#1E2232',
                border: 'none',
                outline: 'none',
                borderRadius: '20px',
                padding: '8px 14px',
                color: '#F5F7FA',
                fontFamily: 'Inter',
                fontSize: '13px',
              }}
            />
            <button
              type="submit"
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '8px', flexShrink: 0 }}
            >
              <Search size={20} color="#24A8F5" />
            </button>
          </form>
        ) : (
          /* ── Mobile normal mode ── */
          <>
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
                onClick={() => setMobileSearchOpen(true)}
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
          </>
        )}
      </nav>

      {/* ── Desktop Navbar ── */}
      <nav
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: '#060810', height: '70px', padding: `0 ${sidePadding}`, gap: '40px', position: 'sticky', top: 0, zIndex: 50 }}
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

        <form
          onSubmit={handleDesktopSearch}
          className="flex items-center"
          style={{ backgroundColor: '#1E2232', borderRadius: '20px', padding: '8px 16px', gap: '10px', width: '220px' }}
        >
          <button
            type="submit"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Search size={16} color="#8890A4" />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F5F7FA',
              fontFamily: 'Inter',
              fontSize: '13px',
              flex: 1,
              minWidth: 0,
            }}
          />
        </form>

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
