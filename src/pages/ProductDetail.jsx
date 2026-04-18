import { useState } from 'react'
import {
  Cpu, Monitor, MemoryStick, HardDrive,
  Star, Heart, Share2, ShoppingCart,
  ChevronRight, ChevronDown, ArrowLeft, Truck,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TrustBadges from '../components/TrustBadges'
import { products } from '../data/products'
import { useWindowWidth } from '../hooks/useWindowWidth'

const tabs = ['Descripción', 'Especificaciones', 'Reseñas (127)']

const ImgOrPlaceholder = ({ src, brand, name, style }) => {
  const [err, setErr] = useState(false)
  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setErr(true)}
        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px', display: 'block' }}
      />
    )
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-full" style={{ gap: '8px', ...style }}>
      <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', letterSpacing: '2px' }}>
        {brand}
      </span>
      <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600', textAlign: 'center', lineHeight: '1.3', padding: '0 16px' }}>
        {name}
      </span>
    </div>
  )
}

const ProductDetail = () => {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  const [activeTab, setActiveTab] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [descOpen, setDescOpen] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)
  const { sidePadding } = useWindowWidth()

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>
        <Navbar />
        <div className="flex flex-col flex-1 items-center justify-center" style={{ gap: '16px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700' }}>
            Producto no encontrado
          </span>
          <Link to="/" style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '14px' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const displayGallery = product.gallery?.length > 0 ? product.gallery : [product.image_url]

  const quickSpecs = [
    { icon: Cpu,         label: 'PROCESADOR',    value: product.specs?.cpu     ?? product.specs?.chipset },
    { icon: Monitor,     label: 'GPU',            value: product.specs?.gpu     ?? product.specs?.panel },
    { icon: MemoryStick, label: 'RAM / VRAM',     value: product.specs?.ram     ?? product.specs?.vram },
    { icon: HardDrive,   label: 'ALMACENAMIENTO', value: product.specs?.storage ?? product.specs?.resolution },
  ].filter((s) => s.value)

  const detailSpecs = Object.entries(product.specs ?? {}).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* ═══ MOBILE HEADER ═══ */}
      <div
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px', gap: '12px' }}
      >
        <Link to="/" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '15px', fontWeight: '600' }}>
          Detalle del Producto
        </span>
        <button
          className="flex items-center justify-center border-none cursor-pointer"
          style={{ width: '36px', height: '36px', backgroundColor: '#1E2232', borderRadius: '8px' }}
        >
          <Heart size={18} color="#AAB3C5" />
        </button>
        <button
          className="flex items-center justify-center border-none cursor-pointer"
          style={{ width: '36px', height: '36px', backgroundColor: '#1E2232', borderRadius: '8px' }}
        >
          <Share2 size={18} color="#AAB3C5" />
        </button>
      </div>

      {/* ═══ DESKTOP NAVBAR ═══ */}
      <Navbar />

      {/* ═══ MOBILE IMAGE ═══ */}
      <div
        className="md:hidden relative"
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return
          const diff = touchStartX - e.changedTouches[0].clientX
          if (Math.abs(diff) < 40) { setTouchStartX(null); return }
          if (diff > 0) setActiveThumb((t) => Math.min(t + 1, displayGallery.length - 1))
          else setActiveThumb((t) => Math.max(t - 1, 0))
          setTouchStartX(null)
        }}
      >
        <div style={{ width: '100%', height: '280px', backgroundColor: '#0E1424', overflow: 'hidden' }}>
          <ImgOrPlaceholder src={displayGallery[activeThumb]} brand={product.brand} name={product.name} />
        </div>
        {displayGallery.length > 1 && (
          <div className="flex items-center justify-center" style={{ gap: '6px', position: 'absolute', bottom: '12px', width: '100%' }}>
            {displayGallery.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveThumb(i)}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: activeThumb === i ? '#00C8FF' : '#1B2333',
                  flexShrink: 0, cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ DESKTOP BREADCRUMB ═══ */}
      <div
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '44px', padding: `0 ${sidePadding}`, gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Link to="/" className="no-underline" style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>
          Inicio
        </Link>
        <ChevronRight size={13} color="#2A3347" />
        <Link to="#" className="no-underline" style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>
          {product.category_id}
        </Link>
        <ChevronRight size={13} color="#2A3347" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
          {product.name}
        </span>
      </div>

      {/* ═══ DESKTOP MAIN ═══ */}
      <div className="hidden md:flex w-full" style={{ padding: `40px ${sidePadding} 48px`, gap: '56px', alignItems: 'flex-start' }}>

        {/* LEFT — Gallery */}
        <div className="flex flex-col" style={{ width: '460px', flexShrink: 0, gap: '12px' }}>
          <div style={{
            backgroundColor: '#0E1424',
            borderRadius: '16px',
            height: '420px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <ImgOrPlaceholder src={displayGallery[activeThumb]} brand={product.brand} name={product.name} />
            {product.badge && (
              <div style={{
                position: 'absolute', top: '14px', left: '14px',
                backgroundColor: product.badge === 'NUEVO' ? '#22C55E' : '#EF4444',
                borderRadius: '5px', padding: '4px 10px',
              }}>
                <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>
                  {product.badge}
                </span>
              </div>
            )}
          </div>
          <div className="flex" style={{ gap: '10px' }}>
            {displayGallery.map((url, i) => (
              <div
                key={i}
                onClick={() => setActiveThumb(i)}
                style={{
                  backgroundColor: '#0E1424',
                  borderRadius: '8px',
                  height: '68px',
                  width: '68px',
                  cursor: 'pointer',
                  border: activeThumb === i ? '2px solid #24A8F5' : '1px solid rgba(255,255,255,0.06)',
                  flexShrink: 0,
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <ImgOrPlaceholder src={url} brand={product.brand} name="" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Product info */}
        <div className="flex flex-col flex-1" style={{ gap: '0', minWidth: '0' }}>

          {/* Brand + actions */}
          <div className="flex items-center" style={{ gap: '8px', marginBottom: '10px' }}>
            <span className="flex-1" style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
              {product.brand}
            </span>
            <button style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={15} color="#8890A4" />
            </button>
            <button style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={15} color="#8890A4" />
            </button>
          </div>

          {/* Title */}
          <h1 style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '26px', fontWeight: '800', lineHeight: '1.25', margin: '0 0 10px 0' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center" style={{ gap: '5px', marginBottom: '20px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />
            ))}
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', marginLeft: '4px' }}>4.8</span>
            <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px' }}>(127 reseñas)</span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

          {/* Price */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '40px', fontWeight: '800', lineHeight: 1 }}>
              {product.price}
            </span>
          </div>

          {/* Payment method tags */}
          <div className="flex items-center" style={{ gap: '8px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '5px 12px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600' }}>MercadoPago</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '5px 12px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600' }}>BTC · ETH · USDT</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '5px 12px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600' }}>Transferencia</span>
            </div>
          </div>

          {/* Stock + shipping */}
          <div className="flex items-center" style={{ gap: '20px', marginBottom: '20px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: product.stock > 0 ? '#22C55E' : '#EF4444', flexShrink: 0 }} />
              <span style={{ color: product.stock > 0 ? '#22C55E' : '#EF4444', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
                {product.stock > 0 ? 'En stock' : 'Sin stock'}
              </span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <Truck size={14} color="#24A8F5" />
              <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>Envío gratis a todo el país</span>
            </div>
          </div>

          {/* Quick specs */}
          {quickSpecs.length > 0 && (
            <div className="flex flex-col" style={{ gap: '8px', marginBottom: '24px' }}>
              {[quickSpecs.slice(0, 2), quickSpecs.slice(2, 4)].filter((r) => r.length > 0).map((row, ri) => (
                <div key={ri} className="flex" style={{ gap: '8px' }}>
                  {row.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex flex-1 items-center"
                      style={{ backgroundColor: '#0A0C14', borderRadius: '10px', padding: '11px 14px', gap: '10px', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <Icon size={15} color="#24A8F5" />
                      <div className="flex flex-col" style={{ gap: '2px' }}>
                        <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '1px' }}>
                          {label}
                        </span>
                        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '12px', fontWeight: '700' }}>
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center" style={{ gap: '14px', marginBottom: '16px' }}>
            <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>Cantidad:</span>
            <div className="flex items-center" style={{ backgroundColor: '#0A0C14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '20px', cursor: 'pointer' }}
              >
                −
              </button>
              <div
                className="flex items-center justify-center"
                style={{ width: '44px', height: '40px', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>{qty}</span>
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#24A8F5', fontSize: '20px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col" style={{ gap: '10px', marginBottom: '24px' }}>
            <button
              className="flex items-center justify-center"
              style={{ backgroundColor: '#00C8FF', borderRadius: '10px', height: '54px', border: 'none', cursor: 'pointer', gap: '12px', width: '100%' }}
            >
              <ShoppingCart size={18} color="#060810" />
              <span style={{ color: '#060810', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
                Agregar al carrito
              </span>
            </button>
            <button
              className="flex items-center justify-center"
              style={{ backgroundColor: 'transparent', borderRadius: '10px', height: '44px', border: '1px solid rgba(36,168,245,0.35)', cursor: 'pointer', width: '100%' }}
            >
              <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
                Comprar ahora
              </span>
            </button>
          </div>

          {/* Trust badges */}
          <TrustBadges size={15} layout="row" />
        </div>
      </div>

      {/* ═══ DESKTOP TABS ═══ */}
      <div className="hidden md:flex flex-col w-full" style={{ padding: `0 ${sidePadding} 48px` }}>
        <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
          {tabs.map((tab, i) => {
            const isActive = activeTab === i
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{
                  backgroundColor: 'transparent',
                  height: '46px',
                  padding: '0 24px',
                  borderBottom: isActive ? '2px solid #24A8F5' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                <span style={{ color: isActive ? '#24A8F5' : '#8890A4', fontFamily: 'Inter', fontSize: '14px', fontWeight: isActive ? '700' : '500' }}>
                  {tab}
                </span>
              </button>
            )
          })}
        </div>

        {activeTab === 0 && (
          <div className="flex w-full" style={{ gap: '48px', alignItems: 'flex-start' }}>
            <p style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.75', flex: 1, whiteSpace: 'pre-line', margin: 0 }}>
              {product.description}
            </p>
            <div style={{ width: '360px', flexShrink: 0, backgroundColor: '#0A0C14', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {detailSpecs.map((row, i) => (
                <div key={row.label}>
                  <div className="flex items-center" style={{ padding: '11px 16px' }}>
                    <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px', flex: 1 }}>{row.label}</span>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>{row.value}</span>
                  </div>
                  {i < detailSpecs.length - 1 && <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div style={{ backgroundColor: '#0A0C14', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {detailSpecs.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-baseline" style={{ padding: '13px 24px' }}>
                  <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px', width: '260px', flexShrink: 0 }}>
                    {row.label}
                  </span>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
                    {row.value}
                  </span>
                </div>
                {i < detailSpecs.length - 1 && <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />}
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '14px' }}>
            Las reseñas estarán disponibles próximamente.
          </span>
        )}
      </div>

      {/* ═══ DESKTOP RELATED ═══ */}
      <div className="hidden md:flex flex-col w-full" style={{ padding: `0 ${sidePadding} 24px`, gap: '20px' }}>
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div className="flex items-center">
          <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '800' }}>
            También te puede gustar
          </span>
          <Link to="#" className="no-underline" style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
            Ver todos →
          </Link>
        </div>
      </div>
      <div className="hidden md:flex w-full" style={{ padding: `0 ${sidePadding} 56px`, gap: '20px' }}>
        {relatedProducts.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="flex flex-col flex-1 no-underline"
            style={{ backgroundColor: '#0E1424', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}
          >
            <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#0A0C14' }}>
              <ImgOrPlaceholder src={p.image_url} brand={p.brand} name={p.name} style={{ backgroundColor: '#0A0C14' }} />
            </div>
            <div className="flex flex-col" style={{ padding: '14px', gap: '6px' }}>
              <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '2px' }}>
                {p.brand}
              </span>
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', lineHeight: '1.3' }}>
                {p.name}
              </span>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
                {p.price}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ═══ MOBILE PRODUCT INFO ═══ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '16px' }}>

        {product.badge && (
          <div className="flex" style={{ gap: '8px' }}>
            <div style={{ backgroundColor: product.badge === 'NUEVO' ? '#22C55E' : '#EF4444', borderRadius: '5px', padding: '4px 10px' }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>
                {product.badge}
              </span>
            </div>
          </div>
        )}

        <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
          {product.brand}
        </span>

        <h1 style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', margin: 0 }}>
          {product.name}
        </h1>

        <div className="flex items-center" style={{ gap: '5px' }}>
          <Star size={13} color="#F59E0B" fill="#F59E0B" />
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', marginLeft: '2px' }}>4.8</span>
          <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px' }}>(127 reseñas)</span>
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

        <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '30px', fontWeight: '800' }}>{product.price}</span>

        <div className="flex items-center" style={{ gap: '6px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: product.stock > 0 ? '#22C55E' : '#EF4444', flexShrink: 0 }} />
          <span style={{ color: product.stock > 0 ? '#22C55E' : '#EF4444', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
            {product.stock > 0 ? 'En stock' : 'Sin stock'}
          </span>
        </div>

        {quickSpecs.length > 0 && (
          <div className="flex flex-col" style={{ gap: '8px' }}>
            {[quickSpecs.slice(0, 2), quickSpecs.slice(2, 4)].filter((r) => r.length > 0).map((row, ri) => (
              <div key={ri} className="flex" style={{ gap: '8px' }}>
                {row.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-1 items-center"
                    style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '11px 12px', gap: '8px', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Icon size={14} color="#24A8F5" />
                    <div className="flex flex-col" style={{ gap: '2px' }}>
                      <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '8px', fontWeight: '700', letterSpacing: '1px' }}>{label}</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700' }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col" style={{ gap: '10px' }}>
          <div className="flex items-center" style={{ gap: '14px' }}>
            <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>Cantidad:</span>
            <div className="flex items-center" style={{ backgroundColor: '#0A0C14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '20px', cursor: 'pointer' }}
              >
                −
              </button>
              <div className="flex items-center justify-center" style={{ width: '44px', height: '40px', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>{qty}</span>
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#24A8F5', fontSize: '20px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="flex items-center justify-center"
            style={{ backgroundColor: '#00C8FF', borderRadius: '10px', height: '52px', border: 'none', cursor: 'pointer', gap: '10px', width: '100%' }}
          >
            <ShoppingCart size={18} color="#060810" />
            <span style={{ color: '#060810', fontFamily: 'Inter', fontSize: '15px', fontWeight: '800' }}>Agregar al carrito</span>
          </button>

          <button
            className="flex items-center justify-center"
            style={{ backgroundColor: 'transparent', borderRadius: '10px', height: '44px', border: '1px solid rgba(36,168,245,0.35)', cursor: 'pointer', width: '100%' }}
          >
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>Comprar ahora</span>
          </button>
        </div>

        {/* Descripción accordion */}
        <div style={{ backgroundColor: '#0E1424', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="flex items-center justify-between w-full border-none cursor-pointer"
            style={{ backgroundColor: 'transparent', padding: '16px' }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>Descripción</span>
            <ChevronDown size={18} color="#8890A4" style={{ transform: descOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
          </button>
          {descOpen && (
            <div style={{ padding: '0 16px 16px' }}>
              <p style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.65', margin: 0, whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Ficha técnica accordion */}
        <div style={{ backgroundColor: '#0E1424', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setSpecsOpen(!specsOpen)}
            className="flex items-center justify-between w-full border-none cursor-pointer"
            style={{ backgroundColor: 'transparent', padding: '16px' }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>Ficha técnica</span>
            <ChevronDown size={18} color="#8890A4" style={{ transform: specsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
          </button>
          {specsOpen && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ backgroundColor: '#070B16', borderRadius: '10px', overflow: 'hidden' }}>
                {detailSpecs.map((row, i) => (
                  <div key={row.label}>
                    <div className="flex items-center" style={{ padding: '11px 14px' }}>
                      <span className="flex-1" style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px' }}>{row.label}</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>{row.value}</span>
                    </div>
                    {i < detailSpecs.length - 1 && <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        <div className="flex flex-col" style={{ gap: '12px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
            También te puede gustar
          </span>
          <div className="grid grid-cols-2" style={{ gap: '10px' }}>
            {relatedProducts.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="flex flex-col no-underline"
                style={{ backgroundColor: '#0E1424', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}
              >
                <div style={{ height: '100px', overflow: 'hidden', backgroundColor: '#0A0C14' }}>
                  <ImgOrPlaceholder src={p.image_url} brand={p.brand} name={p.name} />
                </div>
                <div className="flex flex-col" style={{ padding: '10px', gap: '4px' }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>{p.brand}</span>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '12px', fontWeight: '700', lineHeight: '1.3' }}>{p.name}</span>
                  <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '800' }}>{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ padding: '8px 0 16px' }}>
          <TrustBadges size={20} layout="row" />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetail
