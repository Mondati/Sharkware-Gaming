import { useState, useEffect } from 'react'
import {
  X, User, Package, Headphones, ChevronRight, Laptop, Coins, Sparkles, Palette,
  Monitor, Cpu, Zap, MemoryStick, HardDrive, Keyboard, Fan, Box, CircuitBoard, Plug,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/products'
import { useTheme } from '../context/ThemeContext'

const ICON_MAP = { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard, Fan, Box, CircuitBoard, Plug }

const accountLinks = [
  { icon: User,       label: 'Mi cuenta',   to: '/login'    },
  { icon: Package,    label: 'Mis pedidos', to: '/'         },
  { icon: Sparkles,   label: 'Armá tu PC',  to: '/builder'  },
  { icon: Coins,      label: 'Cripto',      to: '/crypto'   },
  { icon: Headphones, label: 'Soporte',     to: '/'         },
]

const MobileSidebar = ({ isOpen, onClose }) => {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [categories, setCategories] = useState([])
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        aria-hidden="true"
        onClick={onClose}
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 z-50 flex flex-col"
        style={{
          width: '300px',
          height: '100vh',
          backgroundColor: 'var(--bg)',
          borderRight: '1px solid var(--card-border)',
          overflowY: 'auto',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '20px 16px', borderBottom: '1px solid var(--card-border)' }}
        >
          <div className="flex flex-col" style={{ gap: '2px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-bright)', flexShrink: 0 }} />
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>
                SHARKWARE
              </span>
            </div>
            <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '700', letterSpacing: '2px', paddingLeft: '14px' }}>
              GAMING
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '36px', height: '36px', backgroundColor: 'var(--surface)', borderRadius: '8px' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-col" style={{ padding: '12px 0' }}>
          <div style={{ padding: '0 16px 8px' }}>
            <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
              CATEGORÍAS
            </span>
          </div>
          {categories.map(({ id, label, icon }) => {
            const Icon = ICON_MAP[icon] ?? null
            return (
            <Link
              key={id}
              to={`/?cat=${id}`}
              className="flex items-center no-underline"
              onClick={onClose}
              onMouseEnter={() => setHoveredItem(id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                padding: '12px 16px',
                gap: '14px',
                borderBottom: '1px solid rgba(var(--overlay-rgb),0.04)',
                backgroundColor: hoveredItem === id ? 'var(--elev)' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--elev)',
                  border: '1px solid var(--card-border)',
                  flexShrink: 0,
                }}
              >
                {Icon && <Icon size={16} color="var(--accent)" />}
              </div>
              <span className="flex-1" style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
                {label}
              </span>
              <ChevronRight size={15} color="var(--text-faint)" />
            </Link>
            )
          })}
        </div>

        {/* Account links */}
        <div className="flex flex-col">
          {accountLinks.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center no-underline"
              onClick={onClose}
              onMouseEnter={() => setHoveredItem(label)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                padding: '12px 16px',
                gap: '14px',
                borderBottom: '1px solid rgba(var(--overlay-rgb),0.04)',
                backgroundColor: hoveredItem === label ? 'var(--elev)' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Icon size={18} color="var(--text-subtle)" />
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '500' }}>
                {label}
              </span>
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            onMouseEnter={() => setHoveredItem('theme')}
            onMouseLeave={() => setHoveredItem(null)}
            className="flex items-center cursor-pointer w-full text-left bg-transparent border-none"
            style={{
              padding: '12px 16px',
              gap: '14px',
              borderBottom: '1px solid rgba(var(--overlay-rgb),0.04)',
              backgroundColor: hoveredItem === 'theme' ? 'var(--elev)' : 'transparent',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Palette size={18} color="var(--text-subtle)" />
            <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '500' }}>
              Tema: {theme === 'retro' ? 'Retro' : 'Oscuro'}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export default MobileSidebar
