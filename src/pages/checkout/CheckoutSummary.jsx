import { useEffect, useState } from 'react'
import { ChevronRight, ArrowLeft, X, Clock, CheckCircle2, XCircle, ShoppingBag, Info, Lock, User, Mail, AlertTriangle } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import MercadoPagoLogo from '../../components/MercadoPagoLogo'
import { getOrderSummary, createMpPreference } from '../../api/orders'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import SkeletonBlock from '../../components/Skeleton'

const fmt = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-AR')

const STATUS_META = {
  PENDING:   { label: 'Pendiente de pago', color: 'var(--warning)', bg: 'var(--warning-bg)', Icon: Clock },
  PAID:      { label: 'Pagado',            color: 'var(--success)', bg: 'var(--success-bg)', Icon: CheckCircle2 },
  FAILED:    { label: 'Pago rechazado',    color: 'var(--error)', bg: 'var(--error-bg)', Icon: XCircle },
  CANCELLED: { label: 'Cancelado',         color: 'var(--error)', bg: 'var(--error-bg)', Icon: XCircle },
}

const Skeleton = () => (
  <div className="flex flex-col" style={{ gap: '16px' }}>
    {[0, 1, 2].map(i => (
      <SkeletonBlock key={i} height={i === 1 ? 180 : 88} radius={14} />
    ))}
  </div>
)

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? { label: status, color: 'var(--text-muted)', bg: 'var(--border)', Icon: Info }
  const Icon = meta.Icon
  return (
    <div
      className="flex items-center"
      style={{ backgroundColor: meta.bg, borderRadius: '999px', padding: '6px 12px', gap: '6px', alignSelf: 'flex-start' }}
    >
      <Icon size={14} color={meta.color} />
      <span style={{ color: meta.color, fontFamily: 'Poppins', fontSize: '12px', fontWeight: '700' }}>
        {meta.label}
      </span>
    </div>
  )
}

