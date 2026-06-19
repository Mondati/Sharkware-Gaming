import { useState, memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard, Fan, Box, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatARS } from '../utils/formatPrice'

const CATEGORY_ICON = {
  notebooks: Laptop,
  cpu: Cpu,
  gpu: Zap,
  ram: MemoryStick,
  monitors: Monitor,
  storage: HardDrive,
  peripherals: Keyboard,
  coolers: Fan,
  gabinetes: Box,
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
          backgroundColor: 'var(--img-bg)',
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
        backgroundColor: 'var(--elev)',
        borderRadius: '10px',
        height: `${height}px`,
        gap: '8px',
        padding: '12px',
        border: '1px solid rgba(var(--overlay-rgb),0.06)',
      }}
    >
      {Icon && <Icon size={24} color="var(--accent)" style={{ opacity: 0.5 }} />}
      <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
        {brand}
      </span>
      <span style={{ color: 'var(--text-muted)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', textAlign: 'center', lineHeight: '1.3' }}>
        {name}
      </span>
    </div>
  )
}

const StockDot = ({ stock }) => (
  <div className="flex items-center flex-wrap" style={{ gap: '6px' }}>
    <div className="flex items-center" style={{ gap: '5px' }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: stock > 0 ? 'var(--success)' : 'var(--error)',
        flexShrink: 0,
      }} />
      <span style={{ color: stock > 0 ? 'var(--success)' : 'var(--error)', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>
        {stock > 0 ? 'En stock' : 'Sin stock'}
      </span>
    </div>
    {stock > 0 && stock <= 3 && (
      <span style={{ backgroundColor: 'rgba(var(--warning-rgb), 0.15)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '10px', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600', whiteSpace: 'nowrap' }}>
        Pocas unidades
      </span>
    )}
  </div>
)

const BADGE_COLORS = { NUEVO: 'var(--success)', HOT: 'var(--badge-hot)', OFERTA: 'var(--badge-oferta)' }

const ProductCard = ({
  id, brand, name, spec, price_ars, image_url,
  imgHeight = 210, mobile = false, badge = null,
  stock = 1, category_id = null,
}) => {
  const price = formatARS(price_ars)
  const [hovered, setHovered] = useState(false)
  const [cartHovered, setCartHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const timerRef = useRef(null)
  const { addItem, items } = useCart()

  const inCart = items.find(i => i.id === id)?.quantity ?? 0
  const maxAddable = Math.max(0, stock - inCart)
  const disabled = maxAddable === 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled || added) return
    addItem({ id, brand, name, spec, price_ars, image_url, stock }, 1)
    setAdded(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAdded(false), 1500)
  }

  if (mobile) {
    return (
      <Link
        to={`/product/${id}`}
        className="flex flex-col no-underline"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: 'var(--surface-2)',
          borderRadius: '12px',
          padding: '12px',
          gap: '8px',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${hovered ? 'rgba(var(--accent-bright-rgb),0.3)' : 'rgba(var(--overlay-rgb),0.06)'}`,
          boxShadow: hovered ? '0 8px 32px rgba(var(--accent-bright-rgb),0.2), 0 0 0 1px rgba(var(--accent-bright-rgb),0.15)' : 'none',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          filter: hovered ? 'brightness(1.03)' : 'brightness(1)',
          transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ProductImage image_url={image_url} brand={brand} name={name} height={160} category_id={category_id} />
          <button
            onClick={handleAddToCart}
            onMouseEnter={() => setCartHovered(true)}
            onMouseLeave={() => setCartHovered(false)}
            disabled={disabled}
            title={disabled && stock > 0 ? 'Máximo agregado' : undefined}
            style={{
              position: 'absolute',
              bottom: '6px',
              right: '6px',
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: added ? 'var(--success)' : 'var(--accent-bright)',
              boxShadow: cartHovered && !added ? '0 4px 16px rgba(var(--accent-bright-rgb),0.5)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
              opacity: disabled ? 0.4 : 1,
            }}
          >
            {added
              ? <Check size={13} color="var(--on-status)" />
              : <ShoppingCart size={13} color="var(--on-accent)" />
            }
          </button>
        </div>

        {badge && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: BADGE_COLORS[badge] ?? 'var(--surface)',
              borderRadius: '4px',
              padding: '3px 8px',
            }}
          >
            <span style={{ color: 'var(--on-status)', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '700', letterSpacing: '0.5px' }}>
              {badge}
            </span>
          </div>
        )}

        <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '600', letterSpacing: '1px' }}>
          {brand}
        </span>

        <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700', lineHeight: '1.3' }}>
          {name}
        </span>

        <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.3', flex: 1 }}>
          {spec}
        </span>

        <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
          {price}
        </span>

        <StockDot stock={stock} />
      </Link>
    )
  }

  return (
    <Link
      to={`/product/${id}`}
      className="flex flex-col no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--surface-2)',
        borderRadius: '12px',
        padding: '14px',
        gap: '10px',
        flex: 1,
        height: '100%',
        position: 'relative',
        border: `1px solid ${hovered ? 'rgba(var(--accent-bright-rgb),0.3)' : 'rgba(var(--overlay-rgb),0.06)'}`,
        boxShadow: hovered ? '0 8px 32px rgba(var(--accent-bright-rgb),0.2), 0 0 0 1px rgba(var(--accent-bright-rgb),0.15)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        filter: hovered ? 'brightness(1.03)' : 'brightness(1)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
        cursor: 'pointer',
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
              backgroundColor: BADGE_COLORS[badge] ?? 'var(--surface)',
              borderRadius: '4px',
              padding: '3px 8px',
            }}
          >
            <span style={{ color: 'var(--on-status)', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '700', letterSpacing: '0.5px' }}>
              {badge}
            </span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          onMouseEnter={() => setCartHovered(true)}
          onMouseLeave={() => setCartHovered(false)}
          disabled={disabled}
          title={disabled && stock > 0 ? 'Máximo agregado' : undefined}
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: added ? 'var(--success)' : 'var(--accent-bright)',
            boxShadow: cartHovered && !added ? '0 4px 16px rgba(var(--accent-bright-rgb),0.5)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          {added
            ? <Check size={15} color="var(--on-status)" />
            : <ShoppingCart size={15} color="var(--on-accent)" />
          }
        </button>
      </div>

      <span style={{ color: 'var(--accent)', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600', letterSpacing: '1px' }}>
        {brand}
      </span>

      <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
        {name}
      </span>

      <span style={{ color: 'var(--text-subtle)', fontFamily: 'Poppins', fontSize: '12px', flex: 1 }}>
        {spec}
      </span>

      <span style={{ color: 'var(--text-strong)', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
        {price}
      </span>

      <StockDot stock={stock} />
    </Link>
  )
}

export default memo(ProductCard)
