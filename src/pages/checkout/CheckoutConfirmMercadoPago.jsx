import { useEffect, useState, useRef } from 'react'
import { ChevronRight, ArrowLeft, X, Clock, CheckCircle2, XCircle, ShoppingBag, Info } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import { syncPayment } from '../../api/orders'

const fmt = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-AR')

const MAX_ATTEMPTS = 10
const POLL_INTERVAL_MS = 3000

const STATUS_META = {
  PENDING:   { label: 'Pendiente de pago', color: '#F59E0B', bg: '#2A1F0A', Icon: Clock },
  PAID:      { label: 'Pagado',            color: '#22C55E', bg: '#0E2417', Icon: CheckCircle2 },
  FAILED:    { label: 'Pago rechazado',    color: '#EF4444', bg: '#2A1414', Icon: XCircle },
  CANCELLED: { label: 'Cancelado',         color: '#EF4444', bg: '#2A1414', Icon: XCircle },
}

const Skeleton = () => (
  <div className="flex flex-col" style={{ gap: '16px' }}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          backgroundColor: '#0E1424',
          borderRadius: '14px',
          border: '1px solid #1B2333',
          height: i === 1 ? '160px' : '88px',
          opacity: 0.6,
        }}
      />
    ))}
  </div>
)

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? { label: status, color: '#AAB3C5', bg: '#1B2333', Icon: Info }
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

const HeroBanner = ({ Icon, iconColor, iconBg, title, subtitle }) => (
  <div
    className="flex flex-col items-center text-center"
    style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '32px 24px', gap: '12px', border: '1px solid #1B2333' }}
  >
    <div style={{ backgroundColor: iconBg, borderRadius: '999px', padding: '14px' }}>
      <Icon size={36} color={iconColor} />
    </div>
    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '20px', fontWeight: '800' }}>{title}</span>
    {subtitle && (
      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', maxWidth: '420px' }}>
        {subtitle}
      </span>
    )}
  </div>
)

const PrimaryHomeButton = ({ label = 'Volver al inicio' }) => (
  <Link
    to="/"
    className="no-underline flex items-center justify-center flex-1"
    style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '48px' }}
  >
    <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
      {label}
    </span>
  </Link>
)

const CheckoutConfirmMercadoPago = () => {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const attemptsRef = useRef(0)

  useEffect(() => {
    if (!orderId) {
      setError('Orden no encontrada')
      setLoading(false)
      return
    }
    let cancelled = false
    let timer
    attemptsRef.current = 0
    setLoading(true)
    setError(null)
    setTimedOut(false)

    const tick = async () => {
      try {
        const data = await syncPayment(orderId)
        if (cancelled) return
        setOrder(data)
        setLoading(false)
        if (data.status === 'PENDING') {
          if (attemptsRef.current < MAX_ATTEMPTS - 1) {
            attemptsRef.current += 1
            timer = setTimeout(tick, POLL_INTERVAL_MS)
          } else {
            setTimedOut(true)
          }
        }
      } catch (err) {
        if (cancelled) return
        if (err.code === 'PAYMENT_PROVIDER_ERROR' && attemptsRef.current < MAX_ATTEMPTS - 1) {
          attemptsRef.current += 1
          timer = setTimeout(tick, POLL_INTERVAL_MS)
          return
        }
        if (err.status === 404) setError('Orden no encontrada')
        else if (err.status === 401) setError('Necesitás iniciar sesión para ver esta orden')
        else setError(err.message || 'No pudimos confirmar el pago')
        setLoading(false)
      }
    }

    tick()
    return () => { cancelled = true; if (timer) clearTimeout(timer) }
  }, [orderId])

  const status = order?.status
  const showSkeleton = loading && !order
  const showPolling = !error && order && status === 'PENDING' && !timedOut

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px' }}
      >
        <Link to="/checkout" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
            Confirmación de pago
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
            Paso 3 de 3
          </span>
        </div>
        <Link to="/" className="flex items-center no-underline">
          <X size={20} color="#AAB3C5" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div className="hidden md:flex items-center w-full" style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Confirmación de pago</span>
      </div>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <div
        className="flex flex-col w-full"
        style={{ padding: '24px 16px', gap: '20px', maxWidth: '720px', margin: '0 auto', width: '100%' }}
      >
        {showSkeleton && (
          <>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
                Confirmando pago…
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
                Estamos verificando el estado de tu compra con MercadoPago.
              </span>
            </div>
            <Skeleton />
          </>
        )}

        {!showSkeleton && error && (
          <div
            className="flex flex-col items-center text-center"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '32px 24px', gap: '12px', border: '1px solid #1B2333' }}
          >
            <XCircle size={36} color="#EF4444" />
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>{error}</span>
            <Link
              to="/"
              className="no-underline flex items-center justify-center"
              style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '44px', padding: '0 20px', marginTop: '8px' }}
            >
              <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                Volver al inicio
              </span>
            </Link>
          </div>
        )}

        {!error && order && status === 'PAID' && (
          <HeroBanner
            Icon={CheckCircle2}
            iconColor="#22C55E"
            iconBg="#0E2417"
            title="¡Pago confirmado!"
            subtitle="Recibimos tu pago. Te enviamos los detalles por mail."
          />
        )}

        {!error && order && (status === 'FAILED' || status === 'CANCELLED') && (
          <HeroBanner
            Icon={XCircle}
            iconColor="#EF4444"
            iconBg="#2A1414"
            title="El pago no se completó"
            subtitle="Podés intentarlo de nuevo desde el catálogo."
          />
        )}

        {!error && order && status === 'PENDING' && timedOut && (
          <HeroBanner
            Icon={Clock}
            iconColor="#F59E0B"
            iconBg="#2A1F0A"
            title="El pago está en proceso"
            subtitle="Te avisaremos cuando se confirme. Podés cerrar esta página."
          />
        )}

        {showPolling && (
          <div
            className="flex items-center"
            style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '14px', gap: '10px', border: '1px solid rgba(36,168,245,0.3)' }}
          >
            <Clock size={18} color="#24A8F5" style={{ flexShrink: 0 }} />
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
              Confirmando pago con MercadoPago…
            </span>
          </div>
        )}

        {!error && order && (
          <>
            {/* Header card */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '20px', gap: '12px', border: '1px solid #1B2333' }}
            >
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '12px' }}>
                  <ShoppingBag size={22} color="#24A8F5" />
                </div>
                <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>
                    Pedido #{order.id}
                  </span>
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
                    {order.items?.length ?? 0} producto{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                  </span>
                </div>
                <StatusBadge status={order.status} />
              </div>
              {order.externalReference && (
                <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '11px' }}>
                  Referencia: {order.externalReference}
                </span>
              )}
            </div>

            {/* Items list */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '20px', gap: '14px', border: '1px solid #1B2333' }}
            >
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
                Detalle del pedido
              </span>
              <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
              {(order.items ?? []).map((it, idx) => (
                <div key={idx} className="flex items-start" style={{ gap: '12px' }}>
                  <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
                      {it.productName}
                    </span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
                      {it.quantity} × {fmt(it.unitPrice)}
                    </span>
                  </div>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                    {fmt(Number(it.unitPrice) * it.quantity)}
                  </span>
                </div>
              ))}
              <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
              <div className="flex items-center">
                <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>Total</span>
                <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>
                  {fmt(order.total)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex" style={{ gap: '12px' }}>
              <PrimaryHomeButton />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutConfirmMercadoPago
