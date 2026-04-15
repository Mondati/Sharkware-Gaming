import { Link } from 'react-router-dom'

const ProductCard = ({ id, brand, name, spec, price, imgHeight = 140, mobile = false, badge = null }) => {
  if (mobile) {
    return (
      <div
        className="flex flex-col"
        style={{
          backgroundColor: '#121420',
          borderRadius: '14px',
          padding: '12px',
          gap: '10px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Image placeholder */}
        <div style={{ backgroundColor: '#1E2232', borderRadius: '10px', height: '120px' }} />

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: badge === 'HOT' ? '#EF4444' : badge === 'NUEVO' ? '#22C55E' : badge === 'OFERTA' ? '#EF4444' : '#1E2232',
              borderRadius: '4px',
              padding: '3px 8px',
            }}
          >
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.5px' }}>
              {badge}
            </span>
          </div>
        )}

        <span style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '9px', fontWeight: '600', letterSpacing: '1px' }}>
          {brand}
        </span>

        <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', lineHeight: '1.3' }}>
          {name}
        </span>

        <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
          {price}
        </span>

        <Link
          to={`/product/${id}`}
          className="no-underline"
          style={{
            backgroundColor: '#00C8FF',
            borderRadius: '7px',
            padding: '8px 0',
            color: '#060810',
            fontFamily: 'Inter',
            fontSize: '12px',
            fontWeight: '700',
            textAlign: 'center',
            display: 'block',
          }}
        >
          Agregar
        </Link>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: '#121420', borderRadius: '14px', padding: '14px', gap: '12px', flex: 1 }}
    >
      {/* Image placeholder */}
      <div style={{ backgroundColor: '#1E2232', borderRadius: '10px', height: `${imgHeight}px`, position: 'relative', overflow: 'hidden' }}>
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: badge === 'HOT' ? '#EF4444' : badge === 'NUEVO' ? '#22C55E' : badge === 'OFERTA' ? '#EF4444' : '#1E2232',
              borderRadius: '4px',
              padding: '3px 8px',
            }}
          >
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.5px' }}>
              {badge}
            </span>
          </div>
        )}
      </div>

      <span style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>
        {brand}
      </span>

      <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
        {name}
      </span>

      <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px' }}>
        {spec}
      </span>

      <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
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
        Agregar al carrito
      </Link>
    </div>
  )
}

export default ProductCard
