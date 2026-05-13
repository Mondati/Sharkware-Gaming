import { useState, useEffect, useRef } from 'react'
import { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { SORT_OPTIONS } from '../data/sortOptions'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { getProducts, getCategories } from '../api/products'
import { formatARS } from '../utils/formatPrice'

const ALL_CATEGORY = { id: 'all', label: 'Todo', icon: null }

const ICON_MAP = { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard }

const BADGE_COLOR = {
  NUEVO:  { bg: '#00C8FF22', text: '#00C8FF', dot: '#00C8FF' },
  HOT:    { bg: '#FF840022', text: '#FF8400', dot: '#FF8400' },
  OFERTA: { bg: '#EF444422', text: '#EF4444', dot: '#EF4444' },
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

  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const [categories, setCategories] = useState([ALL_CATEGORY])
  const [newProducts, setNewProducts] = useState([])
  const [notebooksList, setNotebooksList] = useState([])
  const [monitorsList, setMonitorsList] = useState([])
  const [categoryProducts, setCategoryProducts] = useState([])
  const catalogRef = useRef(null)

  useEffect(() => {
    getCategories()
      .then(cats => setCategories([ALL_CATEGORY, ...cats]))
      .catch(() => setCategories([ALL_CATEGORY]))
  }, [])

  useEffect(() => {
    if (activeCategory !== 'all') return
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
    })
    return () => { cancelled = true }
  }, [activeCategory])

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

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#0A0C14' }}>

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
                background: 'linear-gradient(130deg, #071530 0%, #0D1A40 40%, #0A0C14 100%)',
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
                <h1 style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '68px', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
                  {p.name}
                </h1>
                <p style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '16px', maxWidth: '520px', lineHeight: '1.5', margin: 0 }}>
                  {p.spec}
                </p>
                <div className="flex flex-col" style={{ gap: '4px' }}>
                  <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '12px' }}>Precio desde</span>
                  <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '32px', fontWeight: '800' }}>{formatARS(p.price_ars)}</span>
                </div>
                <div className="flex items-center flex-wrap" style={{ gap: '14px' }}>
                  <Link
                    to={`/product/${p.id}`}
                    className="sw-hero-primary"
                    style={{ borderRadius: '8px', padding: '14px 28px', color: '#060810', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    Comprar ahora
                  </Link>
                  <Link
                    to={`/product/${p.id}`}
                    className="sw-hero-secondary"
                    style={{ borderRadius: '8px', padding: '14px 28px', color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    Ver especificaciones
                  </Link>
                </div>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ position: 'relative', backgroundColor: '#1E2232', borderRadius: '20px', width: '400px', height: '380px', flexShrink: 0, overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,200,255,0.12) 0%, transparent 70%)', zIndex: 0 }} />
                <span style={{ color: '#00C8FF12', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '36px', fontWeight: '700', position: 'absolute', textAlign: 'center', padding: '0 16px', zIndex: 0 }}>
                  {p.name}
                </span>
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 40px rgba(0,200,255,0.25))' }}
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
                backgroundColor: i === activeSlide ? '#00C8FF' : '#1E2232',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
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
                background: 'linear-gradient(180deg, #071530 0%, #0A0C14 100%)',
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
              <h1 style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '38px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1, margin: 0 }}>
                {p.name}
              </h1>
              <p style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '12px', lineHeight: '1.4', margin: 0 }}>
                {p.spec}
              </p>
              <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '22px', fontWeight: '800' }}>{formatARS(p.price_ars)}</span>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <Link
                  to={`/product/${p.id}`}
                  style={{ backgroundColor: '#00C8FF', borderRadius: '8px', padding: '10px 22px', color: '#060810', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Comprar
                </Link>
                <Link
                  to={`/product/${p.id}`}
                  style={{ backgroundColor: '#1E2232', borderRadius: '8px', padding: '10px 18px', color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}
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
                backgroundColor: i === activeSlide ? '#00C8FF' : '#1E2232',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════ CATEGORY BAR ═══════════════ */}

      {/* Desktop Category Bar */}
      <div className="hidden md:block w-full" style={{ position: 'relative', backgroundColor: '#070B16', borderBottom: '1px solid #1B2333' }}>
      <div
        className="flex items-center w-full"
        style={{
          height: '76px',
          padding: `14px ${sidePadding}`,
          gap: '10px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
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
                background: isActive ? 'linear-gradient(135deg, #1A9FFF, #00C8FF)' : undefined,
                boxShadow: isActive ? '0 0 14px rgba(0,200,255,0.45)' : 'none',
                borderRadius: '20px',
                padding: '8px 18px',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              {Icon && <Icon size={14} color={isActive ? '#060810' : '#AAB3C5'} />}
              <span style={{ color: isActive ? '#060810' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: isActive ? '700' : '600' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '48px', background: 'linear-gradient(to right, transparent, #070B16)', pointerEvents: 'none' }} />
      </div>

      {/* Mobile Category Bar — horizontal scroll */}
      <div
        className="flex md:hidden w-full overflow-x-auto"
        style={{
          backgroundColor: '#070B16',
          borderBottom: '1px solid #1B2333',
          padding: '10px 16px',
          gap: '8px',
          flexShrink: 0,
          scrollbarWidth: 'none',
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
                backgroundColor: isActive ? '#00C8FF' : '#1E2232',
                borderRadius: '20px',
                padding: '6px 14px',
                gap: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              {Icon && <Icon size={12} color={isActive ? '#060810' : '#AAB3C5'} />}
              <span style={{ color: isActive ? '#060810' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: isActive ? '700' : '600' }}>
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
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '12px', letterSpacing: '0.5px' }}>
                {categories.find((c) => c.id === activeCategory)?.label}
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  backgroundColor: '#1E2232',
                  border: '1px solid #1B2333',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  color: '#AAB3C5',
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
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
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
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '10px', letterSpacing: '0.5px' }}>
                {categories.find((c) => c.id === activeCategory)?.label}
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  backgroundColor: '#1E2232',
                  border: '1px solid #1B2333',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: '#AAB3C5',
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
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
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
            <span style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '12px', letterSpacing: '0.5px' }}>
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
            <span style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '10px', letterSpacing: '0.5px' }}>
              Nuevos Productos
            </span>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {newProducts.map((p) => (
                <ProductCard key={p.id} {...p} mobile />
              ))}
            </div>
          </section>

          {/* ── Notebooks Gamer ──────────────────────────────────────────── */}

          {/* Desktop */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: `0 ${sidePadding} 40px`, gap: '20px' }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '12px', letterSpacing: '0.5px' }}>
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
                      backgroundColor: isActive ? '#00C8FF' : undefined,
                      borderRadius: '20px',
                      padding: '6px 16px',
                      color: isActive ? '#060810' : '#AAB3C5',
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
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
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
            <span style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '10px', letterSpacing: '0.5px' }}>
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
            <span style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '26px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '12px', letterSpacing: '0.5px' }}>
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
            <span style={{ color: '#FFFFFF', fontFamily: 'Rajdhani, Poppins, sans-serif', fontSize: '20px', fontWeight: '700', borderLeft: '3px solid #00C8FF', paddingLeft: '10px', letterSpacing: '0.5px' }}>
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
