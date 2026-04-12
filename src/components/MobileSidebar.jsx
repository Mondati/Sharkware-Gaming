import { useEffect } from 'react'
import {
  X,
  Search,
  User,
  Package,
  Headphones,
  ChevronRight,
  Monitor,
  Cpu,
  Zap,
  MemoryStick,
  HardDrive,
  Keyboard,
  Armchair,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
  { id: 'notebooks', label: 'Notebooks Gaming', icon: Monitor, color: '#38BDF8', bg: '#0C4A6E' },
  { id: 'cpu', label: 'Procesadores', icon: Cpu, color: '#FB923C', bg: '#7C2D12' },
  { id: 'monitors', label: 'Monitores Gaming', icon: Monitor, color: '#4ADE80', bg: '#14532D' },
  { id: 'gpu', label: 'GPU / Placas de Video', icon: Zap, color: '#C084FC', bg: '#581C87' },
  { id: 'ram', label: 'Memorias RAM', icon: MemoryStick, color: '#F87171', bg: '#7F1D1D' },
  { id: 'storage', label: 'Almacenamiento SSD', icon: HardDrive, color: '#FBBF24', bg: '#78350F' },
  { id: 'audio', label: 'Auriculares & Audio', icon: Headphones, color: '#38BDF8', bg: '#0C4A6E' },
  { id: 'peripherals', label: 'Teclados & Mouse', icon: Keyboard, color: '#4ADE80', bg: '#14532D' },
  { id: 'chairs', label: 'Sillas Gamer', icon: Armchair, color: '#C084FC', bg: '#581C87' },
]

const MobileSidebar = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 z-50 flex flex-col"
        style={{
          width: '300px',
          height: '100vh',
          backgroundColor: '#0A0C14',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '20px 16px', borderBottom: '1px solid #1B2333' }}
        >
          <div className="flex flex-col" style={{ gap: '2px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#37C3FF', flexShrink: 0 }} />
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>
                SHARKWARE
              </span>
            </div>
            <span style={{ color: '#37C3FF', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px', paddingLeft: '14px' }}>
              GAMING
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#1E2232',
              borderRadius: '8px',
            }}
          >
            <X size={18} color="#AAB3C5" />
          </button>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center"
          style={{
            backgroundColor: '#0E1424',
            padding: '12px 16px',
            borderBottom: '1px solid #1B2333',
            gap: '10px',
          }}
        >
          <Search size={18} color="#8890A4" />
          <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '14px' }}>
            Buscar productos...
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-col" style={{ padding: '12px 0' }}>
          <div style={{ padding: '0 16px 8px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px', fontWeight: '700', letterSpacing: '2px' }}>
              CATEGORÍAS
            </span>
          </div>
          {categories.map(({ id, label, icon: Icon, color, bg }) => (
            <Link
              key={id}
              to="/"
              className="flex items-center no-underline"
              onClick={onClose}
              style={{
                padding: '14px 16px',
                gap: '14px',
                borderBottom: '1px solid #1B2333',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: bg,
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={color} />
              </div>
              <span
                className="flex-1"
                style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '15px', fontWeight: '600' }}
              >
                {label}
              </span>
              <ChevronRight size={16} color="#454E64" />
            </Link>
          ))}
        </div>

        {/* Account links */}
        <div className="flex flex-col">
          {[
            { icon: User, label: 'Mi cuenta', to: '/login' },
            { icon: Package, label: 'Mis pedidos', to: '/' },
            { icon: Headphones, label: 'Soporte', to: '/' },
          ].map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center no-underline"
              onClick={onClose}
              style={{
                padding: '14px 16px',
                gap: '14px',
                borderBottom: '1px solid #1B2333',
              }}
            >
              <Icon size={20} color="#8890A4" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '15px', fontWeight: '500' }}>
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
