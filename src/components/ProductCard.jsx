import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard } from 'lucide-react'

const CATEGORY_ICON = {
  notebooks: Laptop,
  cpu: Cpu,
  gpu: Zap,
  ram: MemoryStick,
  monitors: Monitor,
  storage: HardDrive,
  peripherals: Keyboard,
}

const ProductImage = ({ image_url, brand, name, height, category_id }) => {
  const [imgError, setImgError] = useState(false)
  const Icon = CATEGORY_ICON[category_id] ?? null

  if (image_url && !imgError) {
    return (
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#080A12',
          borderRadius: '10px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={image_url}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '8px',
            display: 'block',
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#0E1424',
        borderRadius: '10px',
        height: `${height}px`,
        gap: '8px',
        padding: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {Icon && <Icon size={24} color="#24A8F5" style={{ opacity: 0.5 }} />}
      <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '2px' }}>
        {brand}
      </span>
      <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600', textAlign: 'center', lineHeight: '1.3' }}>
        {name}
      </span>
    </div>
  )
}

const StockDot = ({ stock }) => (
  <div className="flex items-center" style={{ gap: '5px' }}>
    <div style={{
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: stock > 0 ? '#22C55E' : '#EF4444',
      flexShrink: 0,
    }} />
    <span style={{ color: stock > 0 ? '#22C55E' : '#EF4444', fontFamily: 'Inter', fontSize: '10px', fontWeight: '600' }}>
      {stock > 0 ? 'En stock' : 'Sin stock'}
    </span>
  </div>
)

const badgeColor = (badge) => {
  if (badge === 'NUEVO') return '#22C55E'
  if (badge === 'HOT' || badge === 'OFERTA') return '#EF4444'
  return '#1E2232'
}

const ProductCard = ({
  id, brand, name, spec, price, image_url,
  imgHeight = 210, mobile = false, badge = null,
  stock = 1, category_id = null,
}) => {
  const [hovered, setHovered] = useState(false)
  const [ctaHovered, setCtaHovered] = useState(false)

  if (mobile) {
    return (
      <div
        className="flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: '#121420',
          borderRadius: '12px',
          padding: '12px',
          gap: '8px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.2s ease',
        }}
      >
        <ProductImage image_url={image_url} brand={brand} name={name} height={160} category_id={category_id} />

        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: badgeColor(badge),
              borderRadius: '4px',
              padding: '3px 8px',
            }}
          >
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.5px' }}>
              {badge}
            </span>
          </div>
        )}

        <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '600', letterSpacing: '1px' }}>
          {brand}
        </span>

        <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', lineHeight: '1.3' }}>
          {name}
        </span>

        <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '11px', lineHeight: '1.3' }}>
          {spec}
        </span>

        <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
          {price}
        </span>

        <StockDot stock={stock} />

        <Link
          to={`/product/${id}`}
          className="no-underline"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          style={{
            backgroundColor: ctaHovered ? '#00B8EF' : '#00C8FF',
            borderRadius: '7px',
            padding: '8px 0',
            color: '#060810',
            fontFamily: 'Inter',
            fontSize: '12px',
            fontWeight: '700',
            textAlign: 'center',
            display: 'block',
            transition: 'background-color 0.15s ease',
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#121420',
        borderRadius: '12px',
        padding: '14px',
        gap: '10px',
        flex: 1,
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div style={{ position: 'relative' }}>
        <ProductImage image_url={image_url} brand={brand} name={name} height={imgHeight} category_id={category_id} />
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: badgeColor(badge),
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

      <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '600', letterSpacing: '1px' }}>
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

      <StockDot stock={stock} />

      <Link
        to={`/product/${id}`}
        className="no-underline"
        onMouseEnter={() => setCtaHovered(true)}
        onMouseLeave={() => setCtaHovered(false)}
        style={{
          backgroundColor: ctaHovered ? '#00B8EF' : '#00C8FF',
          borderRadius: '7px',
          padding: '9px 0',
          color: '#060810',
          fontFamily: 'Inter',
          fontSize: '13px',
          fontWeight: '700',
          textAlign: 'center',
          display: 'block',
          transition: 'background-color 0.15s ease',
        }}
      >
        Ver detalle
      </Link>
    </div>
  )
}

export default ProductCard
