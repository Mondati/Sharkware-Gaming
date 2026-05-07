import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import FilterPanel from '../components/FilterPanel'
import Pagination from '../components/Pagination'
import { SORT_OPTIONS } from '../data/sortOptions'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { getProducts, getFacets, getCategories } from '../api/products'

const LIMIT = 12
const FILTER_DEFAULTS = { category: 'all', brand: '', minPrice: '', maxPrice: '', sort: 'relevance' }

const EmptyState = ({ isMobile, hasActiveFilters, onClear }) => (
  <div
    className="flex flex-col items-center justify-center"
    style={{ gap: '16px', padding: isMobile ? '60px 0' : '80px 0' }}
  >
    <SearchX size={isMobile ? 44 : 52} color="#454E64" />
    <div className="flex flex-col items-center" style={{ gap: '8px' }}>
      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: isMobile ? '16px' : '18px', fontWeight: '700', textAlign: 'center' }}>
        {hasActiveFilters
          ? 'No se encontraron productos con los filtros seleccionados'
          : 'No se encontraron productos'}
      </span>
      <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: isMobile ? '13px' : '14px', textAlign: 'center' }}>
        {hasActiveFilters
          ? 'Probá cambiando o eliminando los filtros'
          : 'Probá con otros términos de búsqueda'}
      </span>
    </div>
    {hasActiveFilters ? (
      <button
        onClick={onClear}
        style={{
          backgroundColor: '#00C8FF',
          color: '#060810',
          fontFamily: 'Poppins',
          fontSize: '14px',
          fontWeight: '700',
          borderRadius: '8px',
          padding: '12px 24px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Limpiar filtros
      </button>
    ) : (
      <Link
        to="/"
        style={{
          backgroundColor: '#00C8FF',
          color: '#060810',
          fontFamily: 'Poppins',
          fontSize: '14px',
          fontWeight: '700',
          borderRadius: '8px',
          padding: '12px 24px',
          textDecoration: 'none',
          marginTop: '8px',
        }}
      >
        Ver catálogo
      </Link>
    )}
  </div>
)

const SortSelect = ({ isMobile, sortOrder, onChange }) => (
  <select
    value={sortOrder}
    onChange={e => onChange('sort', e.target.value)}
    style={{
      backgroundColor: '#1E2232',
      border: '1px solid #1B2333',
      borderRadius: '8px',
      padding: isMobile ? '6px 10px' : '7px 12px',
      color: '#AAB3C5',
      fontFamily: 'Poppins',
      fontSize: isMobile ? '12px' : '13px',
      cursor: 'pointer',
    }}
  >
    {SORT_OPTIONS.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
)

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q          = searchParams.get('q') ?? ''
  const catParam   = searchParams.get('category') ?? 'all'
  const brandParam = searchParams.get('brand') ?? ''
  const minParam   = searchParams.get('minPrice') ?? ''
  const maxParam   = searchParams.get('maxPrice') ?? ''
  const sortOrder  = searchParams.get('sort') ?? 'relevance'
  const { sidePadding, cardFlex } = useWindowWidth()

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === '' || value === FILTER_DEFAULTS[key]) next.delete(key)
    else next.set(key, value)
    next.delete('page')
    setSearchParams(next)
  }

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams)
    ;['category', 'brand', 'minPrice', 'maxPrice'].forEach(k => next.delete(k))
    next.delete('page')
    setSearchParams(next)
  }

  const min = minParam !== '' ? Number(minParam) : null
  const max = maxParam !== '' ? Number(maxParam) : null
  const priceValid = min === null || max === null || min <= max

  const rawPage = Number(searchParams.get('page'))
  const parsedPage = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1

  // ── Server-side data ──────────────────────────────────────────
  const [paginated, setPaginated] = useState([])
  const [total, setTotal] = useState(0)
  const [serverTotalPages, setServerTotalPages] = useState(1)
  const [availableBrands, setAvailableBrands] = useState([])
  const [catalogMin, setCatalogMin] = useState(null)
  const [catalogMax, setCatalogMax] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!priceValid) return
    let cancelled = false
    const sortParam = sortOrder === 'price_asc' || sortOrder === 'price_desc' ? sortOrder : undefined
    getProducts({
      q,
      category: catParam === 'all' ? undefined : catParam,
      brand: brandParam || undefined,
      minPrice: minParam || undefined,
      maxPrice: maxParam || undefined,
      sort: sortParam,
      page: parsedPage - 1,
      size: LIMIT,
    })
      .then(res => {
        if (cancelled) return
        setPaginated(res.items ?? [])
        setTotal(res.total ?? 0)
        setServerTotalPages(Math.max(1, res.totalPages ?? 1))
      })
      .catch(() => {
        if (cancelled) return
        setPaginated([])
        setTotal(0)
        setServerTotalPages(1)
      })
    return () => { cancelled = true }
  }, [q, catParam, brandParam, minParam, maxParam, sortOrder, parsedPage, priceValid])

  useEffect(() => {
    let cancelled = false
    getFacets({ q, category: catParam === 'all' ? undefined : catParam })
      .then(facets => {
        if (cancelled) return
        setAvailableBrands(facets?.brands ?? [])
        setCatalogMin(facets?.priceMin ?? null)
        setCatalogMax(facets?.priceMax ?? null)
      })
      .catch(() => {
        if (cancelled) return
        setAvailableBrands([])
        setCatalogMin(null)
        setCatalogMax(null)
      })
    return () => { cancelled = true }
  }, [q, catParam])

  const totalPages = serverTotalPages
  const currentPage = Math.min(parsedPage, totalPages)
  const start = (currentPage - 1) * LIMIT
  const end = currentPage * LIMIT

  // Normaliza la URL si page estaba fuera de rango (ej: page=999 con 2 páginas → page=2)
  useEffect(() => {
    if (parsedPage !== currentPage) {
      const next = new URLSearchParams(searchParams)
      if (currentPage === 1) next.delete('page')
      else next.set('page', String(currentPage))
      setSearchParams(next, { replace: true })
    }
  }, [parsedPage, currentPage])

  const goToPage = (n) => {
    const next = new URLSearchParams(searchParams)
    if (n === 1) next.delete('page')
    else next.set('page', String(n))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const from = total === 0 ? 0 : start + 1
  const to = Math.min(end, total)
  const countLabel = total === 0
    ? 'Sin resultados'
    : totalPages > 1
      ? `Mostrando ${from}–${to} de ${total} productos`
      : total === 1 ? '1 producto' : `${total} productos`

  const hasActiveFilters = catParam !== 'all' || !!brandParam || !!minParam || !!maxParam
  const sortedLength = total

  // ── Active chips ──────────────────────────────────────────────
  const activeChips = []
  if (catParam !== 'all') {
    const cat = categories.find(c => c.id === catParam)
    activeChips.push({ key: 'category', label: cat?.label ?? catParam })
  }
  if (brandParam) activeChips.push({ key: 'brand', label: brandParam })
  if (minParam)   activeChips.push({ key: 'minPrice', label: `Desde $${Number(minParam).toLocaleString('es-AR')}` })
  if (maxParam)   activeChips.push({ key: 'maxPrice', label: `Hasta $${Number(maxParam).toLocaleString('es-AR')}` })

  const chips = hasActiveFilters && (
    <div className="flex flex-wrap items-center" style={{ gap: '8px' }}>
      {activeChips.map(chip => (
        <button
          key={chip.key}
          onClick={() => updateFilter(chip.key, '')}
          style={{
            backgroundColor: '#1E2232',
            border: '1px solid #1B2333',
            borderRadius: '20px',
            padding: '4px 12px',
            color: '#AAB3C5',
            fontFamily: 'Poppins',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {chip.label}
          <span style={{ color: '#EF4444', fontSize: '14px', lineHeight: 1 }}>×</span>
        </button>
      ))}
      <button
        onClick={clearFilters}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#24A8F5',
          fontFamily: 'Poppins',
          fontSize: '12px',
          cursor: 'pointer',
          padding: '4px 6px',
        }}
      >
        Limpiar todo
      </button>
    </div>
  )

  const filterPanelProps = {
    availableBrands,
    catalogMin,
    catalogMax,
    catParam,
    brandParam,
    minParam,
    maxParam,
    hasActiveFilters,
    onFilterChange: updateFilter,
    onClearFilters: clearFilters,
    categories,
  }

  const showPagination = sortedLength > 0 && totalPages > 1

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#0A0C14' }}>

      {/* ── Desktop header ── */}
      <section
        className="hidden md:flex flex-col w-full"
        style={{ padding: `40px ${sidePadding} 20px` }}
      >
        <div className="flex items-center w-full" style={{ gap: '12px' }}>
          <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '700' }}>
              {q ? <>Resultados para &ldquo;{q}&rdquo;</> : 'Todos los productos'}
            </span>
            <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '13px' }}>
              {countLabel}
            </span>
          </div>
          <SortSelect isMobile={false} sortOrder={sortOrder} onChange={updateFilter} />
        </div>
      </section>

      {/* ── Mobile header ── */}
      <section
        className="flex md:hidden flex-col w-full"
        style={{ padding: '24px 16px 12px' }}
      >
        <div className="flex items-center w-full" style={{ gap: '10px' }}>
          <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '700' }}>
              {q ? <>&ldquo;{q}&rdquo;</> : 'Todos los productos'}
            </span>
            <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {countLabel}
            </span>
          </div>
          <SortSelect isMobile sortOrder={sortOrder} onChange={updateFilter} />
        </div>
      </section>

      {/* ── Desktop: sidebar + content ── */}
      <div
        className="hidden md:flex flex-1"
        style={{ padding: `0 ${sidePadding} 48px`, gap: '24px', alignItems: 'flex-start' }}
      >
        <FilterPanel {...filterPanelProps} />
        <div className="flex flex-col flex-1" style={{ minWidth: 0, gap: '16px' }}>
          {chips}
          {sortedLength === 0
            ? <EmptyState isMobile={false} hasActiveFilters={hasActiveFilters} onClear={clearFilters} />
            : (
              <>
                <div
                  className="flex sw-scroll"
                  style={{ gap: '16px', overflowX: 'auto', paddingTop: '8px', paddingBottom: '8px' }}
                >
                  {paginated.map(p => (
                    <div key={p.id} style={{ flex: `1 0 ${cardFlex}`, minWidth: cardFlex, maxWidth: cardFlex, display: 'flex' }}>
                      <ProductCard {...p} imgHeight={210} />
                    </div>
                  ))}
                </div>
                {showPagination && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPage={goToPage}
                    isMobile={false}
                  />
                )}
              </>
            )
          }
        </div>
      </div>

      {/* ── Mobile: stack ── */}
      <div
        className="flex flex-col md:hidden flex-1"
        style={{ padding: '0 16px 32px', gap: '12px' }}
      >
        <FilterPanel {...filterPanelProps} />
        {chips}
        {sortedLength === 0
          ? <EmptyState isMobile hasActiveFilters={hasActiveFilters} onClear={clearFilters} />
          : (
            <>
              <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                {paginated.map(p => (
                  <ProductCard key={p.id} {...p} mobile />
                ))}
              </div>
              {showPagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPage={goToPage}
                  isMobile
                />
              )}
            </>
          )
        }
      </div>

      <Footer />
    </div>
  )
}

export default SearchResults
