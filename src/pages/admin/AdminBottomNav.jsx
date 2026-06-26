import { Package, Store } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { id: 'productos', icon: Package, label: 'Productos', to: '/admin' },
  { id: 'tienda', icon: Store, label: 'Ver tienda', to: '/' },
]

const AdminBottomNav = () => {
  const location = useLocation()

  return (
    <div
      className="flex md:hidden items-center justify-around w-full fixed bottom-0 left-0 right-0 z-40"
      style={{
        backgroundColor: 'var(--elev)',
        borderTop: '1px solid var(--border)',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map(({ id, icon: Icon, label, to }) => {
        const active = location.pathname === to
        return (
          <Link
            key={id}
            to={to}
            className="flex flex-col items-center justify-center no-underline"
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: active ? 'var(--surface-accent-2)' : 'transparent',
              padding: '8px 4px',
              gap: '4px',
            }}
          >
            <Icon size={20} color={active ? 'var(--accent)' : 'var(--text-muted)'} />
            <span
              style={{
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'Poppins',
                fontSize: '11px',
                fontWeight: active ? '700' : '500',
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default AdminBottomNav
