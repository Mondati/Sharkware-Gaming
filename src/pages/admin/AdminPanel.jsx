import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Package,
  UserRound, Plus, Search, Pencil, Trash2, Clock, TriangleAlert,
  Layers, ChevronLeft, ChevronRight, Menu, Store, Check, X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminBottomNav from './AdminBottomNav'
import AdminSidebar from './AdminSidebar'
import ProductModal from './ProductModal'
import ConfirmModal from './ConfirmModal'
import { listAdminProducts, deleteProduct, getCategories, getAdminStats, updateProductStock } from '../../api/products'
import { useAuth } from '../../context/AuthContext'
import { formatARS } from '../../utils/formatPrice'

/* ─────────────────────────────────────────────────────────── AdminPanel */

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

const StockCell = ({ product, onUpdated, compact = false }) => {
  const { showToast } = useAuth()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(product.stock ?? 0))
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  const startEdit = () => {
    setDraft(String(product.stock ?? 0))
    setEditing(true)
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select() }, 0)
  }

  const cancel = () => { setEditing(false); setDraft(String(product.stock ?? 0)) }

  const commit = async () => {
    const next = Number(draft)
    if (!Number.isInteger(next) || next < 0 || next > 999999) {
      showToast('Stock inválido (0 a 999999)')
      return
    }
    if (next === product.stock) { setEditing(false); return }
    setSaving(true)
    try {
      const updated = await updateProductStock(product.id, next)
      onUpdated(updated)
      showToast('Stock actualizado')
      setEditing(false)
    } catch (err) {
      const msg = err.fields?.stock ?? (err.status === 404 ? 'El producto ya no existe' : 'No se pudo actualizar el stock')
      showToast(msg)
    } finally {
      setSaving(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    else if (e.key === 'Escape') { e.preventDefault(); cancel() }
  }

  const stockColor = product.stock === 0 ? '#EF4444' : '#F5F7FA'
  const stockWeight = product.stock === 0 ? (compact ? '700' : '600') : (compact ? '600' : 'normal')
  const fontSize = compact ? '13px' : '13px'
  const wrapWidth = compact ? undefined : '85px'

  if (!editing) {
    return (
      <div style={{ width: wrapWidth, flexShrink: 0 }}>
        <button onClick={startEdit} title="Click para editar stock"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#24A8F5' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1B2333' }}
          className="cursor-pointer inline-flex items-center"
          style={{
            backgroundColor: '#0A0C14',
            border: '1px solid #1B2333',
            borderRadius: '4px',
            padding: '3px 8px',
            color: stockColor,
            fontFamily: 'Poppins',
            fontSize,
            fontWeight: stockWeight,
            textAlign: 'left',
            transition: 'border-color 120ms',
          }}>
          {product.stock} un.
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center" style={{ gap: '4px', width: wrapWidth, flexShrink: 0, opacity: saving ? 0.6 : 1 }}>
      <input
        ref={inputRef}
        type="number"
        min={0}
        max={999999}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        disabled={saving}
        style={{
          width: '60px',
          backgroundColor: '#0A0C14',
          color: '#F5F7FA',
          border: '1px solid #1B2333',
          borderRadius: '4px',
          padding: '3px 6px',
          fontFamily: 'Poppins',
          fontSize: '13px',
        }}
      />
      <button onClick={commit} disabled={saving} title="Guardar"
        className="border-none cursor-pointer flex items-center justify-center"
        style={{ background: 'none', padding: 2 }}>
        <Check size={14} color="#22C55E" />
      </button>
      <button onClick={cancel} disabled={saving} title="Cancelar"
        className="border-none cursor-pointer flex items-center justify-center"
        style={{ background: 'none', padding: 2 }}>
        <X size={14} color="#AAB3C5" />
      </button>
    </div>
  )
}

const AdminPanel = () => {
  const { showToast } = useAuth()
  const [products, setProducts] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [modal, setModal] = useState(null)   // null | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)
  const categoryLabel = (id) => categories.find(c => c.id === id)?.label ?? id
  const searchRef = useRef('')
  const debounceRef = useRef(null)

  const fetchProducts = useCallback((pageNum = 0, q = '') => {
    setLoadingList(true)
    listAdminProducts({ page: pageNum, size: 20, q })
      .then(data => {
        setProducts(data.items ?? data)
        setTotalPages(data.totalPages ?? 1)
        setPage(pageNum)
      })
      .catch(() => { setProducts([]); setTotalPages(1) })
      .finally(() => setLoadingList(false))
  }, [])

  const fetchStats = useCallback(() => {
    getAdminStats().then(setStats).catch(() => {})
  }, [])

  const handleSearch = (val) => {
    setSearch(val)
    searchRef.current = val
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchProducts(0, searchRef.current)
    }, 300)
  }

  useEffect(() => { fetchProducts(0) }, [fetchProducts])

  useEffect(() => { fetchStats() }, [fetchStats])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const openEdit = (p) => { setEditTarget(p); setModal('edit') }

  const handleDelete = (product) => setDeleteTarget(product)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      showToast('Producto eliminado')
      fetchProducts(page, searchRef.current)
      fetchStats()
      setDeleteTarget(null)
    } catch (err) {
      if (err.status === 409) {
        showToast('No se puede eliminar: tiene órdenes asociadas')
      } else if (err.status === 404) {
        showToast('El producto ya no existe')
        fetchProducts(page, searchRef.current)
      } else {
        showToast('Error al eliminar el producto')
      }
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const mergeProduct = (updated) => {
    setProducts(prev => prev.map(x => x.id === updated.id ? updated : x))
    fetchStats()
  }

  const handleSave = (_saved, savedMode) => {
    showToast(savedMode === 'edit' ? 'Producto actualizado' : 'Producto creado')
    fetchProducts(savedMode === 'edit' ? page : 0, searchRef.current)
    fetchStats()
  }

  const totalProducts = stats?.totalProducts ?? null
  const pendingOrders = stats?.pendingOrders ?? null
  const noStockCount = stats?.outOfStockProducts ?? null
  const categoriesCount = stats?.totalCategories ?? null
  const fmt = (n) => (n === null || n === undefined ? '—' : n)

  return (
    <div className="flex" style={{ height: '100vh', backgroundColor: '#070B16', overflow: 'hidden' }}>

      {/* ── Sidebar (desktop only) ── */}
      <AdminSidebar />

      {/* ── Main content ── */}
      <div className="flex flex-col" style={{ flex: 1, paddingBottom: '64px' }}>

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
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>Panel Admin / Productos</span>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Link to="/" title="Ver tienda" className="flex items-center justify-center no-underline"
              style={{ width: '32px', height: '32px', backgroundColor: '#1B2333', borderRadius: '8px' }}>
              <Store size={16} color="#24A8F5" />
            </Link>
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
            <div className="flex items-center justify-center" style={{ width: '34px', height: '34px', backgroundColor: '#1B2333', borderRadius: '17px' }}>
              <UserRound size={18} color="#24A8F5" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-col sw-scroll" style={{ flex: 1, padding: '28px', gap: '20px', overflowY: 'auto' }}>

          {/* Mobile Stats */}
          <div className="md:hidden grid grid-cols-2" style={{ gap: '10px' }}>
            <StatCard mobile label="Total Productos" value={fmt(totalProducts)} sub="En catálogo" subColor="#AAB3C5" icon={Package} iconColor="#24A8F5" />
            <StatCard mobile label="Pedidos pendientes" value={fmt(pendingOrders)} sub="Sin confirmar pago" subColor="#F59E0B" icon={Clock} iconColor="#F59E0B" />
            <StatCard mobile label="Sin Stock" value={fmt(noStockCount)} sub="Requieren reposición" subColor="#FF8400" icon={TriangleAlert} iconColor="#FF8400" />
            <StatCard mobile label="Categorías" value={fmt(categoriesCount)} sub="GPU · CPU · Monitor..." subColor="#AAB3C5" icon={Layers} iconColor="#37C3FF" />
          </div>

          {/* Desktop Stats */}
          <div className="hidden md:flex" style={{ gap: '14px' }}>
            <StatCard label="Total Productos" value={fmt(totalProducts)} sub="En catálogo" subColor="#AAB3C5" icon={Package} iconColor="#24A8F5" />
            <StatCard label="Pedidos pendientes" value={fmt(pendingOrders)} sub="Sin confirmar pago" subColor="#F59E0B" icon={Clock} iconColor="#F59E0B" />
            <StatCard label="Sin Stock" value={fmt(noStockCount)} sub="Requieren reposición" subColor="#FF8400" icon={TriangleAlert} iconColor="#FF8400" />
            <StatCard label="Categorías" value={fmt(categoriesCount)} sub="GPU · CPU · Monitor · RAM..." subColor="#AAB3C5" icon={Layers} iconColor="#37C3FF" />
          </div>

          {/* Mobile Action bar */}
          <div className="md:hidden flex items-center justify-between" style={{ gap: '10px' }}>
            <div className="flex flex-col" style={{ gap: '2px', flex: 1 }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>Lista de Productos</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>{products.length} de {fmt(totalProducts)} productos</span>
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
            <input placeholder="Buscar producto..." value={search} onChange={e => handleSearch(e.target.value)}
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
                <input placeholder="Buscar producto..." value={search} onChange={e => handleSearch(e.target.value)}
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
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Cargando productos…</span>
            </div>
          )}

          {/* Mobile Product Cards */}
          {!loadingList && (
            <div className="md:hidden flex flex-col" style={{ gap: '10px' }}>
              {products.map((p) => (
                <div key={p.id} className="flex flex-col"
                  style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '14px', gap: '10px', border: '1px solid #1B2333' }}>
                  <div className="flex flex-col" style={{ gap: '2px' }}>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{p.name}</span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>{p.brand}</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <div className="flex flex-col" style={{ gap: '2px' }}>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Categoría</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>{categoryLabel(p.category_id)}</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div className="flex flex-col" style={{ gap: '2px', alignItems: 'flex-end' }}>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Precio</span>
                      <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{formatARS(p.price_ars)}</span>
                    </div>
                  </div>
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>Stock:</span>
                      <StockCell product={p} onUpdated={mergeProduct} compact />
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
                    <button onClick={() => handleDelete(p)} className="flex items-center justify-center border-none cursor-pointer flex-1"
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
            <div className="hidden md:block" style={{ backgroundColor: '#0E1424', borderRadius: '8px', border: '1px solid #1B2333' }}>
              <div className="flex items-center"
                style={{ backgroundColor: '#080D1A', padding: '11px 16px', borderBottom: '1px solid #1B2333' }}>
                {[
                  { label: 'Producto', flex: 1 },
                  { label: 'Categoría', w: 120 },
                  { label: 'Precio', w: 140 },
                  { label: 'Stock', w: 85 },
                  { label: 'Estado', w: 100 },
                  { label: 'Acciones', w: 90 },
                ].map(({ label, flex, w }) => (
                  <span key={label}
                    style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', flex, width: w, flexShrink: w ? 0 : undefined }}>
                    {label}
                  </span>
                ))}
              </div>

              <div>
                {products.length === 0 && (
                  <div className="flex items-center justify-center" style={{ padding: '32px' }}>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
                      {search ? 'Sin resultados para esa búsqueda' : 'No hay productos cargados'}
                    </span>
                  </div>
                )}

                {products.map((p, i) => (
                  <div key={p.id} className="flex items-center"
                    style={{ padding: '12px 16px', borderBottom: i < products.length - 1 ? '1px solid #1B2333' : 'none' }}>
                    <div className="flex flex-col" style={{ flex: 1, gap: '2px' }}>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>{p.name}</span>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>{p.brand}</span>
                    </div>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', width: '120px', flexShrink: 0 }}>{categoryLabel(p.category_id)}</span>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600', width: '140px', flexShrink: 0 }}>{formatARS(p.price_ars)}</span>
                    <StockCell product={p} onUpdated={mergeProduct} />
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
                      <button onClick={() => handleDelete(p)} className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                        <Trash2 size={18} color="#EF4444" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between"
                style={{ backgroundColor: '#080D1A', padding: '10px 16px' }}>
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
                  Página {page + 1} de {totalPages} ({products.length} productos)
                </span>
                <div className="flex items-center" style={{ gap: '4px' }}>
                  <button
                    onClick={() => fetchProducts(page - 1, searchRef.current)}
                    disabled={page === 0}
                    className="flex items-center justify-center cursor-pointer border-none"
                    style={{ width: '28px', height: '28px', backgroundColor: page === 0 ? '#0A0C14' : '#1B2333', borderRadius: '4px', opacity: page === 0 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={14} color="#F5F7FA" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i).map(i => (
                    <button key={i} onClick={() => fetchProducts(i, searchRef.current)}
                      className="flex items-center justify-center cursor-pointer border-none"
                      style={{ width: '28px', height: '28px', backgroundColor: i === page ? '#24A8F5' : '#1B2333', borderRadius: '4px' }}>
                      <span style={{ fontFamily: 'Poppins', fontSize: '12px', fontWeight: i === page ? '700' : 'normal', color: '#F5F7FA' }}>{i + 1}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => fetchProducts(page + 1, searchRef.current)}
                    disabled={page >= totalPages - 1}
                    className="flex items-center justify-center cursor-pointer border-none"
                    style={{ width: '28px', height: '28px', backgroundColor: page >= totalPages - 1 ? '#0A0C14' : '#1B2333', borderRadius: '4px', opacity: page >= totalPages - 1 ? 0.5 : 1 }}
                  >
                    <ChevronRight size={14} color="#F5F7FA" />
                  </button>
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar producto"
        message={deleteTarget ? `¿Seguro que querés eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.` : ''}
        confirmLabel="Eliminar"
        loadingLabel="Eliminando..."
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* ── Mobile Bottom Nav ── */}
      <AdminBottomNav />
    </div>
  )
}

export default AdminPanel
