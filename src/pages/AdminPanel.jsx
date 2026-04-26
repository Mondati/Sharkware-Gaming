import { useState } from 'react'
import {
  Zap, LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
  UserRound, Bell, Plus, Search, Pencil, Trash2, CircleCheck, TriangleAlert,
  Layers, ChevronLeft, ChevronRight, Menu,
} from 'lucide-react'
import AdminBottomNav from '../components/AdminBottomNav'
import ProductModal from '../components/ProductModal'

/* ─────────────────────────────────────────────────────────────────── data */

const initialProducts = [
  { id: 1, name: 'RTX 5090 24GB GDDR7',            sku: 'GPU-5090-001',    cat: 'GPU',         price: '$3,499.99', stock: 24, active: true  },
  { id: 2, name: 'Core i9-14900K',                  sku: 'CPU-14900K-001',  cat: 'CPU',         price: '$599.99',  stock: 0,  active: false },
  { id: 3, name: 'LG OLED 27" 240Hz 4K',            sku: 'MON-OLED27-001', cat: 'Monitor',     price: '$1,199.99', stock: 8,  active: true  },
  { id: 4, name: 'Corsair Vengeance 32GB DDR5-6400', sku: 'RAM-DDR5-001',   cat: 'RAM',         price: '$189.99',  stock: 42, active: true  },
  { id: 5, name: 'MSI MAG X870E TOMAHAWK',           sku: 'MB-X870E-001',   cat: 'Placa Madre', price: '$449.99',  stock: 15, active: true  },
]

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
      <div
        className="flex flex-col"
        style={{ backgroundColor: '#0E1424', borderRadius: '12px', padding: '14px', gap: '8px', border: '1px solid #1B2333' }}
      >
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
    <div
      className="flex flex-col"
      style={{ flex: 1, backgroundColor: '#0E1424', borderRadius: '8px', padding: '18px', gap: '6px', border: '1px solid #1B2333' }}
    >
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
  const [products, setProducts] = useState(initialProducts)
  const [modal, setModal] = useState(null)        // null | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [search, setSearch] = useState('')

  const openEdit = (p) => { setEditTarget(p); setModal('edit') }
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id))
  const handleSave = (form) => {
    if (modal === 'add') {
      setProducts(prev => [...prev, {
        id: Date.now(), name: form.nombre || 'Nuevo producto',
        sku: 'SKU-NEW', cat: form.cat || '—',
        price: form.precio ? `$${form.precio}` : '$0', stock: Number(form.stock) || 0,
        active: form.activo,
      }])
    } else {
      setProducts(prev => prev.map(p => p.id === editTarget.id
        ? { ...p, name: form.nombre || p.name, cat: form.cat || p.cat, price: form.precio ? `$${form.precio}` : p.price, stock: Number(form.stock) ?? p.stock, active: form.activo }
        : p
      ))
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex" style={{ height: '100vh', backgroundColor: '#070B16', overflow: 'hidden' }}>

      {/* ── Sidebar (desktop only) ── */}
      <div
        className="hidden md:flex flex-col"
        style={{ width: '260px', flexShrink: 0, backgroundColor: '#0E1424', borderRight: '1px solid #1B2333', height: '100%' }}
      >
        {/* Logo */}
        <div className="flex items-center" style={{ padding: '20px 24px', gap: '12px' }}>
          <Zap size={22} color="#24A8F5" />
          <div className="flex flex-col" style={{ gap: '1px', flex: 1 }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>SHARKWARE</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '600' }}>GAMING</span>
          </div>
          <div style={{ backgroundColor: '#0D2035', borderRadius: '4px', padding: '4px 8px' }}>
            <span style={{ color: '#37C3FF', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>Admin</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#1B2333' }} />

        {/* Nav */}
        <div className="flex flex-col" style={{ padding: '16px 0', gap: '4px' }}>
          <div style={{ padding: '0 24px 8px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '700' }}>MENÚ PRINCIPAL</span>
          </div>
          {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className="flex items-center cursor-pointer"
              style={{
                padding: '10px 24px', gap: '12px',
                backgroundColor: active ? '#0D2035' : 'transparent',
                borderLeft: active ? '3px solid #24A8F5' : '3px solid transparent',
              }}
            >
              <Icon size={18} color={active ? '#24A8F5' : '#AAB3C5'} />
              <span style={{ color: active ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: active ? '600' : 'normal' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ height: '1px', backgroundColor: '#1B2333' }} />

        {/* Footer */}
        <div className="flex items-center" style={{ padding: '16px 24px', gap: '10px' }}>
          <div className="flex items-center justify-center" style={{ width: '34px', height: '34px', backgroundColor: '#1B2333', borderRadius: '17px', flexShrink: 0 }}>
            <UserRound size={18} color="#24A8F5" />
          </div>
          <div className="flex flex-col" style={{ flex: 1, gap: '1px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Administrador</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px' }}>admin@sharkware.com</span>
          </div>
          <LogOut size={16} color="#AAB3C5" style={{ cursor: 'pointer', flexShrink: 0 }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col" style={{ flex: 1, overflow: 'hidden', paddingBottom: '64px' }}>

        {/* Mobile TopBar */}
        <div
          className="flex md:hidden items-center justify-between"
          style={{ height: '56px', flexShrink: 0, backgroundColor: '#0E1424', padding: '0 16px', borderBottom: '1px solid #1B2333' }}
        >
          <div className="flex items-center" style={{ gap: '10px' }}>
            <button
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ width: '36px', height: '36px', backgroundColor: '#1B2333', borderRadius: '8px' }}
            >
              <Menu size={18} color="#F5F7FA" />
            </button>
            <div className="flex flex-col" style={{ gap: '0' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Gestión de Productos</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px' }}>Panel Admin / Productos</span>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Bell size={18} color="#AAB3C5" />
            <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', backgroundColor: '#1B2333', borderRadius: '16px' }}>
              <UserRound size={16} color="#24A8F5" />
            </div>
          </div>
        </div>

        {/* Desktop TopBar */}
        <div
          className="hidden md:flex items-center justify-between"
          style={{ height: '60px', flexShrink: 0, backgroundColor: '#0E1424', padding: '0 28px', borderBottom: '1px solid #1B2333' }}
        >
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

          {/* Mobile Stats (2x2 grid) */}
          <div className="md:hidden grid grid-cols-2" style={{ gap: '10px' }}>
            <StatCard mobile label="Total Productos" value="156" sub="+12 este mes" subColor="#22C55E" icon={Package} iconColor="#24A8F5" />
            <StatCard mobile label="Activos" value="142" sub="91% del catálogo" subColor="#AAB3C5" icon={CircleCheck} iconColor="#22C55E" />
            <StatCard mobile label="Sin Stock" value="8" sub="Requieren reposición" subColor="#FF8400" icon={TriangleAlert} iconColor="#FF8400" />
            <StatCard mobile label="Categorías" value="5" sub="GPU · CPU · Monitor..." subColor="#AAB3C5" icon={Layers} iconColor="#37C3FF" />
          </div>

          {/* Desktop Stats row */}
          <div className="hidden md:flex" style={{ gap: '14px' }}>
            <StatCard label="Total Productos" value="156" sub="+12 este mes"        subColor="#22C55E" icon={Package}       iconColor="#24A8F5" />
            <StatCard label="Activos"         value="142" sub="91% del catálogo"    subColor="#AAB3C5" icon={CircleCheck}   iconColor="#22C55E" />
            <StatCard label="Sin Stock"       value="8"   sub="Requieren reposición" subColor="#FF8400" icon={TriangleAlert} iconColor="#FF8400" />
            <StatCard label="Categorías"      value="5"   sub="GPU · CPU · Monitor · RAM..." subColor="#AAB3C5" icon={Layers} iconColor="#37C3FF" />
          </div>

          {/* Mobile Action bar */}
          <div className="md:hidden flex items-center justify-between" style={{ gap: '10px' }}>
            <div className="flex flex-col" style={{ gap: '2px', flex: 1 }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>Lista de Productos</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>{filtered.length} de {products.length} productos</span>
            </div>
            <button
              onClick={() => setModal('add')}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#24A8F5', borderRadius: '8px', width: '40px', height: '40px' }}
            >
              <Plus size={18} color="#FFFFFF" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden flex items-center" style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '44px', padding: '0 14px', gap: '8px', border: '1px solid #1B2333' }}>
            <Search size={16} color="#AAB3C5" />
            <input
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full"
              style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}
            />
          </div>

          {/* Desktop Action bar */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex flex-col" style={{ gap: '3px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>Lista de Productos</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>Administrá el catálogo completo de la tienda</span>
            </div>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#0E1424', borderRadius: '6px', height: '36px', padding: '0 12px', gap: '8px', border: '1px solid #1B2333', width: '220px' }}
              >
                <Search size={14} color="#AAB3C5" />
                <input
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}
                />
              </div>
              <button
                onClick={() => setModal('add')}
                className="flex items-center border-none cursor-pointer"
                style={{ backgroundColor: '#24A8F5', borderRadius: '6px', height: '36px', padding: '0 16px', gap: '8px' }}
              >
                <Plus size={14} color="#FFFFFF" />
                <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Agregar Producto</span>
              </button>
            </div>
          </div>

          {/* Mobile Product Cards */}
          <div className="md:hidden flex flex-col" style={{ gap: '10px' }}>
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex flex-col"
                style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '14px', gap: '10px', border: '1px solid #1B2333' }}
              >
                {/* Name + SKU */}
                <div className="flex flex-col" style={{ gap: '2px' }}>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{p.name}</span>
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>SKU: {p.sku}</span>
                </div>

                {/* Category + Price row */}
                <div className="flex items-center" style={{ gap: '12px' }}>
                  <div className="flex flex-col" style={{ gap: '2px' }}>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600' }}>Categoría</span>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>{p.cat}</span>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div className="flex flex-col" style={{ gap: '2px', alignItems: 'flex-end' }}>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600' }}>Precio</span>
                    <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{p.price}</span>
                  </div>
                </div>

                {/* Stock + Status row */}
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
                      {p.active ? 'Activo' : 'Agotado'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center" style={{ gap: '8px', paddingTop: '4px', borderTop: '1px solid #1B2333' }}>
                  <button
                    onClick={() => openEdit(p)}
                    className="flex items-center justify-center border-none cursor-pointer flex-1"
                    style={{ backgroundColor: '#0D2035', borderRadius: '8px', height: '36px', gap: '6px' }}
                  >
                    <Pencil size={14} color="#24A8F5" />
                    <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Editar</span>
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex items-center justify-center border-none cursor-pointer flex-1"
                    style={{ backgroundColor: '#2D1010', borderRadius: '8px', height: '36px', gap: '6px' }}
                  >
                    <Trash2 size={14} color="#EF4444" />
                    <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block" style={{ backgroundColor: '#0E1424', borderRadius: '8px', border: '1px solid #1B2333', overflow: 'hidden' }}>
            {/* Header */}
            <div
              className="flex items-center"
              style={{ backgroundColor: '#080D1A', padding: '11px 16px', borderBottom: '1px solid #1B2333' }}
            >
              {[
                { label: 'Producto',   flex: 1    },
                { label: 'Categoría',  w: 120     },
                { label: 'Precio',     w: 110     },
                { label: 'Stock',      w: 85      },
                { label: 'Estado',     w: 100     },
                { label: 'Acciones',   w: 90      },
              ].map(({ label, flex, w }) => (
                <span
                  key={label}
                  style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', flex, width: w, flexShrink: w ? 0 : undefined }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center"
                style={{ padding: '12px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #1B2333' : 'none' }}
              >
                {/* Name + SKU */}
                <div className="flex flex-col" style={{ flex: 1, gap: '2px' }}>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>{p.name}</span>
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>SKU: {p.sku}</span>
                </div>
                {/* Category */}
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', width: '120px', flexShrink: 0 }}>{p.cat}</span>
                {/* Price */}
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600', width: '110px', flexShrink: 0 }}>{p.price}</span>
                {/* Stock */}
                <span style={{ color: p.stock === 0 ? '#EF4444' : '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: p.stock === 0 ? '600' : 'normal', width: '85px', flexShrink: 0 }}>
                  {p.stock} un.
                </span>
                {/* Status badge */}
                <div style={{ width: '100px', flexShrink: 0 }}>
                  <div style={{ display: 'inline-flex', backgroundColor: p.active ? '#0F3D22' : '#2D1010', borderRadius: '4px', padding: '3px 10px' }}>
                    <span style={{ color: p.active ? '#22C55E' : '#EF4444', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>
                      {p.active ? 'Activo' : 'Agotado'}
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center" style={{ gap: '8px', width: '90px', flexShrink: 0 }}>
                  <button onClick={() => openEdit(p)} className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                    <Pencil size={18} color="#24A8F5" />
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                    <Trash2 size={18} color="#EF4444" />
                  </button>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div
              className="flex items-center justify-between"
              style={{ backgroundColor: '#080D1A', padding: '10px 16px' }}
            >
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
                Mostrando 1–{filtered.length} de {products.length} productos
              </span>
              <div className="flex items-center" style={{ gap: '4px' }}>
                {[
                  { id: 'prev', label: <ChevronLeft size={14} />, active: false },
                  { id: '1',    label: '1', active: true },
                  { id: '2',    label: '2', active: false },
                  { id: '3',    label: '3', active: false },
                  { id: 'next', label: <ChevronRight size={14} />, active: false },
                ].map((btn) => (
                  <div
                    key={btn.id}
                    className="flex items-center justify-center cursor-pointer"
                    style={{ width: '28px', height: '28px', backgroundColor: btn.active ? '#24A8F5' : '#1B2333', borderRadius: '4px', color: '#F5F7FA' }}
                  >
                    {typeof btn.label === 'string'
                      ? <span style={{ fontFamily: 'Poppins', fontSize: '12px', fontWeight: btn.active ? '700' : 'normal' }}>{btn.label}</span>
                      : btn.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
