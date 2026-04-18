import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { SORT_OPTIONS } from '../data/sortOptions'
import { searchProducts } from '../utils/search'
import { useWindowWidth } from '../hooks/useWindowWidth'

const SearchResults = () => {
  const location = useLocation()
  const q = new URLSearchParams(location.search).get('q') ?? ''
  const [sortOrder, setSortOrder] = useState('relevance')
  const { sidePadding, cardFlex } = useWindowWidth()

  const results = searchProducts(q, products)
  const sortedResults = [...results].sort((a, b) => {
    if (sortOrder === 'price_asc') return a.price_ars - b.price_ars
    if (sortOrder === 'price_desc') return b.price_ars - a.price_ars
    return 0
  })

  const countLabel = sortedResults.length === 1 ? '1 producto' : `${sortedResults.length} productos`

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#0A0C14' }}>
      <Navbar cartCount={0} />

      {/* ── Desktop header ── */}
      <section
        className="hidden md:flex flex-col w-full"
        style={{ padding: `40px ${sidePadding} 20px` }}
      >
        <div className="flex items-center w-full" style={{ gap: '12px' }}>
          <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700' }}>
              Resultados para &ldquo;{q}&rdquo;
            </span>
            {sortedResults.length > 0 && (
              <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>
                {countLabel}
              </span>
            )}
          </div>
          {sortedResults.length > 0 && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                backgroundColor: '#1E2232',
                border: '1px solid #1B2333',
                borderRadius: '8px',
                padding: '7px 12px',
                color: '#AAB3C5',
                fontFamily: 'Inter',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* ── Mobile header ── */}
      <section
        className="flex md:hidden flex-col w-full"
        style={{ padding: '24px 16px 12px' }}
      >
        <div className="flex items-center w-full" style={{ gap: '10px' }}>
          <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>
              &ldquo;{q}&rdquo;
            </span>
            {sortedResults.length > 0 && (
              <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px' }}>
                {countLabel}
              </span>
            )}
          </div>
          {sortedResults.length > 0 && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                backgroundColor: '#1E2232',
                border: '1px solid #1B2333',
                borderRadius: '8px',
                padding: '6px 10px',
                color: '#AAB3C5',
                fontFamily: 'Inter',
                fontSize: '12px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      </section>

      {sortedResults.length === 0 ? (
        /* ── Empty state ── */
        <div
          className="flex flex-col items-center justify-center flex-1"
          style={{ gap: '16px', padding: '80px 16px' }}
        >
          <SearchX size={52} color="#454E64" />
          <div className="flex flex-col items-center" style={{ gap: '8px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>
              No se encontraron productos
            </span>
            <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '14px' }}>
              Probá con otros términos de búsqueda
            </span>
          </div>
          <Link
            to="/"
            style={{
              backgroundColor: '#00C8FF',
              color: '#060810',
              fontFamily: 'Inter',
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
        </div>
      ) : (
        <>
          {/* ── Desktop grid ── */}
          <div
            className="hidden md:flex sw-scroll"
            style={{ gap: '16px', padding: `0 ${sidePadding} 48px`, overflowX: 'auto', paddingBottom: '8px' }}
          >
            {sortedResults.map((p) => (
              <div key={p.id} style={{ flex: `1 0 ${cardFlex}`, minWidth: cardFlex, maxWidth: cardFlex, display: 'flex' }}>
                <ProductCard {...p} imgHeight={210} />
              </div>
            ))}
          </div>

          {/* ── Mobile grid ── */}
          <div
            className="grid grid-cols-2 md:hidden"
            style={{ gap: '10px', padding: '0 16px 32px' }}
          >
            {sortedResults.map((p) => (
              <ProductCard key={p.id} {...p} mobile />
            ))}
          </div>
        </>
      )}

      <div className="flex-1" />
      <Footer />
    </div>
  )
}

export default SearchResults
