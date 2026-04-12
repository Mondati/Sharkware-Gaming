import { Link } from 'react-router-dom'

const ProductCard = ({ id, brand, name, spec, price, imgHeight = 140 }) => {
  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: '#121420', borderRadius: '14px', padding: '14px', gap: '12px', flex: 1 }}
    >
      {/* Image placeholder */}
      <div style={{ backgroundColor: '#1E2232', borderRadius: '10px', height: `${imgHeight}px` }} />

      <span style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>
        {brand}
      </span>

      <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
        {name}
      </span>

      <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px' }}>
        {spec}
      </span>

      <span style={{ color: '#FF8400', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
        {price}
      </span>

      <Link
        to={`/product/${id}`}
        className="no-underline"
        style={{
          backgroundColor: '#00C8FF',
          borderRadius: '7px',
          padding: '9px 0',
          color: '#060810',
          fontFamily: 'Inter',
          fontSize: '13px',
          fontWeight: '700',
          textAlign: 'center',
          display: 'block',
        }}
      >
        Ver producto
      </Link>
    </div>
  )
}

export default ProductCard
