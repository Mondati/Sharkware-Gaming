import { useState } from 'react'
import {
  Cpu, Monitor, MemoryStick, HardDrive,
  Star, Heart, Share2, ShoppingCart,
  ShieldCheck, Truck, RefreshCw, ChevronRight, ChevronDown, ChevronLeft,
  ArrowLeft,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const quickSpecs = [
  { icon: Cpu, label: 'PROCESADOR', value: 'Intel Core i9-14900HX' },
  { icon: Monitor, label: 'GPU', value: 'RTX 4090 16GB' },
  { icon: MemoryStick, label: 'RAM', value: '64GB DDR5 5600MHz' },
  { icon: HardDrive, label: 'ALMACENAMIENTO', value: '2TB NVMe SSD' },
]

const detailSpecs = [
  { label: 'Pantalla', value: '17" QHD+ 240Hz' },
  { label: 'Sistema Op.', value: 'Windows 11 Home' },
  { label: 'Batería', value: '99.9Whr, carga 240W' },
  { label: 'Conectividad', value: 'WiFi 7, BT 5.4' },
  { label: 'Peso', value: '2.99 kg' },
]

const relatedProducts = [
  { id: 2, brand: 'ASUS', name: 'ROG Strix G18 RTX 4080', price: '$ 2.499.999' },
  { id: 3, brand: 'LENOVO', name: 'Legion Pro 7i Gen 9 RTX 4070', price: '$ 1.899.999' },
  { id: 8, brand: 'RAZER', name: 'Blade 18 RTX 4090 240Hz', price: '$ 3.199.999' },
]

const tabs = ['Descripción', 'Especificaciones', 'Reseñas (127)']

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [descOpen, setDescOpen] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
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

      {/* ═══════════════ DESKTOP NAVBAR ═══════════════ */}
      <Navbar />

      {/* ═══════════════ MOBILE IMAGE ═══════════════ */}
      <div className="md:hidden relative">
        <div
          style={{
            width: '100%',
            height: '280px',
            backgroundColor: '#0E1424',
            backgroundImage: 'url(https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dots */}
        <div className="flex items-center justify-center" style={{ gap: '6px', position: 'absolute', bottom: '12px', width: '100%' }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activeThumb === i ? '#00C8FF' : '#1B2333',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB + MAIN ═══════════════ */}

      {/* Desktop Breadcrumb */}
      <div
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}
      >
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
          Inicio
        </Link>
        <ChevronRight size={14} color="#1B2333" />
        <Link to="#" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
          Notebooks
        </Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
          MSI Raider GE78 HX
        </span>
      </div>

      {/* Desktop Main */}
      <div className="hidden md:flex w-full" style={{ padding: '48px 80px', gap: '60px' }}>
        {/* Left: Gallery */}
        <div className="flex flex-col" style={{ width: '777px', flexShrink: 0, gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#0E1424',
              borderRadius: '16px',
              height: '440px',
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: 'url(https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=777&h=440&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#22C55E', borderRadius: '6px', padding: '4px 12px' }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>NUEVO</span>
            </div>
            <div style={{ position: 'absolute', top: '16px', left: '90px', backgroundColor: '#EF4444', borderRadius: '6px', padding: '4px 12px' }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>MÁS VENDIDO</span>
            </div>
          </div>
          <div className="flex" style={{ gap: '10px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                onClick={() => setActiveThumb(i)}
                style={{
                  backgroundColor: '#0E1424',
                  borderRadius: '8px',
                  height: '60px',
                  width: '60px',
                  cursor: 'pointer',
                  border: activeThumb === i ? '2px solid #24A8F5' : '1px solid #1B2333',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col flex-1" style={{ gap: '20px' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span className="flex-1" style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '12px', fontWeight: '700', letterSpacing: '2px' }}>
              MSI
            </span>
            <button style={{ backgroundColor: '#0E1424', border: '1px solid #1B2333', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={16} color="#AAB3C5" />
            </button>
            <button style={{ backgroundColor: '#0E1424', border: '1px solid #1B2333', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={16} color="#AAB3C5" />
            </button>
          </div>

          <h1 style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '26px', fontWeight: '800', lineHeight: '1.25', margin: 0 }}>
            MSI Raider GE78 HX — Laptop Gaming 17"
          </h1>

          <div className="flex items-center" style={{ gap: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
            ))}
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>4.8</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>(127 reseñas)</span>
          </div>

          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex flex-col" style={{ gap: '6px' }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '36px', fontWeight: '800' }}>$ 2.899.999</span>
            <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '14px' }}>12 cuotas sin interés de $ 241.666</span>
          </div>

          <div className="flex items-center" style={{ gap: '8px' }}>
            <div style={{ backgroundColor: '#22C55E', borderRadius: '50%', width: '8px', height: '8px', flexShrink: 0 }} />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
              En stock — Envío gratis a todo el país
            </span>
          </div>

          <div className="flex flex-col" style={{ gap: '8px' }}>
            {[[quickSpecs[0], quickSpecs[1]], [quickSpecs[2], quickSpecs[3]]].map((row, ri) => (
              <div key={ri} className="flex" style={{ gap: '8px' }}>
                {row.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-1 items-center"
                    style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '12px', gap: '10px' }}
                  >
                    <Icon size={16} color="#24A8F5" />
                    <div className="flex flex-col" style={{ gap: '2px' }}>
                      <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '1px' }}>
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

          <div className="flex items-center" style={{ gap: '16px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>Cantidad:</span>
            <div className="flex" style={{ backgroundColor: '#0E1424', border: '1px solid #1B2333', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '18px', cursor: 'pointer' }}
              >
                −
              </button>
              <div className="flex items-center justify-center" style={{ width: '48px', height: '40px' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>{qty}</span>
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: '40px', height: '40px', backgroundColor: '#24A8F5', border: 'none', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer', borderRadius: '0 8px 8px 0' }}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="flex items-center justify-center"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '54px', border: 'none', cursor: 'pointer', gap: '12px', width: '100%' }}
          >
            <ShoppingCart size={20} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>Agregar al carrito</span>
          </button>

          <button
            className="flex items-center justify-center"
            style={{ backgroundColor: '#0E1424', borderRadius: '12px', height: '54px', border: '2px solid #24A8F5', cursor: 'pointer', width: '100%' }}
          >
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>Comprar ahora</span>
          </button>

          <div className="flex" style={{ paddingTop: '12px', justifyContent: 'space-around' }}>
            {[
              { icon: ShieldCheck, color: '#22C55E', label: 'Compra segura' },
              { icon: Truck, color: '#24A8F5', label: 'Envío gratis' },
              { icon: RefreshCw, color: '#F59E0B', label: '30 días devolución' },
            ].map(({ icon: Icon, color, label }) => (
              <div key={label} className="flex items-center" style={{ gap: '8px' }}>
                <Icon size={16} color={color} />
                <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ MOBILE PRODUCT INFO ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '16px' }}>
        {/* Badges */}
        <div className="flex items-center" style={{ gap: '8px' }}>
          <div style={{ backgroundColor: '#22C55E', borderRadius: '5px', padding: '4px 10px' }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>NUEVO</span>
          </div>
          <div style={{ backgroundColor: '#EF4444', borderRadius: '5px', padding: '4px 10px' }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>MAS VENDIDO</span>
          </div>
        </div>

        {/* Brand */}
        <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
          MSI
        </span>

        {/* Name */}
        <h1 style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '20px', fontWeight: '800', lineHeight: '1.25', margin: 0 }}>
          MSI Raider GE78 HX — Laptop Gaming 17"
        </h1>

        {/* Rating */}
        <div className="flex items-center" style={{ gap: '6px' }}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>4.8</span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>(127 reseñas)</span>
        </div>

        {/* Price */}
        <div className="flex flex-col" style={{ gap: '4px' }}>
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>$ 2.899.999</span>
          <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '13px' }}>
            12 cuotas sin interés de $ 241.666
          </span>
        </div>

        {/* Quick Specs 2x2 */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
            Especificaciones principales
          </span>
          {[[quickSpecs[0], quickSpecs[1]], [quickSpecs[2], quickSpecs[3]]].map((row, ri) => (
            <div key={ri} className="flex" style={{ gap: '8px' }}>
              {row.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-1 items-center"
                  style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '12px', gap: '10px' }}
                >
                  <Icon size={16} color="#24A8F5" />
                  <div className="flex flex-col" style={{ gap: '2px' }}>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '8px', fontWeight: '700', letterSpacing: '1px' }}>
                      {label}
                    </span>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700' }}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Qty + Buttons */}
        <div className="flex flex-col" style={{ gap: '12px' }}>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Cantidad:</span>
            <div className="flex" style={{ backgroundColor: '#0E1424', border: '1px solid #1B2333', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: 'none', color: '#F5F7FA', fontSize: '18px', cursor: 'pointer' }}
              >
                −
              </button>
              <div className="flex items-center justify-center" style={{ width: '48px', height: '40px' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>{qty}</span>
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: '40px', height: '40px', backgroundColor: '#24A8F5', border: 'none', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer', borderRadius: '0 8px 8px 0' }}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="flex items-center justify-center"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '50px', border: 'none', cursor: 'pointer', gap: '10px', width: '100%' }}
          >
            <ShoppingCart size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '800' }}>Agregar al carrito</span>
          </button>

          <button
            className="flex items-center justify-center"
            style={{ backgroundColor: '#0E1424', borderRadius: '12px', height: '50px', border: '2px solid #24A8F5', cursor: 'pointer', width: '100%' }}
          >
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '15px', fontWeight: '800' }}>Comprar ahora</span>
          </button>
        </div>

        {/* Descripción (accordion) */}
        <div style={{ backgroundColor: '#0E1424', borderRadius: '12px', overflow: 'hidden' }}>
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="flex items-center justify-between w-full border-none cursor-pointer"
            style={{ backgroundColor: 'transparent', padding: '16px' }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
              Descripción
            </span>
            <ChevronDown
              size={18}
              color="#AAB3C5"
              style={{
                transform: descOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                flexShrink: 0,
              }}
            />
          </button>
          {descOpen && (
            <div style={{ padding: '0 16px 16px' }}>
              <p style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                El MSI Raider GE78 HX representa la cúspide del rendimiento gaming. Equipado con el procesador Intel Core i9-14900HX de última generación y la potente GPU NVIDIA RTX 4090, este equipo está diseñado para conquistar los juegos más exigentes del mercado.
                {'\n\n'}
                Su pantalla QHD+ de 17" con 240Hz garantiza una fluidez visual incomparable, mientras que el sistema de cooling avanzado mantiene temperaturas óptimas en las sesiones más intensas.
              </p>
            </div>
          )}
        </div>

        {/* Ficha técnica (accordion) */}
        <div style={{ backgroundColor: '#0E1424', borderRadius: '12px', overflow: 'hidden' }}>
          <button
            onClick={() => setSpecsOpen(!specsOpen)}
            className="flex items-center justify-between w-full border-none cursor-pointer"
            style={{ backgroundColor: 'transparent', padding: '16px' }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
              Ficha técnica completa
            </span>
            <ChevronDown
              size={18}
              color="#AAB3C5"
              style={{
                transform: specsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                flexShrink: 0,
              }}
            />
          </button>
          {specsOpen && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ backgroundColor: '#070B16', borderRadius: '10px', overflow: 'hidden' }}>
                {detailSpecs.map((row, i) => (
                  <div key={row.label}>
                    <div className="flex items-center" style={{ padding: '12px 14px' }}>
                      <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>{row.label}</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>{row.value}</span>
                    </div>
                    {i < detailSpecs.length - 1 && <div style={{ backgroundColor: '#1B2333', height: '1px' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="flex flex-col" style={{ gap: '12px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800', textAlign: 'center' }}>
            También te puede gustar
          </span>
          <div className="grid grid-cols-2" style={{ gap: '10px' }}>
            {relatedProducts.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="flex flex-col no-underline"
                style={{ backgroundColor: '#0E1424', borderRadius: '14px', border: '1px solid #1B2333', overflow: 'hidden' }}
              >
                <div style={{ backgroundColor: '#1E2232', height: '100px' }} />
                <div className="flex flex-col" style={{ padding: '10px', gap: '6px' }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>
                    {p.brand}
                  </span>
                  <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '12px', fontWeight: '700', lineHeight: '1.3' }}>
                    {p.name}
                  </span>
                  <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '800' }}>
                    {p.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center" style={{ gap: '20px', padding: '8px 0 16px' }}>
          <div className="flex flex-col items-center" style={{ gap: '4px' }}>
            <ShieldCheck size={20} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Compra segura</span>
          </div>
          <div className="flex flex-col items-center" style={{ gap: '4px' }}>
            <Truck size={20} color="#24A8F5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Envío gratis</span>
          </div>
          <div className="flex flex-col items-center" style={{ gap: '4px' }}>
            <RefreshCw size={20} color="#F59E0B" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>30 días devolución</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP TABS ═══════════════ */}
      <div className="hidden md:flex flex-col w-full" style={{ padding: '0 80px 40px' }}>
        <div className="flex" style={{ borderBottom: '1px solid #1B2333' }}>
          {tabs.map((tab, i) => {
            const isActive = activeTab === i
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{
                  backgroundColor: isActive ? '#0E1424' : '#070B16',
                  height: '48px',
                  padding: '0 28px',
                  borderBottom: isActive ? '2px solid #24A8F5' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                <span style={{ color: isActive ? '#24A8F5' : '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', fontWeight: isActive ? '700' : '500' }}>
                  {tab}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex w-full" style={{ paddingTop: '32px', gap: '48px' }}>
          {activeTab === 0 && (
            <>
              <p style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.7', flex: 1, whiteSpace: 'pre-line', margin: 0 }}>
                {`El MSI Raider GE78 HX representa la cúspide del rendimiento gaming. Equipado con el procesador Intel Core i9-14900HX de última generación y la potente GPU NVIDIA RTX 4090, este equipo está diseñado para conquistar los juegos más exigentes del mercado.\n\nSu pantalla QHD+ de 17" con 240Hz garantiza una fluidez visual incomparable, mientras que el sistema de cooling avanzado MSI Cooler Boost 5 mantiene temperaturas óptimas incluso en las sesiones más intensas.`}
              </p>
              <div style={{ backgroundColor: '#0E1424', borderRadius: '12px', width: '380px', flexShrink: 0, overflow: 'hidden' }}>
                {detailSpecs.map((row, i) => (
                  <div key={row.label}>
                    <div className="flex items-center" style={{ padding: '12px 16px' }}>
                      <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>{row.label}</span>
                      <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>{row.value}</span>
                    </div>
                    {i < detailSpecs.length - 1 && <div style={{ backgroundColor: '#1B2333', height: '1px' }} />}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 1 && (
            <div className="flex w-full" style={{ gap: '12px', flexWrap: 'wrap' }}>
              {[...quickSpecs.map((s) => ({ label: s.label, value: s.value })), ...detailSpecs].map((row) => (
                <div
                  key={row.label}
                  style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '14px 16px', minWidth: '220px', flex: 1 }}
                >
                  <div style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px' }}>
                    {row.label}
                  </div>
                  <div style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 2 && (
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
              Las reseñas estarán disponibles próximamente.
            </span>
          )}
        </div>
      </div>

      {/* ═══════════════ DESKTOP RELATED ═══════════════ */}
      <div className="hidden md:flex flex-col w-full" style={{ padding: '0 80px 20px', gap: '20px' }}>
        <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
        <div className="flex items-center">
          <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '20px', fontWeight: '800' }}>
            También te puede gustar
          </span>
          <Link to="#" className="no-underline" style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>
            Ver todos →
          </Link>
        </div>
      </div>
      <div className="hidden md:flex w-full" style={{ padding: '0 56px 56px', gap: '32px' }}>
        {relatedProducts.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="flex flex-col flex-1 no-underline"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', border: '1px solid #1B2333', overflow: 'hidden' }}
          >
            <div style={{ backgroundColor: '#1E2232', height: '180px' }} />
            <div className="flex flex-col" style={{ padding: '14px', gap: '8px' }}>
              <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700', letterSpacing: '2px' }}>
                {p.brand}
              </span>
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
                {p.name}
              </span>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
                {p.price}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetail
