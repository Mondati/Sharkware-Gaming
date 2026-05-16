import { useState, useEffect } from 'react'
import { ChevronRight, CreditCard, ShieldCheck, X, ArrowLeft, Smartphone, Calendar, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import TrustBadges from '../../components/TrustBadges'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder, createMpPreference } from '../../api/orders'

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-AR')

const SummaryPanel = ({ subtotal, cartCount, onPay, submitting, ctaLabel }) => (
  <div
    className="flex flex-col"
    style={{ width: '380px', flexShrink: 0, backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px', gap: '16px', border: '1px solid #1B2333' }}
  >
    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>Resumen del pedido</span>
    <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
    <div className="flex items-center">
      <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
        Subtotal ({cartCount} ítem{cartCount !== 1 ? 's' : ''})
      </span>
      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{fmt(subtotal)}</span>
    </div>
    <div className="flex items-center">
      <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>Envío</span>
      <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Gratis</span>
    </div>
    <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
    <div className="flex items-center">
      <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>Total</span>
      <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>{fmt(subtotal)}</span>
    </div>
    {subtotal > 0 && (
      <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '12px' }}>
        en 12 cuotas sin interés de {fmt(subtotal / 12)}
      </span>
    )}
    <button
      onClick={onPay}
      disabled={submitting || subtotal === 0}
      className="flex items-center justify-center border-none"
      style={{
        backgroundColor: submitting || subtotal === 0 ? '#1B2333' : '#24A8F5',
        borderRadius: '12px',
        height: '52px',
        cursor: submitting || subtotal === 0 ? 'default' : 'pointer',
        gap: '8px',
      }}
    >
      <Lock size={16} color={submitting || subtotal === 0 ? '#AAB3C5' : '#FFFFFF'} />
      <span style={{ color: submitting || subtotal === 0 ? '#AAB3C5' : '#FFFFFF', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
        {ctaLabel}
      </span>
    </button>
  </div>
)

const Checkout = () => {
  const navigate = useNavigate()
  const { items, cartCount, clearCart } = useCart()
  const { user, loading, showToast } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const subtotal = items.reduce((a, i) => a + i.price_ars * i.quantity, 0)

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login')
      return
    }
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [loading, user, items.length, navigate])

  const handlePay = async () => {
    if (submitting) return
    if (!user) {
      navigate('/login')
      return
    }
    setSubmitting(true)
    try {
      const order = await createOrder(
        items.map(i => ({ productId: i.id, quantity: i.quantity }))
      )
      const pref = await createMpPreference(order.id)
      clearCart()
      window.location.href = pref.initPoint
    } catch (err) {
      if (err.status === 401) navigate('/login')
      else if (err.code === 'OUT_OF_STOCK') showToast('Uno de los productos se quedó sin stock')
      else if (err.code === 'PAYMENT_PROVIDER_ERROR') showToast('No se pudo iniciar el pago. Reintentá en un momento.')
      else if (err.code === 'CONFLICT') showToast('La orden ya no está disponible para pagar')
      else if (err.code === 'NOT_FOUND') showToast('Producto no disponible')
      else if (err.code === 'VALIDATION_ERROR') showToast('Datos del pedido inválidos')
      else showToast('No se pudo iniciar el pago')
      setSubmitting(false)
    }
  }

  if (loading || !user || items.length === 0) {
    return <div className="flex flex-1" style={{ backgroundColor: '#070B16' }} />
  }

  const ctaLabel = submitting ? 'Procesando…' : 'Pagar con MercadoPago'

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px' }}
      >
        <Link to="/cart" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
            Método de pago
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
            Paso 2 de 3
          </span>
        </div>
        <Link to="/cart" className="flex items-center no-underline">
          <X size={20} color="#AAB3C5" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div className="hidden md:flex items-center w-full" style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Método de pago</span>
      </div>

      {/* ═══════════════ MOBILE CONTENT ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '20px' }}>

        <div className="flex flex-col" style={{ gap: '4px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '20px', fontWeight: '800' }}>
            Confirmá tu compra
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
            Pagás de forma segura con MercadoPago
          </span>
        </div>

        {/* Summary strip */}
        <div
          className="flex items-center"
          style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '12px 14px', gap: '10px', border: '1px solid #1B2333' }}
        >
          <CreditCard size={18} color="#24A8F5" />
          <div className="flex-1">
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
              {cartCount} producto{cartCount !== 1 ? 's' : ''} en tu carrito
            </span>
          </div>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
            Total: {fmt(subtotal)}
          </span>
        </div>

        {/* MercadoPago card */}
        <div
          className="flex flex-col"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '18px', gap: '12px', border: '1px solid #24A8F5' }}
        >
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
              <CreditCard size={22} color="#24A8F5" />
            </div>
            <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>
                MercadoPago
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
                Tarjeta, cuotas y otros medios disponibles
              </span>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Smartphone size={14} color="#24A8F5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
              Tarjeta · Efectivo · Billetera virtual
            </span>
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <Calendar size={14} color="#22C55E" />
            <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>
              Hasta 12 cuotas sin interés
            </span>
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <ShieldCheck size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
              Pago seguro gestionado por MercadoPago
            </span>
          </div>
        </div>

        {/* Totals mobile */}
        <div
          className="flex flex-col"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '16px', gap: '12px', border: '1px solid #1B2333' }}
        >
          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
              Subtotal ({cartCount} ítem{cartCount !== 1 ? 's' : ''})
            </span>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{fmt(subtotal)}</span>
          </div>
          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Envío</span>
            <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>Gratis</span>
          </div>
          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>Total</span>
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>{fmt(subtotal)}</span>
          </div>
          {subtotal > 0 && (
            <span style={{ color: '#22C55E', fontFamily: 'Poppins', fontSize: '11px' }}>
              en 12 cuotas sin interés de {fmt(subtotal / 12)}
            </span>
          )}
        </div>

        <button
          onClick={handlePay}
          disabled={submitting}
          className="flex items-center justify-center border-none w-full"
          style={{
            backgroundColor: submitting ? '#1B2333' : '#24A8F5',
            borderRadius: '12px',
            height: '50px',
            gap: '10px',
            cursor: submitting ? 'default' : 'pointer',
          }}
        >
          <Lock size={18} color={submitting ? '#AAB3C5' : '#FFFFFF'} />
          <span style={{ color: submitting ? '#AAB3C5' : '#FFFFFF', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '800' }}>
            {ctaLabel}
          </span>
        </button>

        <div style={{ padding: '16px 0' }}>
          <TrustBadges size={14} layout="row" />
        </div>
      </div>

      {/* ═══════════════ DESKTOP CONTENT ═══════════════ */}
      <div className="hidden md:flex w-full" style={{ padding: '40px 80px', gap: '30px' }}>

        <div className="flex flex-col" style={{ flex: 1, gap: '24px' }}>
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '28px', fontWeight: '800' }}>Confirmá tu compra</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '15px' }}>Pagás de forma segura con MercadoPago</span>
          </div>

          {/* MercadoPago card */}
          <div
            className="flex items-center"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px', gap: '16px', border: '1px solid #24A8F5', width: '100%' }}
          >
            <div style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '14px', flexShrink: 0 }}>
              <CreditCard size={26} color="#24A8F5" />
            </div>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '700' }}>MercadoPago</span>
                <div style={{ backgroundColor: '#0D2E52', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>Método único</span>
                </div>
              </div>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>Tarjeta, cuotas y otros medios disponibles</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>Pago seguro gestionado por MercadoPago</span>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: '20px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <ShieldCheck size={16} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Pago seguro</span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <Calendar size={16} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Hasta 12 cuotas sin interés</span>
            </div>
          </div>
        </div>

        <SummaryPanel
          subtotal={subtotal}
          cartCount={cartCount}
          onPay={handlePay}
          submitting={submitting}
          ctaLabel={ctaLabel}
        />
      </div>

      <Footer />
    </div>
  )
}

export default Checkout
