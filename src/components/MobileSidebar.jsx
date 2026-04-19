import { useState, useEffect } from 'react'
import {
  X, User, Package, Headphones, ChevronRight, Laptop,
  Monitor, Cpu, Zap, MemoryStick, HardDrive, Keyboard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

const ICON_MAP = { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard }

const accountLinks = [
  { icon: User,       label: 'Mi cuenta',   to: '/login' },
  { icon: Package,    label: 'Mis pedidos', to: '/'      },
  { icon: Headphones, label: 'Soporte',     to: '/'      },
]

const MobileSidebar = ({ isOpen, onClose }) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
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
          backgroundColor: '#0A0C14',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowY: 'auto',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex flex-col" style={{ gap: '2px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00C8FF', flexShrink: 0 }} />
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>
                SHARKWARE
              </span>
            </div>
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px', paddingLeft: '14px' }}>
              GAMING
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '36px', height: '36px', backgroundColor: '#1E2232', borderRadius: '8px' }}
          >
            <X size={18} color="#AAB3C5" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-col" style={{ padding: '12px 0' }}>
          <div style={{ padding: '0 16px 8px' }}>
            <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
              CATEGORÍAS
            </span>
          </div>
          {categories.filter((c) => c.id !== 'all').map(({ id, label, icon }) => {
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
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                backgroundColor: hoveredItem === id ? '#0E1424' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#0E1424',
                  border: '1px solid rgba(255,255,255,0.06)',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color="#24A8F5" />
              </div>
              <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>
                {label}
              </span>
              <ChevronRight size={15} color="#454E64" />
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
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                backgroundColor: hoveredItem === label ? '#0E1424' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Icon size={18} color="#8890A4" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '500' }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default MobileSidebar
