import { ChevronLeft, ChevronRight } from 'lucide-react'

const buildPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set([1, totalPages, currentPage])
  if (currentPage > 1) pages.add(currentPage - 1)
  if (currentPage < totalPages) pages.add(currentPage + 1)
  const sorted = Array.from(pages).toSorted((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

const Pagination = ({ currentPage, totalPages, onPage, isMobile }) => {
  const items = buildPageItems(currentPage, totalPages)
  const btnBase = {
    fontFamily: 'Poppins',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: isMobile ? '32px' : '36px',
    height: isMobile ? '32px' : '36px',
    padding: '0 8px',
  }
  return (
    <div className="flex items-center justify-center" style={{ gap: '6px', paddingTop: '8px' }}>
      <button
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...btnBase,
          backgroundColor: 'var(--surface)',
          color: currentPage === 1 ? 'var(--text-faint)' : 'var(--text-muted)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          gap: '4px',
          padding: '0 10px',
        }}
      >
        <ChevronLeft size={14} />
        {!isMobile && <span>Anterior</span>}
      </button>

      {items.map((item, i) =>
        item === '...' ? (
          <span
            key={`sep-after-${items[i - 1]}`}
            style={{ color: 'var(--text-faint)', fontFamily: 'Poppins', fontSize: '14px', padding: '0 4px' }}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPage(item)}
            style={{
              ...btnBase,
              backgroundColor: item === currentPage ? 'var(--accent)' : 'var(--surface)',
              color: item === currentPage ? 'var(--bg-navbar)' : 'var(--text-muted)',
              border: item === currentPage ? '1px solid var(--accent)' : '1px solid var(--border)',
            }}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...btnBase,
          backgroundColor: 'var(--surface)',
          color: currentPage === totalPages ? 'var(--text-faint)' : 'var(--text-muted)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          gap: '4px',
          padding: '0 10px',
        }}
      >
        {!isMobile && <span>Siguiente</span>}
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

export default Pagination
