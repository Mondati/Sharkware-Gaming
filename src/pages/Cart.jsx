import { useState, Fragment } from 'react'
import {
  ChevronRight, Tag, ArrowLeft, Lock, ShieldCheck, Truck, RefreshCw,
  Minus, Plus, Trash2, X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const initialItems = [
  { id: 1, brand: 'NVIDIA', name: 'GeForce RTX 5080 Super', spec: '16GB GDDR7', price: 1899999, qty: 1 },
  { id: 2, brand: 'MSI', name: 'Katana 17 B13VGK', spec: 'i7-13620H · RTX 4060 · 16GB', price: 1099999, qty: 2 },
  { id: 9, brand: 'SAMSUNG', name: 'Odyssey G7 32" 240Hz', spec: 'QHD · 1ms · HDR600', price: 599999, qty: 1 },
]

const fmt = (n) => '$' + n.toLocaleString('es-AR')

const Cart = () => {
  const [items, setItems] = useState(initialItems)
  const [coupon, setCoupon] = useState('')

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    )
  }

  const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id))

  const totalQty = items.reduce((a, i) => a + i.qty, 0)
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0)

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ DESKTOP NAVBAR ═══════════════ */}
      <Navbar cartCount={totalQty} />

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px' }}
      >
        <Link to="/" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
            Mi carrito
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>
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
        style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}
      >
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
          Inicio
        </Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
          Mi Carrito
        </span>
      </div>

      {/* ═══════════════ MOBILE CONTENT ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '16px' }}>

        {/* Items list */}
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start"
              style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '14px', gap: '12px', border: '1px solid #1B2333' }}
            >
              {/* Image */}
              <div style={{ backgroundColor: '#1E2232', borderRadius: '10px', width: '80px', height: '80px', flexShrink: 0 }} />

              {/* Info */}
              <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col" style={{ gap: '2px', flex: 1 }}>
                    <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>
                      {item.brand}
                    </span>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', lineHeight: '1.3' }}>
                      {item.name}
                    </span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>
                      {item.spec}
                    </span>
                  </div>
                  {/* Delete */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{ background: 'none', padding: '4px' }}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </button>
                </div>

                {/* Price + Qty row */}
                <div className="flex items-center justify-between" style={{ marginTop: '4px' }}>
                  <span style={{ color: '#FF8400', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
                    {fmt(item.price * item.qty)}
                  </span>
                  <div className="flex items-center" style={{ backgroundColor: '#070B16', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="flex items-center justify-center border-none cursor-pointer"
                      style={{ width: '30px', height: '30px', background: 'none' }}
                    >
                      <Minus size={12} color="#AAB3C5" />
                    </button>
                    <div className="flex items-center justify-center" style={{ width: '32px', height: '30px' }}>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>
                        {item.qty}
                      </span>
                    </div>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="flex items-center justify-center border-none cursor-pointer"
                      style={{ width: '30px', height: '30px', backgroundColor: '#24A8F5' }}
                    >
                      <Plus size={12} color="#FFFFFF" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
              style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}
            />
          </div>
          <button
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: '#1B2333', borderRadius: '10px', height: '44px', padding: '0 18px', flexShrink: 0 }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>Aplicar</span>
          </button>
        </div>

        {/* Order summary */}
        <div
          className="flex flex-col"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '16px', gap: '12px', border: '1px solid #1B2333' }}
        >
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
            Resumen del pedido
          </span>
          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
              Subtotal ({totalQty} {totalQty === 1 ? 'ítem' : 'ítems'})
            </span>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
              {fmt(subtotal)}
            </span>
          </div>

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Envío</span>
            <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>Gratis</span>
          </div>

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Descuento</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>− $0</span>
          </div>

          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>Total</span>
            <span style={{ color: '#FF8400', fontFamily: 'Inter', fontSize: '22px', fontWeight: '800' }}>
              {fmt(subtotal)}
            </span>
          </div>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>
            en 12 cuotas sin interés de {fmt(Math.round(subtotal / 12))}
          </span>

          {/* Checkout button */}
          <Link
            to="/checkout"
            className="flex items-center justify-center no-underline"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '50px', gap: '10px', width: '100%' }}
          >
            <Lock size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '800' }}>
              Finalizar compra
            </span>
          </Link>

          {/* Keep shopping */}
          <Link to="/" className="flex items-center justify-center no-underline" style={{ gap: '6px' }}>
            <ArrowLeft size={14} color="#24A8F5" />
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
              Seguir comprando
            </span>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center" style={{ gap: '16px', padding: '8px 0' }}>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <ShieldCheck size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Pago seguro</span>
          </div>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <Truck size={14} color="#24A8F5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Envío gratis</span>
          </div>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <RefreshCw size={14} color="#F59E0B" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>30 días devolución</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP CONTENT ═══════════════ */}
      <div className="hidden md:flex w-full" style={{ padding: '40px 80px', gap: '32px' }}>

        {/* ── Left column ── */}
        <div className="flex flex-col" style={{ flex: 1, gap: '20px' }}>

          {/* Header */}
          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Inter', fontSize: '24px', fontWeight: '800' }}>
              Mi Carrito
            </span>
            <div style={{ backgroundColor: '#1B2333', borderRadius: '20px', padding: '4px 12px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
                {totalQty} {totalQty === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </div>

          {/* Items container */}
          <div
            className="flex flex-col"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '20px', gap: '12px', border: '1px solid #1B2333' }}
          >
            {items.length === 0 && (
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                Tu carrito está vacío.
              </span>
            )}
            {items.map((item, idx) => (
              <Fragment key={item.id}>
                {idx > 0 && (
                  <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />
                )}
                <div className="flex items-center" style={{ gap: '16px', width: '100%' }}>
                  <div style={{ backgroundColor: '#1E2232', borderRadius: '10px', width: '90px', height: '90px', flexShrink: 0 }} />
                  <div className="flex flex-col" style={{ flex: 1, gap: '4px' }}>
                    <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '2px' }}>
                      {item.brand}
                    </span>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
                      {item.name}
                    </span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
                      {item.spec}
                    </span>
                  </div>
                  <span style={{ color: '#FF8400', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800', flexShrink: 0 }}>
                    {fmt(item.price * item.qty)}
                  </span>
                  <div className="flex items-center" style={{ backgroundColor: '#070B16', borderRadius: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="flex items-center justify-center border-none cursor-pointer"
                      style={{ width: '34px', height: '34px', background: 'none' }}
                    >
                      <Minus size={14} color="#AAB3C5" />
                    </button>
                    <div className="flex items-center justify-center" style={{ width: '36px', height: '34px' }}>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
                        {item.qty}
                      </span>
                    </div>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="flex items-center justify-center border-none cursor-pointer"
                      style={{ width: '34px', height: '34px', backgroundColor: '#24A8F5', borderRadius: '0 8px 8px 0' }}
                    >
                      <Plus size={14} color="#FFFFFF" />
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
                style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}
              />
            </div>
            <button
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#1B2333', borderRadius: '10px', height: '44px', padding: '0 20px' }}
            >
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>Aplicar</span>
            </button>
          </div>

          {/* Keep shopping */}
          <Link to="/" className="flex items-center no-underline" style={{ gap: '8px' }}>
            <ArrowLeft size={16} color="#24A8F5" />
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>
              Seguir comprando
            </span>
          </Link>
        </div>

        {/* ── Right column: Order summary ── */}
        <div
          className="flex flex-col"
          style={{ width: '380px', flexShrink: 0, backgroundColor: '#0E1424', borderRadius: '14px', padding: '11px 24px 24px 24px', gap: '16px', border: '1px solid #1B2333' }}
        >
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '800' }}>
            Resumen del pedido
          </span>
          <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
              Subtotal ({totalQty} {totalQty === 1 ? 'ítem' : 'ítems'})
            </span>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
              {fmt(subtotal)}
            </span>
          </div>

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>Envío</span>
            <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>Gratis</span>
          </div>

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>Descuento</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>−$0</span>
          </div>

          <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />

          <div className="flex items-center" style={{ width: '100%' }}>
            <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '800' }}>Total</span>
            <span style={{ color: '#FF8400', fontFamily: 'Inter', fontSize: '22px', fontWeight: '800' }}>
              {fmt(subtotal)}
            </span>
          </div>
          <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '12px' }}>
            en 12 cuotas sin interés de {fmt(Math.round(subtotal / 12))}
          </span>

          <Link
            to="/checkout"
            className="flex items-center justify-center no-underline"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', gap: '10px' }}
          >
            <Lock size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '800' }}>
              Finalizar compra
            </span>
          </Link>

          <div style={{ backgroundColor: '#1B2333', height: '1px', width: '100%' }} />

          <div className="flex justify-around" style={{ width: '100%' }}>
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <ShieldCheck size={18} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Pago seguro</span>
            </div>
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <Truck size={18} color="#24A8F5" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Envío gratis</span>
            </div>
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <RefreshCw size={18} color="#F59E0B" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>30 días devolución</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Cart
