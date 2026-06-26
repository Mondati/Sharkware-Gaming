import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownUp, RefreshCw, Bitcoin } from 'lucide-react'
import { getRates } from '../api/crypto'

const CURRENCIES = ['ARS', 'BTC', 'ETH', 'USDT']

const rateKey = { BTC: 'btcArs', ETH: 'ethArs', USDT: 'usdtArs' }

const EthMark = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 256 417" aria-hidden style={{ display: 'inline-block', verticalAlign: '-2px' }}>
    <path fill={color} d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" opacity="0.85" />
    <path fill={color} d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
    <path fill={color} d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" opacity="0.85" />
    <path fill={color} d="M127.962 416.905v-104.72L0 236.585z" />
    <path fill={color} d="M127.961 287.958l127.96-75.637-127.96-58.162z" opacity="0.5" />
    <path fill={color} d="M0 212.32l127.96 75.638v-133.8z" opacity="0.7" />
  </svg>
)

const renderGlyph = (currency) => {
  if (currency === 'ETH') return <EthMark size={11} />
  return { ARS: '$', BTC: '₿', USDT: '₮' }[currency]
}

const toArs = (amount, from, rates) => {
  if (from === 'ARS') return amount
  return amount * Number(rates[rateKey[from]])
}

const fromArs = (arsAmount, to, rates) => {
  if (to === 'ARS') return arsAmount
  return arsAmount / Number(rates[rateKey[to]])
}

const formatNumber = (value, currency) => {
  if (!Number.isFinite(value)) return '—'
  if (currency === 'ARS') {
    return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(value)
  }
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 8,
    minimumFractionDigits: 2,
  }).format(value)
}

const MONO = 'Poppins, sans-serif'
const DISPLAY = 'Poppins, sans-serif'

