import { useEffect, useState } from 'react'
import { Activity, TrendingUp, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../hooks/useWindowWidth'
import Footer from '../components/Footer'
import CryptoConverter from '../components/CryptoConverter'
import { getRates } from '../api/crypto'

const MONO = 'Poppins, sans-serif'
const DISPLAY = 'Poppins, sans-serif'
const HERO = '"Rajdhani", "Poppins", sans-serif'

const EthMark = ({ size = 28, color = 'var(--accent)' }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 256 417" aria-hidden style={{ display: 'block' }}>
    <path fill={color} d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" opacity="0.85" />
    <path fill={color} d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
    <path fill={color} d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" opacity="0.85" />
    <path fill={color} d="M127.962 416.905v-104.72L0 236.585z" />
    <path fill={color} d="M127.961 287.958l127.96-75.637-127.96-58.162z" opacity="0.5" />
    <path fill={color} d="M0 212.32l127.96 75.638v-133.8z" opacity="0.7" />
  </svg>
)

const COINS = [
  { code: 'BTC',  name: 'Bitcoin',  key: 'btcArs',  glyph: '₿' },
  { code: 'ETH',  name: 'Ethereum', key: 'ethArs',  glyph: <EthMark /> },
  { code: 'USDT', name: 'Tether',   key: 'usdtArs', glyph: '₮' },
]

const formatArs = (v) =>
  Number.isFinite(v)
    ? new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v)
    : '———'

const Sparkline = () => {
  // decorativa, no real
  return (
    <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,28 L20,22 L40,30 L60,18 L80,24 L100,12 L120,20 L140,8 L160,16 L180,6 L200,14 L200,40 L0,40 Z"
        fill="url(#spark)"
      />
      <path
        d="M0,28 L20,22 L40,30 L60,18 L80,24 L100,12 L120,20 L140,8 L160,16 L180,6 L200,14"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

const RateCard = ({ coin, value }) => (
  <div
    style={{
      position: 'relative',
      flex: 1,
      minWidth: 220,
      background: 'linear-gradient(180deg, rgba(var(--accent-rgb),0.06) 0%, rgba(var(--accent-rgb),0) 70%), var(--elev)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 22px',
      overflow: 'hidden',
    }}
  >
    <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
      <span style={{ color: 'var(--text-subtle)', fontFamily: MONO, fontSize: 10, letterSpacing: 2 }}>
        {coin.name.toUpperCase()}
      </span>
      <span
        style={{
          color: 'var(--success)',
          fontFamily: MONO,
          fontSize: 10,
          backgroundColor: 'rgba(var(--success-rgb),0.10)',
          border: '1px solid rgba(var(--success-rgb),0.30)',
          padding: '2px 6px',
          borderRadius: 4,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <TrendingUp size={10} /> LIVE
      </span>
    </div>
    <div className="flex items-baseline" style={{ gap: 8, marginBottom: 8 }}>
      <span style={{ color: 'var(--accent)', fontFamily: DISPLAY, fontSize: 28, fontWeight: 700 }}>
        {coin.glyph}
      </span>
      <span style={{ color: 'var(--text)', fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>
        {coin.code}/ARS
      </span>
    </div>
    <div style={{ marginBottom: 10 }}>
      <span style={{ color: 'var(--text)', fontFamily: MONO, fontSize: 18, fontWeight: 500 }}>
        $ {formatArs(value)}
      </span>
    </div>
    <Sparkline />
  </div>
)

const CryptoPage = () => {
  const { sidePadding } = useWindowWidth()
  const [rates, setRates] = useState(null)

  useEffect(() => {
    let alive = true
    const load = () => getRates().then((r) => { if (alive) setRates(r) }).catch(() => {})
    load()
    const id = setInterval(load, 60_000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-2)' }}>

      {/* Mobile header */}
      <div
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: 'var(--hero-1)', height: '56px', padding: '0 16px', gap: '10px' }}
      >
        <Activity size={18} color="var(--accent)" />
        <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
          Cripto
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
          Cripto
        </span>
      </div>

      <main className="flex flex-col flex-1 w-full">

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          padding: `56px ${sidePadding} 40px`,
          backgroundColor: 'var(--bg-2)',
          backgroundImage:
            'radial-gradient(60% 50% at 80% 0%, rgba(var(--accent-rgb),calc(0.18 * var(--glow-strength))) 0%, transparent 60%),' +
            'radial-gradient(40% 40% at 0% 100%, rgba(var(--hero-2-rgb),0.6) 0%, transparent 60%),' +
            'linear-gradient(rgba(var(--accent-rgb),0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(var(--accent-rgb),0.04) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* deco strip */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--accent-bright) 50%, var(--accent) 70%, transparent 100%)',
            opacity: 0.6,
          }}
        />

        <div className="flex items-center" style={{ gap: 10, marginBottom: 24 }}>
          <Activity size={14} color="var(--accent)" />
          <span style={{ color: 'var(--accent)', fontFamily: MONO, fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>
            SHARKWARE // CRYPTO TERMINAL
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(var(--accent-rgb),0.15)' }} />
          <span style={{ color: 'var(--text-subtle)', fontFamily: MONO, fontSize: 10, letterSpacing: 2 }}>
            v1.0 · COINGECKO
          </span>
        </div>

        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 16,
            marginBottom: 36,
          }}
        >
          <h1
            style={{
              fontFamily: HERO,
              color: 'var(--text)',
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            Convertí cripto
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-bright) 50%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 24px rgba(var(--accent-rgb),0.4))',
              }}
            >
              a peso
            </span>{' '}
            <span style={{ color: 'var(--text-faint)' }}>/</span>{' '}
            <span style={{ color: 'var(--text-muted)' }}>al instante.</span>
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'Poppins',
              fontSize: 15,
              maxWidth: 560,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Cotizaciones en vivo de BTC, ETH y USDT contra el peso argentino — alimentadas por
            CoinGecko y actualizadas cada minuto. Comprá hardware sabiendo cuánto vale tu cripto, sin pestañas extra.
          </p>
        </div>

        {/* ticker row */}
        <div
          className="flex"
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          {COINS.map((c) => (
            <RateCard key={c.code} coin={c} value={rates ? Number(rates[c.key]) : NaN} />
          ))}
        </div>
      </section>

      {/* CONVERTER */}
      <section
        style={{
          padding: `60px ${sidePadding} 80px`,
          background:
            'radial-gradient(50% 60% at 50% 0%, rgba(var(--accent-rgb),0.06) 0%, transparent 60%), var(--bg-2)',
        }}
      >
        <div className="flex items-center" style={{ gap: 14, marginBottom: 24, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          <span
            style={{
              color: 'var(--accent)',
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 3,
              fontWeight: 500,
            }}
          >
            [ 01 ] CONVERSOR
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(var(--accent-rgb),0.15)' }} />
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <CryptoConverter />
        </div>

        <p
          style={{
            color: 'var(--text-faint)',
            fontFamily: MONO,
            fontSize: 10,
            textAlign: 'center',
            marginTop: 28,
            letterSpacing: 1.5,
          }}
        >
          // las cotizaciones son referenciales · no constituyen recomendación financiera
        </p>
      </section>

      </main>

      <Footer />
    </div>
  )
}

export default CryptoPage
