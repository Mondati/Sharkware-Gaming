import { useState, Fragment } from 'react'
import { useWindowWidth } from '../hooks/useWindowWidth'
import {
  ChevronRight, Tag, ArrowLeft, Lock,
  Minus, Plus, Trash2, Trash, X, ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import TrustBadges from '../components/TrustBadges'
import { useCart } from '../context/CartContext'

const fmt = (n) => '$' + n.toLocaleString('es-AR')

const Cart = () => {
  const { sidePadding } = useWindowWidth()
  const { items, removeItem, updateQty, clearCart, cartCount } = useCart()
  const [coupon, setCoupon] = useState('')
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const totalQty = cartCount
  const subtotal = items.reduce((a, i) => a + i.price_ars * i.quantity, 0)

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ DESKTOP NAVBAR ═══════════════ */}

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px' }}
      >
        <Link to="/" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
            Mi carrito
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
            {totalQty} {totalQty === 1 ? 'producto' : 'productos'}
          </span>
        </div>
        <Link to="/" className="flex items-center no-underline">
          <X size={20} color="#AAB3C5" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '44px', padding: `0 ${sidePadding}`, gap: '8px' }}
      >
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
          Inicio
        </Link>
        <ChevronRight size={13} color="#454E64" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
          Mi Carrito
        </span>
      </div>

      {/* ═══════════════ MOBILE CONTENT ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '16px' }}>

        {/* Items list */}
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center" style={{ padding: '48px 16px', gap: '16px' }}>
              <div className="flex items-center justify-center" style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,200,255,0.1), transparent 70%)',
              }}>
                <ShoppingBag size={40} color="#2A3250" />
              </div>
              <div className="flex flex-col items-center" style={{ gap: '6px' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '600', textAlign: 'center' }}>
                  Tu carrito está vacío
                </span>
                <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
                  Explorá nuestro catálogo de gaming hardware
                </span>
              </div>
              <Link
                to="/"
                className="no-underline flex items-center justify-center"
                style={{
                  backgroundColor: '#1E2232',
                  border: '1px solid #1B2333',
                  borderRadius: '20px',
                  padding: '8px 20px',
                  color: '#24A8F5',
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
              style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '14px', gap: '12px', border: '1px solid #1B2333' }}
            >
              {/* Image + info → clickeable */}
              <Link
                to={`/product/${item.id}`}
                className="flex items-start no-underline"
                style={{ gap: '12px', flex: 1 }}
              >
                <div style={{ backgroundColor: '#1E2232', borderRadius: '10px', width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                </div>
                <div className="flex flex-col" style={{ gap: '2px' }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>
                    {item.brand}
                  </span>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700', lineHeight: '1.3' }}>
                    {item.name}
                  </span>
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
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
                  <Trash2 size={16} color="#EF4444" />
                </button>

                {/* Price */}
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
                  c/u {fmt(item.price_ars)}
                </span>
                <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
                  {fmt(item.price_ars * item.quantity)}
                </span>

                {/* Qty */}
                <div className="flex items-center" style={{ backgroundColor: '#070B16', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{ width: '30px', height: '30px', background: 'none' }}
                  >
                    <Minus size={12} color="#AAB3C5" />
                  </button>
                  <div className="flex items-center justify-center" style={{ width: '32px', height: '30px' }}>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{ width: '30px', height: '30px', background: 'none' }}
                  >
                    <Plus size={12} color="#AAB3C5" />
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
            style={{ backgroundColor: '#1E2232', border: '1px solid #EF4444', borderRadius: '10px', padding: '12px', gap: '8px' }}
          >
            <Trash size={16} color="#EF4444" />
            <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
              Vaciar carrito
            </span>
          </button>
        )}

        {/* Coupon */}
        <div className="flex items-center" style={{ gap: '10px' }}>
          <div
            className="flex items-center flex-1"
            style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '44px', padding: '0 14px', gap: '8px', border: '1px solid #1B2333' }}
          >
            <Tag size={16} color="#AAB3C5" />
            <input
              type="text"
              placeholder="Código de descuento"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              className="bg-transparent border-none outline-none w-full"
              style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}
            />
          </div>
          <button
            onMouseEnter={() => setHoveredBtn('apply_m')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: hoveredBtn === 'apply_m' ? '#252840' : '#1B2333', borderRadius: '10px', height: '44px', padding: '0 18px', flexShrink: 0 }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>Aplicar</span>
          </button>
        </div>

        {/* Order summary */}
        <div
          className="flex flex-col"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '16px', gap: '12px', border: '1px solid #1B2333' }}
        >
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
            Resumen del pedido
          </span>
          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
              Subtotal ({totalQty} {totalQty === 1 ? 'ítem' : 'ítems'})
            </span>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
              {fmt(subtotal)}
            </span>
          </div>

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Envío</span>
            <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>Gratis</span>
          </div>

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Descuento</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>− $0</span>
          </div>

          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>Total</span>
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>
              {fmt(subtotal)}
            </span>
          </div>
          {subtotal > 0 && (
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
            en 12 cuotas sin interés de {fmt(Math.round(subtotal / 12))}
          </span>
          )}

          {/* Checkout button */}
          <Link
            to="/checkout"
            onMouseEnter={() => setHoveredBtn('checkout_m')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center no-underline"
            style={{ backgroundColor: hoveredBtn === 'checkout_m' ? '#00A8D8' : '#00C8FF', borderRadius: '12px', height: '50px', gap: '10px', width: '100%' }}
          >
            <Lock size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '800' }}>
              Finalizar compra
            </span>
          </Link>

          {/* Keep shopping */}
          <Link to="/" className="flex items-center justify-center no-underline" style={{ gap: '6px' }}>
            <ArrowLeft size={14} color="#24A8F5" />
            <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
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

          {/* Header */}
          <div className="flex items-center justify-between" style={{ width: '100%' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
                Mi Carrito
              </span>
              <div style={{ backgroundColor: '#1B2333', borderRadius: '20px', padding: '4px 12px' }}>
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
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
                style={{ backgroundColor: hoveredBtn === 'clear_d' ? '#2A1A1A' : '#1E2232', border: '1px solid #EF4444', borderRadius: '10px', padding: '10px 16px', gap: '8px' }}
              >
                <Trash size={16} color="#EF4444" />
                <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                  Vaciar carrito
                </span>
              </button>
            )}
          </div>

          {/* Items container */}
          <div
            className="flex flex-col"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '20px', gap: '12px', border: '1px solid #1B2333' }}
          >
            {items.length === 0 && (
              <div className="flex flex-col items-center" style={{ padding: '40px 0', gap: '16px' }}>
                <div className="flex items-center justify-center" style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,200,255,0.1), transparent 70%)',
                }}>
                  <ShoppingBag size={44} color="#2A3250" />
                </div>
                <div className="flex flex-col items-center" style={{ gap: '6px' }}>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '600', textAlign: 'center' }}>
                    Tu carrito está vacío
                  </span>
                  <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
                    Explorá nuestro catálogo de gaming hardware
                  </span>
                </div>
                <Link
                  to="/"
                  className="no-underline flex items-center justify-center"
                  style={{
                    backgroundColor: '#1E2232',
                    border: '1px solid #1B2333',
                    borderRadius: '20px',
                    padding: '8px 24px',
                    color: '#24A8F5',
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
                  <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />
                )}
                <div className="flex items-center" style={{ gap: '16px', width: '100%' }}>
                  {/* Image + info → clickeable */}
                  <Link
                    to={`/product/${item.id}`}
                    className="flex items-center no-underline"
                    style={{ flex: 1, gap: '16px' }}
                  >
                    <div style={{ backgroundColor: '#1E2232', borderRadius: '10px', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden' }}>
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  </div>
                    <div className="flex flex-col" style={{ gap: '4px' }}>
                      <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '700', letterSpacing: '2px' }}>
                        {item.brand}
                      </span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                        {item.name}
                      </span>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
                        {item.spec}
                      </span>
                    </div>
                  </Link>
                  <div className="flex flex-col items-end" style={{ flexShrink: 0 }}>
                    <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
                      {fmt(item.price_ars * item.quantity)}
                    </span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
                      c/u {fmt(item.price_ars)}
                    </span>
                  </div>
                  <div className="flex items-center" style={{ backgroundColor: '#070B16', borderRadius: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="flex items-center justify-center border-none cursor-pointer"
                      style={{ width: '34px', height: '34px', background: 'none' }}
                    >
                      <Minus size={14} color="#AAB3C5" />
                    </button>
                    <div className="flex items-center justify-center" style={{ width: '36px', height: '34px' }}>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="flex items-center justify-center border-none cursor-pointer"
                      style={{ width: '34px', height: '34px', background: 'none' }}
                    >
                      <Plus size={14} color="#AAB3C5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{ width: '34px', height: '34px', backgroundColor: '#1B2333', borderRadius: '8px', flexShrink: 0 }}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </button>
                </div>
              </Fragment>
            ))}
          </div>

          {/* Coupon row */}
          <div className="flex items-center" style={{ gap: '12px', width: '100%' }}>
            <div
              className="flex items-center"
              style={{ flex: 1, backgroundColor: '#0E1424', borderRadius: '10px', height: '44px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
            >
              <Tag size={16} color="#AAB3C5" />
              <input
                type="text"
                placeholder="Código de descuento"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                className="bg-transparent border-none outline-none w-full"
                style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}
              />
            </div>
            <button
              onMouseEnter={() => setHoveredBtn('apply_d')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: hoveredBtn === 'apply_d' ? '#252840' : '#1B2333', borderRadius: '10px', height: '44px', padding: '0 20px' }}
            >
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Aplicar</span>
            </button>
          </div>

          {/* Keep shopping */}
          <Link to="/" className="flex items-center no-underline" style={{ gap: '8px' }}>
            <ArrowLeft size={16} color="#24A8F5" />
            <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
              Seguir comprando
            </span>
          </Link>
        </div>

        {/* ── Right column: Order summary ── */}
        <div
          className="flex flex-col"
          style={{ width: '380px', flexShrink: 0, backgroundColor: '#0E1424', borderRadius: '14px', padding: '11px 24px 24px 24px', gap: '16px', border: '1px solid #1B2333' }}
        >
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>
            Resumen del pedido
          </span>
          <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
              Subtotal ({totalQty} {totalQty === 1 ? 'ítem' : 'ítems'})
            </span>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
              {fmt(subtotal)}
            </span>
          </div>

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>Envío</span>
            <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Gratis</span>
          </div>

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>Descuento</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>−$0</span>
          </div>

          <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>Total</span>
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>
              {fmt(subtotal)}
            </span>
          </div>
          {subtotal > 0 && (
          <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '12px' }}>
            en 12 cuotas sin interés de {fmt(Math.round(subtotal / 12))}
          </span>
          )}

          <Link
            to="/checkout"
            onMouseEnter={() => setHoveredBtn('checkout_d')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center justify-center no-underline"
            style={{ backgroundColor: hoveredBtn === 'checkout_d' ? '#00A8D8' : '#00C8FF', borderRadius: '12px', height: '52px', gap: '10px' }}
          >
            <Lock size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '800' }}>
              Finalizar compra
            </span>
          </Link>

          <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />

          <TrustBadges size={18} layout="column" />
        </div>
      </div>

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
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px', gap: '20px', width: '90%', maxWidth: '360px', border: '1px solid #1B2333' }}
          >
            <div className="flex flex-col items-center" style={{ gap: '12px' }}>
              <div
                className="flex items-center justify-center"
                style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.15)' }}
              >
                <Trash2 size={28} color="#EF4444" />
              </div>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800', textAlign: 'center' }}>
                ¿Vaciar el carrito?
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', textAlign: 'center' }}>
                Se eliminarán todos los productos del carrito.
              </span>
            </div>
            <div className="flex" style={{ gap: '12px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 flex items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: '#1B2333', borderRadius: '10px', height: '48px' }}
              >
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Cancelar</span>
              </button>
              <button
                onClick={() => { clearCart(); setShowClearConfirm(false) }}
                className="flex-1 flex items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: '#EF4444', borderRadius: '10px', height: '48px' }}
              >
                <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Vaciar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
