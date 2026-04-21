import { ChevronLeft, ChevronRight } from 'lucide-react'

const buildPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set([1, totalPages, currentPage])
  if (currentPage > 1) pages.add(currentPage - 1)
  if (currentPage < totalPages) pages.add(currentPage + 1)
  const sorted = [...pages].sort((a, b) => a - b)
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
    border: '1px solid #1B2333',
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
          backgroundColor: '#1E2232',
          color: currentPage === 1 ? '#454E64' : '#AAB3C5',
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
            key={`ellipsis-${i}`}
            style={{ color: '#454E64', fontFamily: 'Poppins', fontSize: '14px', padding: '0 4px' }}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPage(item)}
            style={{
              ...btnBase,
              backgroundColor: item === currentPage ? '#24A8F5' : '#1E2232',
              color: item === currentPage ? '#060810' : '#AAB3C5',
              border: item === currentPage ? '1px solid #24A8F5' : '1px solid #1B2333',
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
          backgroundColor: '#1E2232',
          color: currentPage === totalPages ? '#454E64' : '#AAB3C5',
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
