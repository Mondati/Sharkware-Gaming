import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'

const EMPTY_CATEGORIES = []

const PriceRangeInputs = ({ catalogMin, catalogMax, minParam, maxParam, onApply, noProducts }) => {
  const [localMin, setLocalMin] = useState(minParam)
  const [localMax, setLocalMax] = useState(maxParam)

  const priceRangeInvalid =
    localMin !== '' && localMax !== '' && Number(localMin) > Number(localMax)
  const inputBorder = priceRangeInvalid ? '1px solid var(--error)' : '1px solid var(--border)'

  const apply = () => {
    if (!priceRangeInvalid) onApply(localMin, localMax)
  }

  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <input
        type="number"
        value={localMin}
        onChange={e => setLocalMin(e.target.value)}
        onBlur={apply}
        onKeyDown={e => e.key === 'Enter' && apply()}
        disabled={noProducts}
        placeholder={catalogMin !== null ? `Mín. ${catalogMin.toLocaleString('es-AR')}` : 'Mínimo'}
        style={{
          backgroundColor: 'var(--bg)',
          border: inputBorder,
          borderRadius: '6px',
          padding: '7px 10px',
          color: 'var(--text)',
          fontFamily: 'Poppins',
          fontSize: '13px',
          width: '100%',
          opacity: noProducts ? 0.4 : 1,
        }}
      />
      <input
        type="number"
        value={localMax}
        onChange={e => setLocalMax(e.target.value)}
        onBlur={apply}
        onKeyDown={e => e.key === 'Enter' && apply()}
        disabled={noProducts}
        placeholder={catalogMax !== null ? `Máx. ${catalogMax.toLocaleString('es-AR')}` : 'Máximo'}
        style={{
          backgroundColor: 'var(--bg)',
          border: inputBorder,
          borderRadius: '6px',
          padding: '7px 10px',
          color: 'var(--text)',
          fontFamily: 'Poppins',
          fontSize: '13px',
          width: '100%',
          opacity: noProducts ? 0.4 : 1,
        }}
      />
      {priceRangeInvalid && (
        <span style={{ color: 'var(--error)', fontFamily: 'Poppins', fontSize: '11px' }}>
          El mínimo no puede superar el máximo
        </span>
      )}
    </div>
  )
}

const FilterPanel = ({
  availableBrands,
  catalogMin,
  catalogMax,
  catParam,
  brandParam,
  minParam,
  maxParam,
  hasActiveFilters,
  onFilterChange,
  onClearFilters,
  categories = EMPTY_CATEGORIES,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredFilter, setHoveredFilter] = useState(null)
  const noProducts = catalogMin === null
  const filterCategories = categories.filter(c => c.id !== 'all')

  const activeFilterCount = [
    catParam !== 'all' && catParam,
    brandParam,
    minParam,
    maxParam,
  ].filter(Boolean).length

  const panelContent = (
    <div className="flex flex-col" style={{ gap: '20px' }}>

      {/* Categoría */}
      <div className="flex flex-col" style={{ gap: '8px' }}>
        <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Categoría
        </span>
        <div className="flex flex-col" style={{ gap: '2px' }}>
          {filterCategories.map(cat => {
            const isActive = catParam === cat.id
            const isHovered = hoveredFilter === `cat-${cat.id}`
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange('category', isActive ? 'all' : cat.id)}
                onMouseEnter={() => setHoveredFilter(`cat-${cat.id}`)}
                onMouseLeave={() => setHoveredFilter(null)}
                style={{
                  backgroundColor: isActive ? 'var(--elev)' : (isHovered ? 'var(--bg)' : 'transparent'),
                  border: `1px solid ${isActive ? 'var(--accent)' : (isHovered ? 'rgba(var(--accent-rgb),0.2)' : 'transparent')}`,
                  borderRadius: '6px',
                  padding: '7px 10px',
                  color: isActive ? 'var(--accent)' : (isHovered ? 'var(--text)' : 'var(--text-muted)'),
                  fontFamily: 'Poppins',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Marca */}
      {availableBrands.length > 0 && (
        <div className="flex flex-col" style={{ gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Marca
          </span>
          <div className="flex flex-col" style={{ gap: '2px' }}>
            {availableBrands.map(brand => {
              const isActive = brandParam === brand
              const isHovered = hoveredFilter === `brand-${brand}`
              return (
                <button
                  key={brand}
                  onClick={() => onFilterChange('brand', isActive ? '' : brand)}
                  onMouseEnter={() => setHoveredFilter(`brand-${brand}`)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  style={{
                    backgroundColor: isActive ? 'var(--elev)' : (isHovered ? 'var(--bg)' : 'transparent'),
                    border: `1px solid ${isActive ? 'var(--accent)' : (isHovered ? 'rgba(var(--accent-rgb),0.2)' : 'transparent')}`,
                    borderRadius: '6px',
                    padding: '7px 10px',
                    color: isActive ? 'var(--accent)' : (isHovered ? 'var(--text)' : 'var(--text-muted)'),
                    fontFamily: 'Poppins',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {brand}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Precio */}
      <div className="flex flex-col" style={{ gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Precio (ARS)
        </span>
        <PriceRangeInputs
          key={`${minParam}-${maxParam}`}
          catalogMin={catalogMin}
          catalogMax={catalogMax}
          minParam={minParam}
          maxParam={maxParam}
          noProducts={noProducts}
          onApply={(min, max) => {
            onFilterChange('minPrice', min)
            onFilterChange('maxPrice', max)
          }}
        />
      </div>

      {/* Limpiar */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          onMouseEnter={() => setHoveredFilter('clear')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${hoveredFilter === 'clear' ? 'var(--error)' : 'var(--border)'}`,
            borderRadius: '6px',
            padding: '8px 12px',
            color: hoveredFilter === 'clear' ? 'var(--error-light)' : 'var(--error)',
            fontFamily: 'Poppins',
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex flex-col"
        style={{
          width: '220px',
          minWidth: '220px',
          backgroundColor: 'var(--elev)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px 16px',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '80px',
        }}
      >
        <div className="flex items-center" style={{ gap: '8px', marginBottom: '20px' }}>
          <SlidersHorizontal size={15} color="var(--text-muted)" />
          <span style={{ color: 'var(--text)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
            Filtros
          </span>
        </div>
        {panelContent}
      </div>

      {/* Mobile collapsible */}
      <div className="flex md:hidden flex-col">
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{
            backgroundColor: 'var(--elev)',
            border: '1px solid var(--border)',
            borderRadius: mobileOpen ? '12px 12px 0 0' : '12px',
            padding: '12px 16px',
            color: 'var(--text)',
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <SlidersHorizontal size={15} color="var(--text-muted)" />
          <span style={{ flex: 1, textAlign: 'left' }}>Filtros</span>
          {activeFilterCount > 0 && (
            <span style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--on-accent)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {activeFilterCount}
            </span>
          )}
          {mobileOpen
            ? <ChevronUp size={16} color="var(--text-subtle)" />
            : <ChevronDown size={16} color="var(--text-subtle)" />
          }
        </button>
        {mobileOpen && (
          <div style={{
            backgroundColor: 'var(--elev)',
            border: '1px solid var(--border)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '16px',
          }}>
            {panelContent}
          </div>
        )}
      </div>
    </>
  )
}

export default FilterPanel
