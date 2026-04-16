import { useState } from 'react'
import { Link } from 'react-router-dom'

const ProductImage = ({ image_url, brand, name, height }) => {
  const [imgError, setImgError] = useState(false)

  if (image_url && !imgError) {
    return (
      <img
        src={image_url}
        alt={name}
        onError={() => setImgError(true)}
        style={{
          width: '100%',
          height: `${height}px`,
          objectFit: 'cover',
          borderRadius: '10px',
          display: 'block',
        }}
      />
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#1E2232',
        borderRadius: '10px',
        height: `${height}px`,
        gap: '6px',
        padding: '12px',
      }}
    >
      <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '2px' }}>
        {brand}
      </span>
      <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px', fontWeight: '600', textAlign: 'center', lineHeight: '1.3' }}>
        {name}
      </span>
    </div>
  )
}

const ProductCard = ({ id, brand, name, spec, price, image_url, imgHeight = 140, mobile = false, badge = null }) => {
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
        <ProductImage image_url={image_url} brand={brand} name={name} height={120} />

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
          Ver detalle
        </Link>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: '#121420', borderRadius: '14px', padding: '14px', gap: '12px', flex: 1, position: 'relative' }}
    >
      <div style={{ position: 'relative' }}>
        <ProductImage image_url={image_url} brand={brand} name={name} height={imgHeight} />
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
        Ver detalle
      </Link>
    </div>
  )
}

export default ProductCard
