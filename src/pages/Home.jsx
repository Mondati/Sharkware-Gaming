import { useState, useEffect, useRef } from 'react'
import { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard, Fan, Box, CircuitBoard, Plug, Sparkles, ArrowRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { SORT_OPTIONS } from '../data/sortOptions'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { getProducts, getCategories } from '../api/products'
import { formatARS } from '../utils/formatPrice'
import { useAuth } from '../context/AuthContext'
import Skeleton from '../components/Skeleton'

const HomeProductCardSkeleton = ({ mobile = false }) => {
  const imgHeight = mobile ? 160 : 210
  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: mobile ? '10px' : '14px',
        gap: '10px',
        width: '100%',
        minWidth: 0,
      }}
    >
      <Skeleton height={imgHeight} radius={8} />
      <Skeleton height={11} width="40%" />
      <Skeleton height={14} width="85%" />
      <Skeleton height={11} width="65%" />
      <Skeleton height={20} width="55%" />
    </div>
  )
}

const HomeSkeleton = ({ sidePadding, cardFlex }) => (
  <div className="flex flex-col flex-1" style={{ backgroundColor: 'var(--bg)' }}>
    {/* Hero desktop */}
    <div
      className="hidden md:block w-full"
      style={{
        position: 'relative',
        height: '480px',
        padding: `0 ${sidePadding}`,
        background: 'linear-gradient(130deg, var(--hero-3) 0%, var(--hero-2) 40%, var(--bg) 100%)',
      }}
    >
      <div className="flex items-center w-full h-full" style={{ gap: '48px' }}>
        <div className="flex flex-col" style={{ flex: 1, gap: '20px' }}>
          <Skeleton height={22} width={120} radius={5} />
          <Skeleton height={56} width="80%" />
          <Skeleton height={14} width="60%" />
          <Skeleton height={36} width="40%" />
          <div className="flex" style={{ gap: '14px' }}>
            <Skeleton height={48} width={170} radius={8} />
            <Skeleton height={48} width={190} radius={8} />
          </div>
        </div>
        <Skeleton height={380} width={400} radius={20} style={{ flexShrink: 0 }} />
      </div>
    </div>

    {/* Hero mobile */}
    <div
      className="flex md:hidden flex-col w-full"
      style={{ padding: '24px 16px 48px', gap: '12px', background: 'linear-gradient(180deg, var(--hero-3) 0%, var(--bg) 100%)' }}
    >
      <Skeleton height={18} width={100} radius={5} />
      <Skeleton height={36} width="80%" />
      <Skeleton height={12} width="60%" />
      <Skeleton height={24} width="40%" />
      <div className="flex" style={{ gap: '10px' }}>
        <Skeleton height={40} width={110} radius={8} />
        <Skeleton height={40} width={120} radius={8} />
      </div>
    </div>

    {/* Category bar */}
    <div
      className="hidden md:flex w-full"
      style={{ backgroundColor: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: `12px ${sidePadding}`, gap: '12px' }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height={32} width={90} radius={6} />
      ))}
    </div>
    <div className="flex md:hidden w-full" style={{ padding: '12px 16px', gap: '8px', overflow: 'hidden' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height={28} width={70} radius={6} style={{ flexShrink: 0 }} />
      ))}
    </div>

    {/* 3 product sections */}
    {[0, 1, 2].map(section => (
      <div key={section}>
        {/* desktop */}
        <section
          className="hidden md:flex flex-col w-full"
          style={{ padding: `40px ${sidePadding} 0`, gap: '20px' }}
        >
          <Skeleton height={24} width={260} />
          <div className="flex" style={{ gap: '16px', overflow: 'hidden' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ flex: `1 0 ${cardFlex}`, minWidth: cardFlex, maxWidth: cardFlex, display: 'flex' }}>
                <HomeProductCardSkeleton />
              </div>
            ))}
          </div>
        </section>
        {/* mobile */}
        <section
          className="flex md:hidden flex-col w-full"
          style={{ padding: '24px 16px 0', gap: '14px' }}
        >
          <Skeleton height={18} width={200} />
          <div className="grid grid-cols-2" style={{ gap: '10px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <HomeProductCardSkeleton key={i} mobile />
            ))}
          </div>
        </section>
      </div>
    ))}

    <div style={{ height: '48px' }} />
  </div>
)

