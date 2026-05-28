import { useState, useEffect } from 'react'
import {
  Cpu, Monitor, MemoryStick, HardDrive,
  ShoppingCart,
  ChevronRight, ChevronDown, ArrowLeft,
} from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import TrustBadges from '../components/TrustBadges'
import MercadoPagoLogo from '../components/MercadoPagoLogo'
import ProductCard from '../components/ProductCard'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { useCart } from '../context/CartContext'
import { getProduct, getProducts, getCategories } from '../api/products'
import { formatARS } from '../utils/formatPrice'
import Skeleton from '../components/Skeleton'

const ProductDetailSkeleton = ({ sidePadding }) => (
  <div className="flex flex-col flex-1" style={{ backgroundColor: '#070B16' }}>
    {/* Desktop */}
    <section
      className="hidden md:flex w-full"
      style={{ padding: `40px ${sidePadding} 40px`, gap: '40px' }}
    >
      <div className="flex flex-col" style={{ flex: '1', gap: '12px' }}>
        <Skeleton height={520} radius={16} />
        <div className="flex" style={{ gap: '10px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={72} width={72} radius={8} />
          ))}
        </div>
      </div>
      <div className="flex flex-col" style={{ flex: '1', gap: '16px' }}>
        <Skeleton height={14} width="35%" />
        <Skeleton height={32} width="80%" />
        <Skeleton height={16} width="60%" />
        <div className="flex" style={{ gap: '12px', marginTop: '8px' }}>
          <Skeleton height={20} width={90} radius={999} />
          <Skeleton height={20} width={110} radius={999} />
        </div>
        <Skeleton height={48} width="55%" style={{ marginTop: '12px' }} />
        <div className="grid grid-cols-2" style={{ gap: '12px', marginTop: '12px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={72} radius={10} />
          ))}
        </div>
        <Skeleton height={52} radius={12} style={{ marginTop: '12px' }} />
        <Skeleton height={52} radius={12} />
      </div>
    </section>

    {/* Mobile */}
    <section
      className="flex md:hidden flex-col w-full"
      style={{ padding: '20px 16px 32px', gap: '14px' }}
    >
      <Skeleton height={320} radius={16} />
      <Skeleton height={12} width="35%" />
      <Skeleton height={24} width="85%" />
      <Skeleton height={14} width="60%" />
      <Skeleton height={36} width="55%" style={{ marginTop: '8px' }} />
      <div className="grid grid-cols-2" style={{ gap: '10px', marginTop: '8px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={64} radius={10} />
        ))}
      </div>
      <Skeleton height={48} radius={12} style={{ marginTop: '8px' }} />
      <Skeleton height={48} radius={12} />
    </section>
  </div>
)

