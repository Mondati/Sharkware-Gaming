import { useState, useCallback } from 'react'
import { Search, UserRound, ShoppingCart, Menu, X, LogOut, LayoutDashboard, Package, Coins } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import MobileSidebar from './MobileSidebar'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { cartCount } = useCart()
  const { user, logout, showToast } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileSearchTerm, setMobileSearchTerm] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { sidePadding } = useWindowWidth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    showToast('Sesión cerrada correctamente')
    navigate('/')
  }

  const mobileSearchRef = useCallback((node) => { node?.focus() }, [])

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
              ref={mobileSearchRef}
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              style={{
                flex: 1,
                backgroundColor: '#1E2232',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 14px',
                color: '#F5F7FA',
                fontFamily: 'Poppins',
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
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo.png" alt="Sharkware Gaming" style={{ height: '48px', width: 'auto', display: 'block' }} />
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

              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{ width: '36px', height: '36px', backgroundColor: userMenuOpen ? '#1E2232' : 'transparent', borderRadius: '8px', transition: 'background-color 0.15s ease' }}
                  >
                    <UserRound size={20} color="#24A8F5" />
                  </button>
                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute', top: '42px', right: 0,
                      backgroundColor: '#1E2232', borderRadius: '12px',
                      padding: '12px 16px', minWidth: '160px',
                      border: '1px solid #1B2333', zIndex: 10,
                      display: 'flex', flexDirection: 'column', gap: '10px'
                    }}>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                        {user.name}
                      </span>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            background: 'transparent', border: '1px solid #24A8F5',
                            borderRadius: '8px', padding: '6px 12px',
                            color: '#24A8F5', fontFamily: 'Poppins', fontSize: '12px',
                            fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            textDecoration: 'none'
                          }}
                        >
                          <LayoutDashboard size={12} /> Panel admin
                        </Link>
                      )}
                      {user.role !== 'admin' && (
                        <Link
                          to="/mis-pedidos"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            background: 'transparent', border: '1px solid #24A8F5',
                            borderRadius: '8px', padding: '6px 12px',
                            color: '#24A8F5', fontFamily: 'Poppins', fontSize: '12px',
                            fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            textDecoration: 'none'
                          }}
                        >
                          <Package size={8} /> Pedidos
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        style={{
                          background: 'transparent', border: '1px solid #EF4444',
                          borderRadius: '8px', padding: '6px 12px',
                          color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px',
                          fontWeight: '600', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        <LogOut size={12} /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onMouseEnter={() => setHoveredBtn('user')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className="flex items-center justify-center no-underline"
                  style={{ width: '36px', height: '36px', backgroundColor: hoveredBtn === 'user' ? '#1E2232' : 'transparent', borderRadius: '8px', transition: 'background-color 0.15s ease' }}
                >
                  <UserRound size={20} color="#AAB3C5" />
                </Link>
              )}

              {user?.role !== 'admin' && (
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
              )}

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/logo.png" alt="Sharkware Gaming" style={{ height: '48px', width: 'auto', display: 'block' }} />
        </Link>

        <div className="flex-1" />

        <form
          onSubmit={handleDesktopSearch}
          className="flex items-center"
          style={{
            backgroundColor: '#1E2232',
            borderRadius: '20px',
            padding: '8px 16px',
            gap: '10px',
            width: '220px',
            border: `1px solid ${searchFocused ? '#24A8F5' : 'transparent'}`,
            boxShadow: searchFocused ? '0 0 0 3px rgba(36,168,245,0.15)' : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}
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
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar productos..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F5F7FA',
              fontFamily: 'Poppins',
              fontSize: '13px',
              flex: 1,
              minWidth: 0,
            }}
          />
        </form>

        <Link
          to="/crypto"
          onMouseEnter={() => setHoveredBtn('crypto')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="flex items-center no-underline"
          style={{ backgroundColor: hoveredBtn === 'crypto' ? '#0D2035' : '#1E2232', borderRadius: '20px', padding: '8px 14px', gap: '6px', transition: 'background-color 0.15s ease' }}
        >
          <Coins size={14} color="#24A8F5" />
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Cripto</span>
        </Link>

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            onMouseEnter={() => setHoveredBtn('adminPanel')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center no-underline"
            style={{ backgroundColor: hoveredBtn === 'adminPanel' ? '#0D2035' : '#1E2232', borderRadius: '20px', padding: '8px 14px', gap: '6px', transition: 'background-color 0.15s ease' }}
          >
            <LayoutDashboard size={14} color="#24A8F5" />
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Panel</span>
          </Link>
        )}

        {user && user.role !== 'admin' && (
          <Link
            to="/mis-pedidos"
            onMouseEnter={() => setHoveredBtn('myOrders')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center no-underline"
            style={{ backgroundColor: hoveredBtn === 'myOrders' ? '#0D2035' : '#1E2232', borderRadius: '20px', padding: '8px 14px', gap: '6px', transition: 'background-color 0.15s ease' }}
          >
            <Package size={10} color="#24A8F5" />
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Pedidos</span>
          </Link>
        )}

        {user ? (
          <div className="flex items-center" style={{ backgroundColor: '#1E2232', borderRadius: '20px', padding: '8px 16px', gap: '8px' }}>
            <UserRound size={15} color="#24A8F5" />
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHoveredBtn('logout')}
              onMouseLeave={() => setHoveredBtn(null)}
              title="Cerrar sesión"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '4px' }}
            >
              <LogOut size={14} color={hoveredBtn === 'logout' ? '#EF4444' : '#8890A4'} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onMouseEnter={() => setHoveredBtn('login')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center no-underline"
            style={{ backgroundColor: hoveredBtn === 'login' ? '#252840' : '#1E2232', borderRadius: '20px', padding: '8px 16px', gap: '8px', transition: 'background-color 0.15s ease' }}
          >
            <UserRound size={15} color="#AAB3C5" />
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
              Ingresar
            </span>
          </Link>
        )}

        {user?.role !== 'admin' && (
        <Link
          to="/cart"
          onMouseEnter={() => setHoveredBtn('cartDesktop')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="flex items-center no-underline"
          style={{ backgroundColor: hoveredBtn === 'cartDesktop' ? '#00B8EF' : '#00C8FF', borderRadius: '20px', padding: '8px 20px', transition: 'background-color 0.15s ease' }}
        >
          <span style={{ color: '#060810', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>
            Carrito ({cartCount})
          </span>
        </Link>
        )}
      </nav>

      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default Navbar
