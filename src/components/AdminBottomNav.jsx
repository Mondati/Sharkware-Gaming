import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
  { id: 'productos', icon: Package, label: 'Productos', active: true },
  { id: 'pedidos', icon: ShoppingCart, label: 'Pedidos', active: false },
  { id: 'usuarios', icon: Users, label: 'Usuarios', active: false },
  { id: 'config', icon: Settings, label: 'Config', active: false },
]

const AdminBottomNav = () => {
  const navigate = useNavigate()

  return (
    <div
      className="flex md:hidden items-center justify-around w-full fixed bottom-0 left-0 right-0 z-40"
      style={{
        backgroundColor: '#0E1424',
        borderTop: '1px solid #1B2333',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map(({ id, icon: Icon, label, active }) => (
        <button
          key={id}
          onClick={() => navigate('/admin')}
          className="flex flex-col items-center justify-center border-none cursor-pointer"
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: active ? '#0D2035' : 'transparent',
            padding: '8px 4px',
            gap: '4px',
          }}
        >
          <Icon size={20} color={active ? '#24A8F5' : '#AAB3C5'} />
          <span
            style={{
              color: active ? '#24A8F5' : '#AAB3C5',
              fontFamily: 'Inter',
              fontSize: '10px',
              fontWeight: active ? '700' : '500',
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}

export default AdminBottomNav
