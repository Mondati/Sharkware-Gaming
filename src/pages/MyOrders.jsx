import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  RefreshCw,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import Footer from '../components/Footer'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { listOrders, syncPayment } from '../api/orders'
import { useAuth } from '../context/AuthContext'
import Skeleton from '../components/Skeleton'

const fmt = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-AR')

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

const STATUS_META = {
  PENDING:   { label: 'Pendiente de pago', color: 'var(--warning)', bg: 'var(--warning-bg)', Icon: Clock },
  PAID:      { label: 'Pagado',            color: 'var(--success)', bg: 'var(--success-bg)', Icon: CheckCircle2 },
  FAILED:    { label: 'Pago rechazado',    color: 'var(--error)', bg: 'var(--error-bg)', Icon: XCircle },
  CANCELLED: { label: 'Cancelado',         color: 'var(--error)', bg: 'var(--error-bg)', Icon: XCircle },
}

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

const SkeletonCard = ({ height = 180 }) => (
  <Skeleton height={height} radius={14} />
)

const EmptyState = () => (
  <div
    className="flex flex-col items-center text-center"
    style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '40px 24px', gap: '14px', border: '1px solid var(--border)' }}
  >
    <div style={{ backgroundColor: 'var(--surface-accent)', borderRadius: '999px', padding: '16px' }}>
      <ShoppingBag size={32} color="var(--accent)" />
    </div>
    <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '700' }}>
      Todavía no hiciste ninguna compra
    </span>
    <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px', maxWidth: '320px' }}>
      Cuando hagas tu primer pedido lo vas a ver acá con su estado actualizado.
    </span>
    <Link
      to="/"
      className="no-underline flex items-center justify-center"
      style={{ backgroundColor: 'var(--accent)', borderRadius: '12px', height: '44px', padding: '0 24px', marginTop: '6px', gap: '6px' }}
    >
      <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
        Ir al catálogo
      </span>
      <ChevronRight size={16} color="var(--text-strong)" />
    </Link>
  </div>
)