const tabs = ['Descripción', 'Especificaciones']

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
      <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700', letterSpacing: '2px' }}>
        {brand}
      </span>
      <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600', textAlign: 'center', lineHeight: '1.3', padding: '0 16px' }}>
        {name}
      </span>
    </div>
  )
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [activeTab, setActiveTab] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [descOpen, setDescOpen] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const { sidePadding, cardFlex } = useWindowWidth()
  const { addItem, items: cartItems } = useCart()

  const inCart = product ? (cartItems.find(i => i.id === product.id)?.quantity ?? 0) : 0
  const maxAddable = product ? Math.max(0, product.stock - inCart) : 0
  const reachedMax = product ? qty >= maxAddable : true

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setProduct(null)
    setActiveThumb(0)
    getProduct(id)
      .then(p => { if (!cancelled) setProduct(p) })
      .catch(err => { if (!cancelled) setNotFound(err?.status === 404) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!product?.category_id) return
    let cancelled = false
    getProducts({ category: product.category_id, exclude: product.id, size: 5 })
      .then(res => { if (!cancelled) setRelatedProducts(res.items ?? []) })
      .catch(() => { if (!cancelled) setRelatedProducts([]) })
    return () => { cancelled = true }
  }, [product?.category_id, product?.id])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!product) return
    const max = Math.max(1, product.stock - inCart)
    setQty((q) => Math.min(q, max))
  }, [product, inCart])

  const handleAddToCart = () => {
    addItem(product, qty)
  }

  const handleBuyNow = () => {
    addItem(product, qty)
    navigate('/checkout')
  }

  if (loading) return <ProductDetailSkeleton sidePadding={sidePadding} />

  if (notFound || !product) {
    return (
      <div className="flex flex-col flex-1" style={{ backgroundColor: '#070B16' }}>
        <div className="flex flex-col flex-1 items-center justify-center" style={{ gap: '16px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '700' }}>
            Producto no encontrado
          </span>
          <Link to="/" style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '14px' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const displayGallery = [...new Set([product.image_url, ...(product.gallery ?? [])].filter(Boolean))]

  const quickSpecs = [
    { icon: Cpu,         label: 'PROCESADOR',    value: product.specs?.cpu     ?? product.specs?.chipset },
    { icon: Monitor,     label: 'GPU',            value: product.specs?.gpu     ?? product.specs?.panel },
    { icon: MemoryStick, label: 'RAM / VRAM',     value: product.specs?.ram     ?? product.specs?.vram },
    { icon: HardDrive,   label: 'ALMACENAMIENTO', value: product.specs?.storage ?? product.specs?.resolution },
  ].filter((s) => s.value)

  const quickSpecRows = []
  if (quickSpecs.length > 0) quickSpecRows.push(quickSpecs.slice(0, 2))
  if (quickSpecs.length > 2) quickSpecRows.push(quickSpecs.slice(2, 4))

  const detailSpecs = Object.entries(product.specs ?? {}).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  const categoryLabel = categories.find((c) => c.id === product.category_id)?.label ?? product.category_id

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#070B16' }}>

      {/* ═══ MOBILE HEADER ═══ */}
      <div
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px', gap: '12px' }}
      >
        <Link to="/" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '600' }}>
          Detalle del Producto
        </span>
      </div>

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
            {displayGallery.map((url, i) => (
              <button
                key={url}
                onClick={() => setActiveThumb(i)}
                aria-label={`Imagen ${i + 1}`}
                className="border-none cursor-pointer p-0"
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: activeThumb === i ? '#00C8FF' : '#1B2333',
                  flexShrink: 0,
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
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
          Inicio
        </Link>
        <ChevronRight size={13} color="#454E64" />
        <Link to={`/?cat=${product.category_id}`} className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
          {categoryLabel}
        </Link>
        <ChevronRight size={13} color="#454E64" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
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
                <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                  {product.badge}
                </span>
              </div>
            )}
          </div>
          <div className="flex" style={{ gap: '10px' }}>
            {displayGallery.map((url, i) => (
              <button
                key={url}
                onClick={() => setActiveThumb(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className="border-none cursor-pointer p-0"
                style={{
                  backgroundColor: '#0E1424',
                  borderRadius: '8px',
                  height: '68px',
                  width: '68px',
                  border: activeThumb === i ? '2px solid #24A8F5' : '1px solid rgba(255,255,255,0.06)',
                  flexShrink: 0,
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <ImgOrPlaceholder src={url} brand={product.brand} name="" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Product info */}
        <div className="flex flex-col flex-1" style={{ gap: '0', minWidth: '0' }}>

          {/* Brand */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
              {product.brand}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '26px', fontWeight: '600', lineHeight: '1.25', margin: '0 0 20px 0' }}>
            {product.name}
          </h1>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

          {/* Price */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '40px', fontWeight: '800', lineHeight: 1 }}>
              {formatARS(product.price_ars)}
            </span>
          </div>

          {/* Payment method tags */}
          <div className="flex items-center" style={{ gap: '8px', marginBottom: '20px' }}>
            <div className="flex items-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '5px 10px', gap: '6px' }}>
              <MercadoPagoLogo size={14} />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>MercadoPago</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '5px 12px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>BTC · ETH · USDT</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '5px 12px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>Transferencia</span>
            </div>
          </div>

          {/* Stock + shipping */}
          <div className="flex items-center flex-wrap" style={{ gap: '20px', marginBottom: '20px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: product.stock > 0 ? '#22C55E' : '#EF4444', flexShrink: 0 }} />
              <span style={{ color: product.stock > 0 ? '#22C55E' : '#EF4444', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                {product.stock > 0 ? 'En stock' : 'Sin stock'}
              </span>
              {product.stock > 0 && (
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', marginLeft: '4px' }}>
                  · {product.stock} {product.stock === 1 ? 'disponible' : 'disponibles'}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 3 && (
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '4px 10px', borderRadius: '12px', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>
                ¡Pocas unidades!
              </div>
            )}
          </div>

          {/* Quick specs */}
          {quickSpecs.length > 0 && (
            <div className="flex flex-col" style={{ gap: '8px', marginBottom: '24px' }}>
              {quickSpecRows.map((row, ri) => (
                <div key={row.map(s => s.label).join('-')} className="flex" style={{ gap: '8px' }}>
                  {row.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex flex-1 items-center"
                      style={{ backgroundColor: '#0A0C14', borderRadius: '10px', padding: '11px 14px', gap: '10px', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <Icon size={15} color="#24A8F5" />
                      <div className="flex flex-col" style={{ gap: '2px' }}>
                        <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '700', letterSpacing: '1px' }}>
                          {label}
                        </span>
                        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '700' }}>
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
          <div className="flex flex-col" style={{ gap: '6px', marginBottom: '16px' }}>
            <div className="flex items-center" style={{ gap: '14px' }}>
              <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '13px' }}>Cantidad:</span>
              <div className="flex items-center" style={{ backgroundColor: '#0A0C14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '20px', cursor: qty <= 1 ? 'not-allowed' : 'pointer', opacity: qty <= 1 ? 0.4 : 1 }}
                >
                  −
                </button>
                <div
                  className="flex items-center justify-center"
                  style={{ width: '44px', height: '40px', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{qty}</span>
                </div>
                <button
                  onClick={() => setQty((q) => Math.min(maxAddable, q + 1))}
                  disabled={reachedMax}
                  style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '20px', cursor: reachedMax ? 'not-allowed' : 'pointer', opacity: reachedMax ? 0.4 : 1 }}
                >
                  +
                </button>
              </div>
            </div>
            {product.stock > 0 && inCart > 0 && (
              <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '11px' }}>
                Ya tenés {inCart} en el carrito · máx {product.stock}
              </span>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col" style={{ gap: '10px', marginBottom: '24px' }}>
            <button
              onClick={handleAddToCart}
              onMouseEnter={() => setHoveredBtn('add_m')}
              onMouseLeave={() => setHoveredBtn(null)}
              disabled={product.stock === 0 || maxAddable === 0}
              className="flex items-center justify-center"
              style={{ backgroundColor: hoveredBtn === 'add_m' ? '#00A8D8' : '#00C8FF', borderRadius: '10px', height: '54px', border: 'none', cursor: (product.stock === 0 || maxAddable === 0) ? 'not-allowed' : 'pointer', gap: '12px', width: '100%', opacity: (product.stock === 0 || maxAddable === 0) ? 0.5 : 1 }}
            >
              <ShoppingCart size={18} color="#060810" />
              <span style={{ color: '#060810', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
                {maxAddable === 0 && product.stock > 0 ? 'Stock cubierto en tu carrito' : 'Agregar al carrito'}
              </span>
            </button>
            <button
              onClick={handleBuyNow}
              onMouseEnter={() => setHoveredBtn('buy_m')}
              onMouseLeave={() => setHoveredBtn(null)}
              disabled={product.stock === 0 || maxAddable === 0}
              className="flex items-center justify-center"
              style={{ backgroundColor: hoveredBtn === 'buy_m' ? 'rgba(36,168,245,0.08)' : 'transparent', borderRadius: '10px', height: '44px', border: '1px solid rgba(36,168,245,0.35)', cursor: (product.stock === 0 || maxAddable === 0) ? 'not-allowed' : 'pointer', width: '100%', opacity: (product.stock === 0 || maxAddable === 0) ? 0.5 : 1 }}
            >
              <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
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
                <span style={{ color: isActive ? '#24A8F5' : '#8890A4', fontFamily: 'Poppins', fontSize: '14px', fontWeight: isActive ? '700' : '500' }}>
                  {tab}
                </span>
              </button>
            )
          })}
        </div>

        {activeTab === 0 && (
          <div className="flex w-full" style={{ gap: '48px', alignItems: 'flex-start' }}>
            <p style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', lineHeight: '1.75', flex: 1, whiteSpace: 'pre-line', margin: 0 }}>
              {product.description}
            </p>
            <div style={{ width: '360px', flexShrink: 0, backgroundColor: '#0A0C14', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {detailSpecs.map((row, i) => (
                <div key={row.label}>
                  <div className="flex items-center" style={{ padding: '11px 16px' }}>
                    <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '13px', flex: 1 }}>{row.label}</span>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>{row.value}</span>
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
                  <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '13px', width: '260px', flexShrink: 0 }}>
                    {row.label}
                  </span>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                    {row.value}
                  </span>
                </div>
                {i < detailSpecs.length - 1 && <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ═══ DESKTOP RELATED ═══ */}
      {relatedProducts.length > 0 && (
      <div className="hidden md:flex flex-col w-full" style={{ padding: `0 ${sidePadding} 24px`, gap: '20px' }}>
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div className="flex items-center">
          <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '800' }}>
            También te puede gustar
          </span>
          <Link to="#" className="no-underline" style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
            Ver todos →
          </Link>
        </div>
      </div>
      )}
      {relatedProducts.length > 0 && (
      <div className="hidden md:flex sw-scroll w-full" style={{ padding: `10px ${sidePadding} 56px`, gap: '16px', overflowX: 'auto' }}>
        {relatedProducts.map((p) => (
          <div key={p.id} style={{
            flex: `1 0 ${cardFlex}`,
            minWidth: cardFlex,
            maxWidth: relatedProducts.length < 5 ? undefined : cardFlex,
          }}>
            <ProductCard {...p} imgHeight={200} />
          </div>
        ))}
      </div>
      )}

      {/* ═══ MOBILE PRODUCT INFO ═══ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '16px' }}>

        {product.badge && (
          <div className="flex" style={{ gap: '8px' }}>
            <div style={{ backgroundColor: product.badge === 'NUEVO' ? '#22C55E' : '#EF4444', borderRadius: '5px', padding: '4px 10px' }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                {product.badge}
              </span>
            </div>
          </div>
        )}

        <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
          {product.brand}
        </span>

        <h1 style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '20px', fontWeight: '600', lineHeight: '1.25', margin: 0 }}>
          {product.name}
        </h1>

        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

        <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '30px', fontWeight: '800' }}>{formatARS(product.price_ars)}</span>

        <div className="flex items-center flex-wrap" style={{ gap: '10px' }}>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: product.stock > 0 ? '#22C55E' : '#EF4444', flexShrink: 0 }} />
            <span style={{ color: product.stock > 0 ? '#22C55E' : '#EF4444', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
              {product.stock > 0 ? 'En stock' : 'Sin stock'}
            </span>
            {product.stock > 0 && (
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', marginLeft: '4px' }}>
                · {product.stock} {product.stock === 1 ? 'disponible' : 'disponibles'}
              </span>
            )}
          </div>
          {product.stock > 0 && product.stock <= 3 && (
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '4px 10px', borderRadius: '12px', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>
              ¡Pocas unidades!
            </div>
          )}
        </div>

        {quickSpecs.length > 0 && (
          <div className="flex flex-col" style={{ gap: '8px' }}>
            {quickSpecRows.map((row, ri) => (
              <div key={row.map(s => s.label).join('-')} className="flex" style={{ gap: '8px' }}>
                {row.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-1 items-center"
                    style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '11px 12px', gap: '8px', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Icon size={14} color="#24A8F5" />
                    <div className="flex flex-col" style={{ gap: '2px' }}>
                      <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '8px', fontWeight: '700', letterSpacing: '1px' }}>{label}</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '700' }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col" style={{ gap: '10px' }}>
          <div className="flex items-center" style={{ gap: '14px' }}>
            <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '13px' }}>Cantidad:</span>
            <div className="flex items-center" style={{ backgroundColor: '#0A0C14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '20px', cursor: qty <= 1 ? 'not-allowed' : 'pointer', opacity: qty <= 1 ? 0.4 : 1 }}
              >
                −
              </button>
              <div className="flex items-center justify-center" style={{ width: '44px', height: '40px', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>{qty}</span>
              </div>
              <button
                onClick={() => setQty((q) => Math.min(maxAddable, q + 1))}
                disabled={reachedMax}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '20px', cursor: reachedMax ? 'not-allowed' : 'pointer', opacity: reachedMax ? 0.4 : 1 }}
              >
                +
              </button>
            </div>
          </div>
          {product.stock > 0 && inCart > 0 && (
            <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '11px' }}>
              Ya tenés {inCart} en el carrito · máx {product.stock}
            </span>
          )}

          <button
            onClick={handleAddToCart}
            onMouseEnter={() => setHoveredBtn('add_2')}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={product.stock === 0 || maxAddable === 0}
            className="flex items-center justify-center"
            style={{ backgroundColor: hoveredBtn === 'add_2' ? '#00A8D8' : '#00C8FF', borderRadius: '10px', height: '52px', border: 'none', cursor: (product.stock === 0 || maxAddable === 0) ? 'not-allowed' : 'pointer', gap: '10px', width: '100%', opacity: (product.stock === 0 || maxAddable === 0) ? 0.5 : 1 }}
          >
            <ShoppingCart size={18} color="#060810" />
            <span style={{ color: '#060810', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '800' }}>
              {maxAddable === 0 && product.stock > 0 ? 'Stock cubierto en tu carrito' : 'Agregar al carrito'}
            </span>
          </button>

          <button
            onClick={handleBuyNow}
            onMouseEnter={() => setHoveredBtn('buy_2')}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={product.stock === 0 || maxAddable === 0}
            className="flex items-center justify-center"
            style={{ backgroundColor: hoveredBtn === 'buy_2' ? 'rgba(36,168,245,0.08)' : 'transparent', borderRadius: '10px', height: '44px', border: '1px solid rgba(36,168,245,0.35)', cursor: (product.stock === 0 || maxAddable === 0) ? 'not-allowed' : 'pointer', width: '100%', opacity: (product.stock === 0 || maxAddable === 0) ? 0.5 : 1 }}
          >
            <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Comprar ahora</span>
          </button>
        </div>

        {/* Descripción accordion */}
        <div style={{ backgroundColor: '#0E1424', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="flex items-center justify-between w-full border-none cursor-pointer"
            style={{ backgroundColor: 'transparent', padding: '16px' }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Descripción</span>
            <ChevronDown size={18} color="#8890A4" style={{ transform: descOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
          </button>
          {descOpen && (
            <div style={{ padding: '0 16px 16px' }}>
              <p style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', lineHeight: '1.65', margin: 0, whiteSpace: 'pre-line' }}>
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
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>Ficha técnica</span>
            <ChevronDown size={18} color="#8890A4" style={{ transform: specsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
          </button>
          {specsOpen && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ backgroundColor: '#070B16', borderRadius: '10px', overflow: 'hidden' }}>
                {detailSpecs.map((row, i) => (
                  <div key={row.label}>
                    <div className="flex items-center" style={{ padding: '11px 14px' }}>
                      <span className="flex-1" style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '12px' }}>{row.label}</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>{row.value}</span>
                    </div>
                    {i < detailSpecs.length - 1 && <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
        <div className="flex flex-col" style={{ gap: '12px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
            También te puede gustar
          </span>
          <div className="grid grid-cols-2" style={{ gap: '10px' }}>
            {relatedProducts.slice(0, 2).map((p) => (
              <ProductCard key={p.id} {...p} mobile />
            ))}
          </div>
        </div>
        )}

        <div style={{ padding: '8px 0 16px' }}>
          <TrustBadges size={20} layout="row" />
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default ProductDetail
