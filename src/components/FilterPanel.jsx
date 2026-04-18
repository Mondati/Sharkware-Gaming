import { useState, useEffect } from 'react'
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { categories } from '../data/categories'

const filterCategories = categories.filter(c => c.id !== 'all')

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
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [localMin, setLocalMin] = useState(minParam)
  const [localMax, setLocalMax] = useState(maxParam)

  useEffect(() => { setLocalMin(minParam) }, [minParam])
  useEffect(() => { setLocalMax(maxParam) }, [maxParam])

  const priceRangeInvalid =
    localMin !== '' && localMax !== '' && Number(localMin) > Number(localMax)

  const applyPrice = () => {
    if (!priceRangeInvalid) {
      onFilterChange('minPrice', localMin)
      onFilterChange('maxPrice', localMax)
    }
  }

  const activeFilterCount = [
    catParam !== 'all' && catParam,
    brandParam,
    minParam,
    maxParam,
  ].filter(Boolean).length

  const inputBorder = priceRangeInvalid ? '1px solid #EF4444' : '1px solid #1B2333'
  const noProducts = catalogMin === null

  const panelContent = (
    <div className="flex flex-col" style={{ gap: '20px' }}>

      {/* Categoría */}
      <div className="flex flex-col" style={{ gap: '8px' }}>
        <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Categoría
        </span>
        <div className="flex flex-col" style={{ gap: '2px' }}>
          {filterCategories.map(cat => {
            const isActive = catParam === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange('category', isActive ? 'all' : cat.id)}
                style={{
                  backgroundColor: isActive ? '#0E1424' : 'transparent',
                  border: `1px solid ${isActive ? '#24A8F5' : 'transparent'}`,
                  borderRadius: '6px',
                  padding: '7px 10px',
                  color: isActive ? '#24A8F5' : '#AAB3C5',
                  fontFamily: 'Inter',
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
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Marca
          </span>
          <div className="flex flex-col" style={{ gap: '2px' }}>
            {availableBrands.map(brand => {
              const isActive = brandParam === brand
              return (
                <button
                  key={brand}
                  onClick={() => onFilterChange('brand', isActive ? '' : brand)}
                  style={{
                    backgroundColor: isActive ? '#0E1424' : 'transparent',
                    border: `1px solid ${isActive ? '#24A8F5' : 'transparent'}`,
                    borderRadius: '6px',
                    padding: '7px 10px',
                    color: isActive ? '#24A8F5' : '#AAB3C5',
                    fontFamily: 'Inter',
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
      <div className="flex flex-col" style={{ gap: '8px' }}>
        <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Precio (ARS)
        </span>
        <div className="flex flex-col" style={{ gap: '6px' }}>
          <input
            type="number"
            value={localMin}
            onChange={e => setLocalMin(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={e => e.key === 'Enter' && applyPrice()}
            disabled={noProducts}
            placeholder={catalogMin !== null ? `Mín. ${catalogMin.toLocaleString('es-AR')}` : 'Mínimo'}
            style={{
              backgroundColor: '#0A0C14',
              border: inputBorder,
              borderRadius: '6px',
              padding: '7px 10px',
              color: '#F5F7FA',
              fontFamily: 'Inter',
              fontSize: '13px',
              outline: 'none',
              width: '100%',
              opacity: noProducts ? 0.4 : 1,
            }}
          />
          <input
            type="number"
            value={localMax}
            onChange={e => setLocalMax(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={e => e.key === 'Enter' && applyPrice()}
            disabled={noProducts}
            placeholder={catalogMax !== null ? `Máx. ${catalogMax.toLocaleString('es-AR')}` : 'Máximo'}
            style={{
              backgroundColor: '#0A0C14',
              border: inputBorder,
              borderRadius: '6px',
              padding: '7px 10px',
              color: '#F5F7FA',
              fontFamily: 'Inter',
              fontSize: '13px',
              outline: 'none',
              width: '100%',
              opacity: noProducts ? 0.4 : 1,
            }}
          />
          {priceRangeInvalid && (
            <span style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '11px' }}>
              El mínimo no puede superar el máximo
            </span>
          )}
        </div>
      </div>

      {/* Limpiar */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #1B2333',
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#EF4444',
            fontFamily: 'Inter',
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
          backgroundColor: '#0E1424',
          border: '1px solid #1B2333',
          borderRadius: '12px',
          padding: '20px 16px',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '80px',
        }}
      >
        <div className="flex items-center" style={{ gap: '8px', marginBottom: '20px' }}>
          <SlidersHorizontal size={15} color="#AAB3C5" />
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>
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
            backgroundColor: '#0E1424',
            border: '1px solid #1B2333',
            borderRadius: mobileOpen ? '12px 12px 0 0' : '12px',
            padding: '12px 16px',
            color: '#F5F7FA',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <SlidersHorizontal size={15} color="#AAB3C5" />
          <span style={{ flex: 1, textAlign: 'left' }}>Filtros</span>
          {activeFilterCount > 0 && (
            <span style={{
              backgroundColor: '#24A8F5',
              color: '#060810',
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
            ? <ChevronUp size={16} color="#8890A4" />
            : <ChevronDown size={16} color="#8890A4" />
          }
        </button>
        {mobileOpen && (
          <div style={{
            backgroundColor: '#0E1424',
            border: '1px solid #1B2333',
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