const CryptoConverter = () => {
  const [rates, setRates] = useState(null)
  const [loadedAt, setLoadedAt] = useState(null)
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('BTC')
  const [to, setTo] = useState('ARS')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [tick, setTick] = useState(0)
  const tickRef = useRef(null)

  const loadRates = useCallback(async () => {
    setLoading(true)
    setErr(null)
    try {
      const data = await getRates()
      setRates(data)
      setLoadedAt(new Date())
    } catch (e) {
      setErr(e?.message || 'No se pudieron cargar las cotizaciones')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRates()
    const id = setInterval(loadRates, 60_000)
    return () => clearInterval(id)
  }, [loadRates])

  useEffect(() => {
    tickRef.current = setInterval(() => setTick((v) => v + 1), 1000)
    return () => clearInterval(tickRef.current)
  }, [])

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  const parsedAmount = useMemo(() => {
    const n = Number(String(amount).replace(',', '.'))
    return Number.isFinite(n) && n >= 0 ? n : NaN
  }, [amount])

  const converted = useMemo(() => {
    if (!rates || !Number.isFinite(parsedAmount)) return NaN
    if (from === to) return parsedAmount
    return fromArs(toArs(parsedAmount, from, rates), to, rates)
  }, [rates, parsedAmount, from, to])

  const updatedAgo = useMemo(() => {
    if (!loadedAt) return null
    const secs = Math.max(0, Math.floor((Date.now() - loadedAt.getTime()) / 1000))
    if (secs < 60) return `${secs}s`
    return `${Math.floor(secs / 60)}m`
  }, [loadedAt, tick])

  const renderPanel = (kind, currency, setCurrency, value, valueIsInput) => {
    const labelText = kind === 'from' ? 'ENVÍAS' : 'RECIBÍS'
    return (
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, var(--hero-1) 0%, var(--bg-navbar) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '20px 22px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            opacity: kind === 'from' ? 0.7 : 0.4,
          }}
        />
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <span
            style={{
              color: 'var(--text-subtle)',
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: 3,
              fontWeight: 500,
            }}
          >
            // {labelText}
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: 'var(--accent)',
              backgroundColor: 'rgba(var(--accent-rgb),0.08)',
              border: '1px solid rgba(var(--accent-rgb),0.25)',
              padding: '2px 8px',
              borderRadius: 4,
              letterSpacing: 1,
            }}
          >
            {renderGlyph(currency)} {currency}
          </span>
        </div>

        <div className="flex items-baseline" style={{ gap: 10, minHeight: 56 }}>
          {valueIsInput ? (
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: 44,
                lineHeight: 1,
                width: '100%',
                minWidth: 0,
                letterSpacing: '-0.02em',
              }}
            />
          ) : (
            <span
              style={{
                color: Number.isFinite(value) ? 'var(--text)' : 'var(--text-faint)',
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: 44,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                wordBreak: 'break-all',
                textShadow: Number.isFinite(value) ? '0 0 24px rgba(var(--accent-rgb),0.25)' : 'none',
              }}
            >
              {Number.isFinite(value) ? formatNumber(value, currency) : '0.00'}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: 16, gap: 12 }}>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              background: 'var(--elev)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 10px',
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {currency !== 'ARS' && rates && (
            <span style={{ color: 'var(--text-subtle)', fontFamily: MONO, fontSize: 11 }}>
              1 {currency} ≈ {new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(Number(rates[rateKey[currency]]))} ARS
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        background: 'radial-gradient(120% 80% at 0% 0%, rgba(var(--accent-rgb),0.10) 0%, transparent 55%), linear-gradient(160deg, var(--elev) 0%, var(--bg-2) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: 28,
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(var(--accent-rgb),0.04)',
      }}
    >
      {/* corner ticks */}
      {['tl', 'tr', 'bl', 'br'].map((corner) => {
        const pos = {
          tl: { top: 10, left: 10, borderTop: '1px solid var(--accent)', borderLeft: '1px solid var(--accent)' },
          tr: { top: 10, right: 10, borderTop: '1px solid var(--accent)', borderRight: '1px solid var(--accent)' },
          bl: { bottom: 10, left: 10, borderBottom: '1px solid var(--accent)', borderLeft: '1px solid var(--accent)' },
          br: { bottom: 10, right: 10, borderBottom: '1px solid var(--accent)', borderRight: '1px solid var(--accent)' },
        }[corner]
        return <span key={corner} aria-hidden style={{ position: 'absolute', width: 12, height: 12, opacity: 0.5, ...pos }} />
      })}

      {/* header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 22, gap: 12, flexWrap: 'wrap' }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: err ? 'var(--error)' : 'var(--success)',
              boxShadow: err ? '0 0 12px var(--error)' : '0 0 12px var(--success)',
              animation: 'cv-pulse 1.6s ease-in-out infinite',
            }}
          />
          <span style={{ color: 'var(--text)', fontFamily: MONO, fontSize: 11, letterSpacing: 2, fontWeight: 500 }}>
            {err ? 'CONEXIÓN INTERRUMPIDA' : 'MERCADO EN VIVO'}
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 10 }}>
          {updatedAgo && !err && (
            <span style={{ color: 'var(--text-subtle)', fontFamily: MONO, fontSize: 11 }}>
              actualizado · {loading ? 'sync...' : `${updatedAgo} atrás`}
            </span>
          )}
          <button
            type="button"
            onClick={loadRates}
            disabled={loading}
            aria-label="Actualizar cotizaciones"
            className="flex items-center justify-center cursor-pointer"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 999,
              width: 34,
              height: 34,
              color: 'var(--accent)',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'cv-spin 0.8s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {err && !rates ? (
        <div
          style={{
            border: '1px dashed var(--error)',
            borderRadius: 10,
            padding: 24,
            textAlign: 'center',
            background: 'rgba(var(--error-rgb),0.05)',
          }}
        >
          <p style={{ color: 'var(--text)', fontFamily: MONO, fontSize: 13, margin: 0, marginBottom: 14 }}>
            No se pudieron cargar las cotizaciones.
          </p>
          <button
            type="button"
            onClick={loadRates}
            className="cursor-pointer"
            style={{
              background: 'var(--error)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 22px',
              color: 'var(--text-strong)',
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            REINTENTAR
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {renderPanel('from', from, setFrom, parsedAmount, true)}

          {/* swap orb */}
          <div
            className="flex items-center justify-center"
            style={{ position: 'relative', height: 0, zIndex: 2 }}
          >
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Invertir monedas"
              className="flex items-center justify-center cursor-pointer"
              style={{
                position: 'absolute',
                top: -22,
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(140deg, var(--accent) 0%, var(--accent-2) 100%)',
                border: '3px solid var(--elev)',
                color: 'var(--on-accent)',
                boxShadow: '0 0 0 1px rgba(var(--accent-rgb),0.5), 0 0 24px rgba(var(--accent-rgb),calc(0.45 * var(--glow-strength)))',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(180deg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg)' }}
            >
              <ArrowDownUp size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            {renderPanel('to', to, setTo, converted, false)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cv-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes cv-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}

export default CryptoConverter
