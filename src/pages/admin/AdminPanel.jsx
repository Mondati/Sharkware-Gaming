import { useState, useEffect, useCallback } from 'react'
import {
  Zap, LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  UserRound, Bell, Plus, Search, Pencil, Trash2, CircleCheck, TriangleAlert,
  Layers, ChevronLeft, ChevronRight, Menu, Store,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AdminBottomNav from './AdminBottomNav'
import ProductModal from './ProductModal'
import { listAdminProducts } from '../../api/products'
import { useAuth } from '../../context/AuthContext'
import { formatARS } from '../../utils/formatPrice'

/* ─────────────────────────────────────────────────────────── AdminPanel */

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Package,         label: 'Productos', active: true },
  { icon: ShoppingCart,    label: 'Pedidos' },
  { icon: Users,           label: 'Usuarios' },
  { icon: Settings,        label: 'Configuración' },
]

const StatCard = ({ label, value, sub, subColor, icon: Icon, iconColor, mobile = false }) => {
  if (mobile) {
    return (
      <div className="flex flex-col"
        style={{ backgroundColor: '#0E1424', borderRadius: '12px', padding: '14px', gap: '8px', border: '1px solid #1B2333' }}>
        <div className="flex items-center" style={{ gap: '10px' }}>
          <div style={{ backgroundColor: '#1B2333', borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
            <Icon size={18} color={iconColor} />
          </div>
          <div className="flex flex-col" style={{ gap: '2px', flex: 1 }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '500' }}>{label}</span>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>{value}</span>
          </div>
        </div>
        <span style={{ color: subColor, fontFamily: 'Poppins', fontSize: '11px' }}>{sub}</span>
      </div>
    )
  }
  return (
    <div className="flex flex-col"
      style={{ flex: 1, backgroundColor: '#0E1424', borderRadius: '8px', padding: '18px', gap: '6px', border: '1px solid #1B2333' }}>
      <div className="flex items-center justify-between">
        <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>{label}</span>
        <Icon size={16} color={iconColor} />
      </div>
      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '28px', fontWeight: '800' }}>{value}</span>
      <span style={{ color: subColor, fontFamily: 'Poppins', fontSize: '11px' }}>{sub}</span>
    </div>
  )
}