const OrderCard = ({ order, verifying, onVerify }) => {
  const itemsCount = order.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) ?? 0
  const isPending = order.status === 'PENDING'

  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '20px', gap: '14px', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-start" style={{ gap: '12px' }}>
        <div style={{ backgroundColor: 'var(--surface-accent)', borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
          <ShoppingBag size={22} color="var(--accent)" />
        </div>
        <div className="flex flex-col flex-1" style={{ gap: '2px', minWidth: 0 }}>
          <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>
            Pedido #{order.id}
          </span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '12px' }}>
            {formatDate(order.createdAt)} · {itemsCount} producto{itemsCount !== 1 ? 's' : ''}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div style={{ backgroundColor: 'var(--border)', height: '1px' }} />

      {/* Items */}
      <div className="flex flex-col" style={{ gap: '10px' }}>
        {(order.items ?? []).map((it, idx) => (
          <div key={idx} className="flex items-start" style={{ gap: '12px' }}>
            <div className="flex flex-col flex-1" style={{ gap: '2px', minWidth: 0 }}>
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600', wordBreak: 'break-word' }}>
                {it.productName}
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px' }}>
                {it.quantity} × {fmt(it.unitPrice)}
              </span>
            </div>
            <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
              {fmt(Number(it.unitPrice) * it.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'var(--border)', height: '1px' }} />

      {/* Footer: total + action */}
      <div className="flex flex-col md:flex-row md:items-center" style={{ gap: '12px' }}>
        <div className="flex items-center flex-1">
          <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px', marginRight: '8px' }}>
            Total
          </span>
          <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '20px', fontWeight: '800' }}>
            {fmt(order.total)}
          </span>
        </div>

        {isPending && (
          <button
            onClick={() => onVerify(order.id)}
            disabled={verifying}
            className="flex items-center justify-center border-none"
            style={{
              backgroundColor: 'var(--border)',
              borderRadius: '10px',
              height: '40px',
              padding: '0 16px',
              gap: '8px',
              cursor: verifying ? 'wait' : 'pointer',
              opacity: verifying ? 0.7 : 1,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => { if (!verifying) e.currentTarget.style.backgroundColor = 'var(--surface-hover)' }}
            onMouseLeave={(e) => { if (!verifying) e.currentTarget.style.backgroundColor = 'var(--border)' }}
          >
            {verifying ? (
              <Loader2 size={14} color="var(--accent)" className="animate-spin" />
            ) : (
              <RefreshCw size={14} color="var(--accent)" />
            )}
            <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>
              {verifying ? 'Verificando…' : 'Verificar pago'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

const MyOrders = () => {
  const { sidePadding } = useWindowWidth()
  const { showToast } = useAuth()
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [verifyingId, setVerifyingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    listOrders()
      .then((data) => {
        if (cancelled) return
        const visible = Array.isArray(data) ? data.filter((o) => o.status !== 'CANCELLED') : []
        setOrders(visible)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'No pudimos cargar tus pedidos')
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleVerify = useCallback(async (orderId) => {
    if (verifyingId) return
    setVerifyingId(orderId)
    try {
      const updated = await syncPayment(orderId)
      setOrders((prev) => (prev ?? []).map((o) => (o.id === updated.id ? { ...o, ...updated } : o)))
      if (updated.status === 'PENDING') {
        showToast('Aún no recibimos confirmación de MercadoPago')
      } else if (updated.status === 'PAID') {
        showToast('Pago confirmado')
        const pending = localStorage.getItem('sw_pending_order')
        if (pending && Number(pending) === updated.id) localStorage.removeItem('sw_pending_order')
      } else {
        showToast('Estado actualizado')
      }
    } catch (err) {
      showToast(err.message || 'No pudimos verificar el pago')
    } finally {
      setVerifyingId(null)
    }
  }, [verifyingId, showToast])

  const showSkeleton = loading && !orders

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: 'var(--bg-2)' }}>

      {/* Mobile header */}
      <div
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: 'var(--hero-1)', height: '56px', padding: '0 16px', gap: '10px' }}
      >
        <Package size={18} color="var(--accent)" />
        <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
          Mis pedidos
        </span>
      </div>

      {/* Desktop breadcrumb */}
      <div
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: 'var(--hero-1)', height: '44px', padding: `0 ${sidePadding}`, gap: '8px' }}
      >
        <Link to="/" className="no-underline" style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px' }}>
          Inicio
        </Link>
        <ChevronRight size={14} color="var(--border)" />
        <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
          Mis pedidos
        </span>
      </div>

      <main className="flex flex-col flex-1 w-full">

      {/* Content */}
      <div
        className="flex flex-col w-full"
        style={{ padding: '24px 16px', gap: '20px', maxWidth: '720px', margin: '0 auto', width: '100%' }}
      >
        {/* Title */}
        <div className="flex flex-col" style={{ gap: '6px' }}>
          <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
            Mis pedidos
          </span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
            Historial de tus compras y estado de pago.
          </span>
        </div>

        {showSkeleton && (
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <SkeletonCard height={180} />
            <SkeletonCard height={180} />
            <SkeletonCard height={120} />
          </div>
        )}

        {!showSkeleton && error && (
          <div
            className="flex flex-col items-center text-center"
            style={{ backgroundColor: 'var(--elev)', borderRadius: '14px', padding: '32px 24px', gap: '12px', border: '1px solid var(--border)' }}
          >
            <XCircle size={36} color="var(--error)" />
            <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>{error}</span>
          </div>
        )}

        {!error && orders && orders.length === 0 && <EmptyState />}

        {!error && orders && orders.length > 0 && (
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {orders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                verifying={verifyingId === o.id}
                onVerify={handleVerify}
              />
            ))}
          </div>
        )}
      </div>

      </main>

      <Footer />
    </div>
  )
}

export default MyOrders
