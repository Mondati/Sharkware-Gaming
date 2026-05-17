import { useState } from 'react'
import { Zap, Package, Store, UserRound, LogOut } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { icon: Package, label: 'Productos', to: '/admin' },
]

const HOVER_BG = '#141C2E'

const AdminSidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [hovered, setHovered] = useState(null)
  const [logoutHover, setLogoutHover] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (to) => location.pathname === to

  return (
    <div className="hidden md:flex flex-col"
      style={{ width: '260px', flexShrink: 0, backgroundColor: '#0E1424', borderRight: '1px solid #1B2333', height: '100%' }}>
      <Link
        to="/"
        className="flex items-center no-underline"
        style={{
          height: '60px',
          padding: '0 24px',
          gap: '12px',
          backgroundColor: hovered === 'logo' ? HOVER_BG : 'transparent',
          transition: 'background-color 120ms ease',
        }}
        title="Ir a la tienda"
        onMouseEnter={() => setHovered('logo')}
        onMouseLeave={() => setHovered(null)}
      >
        <Zap size={22} color="#24A8F5" />
        <div className="flex flex-col" style={{ gap: '1px', flex: 1 }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>SHARKWARE</span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '600' }}>GAMING</span>
        </div>
        <div style={{ backgroundColor: '#0D2035', borderRadius: '4px', padding: '4px 8px' }}>
          <span style={{ color: '#37C3FF', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>Admin</span>
        </div>
      </Link>
      <div style={{ height: '1px', backgroundColor: '#1B2333' }} />
      <div className="flex flex-col" style={{ padding: '16px 0', gap: '4px' }}>
        <div style={{ padding: '0 24px 8px' }}>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700' }}>MENÚ PRINCIPAL</span>
        </div>
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => {
          const active = isActive(to)
          const isHover = hovered === to
          const bg = active ? '#0D2035' : (isHover ? HOVER_BG : 'transparent')
          return (
            <Link
              key={to}
              to={to}
              className="flex items-center no-underline"
              style={{
                padding: '10px 24px',
                gap: '12px',
                backgroundColor: bg,
                borderLeft: active ? '3px solid #24A8F5' : '3px solid transparent',
                transition: 'background-color 120ms ease',
              }}
              onMouseEnter={() => setHovered(to)}
              onMouseLeave={() => setHovered(null)}
            >
              <Icon size={18} color={active || isHover ? '#24A8F5' : '#AAB3C5'} />
              <span style={{ color: active || isHover ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: active ? '600' : 'normal', transition: 'color 120ms ease' }}>
                {label}
              </span>
            </Link>
          )
        })}
        <Link
          to="/"
          className="flex items-center no-underline"
          style={{
            padding: '10px 24px',
            gap: '12px',
            borderLeft: '3px solid transparent',
            marginTop: '8px',
            backgroundColor: hovered === 'tienda' ? HOVER_BG : 'transparent',
            transition: 'background-color 120ms ease',
          }}
          onMouseEnter={() => setHovered('tienda')}
          onMouseLeave={() => setHovered(null)}
        >
          <Store size={18} color={hovered === 'tienda' ? '#24A8F5' : '#AAB3C5'} />
          <span style={{ color: hovered === 'tienda' ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', transition: 'color 120ms ease' }}>Ver tienda</span>
        </Link>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ height: '1px', backgroundColor: '#1B2333' }} />
      <div className="flex items-center" style={{ padding: '16px 24px', gap: '10px' }}>
        <div className="flex items-center justify-center" style={{ width: '34px', height: '34px', backgroundColor: '#1B2333', borderRadius: '17px', flexShrink: 0 }}>
          <UserRound size={18} color="#24A8F5" />
        </div>
        <div className="flex flex-col" style={{ flex: 1, gap: '1px', minWidth: 0 }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name ?? 'Administrador'}</span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email ?? ''}</span>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="flex items-center justify-center border-none cursor-pointer"
          style={{
            background: logoutHover ? HOVER_BG : 'transparent',
            padding: '6px',
            borderRadius: '6px',
            flexShrink: 0,
            transition: 'background-color 120ms ease',
          }}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
        >
          <LogOut size={16} color={logoutHover ? '#F5F7FA' : '#AAB3C5'} />
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