const ALL_CATEGORY = { id: 'all', label: 'Todo', icon: null }

const ICON_MAP = { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard, Fan, Box, CircuitBoard, Plug }

const BADGE_COLOR = {
  NUEVO:  { bg: 'rgba(var(--accent-bright-rgb),0.13)', text: 'var(--accent-bright)', dot: 'var(--accent-bright)' },
  HOT:    { bg: 'rgba(var(--badge-oferta-rgb),0.13)', text: 'var(--badge-oferta)', dot: 'var(--badge-oferta)' },
  OFERTA: { bg: 'rgba(var(--error-rgb),0.13)', text: 'var(--error)', dot: 'var(--error)' },
}

const notebookFilters = ['Todos', 'i7 / i9', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9']

const NB_FILTER_MAP = {
  'i7 / i9': (p) => p.spec.includes('i7') || p.spec.includes('i9'),
  'Ryzen 5': (p) => p.spec.includes('Ryzen 5'),
  'Ryzen 7': (p) => p.spec.includes('Ryzen 7'),
  'Ryzen 9': (p) => p.spec.includes('Ryzen 9'),
}

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('cat') ?? 'all'
  const [activeNbFilter, setActiveNbFilter] = useState('Todos')
  const [sortOrder, setSortOrder] = useState('relevance')
  const { sidePadding, cardFlex } = useWindowWidth()
  const { user } = useAuth()
  const showBuilderHero = user?.role !== 'admin'

  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const [categories, setCategories] = useState([ALL_CATEGORY])
  const [newProducts, setNewProducts] = useState([])
  const [notebooksList, setNotebooksList] = useState([])
  const [monitorsList, setMonitorsList] = useState([])
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const catalogRef = useRef(null)

  useEffect(() => {
    getCategories()
      .then(cats => setCategories([ALL_CATEGORY, ...cats]))
      .catch(() => setCategories([ALL_CATEGORY]))
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getProducts({ badge: 'NUEVO', size: 8 }).catch(() => ({ items: [] })),
      getProducts({ category: 'notebooks', size: 10 }).catch(() => ({ items: [] })),
      getProducts({ category: 'monitors', size: 10 }).catch(() => ({ items: [] })),
    ]).then(([news, nbs, mons]) => {
      if (cancelled) return
      setNewProducts(news.items ?? [])
      setNotebooksList(nbs.items ?? [])
      setMonitorsList(mons.items ?? [])
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (activeCategory === 'all') return
    let cancelled = false
    const sortParam = sortOrder === 'price_asc' || sortOrder === 'price_desc' ? sortOrder : undefined
    getProducts({ category: activeCategory, sort: sortParam, size: 50 })
      .then(res => { if (!cancelled) setCategoryProducts(res.items ?? []) })
      .catch(() => { if (!cancelled) setCategoryProducts([]) })
    return () => { cancelled = true }
  }, [activeCategory, sortOrder])

  useEffect(() => {
    if (activeCategory === 'all') return
    const id = requestAnimationFrame(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [activeCategory])

  useEffect(() => {
    if (isPaused || newProducts.length === 0) return
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % newProducts.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused, newProducts.length])

  useEffect(() => {
    setActiveSlide(0)
  }, [newProducts.length])

  const sortedFilteredByCategory = activeCategory === 'all' ? null : categoryProducts

  const filteredNotebooks = activeNbFilter === 'Todos'
    ? notebooksList
    : notebooksList.filter(NB_FILTER_MAP[activeNbFilter] ?? (() => true))

  if (loading) return <HomeSkeleton sidePadding={sidePadding} cardFlex={cardFlex} />

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ═══════════════ HERO ═══════════════ */}

      {/* Desktop Hero */}
      <div
        className="hidden md:block w-full"
        style={{ position: 'relative', height: '480px', overflow: 'hidden' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {newProducts.map((p, i) => {
          const badge = p.badge ? BADGE_COLOR[p.badge] : null
          return (
            <div
              key={p.id}
              className="flex items-center w-full"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(130deg, var(--hero-3) 0%, var(--hero-2) 40%, var(--bg) 100%)',
                padding: `0 ${sidePadding}`,
                gap: '48px',
                opacity: i === activeSlide ? 1 : 0,
                transition: 'opacity 0.7s ease',
                pointerEvents: i === activeSlide ? 'auto' : 'none',
              }}
            >
              <div className="flex flex-col flex-1" style={{ gap: '20px' }}>
                {badge && (
                  <div
                    className="flex items-center w-fit"
                    style={{ backgroundColor: badge.bg, borderRadius: '5px', padding: '5px 14px', gap: '8px' }}
                  >
                    <div style={{ backgroundColor: badge.dot, borderRadius: '50%', width: '6px', height: '6px', flexShrink: 0 }} />
                    <span style={{ color: badge.text, fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', letterSpacing: '2px' }}>
                      {p.badge}
                    </span>
                  </div>
                )}
                <h1 style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '68px', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
                  {p.name}
                </h1>
                <p style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '16px', maxWidth: '520px', lineHeight: '1.5', margin: 0 }}>
                  {p.spec}
                </p>
                <div className="flex flex-col" style={{ gap: '4px' }}>
                  <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '12px' }}>Precio desde</span>
                  <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '32px', fontWeight: '800' }}>{formatARS(p.price_ars)}</span>
                </div>
                <div className="flex items-center flex-wrap" style={{ gap: '14px' }}>
                  <Link
                    to={`/product/${p.id}`}
                    className="sw-hero-primary"
                    style={{ borderRadius: '8px', padding: '14px 28px', color: 'var(--on-accent)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    Comprar ahora
                  </Link>
                  <Link
                    to={`/product/${p.id}`}
                    className="sw-hero-secondary"
                    style={{ borderRadius: '8px', padding: '14px 28px', color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    Ver especificaciones
                  </Link>
                </div>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ position: 'relative', backgroundColor: 'var(--surface)', borderRadius: '20px', width: '400px', height: '380px', flexShrink: 0, overflow: 'hidden', padding: '16px' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(var(--accent-bright-rgb),0.12) 0%, transparent 70%)', zIndex: 0 }} />
                <span style={{ color: 'rgba(var(--accent-bright-rgb),0.07)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '36px', fontWeight: '700', position: 'absolute', textAlign: 'center', padding: '0 16px', zIndex: 0 }}>
                  {p.name}
                </span>
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 40px rgba(var(--accent-bright-rgb),0.25))' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            </div>
          )
        })}

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
          {newProducts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveSlide(i)}
              style={{
                width: i === activeSlide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === activeSlide ? 'var(--accent-bright)' : 'var(--surface)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.35s ease, background-color 0.35s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile Hero */}
      <div
        className="flex md:hidden w-full"
        style={{ position: 'relative', height: '290px', overflow: 'hidden' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {newProducts.map((p, i) => {
          const badge = p.badge ? BADGE_COLOR[p.badge] : null
          return (
            <div
              key={p.id}
              className="flex flex-col w-full"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, var(--hero-3) 0%, var(--bg) 100%)',
                padding: '24px 16px 48px',
                gap: '12px',
                opacity: i === activeSlide ? 1 : 0,
                transition: 'opacity 0.7s ease',
                pointerEvents: i === activeSlide ? 'auto' : 'none',
              }}
            >
              {badge && (
                <div
                  className="flex items-center w-fit"
                  style={{ backgroundColor: badge.bg, borderRadius: '5px', padding: '4px 12px', gap: '6px' }}
                >
                  <div style={{ backgroundColor: badge.dot, borderRadius: '50%', width: '5px', height: '5px', flexShrink: 0 }} />
                  <span style={{ color: badge.text, fontFamily: 'Poppins', fontSize: '9px', fontWeight: '600', letterSpacing: '2px' }}>
                    {p.badge}
                  </span>
                </div>
              )}
              <h1 style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '38px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1, margin: 0 }}>
                {p.name}
              </h1>
              <p style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '12px', lineHeight: '1.4', margin: 0 }}>
                {p.spec}
              </p>
              <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>{formatARS(p.price_ars)}</span>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <Link
                  to={`/product/${p.id}`}
                  style={{ backgroundColor: 'var(--accent-bright)', borderRadius: '8px', padding: '10px 22px', color: 'var(--on-accent)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Comprar
                </Link>
                <Link
                  to={`/product/${p.id}`}
                  style={{ backgroundColor: 'var(--surface)', borderRadius: '8px', padding: '10px 18px', color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Ver specs
                </Link>
              </div>
            </div>
          )
        })}

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
          {newProducts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveSlide(i)}
              style={{
                width: i === activeSlide ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: i === activeSlide ? 'var(--accent-bright)' : 'var(--surface)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.35s ease, background-color 0.35s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════ CATEGORY BAR ═══════════════ */}

      {/* Desktop Category Bar */}
      <div className="hidden md:block w-full" style={{ backgroundColor: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: `4px ${sidePadding}` }}>
      <div
        className="flex items-center sw-scroll"
        style={{
          gap: '10px',
          overflowX: 'auto',
          paddingTop: '10px',
          paddingBottom: '10px',
          justifyContent: 'space-between',
        }}
      >
        {categories.map(({ id, label, icon }) => {
          const isActive = activeCategory === id
          const Icon = ICON_MAP[icon] ?? null
          return (
            <button
              key={id}
              onClick={() => id === 'all' ? setSearchParams({}) : setSearchParams({ cat: id })}
              className={isActive ? 'flex items-center border-none cursor-pointer flex-shrink-0' : 'sw-pill flex items-center border-none cursor-pointer flex-shrink-0'}
              style={{
                background: isActive ? 'linear-gradient(135deg, var(--accent-2), var(--accent-bright))' : undefined,
                boxShadow: isActive ? '0 0 14px rgba(var(--accent-bright-rgb),0.45)' : 'none',
                borderRadius: '20px',
                padding: '8px 18px',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              {Icon && <Icon size={14} color={isActive ? 'var(--bg-navbar)' : 'var(--text-muted)'} />}
              <span style={{ color: isActive ? 'var(--bg-navbar)' : 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: isActive ? '700' : '600' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
      </div>

      {/* Mobile Category Bar — horizontal scroll */}
      <div
        className="flex md:hidden w-full overflow-x-auto sw-no-scrollbar"
        style={{
          backgroundColor: 'var(--bg-2)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 16px',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        {categories.map(({ id, label, icon }) => {
          const isActive = activeCategory === id
          const Icon = ICON_MAP[icon] ?? null
          return (
            <button
              key={id}
              onClick={() => id === 'all' ? setSearchParams({}) : setSearchParams({ cat: id })}
              className="flex items-center border-none cursor-pointer flex-shrink-0"
              style={{
                backgroundColor: isActive ? 'var(--accent-bright)' : 'var(--surface)',
                borderRadius: '20px',
                padding: '6px 14px',
                gap: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              {Icon && <Icon size={12} color={isActive ? 'var(--bg-navbar)' : 'var(--text-muted)'} />}
              <span style={{ color: isActive ? 'var(--bg-navbar)' : 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '12px', fontWeight: isActive ? '700' : '600' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {/* ═══════════════ CATÁLOGO — filtrado por categoría o secciones por defecto ═══════════════ */}

      {sortedFilteredByCategory ? (
        <div ref={catalogRef}>
          {/* Desktop — categoría filtrada */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: `40px ${sidePadding}`, gap: '20px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '12px', letterSpacing: '0.5px' }}>
                {categories.find((c) => c.id === activeCategory)?.label}
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  color: 'var(--text-muted)',
                  fontFamily: 'Poppins',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {sortedFilteredByCategory.length === 0 ? (
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
                No hay productos en esta categoría.
              </span>
            ) : (
              <div className="flex sw-scroll" style={{ gap: '10px', justifyContent: 'space-between', overflowX: 'auto', paddingTop: '8px', paddingBottom: '8px' }}>
                {sortedFilteredByCategory.map((p) => (
                  <div key={p.id} style={{ flex: `1 0 ${cardFlex}`, minWidth: cardFlex, maxWidth: cardFlex, display: 'flex' }}>
                    <ProductCard {...p} imgHeight={210} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Mobile — categoría filtrada */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '24px 16px', gap: '14px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '10px', letterSpacing: '0.5px' }}>
                {categories.find((c) => c.id === activeCategory)?.label}
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: 'var(--text-muted)',
                  fontFamily: 'Poppins',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {sortedFilteredByCategory.length === 0 ? (
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
                No hay productos en esta categoría.
              </span>
            ) : (
              <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                {sortedFilteredByCategory.map((p) => (
                  <ProductCard key={p.id} {...p} mobile />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <>
          {/* ── Nuevos Productos ─────────────────────────────────────────── */}

          {/* Desktop */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: `40px ${sidePadding}`, gap: '20px' }}>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '12px', letterSpacing: '0.5px' }}>
              Nuevos Productos
            </span>
            <div className="flex sw-scroll" style={{ gap: '10px', justifyContent: 'space-between', overflowX: 'auto', paddingTop: '8px', paddingBottom: '8px' }}>
              {newProducts.map((p) => (
                <div key={p.id} style={{ flex: `1 0 ${cardFlex}`, minWidth: cardFlex, maxWidth: cardFlex, display: 'flex' }}>
                  <ProductCard {...p} />
                </div>
              ))}
            </div>
          </section>

          {/* Mobile */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '24px 16px', gap: '14px' }}>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '10px', letterSpacing: '0.5px' }}>
              Nuevos Productos
            </span>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {newProducts.map((p) => (
                <ProductCard key={p.id} {...p} mobile />
              ))}
            </div>
          </section>

          {/* ── Builder IA hero ──────────────────────────────────────────── */}
          {showBuilderHero && (
            <section
              className="w-full"
              style={{ padding: `8px ${sidePadding} 40px` }}
            >
              <Link
                to="/builder"
                className="no-underline"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(var(--accent-rgb),0.35)',
                  backgroundColor: 'var(--bg-2)',
                  backgroundImage:
                    'radial-gradient(60% 80% at 90% 50%, rgba(var(--accent-rgb),0.22) 0%, transparent 60%),' +
                    'radial-gradient(40% 80% at 0% 50%, rgba(var(--hero-2-rgb),0.55) 0%, transparent 60%),' +
                    'linear-gradient(rgba(var(--accent-rgb),0.04) 1px, transparent 1px),' +
                    'linear-gradient(90deg, rgba(var(--accent-rgb),0.04) 1px, transparent 1px)',
                  backgroundSize: 'auto, auto, 32px 32px, 32px 32px',
                  boxShadow: '0 0 0 1px rgba(var(--accent-bright-rgb),0.08), 0 12px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      'linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--accent-bright) 50%, var(--accent) 70%, transparent 100%)',
                    opacity: 0.6,
                  }}
                />

                <div
                  className="flex flex-col"
                  style={{
                    flex: 1,
                    padding: '32px 36px',
                    gap: 14,
                    justifyContent: 'center',
                    minWidth: 0,
                  }}
                >
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <Sparkles size={14} color="var(--accent)" />
                    <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>
                      SHARKWARE // PC BUILDER
                    </span>
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: 'Rajdhani, Poppins, sans-serif',
                      color: 'var(--text)',
                      fontSize: 'clamp(28px, 4vw, 44px)',
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ¿No sabés qué comprar?{' '}
                    <span
                      style={{
                        background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-bright) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Armá tu PC con IA.
                    </span>
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: 'var(--text-muted)',
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      lineHeight: 1.55,
                      maxWidth: 540,
                    }}
                  >
                    Decinos tu presupuesto y para qué la vas a usar. Te armamos una build compatible
                    con stock real en menos de 2 minutos.
                  </p>
                  <div className="flex items-center" style={{ gap: 10, marginTop: 4 }}>
                    <span
                      className="flex items-center"
                      style={{
                        gap: 8,
                        padding: '10px 18px',
                        borderRadius: 999,
                        backgroundColor: 'var(--accent)',
                        color: 'var(--text-strong)',
                        fontFamily: 'Poppins',
                        fontSize: 13,
                        fontWeight: 700,
                        boxShadow: '0 0 24px rgba(var(--accent-rgb),0.4)',
                      }}
                    >
                      <Sparkles size={14} /> Probar el asistente
                      <ArrowRight size={14} />
                    </span>
                    <span
                      style={{
                        color: 'var(--success)',
                        fontFamily: 'Poppins',
                        fontSize: 10,
                        backgroundColor: 'rgba(var(--success-rgb),0.10)',
                        border: '1px solid rgba(var(--success-rgb),0.30)',
                        padding: '4px 10px',
                        borderRadius: 4,
                        letterSpacing: 1.5,
                      }}
                    >
                      BETA
                    </span>
                  </div>
                </div>

                <div
                  aria-hidden
                  className="hidden md:flex items-center justify-center"
                  style={{
                    flex: '0 0 280px',
                    position: 'relative',
                    borderLeft: '1px solid rgba(var(--accent-rgb),0.2)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(50% 50% at 50% 50%, rgba(var(--accent-bright-rgb),0.18) 0%, transparent 70%)',
                    }}
                  />
                  <Cpu size={120} color="var(--accent)" strokeWidth={1} style={{ opacity: 0.85, filter: 'drop-shadow(0 0 24px rgba(var(--accent-bright-rgb),0.5))' }} />
                </div>
              </Link>
            </section>
          )}

          {/* ── Notebooks Gamer ──────────────────────────────────────────── */}

          {/* Desktop */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: `0 ${sidePadding} 40px`, gap: '20px' }}>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '12px', letterSpacing: '0.5px' }}>
              Notebooks Gamer
            </span>
            <div className="flex" style={{ gap: '8px' }}>
              {notebookFilters.map((f) => {
                const isActive = activeNbFilter === f
                return (
                  <button
                    key={f}
                    onClick={() => setActiveNbFilter(f)}
                    className="sw-pill border-none cursor-pointer"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-bright)' : undefined,
                      borderRadius: '20px',
                      padding: '6px 16px',
                      color: isActive ? 'var(--bg-navbar)' : 'var(--text-muted)',
                      fontFamily: 'Poppins',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : 'normal',
                    }}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
            {filteredNotebooks.length === 0 ? (
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '14px' }}>
                Sin resultados para este filtro.
              </span>
            ) : (
              <div className="flex sw-scroll" style={{ gap: '10px', justifyContent: 'space-between', overflowX: 'auto', paddingTop: '8px', paddingBottom: '8px' }}>
                {filteredNotebooks.map((p) => (
                  <div key={p.id} style={{ flex: `1 0 ${cardFlex}`, minWidth: cardFlex, maxWidth: cardFlex, display: 'flex' }}>
                    <ProductCard {...p} imgHeight={210} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Mobile */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '0 16px 24px', gap: '14px' }}>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '10px', letterSpacing: '0.5px' }}>
              Notebooks Gamer
            </span>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {filteredNotebooks.map((p) => (
                <ProductCard key={p.id} {...p} mobile />
              ))}
            </div>
          </section>

          {/* ── Monitores Gaming ─────────────────────────────────────────── */}

          {/* Desktop */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: `0 ${sidePadding} 40px`, gap: '20px' }}>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '12px', letterSpacing: '0.5px' }}>
              Monitores Gaming
            </span>
            <div className="flex sw-scroll" style={{ gap: '10px', justifyContent: 'space-between', overflowX: 'auto', paddingTop: '8px', paddingBottom: '8px' }}>
              {monitorsList.map((p) => (
                <div key={p.id} style={{ flex: `1 0 ${cardFlex}`, minWidth: cardFlex, maxWidth: cardFlex, display: 'flex' }}>
                  <ProductCard {...p} imgHeight={210} />
                </div>
              ))}
            </div>
          </section>

          {/* Mobile */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '0 16px 24px', gap: '14px' }}>
            <span style={{ color: 'var(--text-strong)', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', boxShadow: 'inset 3px 0 0 var(--accent-bright)', paddingLeft: '10px', letterSpacing: '0.5px' }}>
              Monitores Gaming
            </span>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {monitorsList.map((p) => (
                <ProductCard key={p.id} {...p} mobile />
              ))}
            </div>
          </section>
        </>
      )}

      <Footer />

    </div>
  )
}

export default Home