const AdminPanel = () => {
  const { showToast, user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    navigate('/')
  }
  const [products, setProducts] = useState([])
  const [loadingList, setLoadingList]     = useState(true)
  const [modal, setModal]     = useState(null)   // null | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [search, setSearch]   = useState('')

  const fetchProducts = useCallback(() => {
    setLoadingList(true)
    listAdminProducts({ page: 0, size: 20 })
      .then(data => setProducts(data.items ?? data))
      .catch(() => setProducts([]))
      .finally(() => setLoadingList(false))
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const openEdit = (p) => { setEditTarget(p); setModal('edit') }

  const handleSave = (created) => {
    showToast('Producto creado')
    fetchProducts()
  }

  const filtered = products.filter(p =>
    `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount   = products.filter(p => p.active).length
  const noStockCount  = products.filter(p => p.stock === 0).length

  return (
    <div className="flex" style={{ height: '100vh', backgroundColor: '#070B16', overflow: 'hidden' }}>

      {/* ── Sidebar (desktop only) ── */}
      <div className="hidden md:flex flex-col"
        style={{ width: '260px', flexShrink: 0, backgroundColor: '#0E1424', borderRight: '1px solid #1B2333', height: '100%' }}>
        <Link to="/" className="flex items-center no-underline" style={{ padding: '20px 24px', gap: '12px' }} title="Ir a la tienda">
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
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '700' }}>MENÚ PRINCIPAL</span>
          </div>
          {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
            <div key={label} className="flex items-center cursor-pointer"
              style={{ padding: '10px 24px', gap: '12px', backgroundColor: active ? '#0D2035' : 'transparent', borderLeft: active ? '3px solid #24A8F5' : '3px solid transparent' }}>
              <Icon size={18} color={active ? '#24A8F5' : '#AAB3C5'} />
              <span style={{ color: active ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: active ? '600' : 'normal' }}>
                {label}
              </span>
            </div>
          ))}
          <Link to="/" className="flex items-center no-underline"
            style={{ padding: '10px 24px', gap: '12px', borderLeft: '3px solid transparent', marginTop: '8px' }}>
            <Store size={18} color="#AAB3C5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>Ver tienda</span>
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
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email ?? ''}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'transparent', padding: 0, flexShrink: 0 }}
          >
            <LogOut size={16} color="#AAB3C5" />
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col" style={{ flex: 1, overflow: 'hidden', paddingBottom: '64px' }}>

        {/* Mobile TopBar */}
        <div className="flex md:hidden items-center justify-between"
          style={{ height: '56px', flexShrink: 0, backgroundColor: '#0E1424', padding: '0 16px', borderBottom: '1px solid #1B2333' }}>
          <div className="flex items-center" style={{ gap: '10px' }}>
            <button className="flex items-center justify-center border-none cursor-pointer"
              style={{ width: '36px', height: '36px', backgroundColor: '#1B2333', borderRadius: '8px' }}>
              <Menu size={18} color="#F5F7FA" />
            </button>
            <div className="flex flex-col" style={{ gap: '0' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Gestión de Productos</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px' }}>Panel Admin / Productos</span>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Link to="/" title="Ver tienda" className="flex items-center justify-center no-underline"
              style={{ width: '32px', height: '32px', backgroundColor: '#1B2333', borderRadius: '8px' }}>
              <Store size={16} color="#24A8F5" />
            </Link>
            <Bell size={18} color="#AAB3C5" />
            <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', backgroundColor: '#1B2333', borderRadius: '16px' }}>
              <UserRound size={16} color="#24A8F5" />
            </div>
          </div>
        </div>

        {/* Desktop TopBar */}
        <div className="hidden md:flex items-center justify-between"
          style={{ height: '60px', flexShrink: 0, backgroundColor: '#0E1424', padding: '0 28px', borderBottom: '1px solid #1B2333' }}>
          <div className="flex flex-col" style={{ gap: '2px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '17px', fontWeight: '700' }}>Gestión de Productos</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>Panel Admin &nbsp;/&nbsp; Productos</span>
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <Bell size={20} color="#AAB3C5" />
            <div className="flex items-center justify-center" style={{ width: '34px', height: '34px', backgroundColor: '#1B2333', borderRadius: '17px' }}>
              <UserRound size={18} color="#24A8F5" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-col" style={{ flex: 1, padding: '28px', gap: '20px', overflowY: 'auto' }}>

          {/* Mobile Stats */}
          <div className="md:hidden grid grid-cols-2" style={{ gap: '10px' }}>
            <StatCard mobile label="Total Productos" value={products.length}  sub={`${activeCount} activos`}        subColor="#22C55E" icon={Package}       iconColor="#24A8F5" />
            <StatCard mobile label="Activos"         value={activeCount}      sub={`${products.length > 0 ? Math.round(activeCount/products.length*100) : 0}% del catálogo`} subColor="#AAB3C5" icon={CircleCheck}   iconColor="#22C55E" />
            <StatCard mobile label="Sin Stock"       value={noStockCount}     sub="Requieren reposición"            subColor="#FF8400" icon={TriangleAlert} iconColor="#FF8400" />
            <StatCard mobile label="Categorías"      value="7"                sub="GPU · CPU · Monitor..."          subColor="#AAB3C5" icon={Layers}        iconColor="#37C3FF" />
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex" style={{ gap: '14px' }}>
            <StatCard label="Total Productos" value={products.length}  sub={`${activeCount} activos`}              subColor="#22C55E" icon={Package}       iconColor="#24A8F5" />
            <StatCard label="Activos"         value={activeCount}      sub={`${products.length > 0 ? Math.round(activeCount/products.length*100) : 0}% del catálogo`} subColor="#AAB3C5" icon={CircleCheck}   iconColor="#22C55E" />
            <StatCard label="Sin Stock"       value={noStockCount}     sub="Requieren reposición"                  subColor="#FF8400" icon={TriangleAlert} iconColor="#FF8400" />
            <StatCard label="Categorías"      value="7"                sub="GPU · CPU · Monitor · RAM..."          subColor="#AAB3C5" icon={Layers}        iconColor="#37C3FF" />
          </div>

          {/* Mobile Action bar */}
          <div className="md:hidden flex items-center justify-between" style={{ gap: '10px' }}>
            <div className="flex flex-col" style={{ gap: '2px', flex: 1 }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>Lista de Productos</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>{filtered.length} de {products.length} productos</span>
            </div>
            <button onClick={() => setModal('add')} className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#24A8F5', borderRadius: '8px', width: '40px', height: '40px' }}>
              <Plus size={18} color="#FFFFFF" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden flex items-center"
            style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '44px', padding: '0 14px', gap: '8px', border: '1px solid #1B2333' }}>
            <Search size={16} color="#AAB3C5" />
            <input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full"
              style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }} />
          </div>

          {/* Desktop Action bar */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex flex-col" style={{ gap: '3px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>Lista de Productos</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>Administrá el catálogo completo de la tienda</span>
            </div>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div className="flex items-center"
                style={{ backgroundColor: '#0E1424', borderRadius: '6px', height: '36px', padding: '0 12px', gap: '8px', border: '1px solid #1B2333', width: '220px' }}>
                <Search size={14} color="#AAB3C5" />
                <input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }} />
              </div>
              <button onClick={() => setModal('add')} className="flex items-center border-none cursor-pointer"
                style={{ backgroundColor: '#24A8F5', borderRadius: '6px', height: '36px', padding: '0 16px', gap: '8px' }}>
                <Plus size={14} color="#FFFFFF" />
                <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Agregar Producto</span>
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loadingList && (
            <div className="flex items-center justify-center" style={{ padding: '40px 0' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Cargando productos...</span>
            </div>
          )}

          {/* Mobile Product Cards */}
          {!loadingList && (
            <div className="md:hidden flex flex-col" style={{ gap: '10px' }}>
              {filtered.map((p) => (
                <div key={p.id} className="flex flex-col"
                  style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '14px', gap: '10px', border: '1px solid #1B2333' }}>
                  <div className="flex flex-col" style={{ gap: '2px' }}>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{p.name}</span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>{p.brand}</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <div className="flex flex-col" style={{ gap: '2px' }}>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600' }}>Categoría</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>{p.category_id}</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div className="flex flex-col" style={{ gap: '2px', alignItems: 'flex-end' }}>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600' }}>Precio</span>
                      <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{formatARS(p.price_ars)}</span>
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>Stock:</span>
                      <span style={{ color: p.stock === 0 ? '#EF4444' : '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: p.stock === 0 ? '700' : '600' }}>
                        {p.stock} un.
                      </span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ backgroundColor: p.active ? '#0F3D22' : '#2D1010', borderRadius: '5px', padding: '4px 10px' }}>
                      <span style={{ color: p.active ? '#22C55E' : '#EF4444', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>
                        {p.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: '8px', paddingTop: '4px', borderTop: '1px solid #1B2333' }}>
                    <button onClick={() => openEdit(p)} className="flex items-center justify-center border-none cursor-pointer flex-1"
                      style={{ backgroundColor: '#0D2035', borderRadius: '8px', height: '36px', gap: '6px' }}>
                      <Pencil size={14} color="#24A8F5" />
                      <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Editar</span>
                    </button>
                    <button className="flex items-center justify-center border-none cursor-pointer flex-1"
                      style={{ backgroundColor: '#2D1010', borderRadius: '8px', height: '36px', gap: '6px' }}>
                      <Trash2 size={14} color="#EF4444" />
                      <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Desktop Table */}
          {!loadingList && (
            <div className="hidden md:block" style={{ backgroundColor: '#0E1424', borderRadius: '8px', border: '1px solid #1B2333', overflow: 'hidden' }}>
              <div className="flex items-center"
                style={{ backgroundColor: '#080D1A', padding: '11px 16px', borderBottom: '1px solid #1B2333' }}>
                {[
                  { label: 'Producto',  flex: 1 },
                  { label: 'Categoría', w: 120  },
                  { label: 'Precio',    w: 140  },
                  { label: 'Stock',     w: 85   },
                  { label: 'Estado',    w: 100  },
                  { label: 'Acciones',  w: 90   },
                ].map(({ label, flex, w }) => (
                  <span key={label}
                    style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', flex, width: w, flexShrink: w ? 0 : undefined }}>
                    {label}
                  </span>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="flex items-center justify-center" style={{ padding: '32px' }}>
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
                    {search ? 'Sin resultados para esa búsqueda' : 'No hay productos cargados'}
                  </span>
                </div>
              )}

              {filtered.map((p, i) => (
                <div key={p.id} className="flex items-center"
                  style={{ padding: '12px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #1B2333' : 'none' }}>
                  <div className="flex flex-col" style={{ flex: 1, gap: '2px' }}>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>{p.name}</span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>{p.brand}</span>
                  </div>
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', width: '120px', flexShrink: 0 }}>{p.category_id}</span>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600', width: '140px', flexShrink: 0 }}>{formatARS(p.price_ars)}</span>
                  <span style={{ color: p.stock === 0 ? '#EF4444' : '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: p.stock === 0 ? '600' : 'normal', width: '85px', flexShrink: 0 }}>
                    {p.stock} un.
                  </span>
                  <div style={{ width: '100px', flexShrink: 0 }}>
                    <div style={{ display: 'inline-flex', backgroundColor: p.active ? '#0F3D22' : '#2D1010', borderRadius: '4px', padding: '3px 10px' }}>
                      <span style={{ color: p.active ? '#22C55E' : '#EF4444', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>
                        {p.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: '8px', width: '90px', flexShrink: 0 }}>
                    <button onClick={() => openEdit(p)} className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                      <Pencil size={18} color="#24A8F5" />
                    </button>
                    <button className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                      <Trash2 size={18} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between"
                style={{ backgroundColor: '#080D1A', padding: '10px 16px' }}>
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
                  Mostrando {filtered.length} de {products.length} productos
                </span>
                <div className="flex items-center" style={{ gap: '4px' }}>
                  {[
                    { id: 'prev', label: <ChevronLeft size={14} />,  active: false },
                    { id: '1',    label: '1',                         active: true  },
                    { id: 'next', label: <ChevronRight size={14} />, active: false },
                  ].map((btn) => (
                    <div key={btn.id} className="flex items-center justify-center cursor-pointer"
                      style={{ width: '28px', height: '28px', backgroundColor: btn.active ? '#24A8F5' : '#1B2333', borderRadius: '4px', color: '#F5F7FA' }}>
                      {typeof btn.label === 'string'
                        ? <span style={{ fontFamily: 'Poppins', fontSize: '12px', fontWeight: btn.active ? '700' : 'normal' }}>{btn.label}</span>
                        : btn.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal && (
        <ProductModal
          mode={modal}
          product={editTarget}
          onClose={() => { setModal(null); setEditTarget(null) }}
          onSave={handleSave}
        />
      )}

      {/* ── Mobile Bottom Nav ── */}
      <AdminBottomNav />
    </div>
  )
}

export default AdminPanel
