import { useState, useEffect, useRef, Fragment } from 'react'
import { useWindowWidth } from '../hooks/useWindowWidth'
import {
  ChevronRight, ArrowLeft, Lock,
  Minus, Plus, Trash2, Trash, X, ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import TrustBadges from '../components/TrustBadges'
import { useCart } from '../context/CartContext'
import { getProduct } from '../api/products'

const fmt = (n) => '$' + n.toLocaleString('es-AR')

const Cart = () => {
  const { sidePadding } = useWindowWidth()
  const { items, removeItem, updateQty, syncStock, clearCart, cartCount } = useCart()
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [stockNotice, setStockNotice] = useState(null)
  const syncedRef = useRef(false)

  useEffect(() => {
    if (syncedRef.current) return
    if (items.length === 0) return
    syncedRef.current = true
    const ids = items.map(i => i.id)
    const prevQty = Object.fromEntries(items.map(i => [i.id, i.quantity]))
    Promise.all(ids.map(id => getProduct(id).then(p => [id, p]).catch(() => [id, null])))
      .then(results => {
        const stockById = {}
        const adjustments = []
        for (const [id, p] of results) {
          if (!p) continue
          stockById[id] = p.stock
          if (prevQty[id] > p.stock) {
            adjustments.push({ name: p.name, from: prevQty[id], to: p.stock })
          }
        }
        if (Object.keys(stockById).length) syncStock(stockById)
        if (adjustments.length) {
          const first = adjustments[0]
          const more = adjustments.length - 1
          setStockNotice(
            more > 0
              ? `Ajustamos "${first.name}" de ${first.from} a ${first.to} y ${more} más por cambios de stock.`
              : `Ajustamos "${first.name}" de ${first.from} a ${first.to} por cambios de stock.`
          )
        }
      })
  }, [items, syncStock])

  const totalQty = cartCount
  const subtotal = items.reduce((a, i) => a + i.price_ars * i.quantity, 0)

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: 'var(--bg-2)' }}>

      {/* ═══════════════ DESKTOP NAVBAR ═══════════════ */}

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: 'var(--hero-1)', height: '56px', padding: '0 16px' }}
      >
        <Link to="/" className="flex items-center no-underline">
          <ArrowLeft size={20} color="var(--text)" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
            Mi carrito
          </span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>
            {totalQty} {totalQty === 1 ? 'producto' : 'productos'}
          </span>
        </div>
        <Link to="/" className="flex items-center no-underline">
          <X size={20} color="var(--text-muted)" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: 'var(--hero-1)', height: '44px', padding: `0 ${sidePadding}`, gap: '8px' }}
      >
        <Link to="/" className="no-underline" style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
          Inicio
        </Link>
        <ChevronRight size={13} color="var(--text-faint)" />
        <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
          Mi Carrito
        </span>
      </div>

      <main className="flex flex-col flex-1 w-full">

      {/* ═══════════════ MOBILE CONTENT ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '16px' }}>

        {stockNotice && (
          <div className="flex items-start justify-between" style={{ backgroundColor: 'rgba(var(--warning-rgb),0.10)', border: '1px solid rgba(var(--warning-rgb),0.35)', borderRadius: '10px', padding: '10px 12px', gap: '10px' }}>
            <span style={{ color: 'var(--warning)', fontFamily: 'Poppins', fontSize: '12px', lineHeight: '1.4' }}>{stockNotice}</span>
            <button onClick={() => setStockNotice(null)} className="border-none cursor-pointer" style={{ background: 'none', padding: 0, color: 'var(--warning)' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Items list */}
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center" style={{ padding: '48px 16px', gap: '16px' }}>
              <div className="flex items-center justify-center" style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(var(--accent-bright-rgb),0.1), transparent 70%)',
              }}>
                <ShoppingBag size={40} color="var(--border-accent)" />
              </div>
              <div className="flex flex-col items-center" style={{ gap: '6px' }}>
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '600', textAlign: 'center' }}>
                  Tu carrito está vacío
                </span>
                <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
                  Explorá nuestro catálogo de gaming hardware
                </span>
              </div>
              <Link
                to="/"
                className="no-underline flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '8px 20px',
                  color: 'var(--accent)',
                  fontFamily: 'Poppins',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Ver catálogo →
              </Link>
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start"
              style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '14px', gap: '12px', border: '1px solid var(--border)' }}
            >
              {/* Image + info → clickeable */}
              <Link
                to={`/product/${item.id}`}
                className="flex items-start no-underline"
                style={{ gap: '12px', flex: 1 }}
              >
                <div style={{ backgroundColor: 'var(--surface)', borderRadius: '10px', width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden', padding: '6px' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none' }} />
                </div>
                <div className="flex flex-col" style={{ gap: '2px' }}>
                  <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>
                    {item.brand}
                  </span>
                  <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700', lineHeight: '1.3' }}>
                    {item.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>
                    {item.spec}
                  </span>
                </div>
              </Link>

              {/* Controls column */}
              <div className="flex flex-col items-end" style={{ gap: '8px', flexShrink: 0 }}>
                {/* Delete */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex items-center justify-center border-none cursor-pointer"
                  style={{ background: 'none', padding: '4px' }}
                >
                  <Trash2 size={16} color="var(--error)" />
                </button>

                {/* Price */}
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>
                  c/u {fmt(item.price_ars)}
                </span>
                <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
                  {fmt(item.price_ars * item.quantity)}
                </span>

                {/* Qty */}
                <div className="flex items-center" style={{ backgroundColor: 'var(--bg-2)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="flex items-center justify-center border-none"
                    style={{ width: '30px', height: '30px', background: 'none', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', opacity: item.quantity <= 1 ? 0.4 : 1 }}
                  >
                    <Minus size={12} color="var(--text-muted)" />
                  </button>
                  <div className="flex items-center justify-center" style={{ width: '32px', height: '30px' }}>
                    <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    disabled={typeof item.stock === 'number' && item.quantity >= item.stock}
                    title={typeof item.stock === 'number' && item.quantity >= item.stock ? `Stock máximo: ${item.stock}` : undefined}
                    className="flex items-center justify-center border-none"
                    style={{ width: '30px', height: '30px', background: 'none', cursor: (typeof item.stock === 'number' && item.quantity >= item.stock) ? 'not-allowed' : 'pointer', opacity: (typeof item.stock === 'number' && item.quantity >= item.stock) ? 0.4 : 1 }}
                  >
                    <Plus size={12} color="var(--text-muted)" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center justify-center no-underline"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--error)', borderRadius: '10px', padding: '12px', gap: '8px' }}
          >
            <Trash size={16} color="var(--error)" />
            <span style={{ color: 'var(--error)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
              Vaciar carrito
            </span>
          </button>
        )}

        {/* Order summary */}
        <div
          className="flex flex-col"
          style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '16px', gap: '12px', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
            Resumen del pedido
          </span>
          <div style={{ backgroundColor: 'var(--border)', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px' }}>
              Subtotal ({totalQty} {totalQty === 1 ? 'ítem' : 'ítems'})
            </span>
            <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
              {fmt(subtotal)}
            </span>
          </div>

          <div style={{ backgroundColor: 'var(--border)', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>Total</span>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>
              {fmt(subtotal)}
            </span>
          </div>
          {/* Checkout button */}
          <Link
            to="/checkout"
            onMouseEnter={() => setHoveredBtn('checkout_m')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center no-underline"
            style={{ backgroundColor: hoveredBtn === 'checkout_m' ? 'var(--accent-deep)' : 'var(--accent-bright)', borderRadius: '12px', height: '50px', gap: '10px', width: '100%' }}
          >
            <Lock size={18} color="var(--text-strong)" />
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '800' }}>
              Finalizar compra
            </span>
          </Link>

          {/* Keep shopping */}
          <Link to="/" className="flex items-center justify-center no-underline" style={{ gap: '6px' }}>
            <ArrowLeft size={14} color="var(--accent)" />
            <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
              Seguir comprando
            </span>
          </Link>
        </div>

        {/* Trust badges */}
        <div style={{ padding: '8px 0' }}>
          <TrustBadges size={14} layout="row" />
        </div>
      </div>

      {/* ═══════════════ DESKTOP CONTENT ═══════════════ */}
      <div className="hidden md:flex w-full" style={{ padding: `40px ${sidePadding}`, gap: '32px' }}>

        {/* ── Left column ── */}
        <div className="flex flex-col" style={{ flex: 1, gap: '20px' }}>

          {stockNotice && (
            <div className="flex items-start justify-between" style={{ backgroundColor: 'rgba(var(--warning-rgb),0.10)', border: '1px solid rgba(var(--warning-rgb),0.35)', borderRadius: '10px', padding: '12px 14px', gap: '12px' }}>
              <span style={{ color: 'var(--warning)', fontFamily: 'Poppins', fontSize: '13px', lineHeight: '1.4' }}>{stockNotice}</span>
              <button onClick={() => setStockNotice(null)} className="border-none cursor-pointer" style={{ background: 'none', padding: 0, color: 'var(--warning)' }}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between" style={{ width: '100%' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
                Mi Carrito
              </span>
              <div style={{ backgroundColor: 'var(--border)', borderRadius: '20px', padding: '4px 12px' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                  {totalQty} {totalQty === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                onMouseEnter={() => setHoveredBtn('clear_d')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: hoveredBtn === 'clear_d' ? 'var(--error-bg-3)' : 'var(--surface)', border: '1px solid var(--error)', borderRadius: '10px', padding: '10px 16px', gap: '8px' }}
              >
                <Trash size={16} color="var(--error)" />
                <span style={{ color: 'var(--error)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                  Vaciar carrito
                </span>
              </button>
            )}
          </div>

          {/* Items container */}
          <div
            className="flex flex-col"
            style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '20px', gap: '12px', border: '1px solid var(--border)' }}
          >
            {items.length === 0 && (
              <div className="flex flex-col items-center" style={{ padding: '40px 0', gap: '16px' }}>
                <div className="flex items-center justify-center" style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(var(--accent-bright-rgb),0.1), transparent 70%)',
                }}>
                  <ShoppingBag size={44} color="var(--border-accent)" />
                </div>
                <div className="flex flex-col items-center" style={{ gap: '6px' }}>
                  <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '600', textAlign: 'center' }}>
                    Tu carrito está vacío
                  </span>
                  <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
                    Explorá nuestro catálogo de gaming hardware
                  </span>
                </div>
                <Link
                  to="/"
                  className="no-underline flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '8px 24px',
                    color: 'var(--accent)',
                    fontFamily: 'Poppins',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  Ver catálogo →
                </Link>
              </div>
            )}
            {items.map((item, idx) => (
              <Fragment key={item.id}>
                {idx > 0 && (
                  <div style={{ backgroundColor: 'var(--border)', height: '1px', width: '100%' }} />
                )}
                <div className="flex items-center" style={{ gap: '16px', width: '100%' }}>
                  {/* Image + info → clickeable */}
                  <Link
                    to={`/product/${item.id}`}
                    className="flex items-center no-underline"
                    style={{ flex: 1, gap: '16px' }}
                  >
                    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '10px', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', padding: '6px' }}>
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none' }} />
                  </div>
                    <div className="flex flex-col" style={{ gap: '4px' }}>
                      <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
                        {item.brand}
                      </span>
                      <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                        {item.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '12px' }}>
                        {item.spec}
                      </span>
                    </div>
                  </Link>
                  <div className="flex flex-col items-end" style={{ flexShrink: 0 }}>
                    <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
                      {fmt(item.price_ars * item.quantity)}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>
                      c/u {fmt(item.price_ars)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end" style={{ flexShrink: 0, gap: '4px' }}>
                    <div className="flex items-center" style={{ backgroundColor: 'var(--bg-2)', borderRadius: '8px' }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex items-center justify-center border-none"
                        style={{ width: '34px', height: '34px', background: 'none', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', opacity: item.quantity <= 1 ? 0.4 : 1 }}
                      >
                        <Minus size={14} color="var(--text-muted)" />
                      </button>
                      <div className="flex items-center justify-center" style={{ width: '36px', height: '34px' }}>
                        <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                          {item.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        disabled={typeof item.stock === 'number' && item.quantity >= item.stock}
                        title={typeof item.stock === 'number' && item.quantity >= item.stock ? `Stock máximo: ${item.stock}` : undefined}
                        className="flex items-center justify-center border-none"
                        style={{ width: '34px', height: '34px', background: 'none', cursor: (typeof item.stock === 'number' && item.quantity >= item.stock) ? 'not-allowed' : 'pointer', opacity: (typeof item.stock === 'number' && item.quantity >= item.stock) ? 0.4 : 1 }}
                      >
                        <Plus size={14} color="var(--text-muted)" />
                      </button>
                    </div>
                    {typeof item.stock === 'number' && item.quantity >= item.stock && (
                      <span style={{ color: 'var(--warning)', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600', alignSelf: 'stretch', textAlign: 'center' }}>
                        Máx {item.stock} en stock
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{ width: '34px', height: '34px', backgroundColor: 'var(--border)', borderRadius: '8px', flexShrink: 0 }}
                  >
                    <Trash2 size={16} color="var(--error)" />
                  </button>
                </div>
              </Fragment>
            ))}
          </div>

          {/* Keep shopping */}
          <Link to="/" className="flex items-center no-underline" style={{ gap: '8px' }}>
            <ArrowLeft size={16} color="var(--accent)" />
            <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
              Seguir comprando
            </span>
          </Link>
        </div>

        {/* ── Right column: Order summary ── */}
        <div
          className="flex flex-col"
          style={{ width: '380px', flexShrink: 0, backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '11px 24px 24px 24px', gap: '16px', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>
            Resumen del pedido
          </span>
          <div style={{ backgroundColor: 'var(--border)', height: '1px', width: '100%' }} />

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
              Subtotal ({totalQty} {totalQty === 1 ? 'ítem' : 'ítems'})
            </span>
            <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
              {fmt(subtotal)}
            </span>
          </div>

          <div style={{ backgroundColor: 'var(--border)', height: '1px', width: '100%' }} />

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: 'var(--text)', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>Total</span>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>
              {fmt(subtotal)}
            </span>
          </div>
          <Link
            to="/checkout"
            onMouseEnter={() => setHoveredBtn('checkout_d')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center no-underline"
            style={{ backgroundColor: hoveredBtn === 'checkout_d' ? 'var(--accent-deep)' : 'var(--accent-bright)', borderRadius: '12px', height: '52px', gap: '10px' }}
          >
            <Lock size={18} color="var(--text-strong)" />
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '800' }}>
              Finalizar compra
            </span>
          </Link>

          <div style={{ backgroundColor: 'var(--border)', height: '1px', width: '100%' }} />

          <TrustBadges size={18} layout="column" />
        </div>
      </div>

      </main>

      <Footer />

      {/* ═══════════════ CLEAR CART MODAL ═══════════════ */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar vaciar carrito"
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 20, backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowClearConfirm(false) }}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowClearConfirm(false) }}
        >
          <div
            className="flex flex-col"
            style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '24px', gap: '20px', width: '90%', maxWidth: '360px', border: '1px solid var(--border)' }}
          >
            <div className="flex flex-col items-center" style={{ gap: '12px' }}>
              <div
                className="flex items-center justify-center"
                style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(var(--error-rgb),0.15)' }}
              >
                <Trash2 size={28} color="var(--error)" />
              </div>
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800', textAlign: 'center' }}>
                ¿Vaciar el carrito?
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px', textAlign: 'center' }}>
                Se eliminarán todos los productos del carrito.
              </span>
            </div>
            <div className="flex" style={{ gap: '12px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 flex items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: 'var(--border)', borderRadius: '10px', height: '48px' }}
              >
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Cancelar</span>
              </button>
              <button
                onClick={() => { clearCart(); setShowClearConfirm(false) }}
                className="flex-1 flex items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: 'var(--error)', borderRadius: '10px', height: '48px' }}
              >
                <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Vaciar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