const CheckoutSummary = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useAuth()
  const { clearCart } = useCart()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const data = await getOrderSummary(orderId)
        if (cancelled) return
        setSummary(data)
        setLoading(false)
      } catch (err) {
        if (cancelled) return
        if (err.status === 401) { navigate('/login'); return }
        if (err.status === 404) {
          showToast('Orden no encontrada')
          navigate('/cart')
          return
        }
        if (err.code === 'ORDER_CANCELLED') {
          showToast(err.message || 'La orden fue cancelada')
          clearCart()
          navigate('/')
          return
        }
        setError(err.message || 'No pudimos cargar el resumen')
        setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [orderId, navigate, showToast, clearCart])

  const handleConfirm = async () => {
    if (submitting || !summary) return
    setSubmitting(true)
    try {
      const pref = await createMpPreference(summary.id)
      localStorage.setItem('sw_pending_order', String(summary.id))
      clearCart()
      window.location.href = pref.initPoint
    } catch (err) {
      if (err.status === 401) navigate('/login')
      else if (err.code === 'OUT_OF_STOCK') showToast('Uno de los productos se quedó sin stock')
      else if (err.code === 'PAYMENT_PROVIDER_ERROR') showToast('No se pudo iniciar el pago. Reintentá en un momento.')
      else if (err.code === 'CONFLICT') showToast('La orden ya no está disponible para pagar')
      else showToast('No se pudo iniciar el pago')
      setSubmitting(false)
    }
  }

  const canPay = summary?.allItemsAvailable && !submitting
  const showSkeleton = loading && !summary

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: 'var(--bg-2)' }}>

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: 'var(--hero-1)', height: '56px', padding: '0 16px' }}
      >
        <Link to="/cart" className="flex items-center no-underline">
          <ArrowLeft size={20} color="var(--text)" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
            Confirmá tu pedido
          </span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>
            Paso 3 de 3
          </span>
        </div>
        <Link to="/" className="flex items-center no-underline">
          <X size={20} color="var(--text-muted)" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div className="hidden md:flex items-center w-full" style={{ backgroundColor: 'var(--hero-1)', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="var(--border)" />
        <Link to="/cart" className="no-underline" style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px' }}>Carrito</Link>
        <ChevronRight size={14} color="var(--border)" />
        <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Confirmá tu pedido</span>
      </div>

      <main className="flex flex-col flex-1 w-full">

      {/* ═══════════════ CONTENT ═══════════════ */}
      <div
        className="flex flex-col w-full"
        style={{ padding: '24px 16px', gap: '20px', maxWidth: '720px', margin: '0 auto', width: '100%' }}
      >
        {showSkeleton && (
          <>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
                Revisá tu pedido
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
                Verificá los datos antes de confirmar el pago.
              </span>
            </div>
            <Skeleton />
          </>
        )}

        {!showSkeleton && error && (
          <div
            className="flex flex-col items-center text-center"
            style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '32px 24px', gap: '12px', border: '1px solid var(--border)' }}
          >
            <XCircle size={36} color="var(--error)" />
            <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>{error}</span>
            <Link
              to="/"
              className="no-underline flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent)', borderRadius: '12px', height: '44px', padding: '0 20px', marginTop: '8px' }}
            >
              <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                Volver al inicio
              </span>
            </Link>
          </div>
        )}

        {!error && summary && (
          <>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
                Revisá tu pedido
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
                Verificá los datos antes de confirmar el pago.
              </span>
            </div>

            {/* Header card */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '20px', gap: '12px', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div style={{ backgroundColor: 'var(--surface-accent)', borderRadius: '12px', padding: '12px' }}>
                  <ShoppingBag size={22} color="var(--accent)" />
                </div>
                <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
                  <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>
                    Pedido #{summary.id}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '12px' }}>
                    {summary.itemCount} producto{summary.itemCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <StatusBadge status={summary.status} />
              </div>
              {summary.externalReference && (
                <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '11px' }}>
                  Referencia: {summary.externalReference}
                </span>
              )}
            </div>

            {/* Datos del cliente */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '20px', gap: '14px', border: '1px solid var(--border)' }}
            >
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
                Datos del cliente
              </span>
              <div style={{ backgroundColor: 'var(--border)', height: '1px' }} />
              <div className="flex items-center" style={{ gap: '10px' }}>
                <User size={16} color="var(--accent)" />
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px' }}>
                  {summary.user?.name}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <Mail size={16} color="var(--accent)" />
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px' }}>
                  {summary.user?.email}
                </span>
              </div>
            </div>

            {/* Items list */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '20px', gap: '14px', border: '1px solid var(--border)' }}
            >
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
                Detalle del pedido
              </span>
              <div style={{ backgroundColor: 'var(--border)', height: '1px' }} />
              {(summary.items ?? []).map((it, idx) => (
                <div key={idx} className="flex items-start" style={{ gap: '12px' }}>
                  <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
                    <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
                      {it.productName}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '12px' }}>
                      {it.quantity} × {fmt(it.unitPrice)}
                    </span>
                    {!it.stockSufficient && (
                      <div
                        className="flex items-center"
                        style={{ backgroundColor: 'var(--error-bg)', borderRadius: '999px', padding: '4px 10px', gap: '6px', alignSelf: 'flex-start', marginTop: '2px' }}
                      >
                        <AlertTriangle size={12} color="var(--error)" />
                        <span style={{ color: 'var(--error)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700' }}>
                          Stock insuficiente (quedan {it.currentStock})
                        </span>
                      </div>
                    )}
                  </div>
                  <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                    {fmt(Number(it.unitPrice) * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Método de pago */}
            <div
              className="flex items-center"
              style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '20px', gap: '14px', border: '1px solid var(--accent)' }}
            >
              <div style={{ backgroundColor: 'var(--surface-accent)', borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
                <MercadoPagoLogo size={22} />
              </div>
              <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
                  MercadoPago
                </span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '12px' }}>
                  Cuotas según tu tarjeta en MercadoPago
                </span>
              </div>
            </div>

            {/* Totales */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '20px', gap: '12px', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center">
                <span className="flex-1" style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
                  Subtotal ({summary.itemCount} ítem{summary.itemCount !== 1 ? 's' : ''})
                </span>
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                  {fmt(summary.subtotal)}
                </span>
              </div>
              <div style={{ backgroundColor: 'var(--border)', height: '1px' }} />
              <div className="flex items-center">
                <span className="flex-1" style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>Total</span>
                <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>
                  {fmt(summary.total)}
                </span>
              </div>
            </div>

            {!summary.allItemsAvailable && (
              <div
                className="flex items-center"
                style={{ backgroundColor: 'var(--error-bg)', borderRadius: '12px', padding: '14px', gap: '10px', border: '1px solid rgba(var(--error-rgb),0.3)' }}
              >
                <AlertTriangle size={18} color="var(--error)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '13px' }}>
                  Alguno de los productos no tiene stock suficiente. Volvé al carrito para ajustar las cantidades.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex" style={{ gap: '12px' }}>
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{
                  flex: 1,
                  backgroundColor: 'var(--elev)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  height: '48px',
                  gap: '8px',
                }}
              >
                <ArrowLeft size={16} color="var(--text)" />
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                  Volver al carrito
                </span>
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canPay}
                className="flex items-center justify-center border-none"
                style={{
                  flex: 1,
                  backgroundColor: canPay ? 'var(--accent)' : 'var(--border)',
                  borderRadius: '12px',
                  height: '48px',
                  gap: '8px',
                  cursor: canPay ? 'pointer' : 'not-allowed',
                }}
              >
                <Lock size={16} color={canPay ? 'var(--text-strong)' : 'var(--text-muted)'} />
                <span style={{ color: canPay ? 'var(--text-strong)' : 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                  {submitting ? 'Procesando…' : 'Confirmar y pagar'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      </main>

      <Footer />
    </div>
  )
}

export default CheckoutSummary
