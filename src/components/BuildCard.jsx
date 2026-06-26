import { Link } from 'react-router-dom'
import { Check, AlertTriangle, ShoppingCart } from 'lucide-react'
import { formatARS } from '../utils/formatPrice'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const ROLE_LABEL = {
  cpu: 'CPU',
  motherboard: 'Motherboard',
  ram: 'RAM',
  gpu: 'GPU',
  psu: 'Fuente',
  storage: 'Almacenamiento',
  cooler: 'Cooler',
  case: 'Gabinete',
}

const BuildCard = ({ build }) => {
  const { addItems } = useCart()
  const { showToast } = useAuth()

  const handleAddAll = () => {
    const entries = (build.items ?? []).map((it) => ({
      product: {
        id: it.productId,
        brand: it.brand,
        name: it.productName,
        spec: ROLE_LABEL[it.role] ?? it.role,
        price_ars: Number(it.unitPrice),
        image_url: it.imageUrl,
        stock: 1,
      },
      quantity: it.quantity ?? 1,
    }))
    const n = addItems(entries)
    if (n > 0) showToast(`Build agregada al carrito (${n} productos)`)
  }

  const compatible = build.compatible
  const items = build.items ?? []
  const warnings = build.warnings ?? []

  return (
    <div
      className="flex flex-col"
      style={{
        marginTop: '8px',
        backgroundColor: 'var(--img-bg-2)',
        border: '1px solid rgba(var(--accent-rgb),0.35)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: '10px 14px', backgroundColor: 'var(--hero-2)', borderBottom: '1px solid var(--border)' }}
      >
        <span style={{ color: 'var(--text)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '15px', fontWeight: 700, letterSpacing: '0.3px' }}>
          BUILD RECOMENDADA
        </span>
        <span style={{ color: 'var(--accent-bright)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '16px', fontWeight: 700 }}>
          {formatARS(build.total)}
        </span>
      </div>

      <div className="flex flex-col" style={{ padding: '8px 6px', gap: '4px' }}>
        {items.map((it) => (
          <Link
            key={`${it.productId}-${it.role}`}
            to={`/product/${it.productId}`}
            className="flex items-center no-underline"
            style={{ padding: '6px 10px', borderRadius: '6px', gap: '10px' }}
          >
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '6px',
                backgroundColor: 'var(--elev)', overflow: 'hidden', flexShrink: 0,
                border: '1px solid var(--border)',
              }}
            >
              {it.imageUrl ? (
                <img src={it.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : null}
            </div>
            <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {ROLE_LABEL[it.role] ?? it.role}
              </span>
              <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {(it.quantity ?? 1) > 1 ? `${it.quantity}x ` : ''}{it.brand} {it.productName}
              </span>
            </div>
            <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
              {formatARS(Number(it.unitPrice) * (it.quantity ?? 1))}
            </span>
          </Link>
        ))}
      </div>

      {build.budget != null && (() => {
        const budget = Number(build.budget)
        const total = Number(build.total)
        const delta = total - budget
        const within = build.withinBudget !== false
        const deltaColor = within ? 'var(--success)' : 'var(--warning)'
        const deltaSign = delta > 0 ? '+' : ''
        return (
          <div
            className="flex items-center justify-between"
            style={{
              padding: '8px 14px',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--bg-2)',
              fontFamily: 'Poppins',
              fontSize: '11px',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>
              Presupuesto: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{formatARS(budget)}</span>
            </span>
            <span style={{ color: deltaColor, fontWeight: 700 }}>
              {deltaSign}{formatARS(Math.abs(delta))}
            </span>
          </div>
        )
      })()}

      <div
        className="flex items-center"
        style={{
          padding: '8px 14px',
          gap: '8px',
          backgroundColor: compatible ? 'rgba(var(--success-rgb),0.10)' : 'rgba(var(--warning-rgb),0.10)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {compatible ? <Check size={14} color="var(--success)" /> : <AlertTriangle size={14} color="var(--warning)" />}
        <span style={{ color: compatible ? 'var(--success)' : 'var(--warning)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: 600 }}>
          {compatible ? 'Compatibilidad verificada' : 'Build con advertencias'}
        </span>
      </div>

      {warnings.length > 0 && (
        <ul style={{ margin: 0, padding: '0 16px 8px 28px', color: 'var(--warning)', fontFamily: 'Poppins', fontSize: '11px' }}>
          {warnings.map((w, i) => <li key={i} style={{ marginTop: '4px' }}>{w}</li>)}
        </ul>
      )}

      <button
        onClick={handleAddAll}
        className="flex items-center justify-center border-none cursor-pointer"
        style={{
          margin: '8px 12px 12px',
          padding: '10px 14px',
          backgroundColor: compatible ? 'var(--accent)' : 'var(--border)',
          color: compatible ? 'var(--text-strong)' : 'var(--text-muted)',
          borderRadius: '8px',
          gap: '8px',
          fontFamily: 'Poppins',
          fontSize: '13px',
          fontWeight: 700,
        }}
      >
        <ShoppingCart size={14} />
        Agregar build al carrito
      </button>
    </div>
  )
}

export default BuildCard
