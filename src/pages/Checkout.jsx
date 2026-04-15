import { ChevronRight, CreditCard, Bitcoin, ShieldCheck, Truck, RefreshCw, X, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ── Shared summary panel (desktop) ── */
const SummaryPanel = ({ ctaEnabled }) => (
  <div
    className="flex flex-col"
    style={{ width: '380px', flexShrink: 0, backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px', gap: '16px', border: '1px solid #1B2333' }}
  >
    <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '800' }}>Resumen del pedido</span>
    <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
    <div className="flex items-center">
      <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>Subtotal (4 ítems)</span>
      <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>$4.698.996</span>
    </div>
    <div className="flex items-center">
      <span style={{ flex: 1, color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>Envío</span>
      <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>Gratis</span>
    </div>
    <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
    <div className="flex items-center">
      <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '800' }}>Total</span>
      <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '22px', fontWeight: '800' }}>$4.698.996</span>
    </div>
    <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '12px' }}>en 12 cuotas sin interés de $391.583</span>
    <div
      className="flex items-center justify-center"
      style={{ backgroundColor: ctaEnabled ? '#24A8F5' : '#1B2333', borderRadius: '12px', height: '52px', cursor: ctaEnabled ? 'pointer' : 'default' }}
    >
      <span style={{ color: ctaEnabled ? '#FFFFFF' : '#AAB3C5', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
        {ctaEnabled ? 'Continuar' : 'Seleccioná un método de pago'}
      </span>
    </div>
  </div>
)

const Checkout = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ DESKTOP NAVBAR ═══════════════ */}
      <Navbar />

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px' }}
      >
        <Link to="/cart" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
            Método de pago
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>
            Paso 2 de 3
          </span>
        </div>
        <Link to="/cart" className="flex items-center no-underline">
          <X size={20} color="#AAB3C5" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div className="hidden md:flex items-center w-full" style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Método de pago</span>
      </div>

      {/* ═══════════════ MOBILE CONTENT ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '20px' }}>

        {/* Title */}
        <div className="flex flex-col" style={{ gap: '4px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '20px', fontWeight: '800' }}>
            Elegí cómo querés pagar
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
            Seleccioná tu método de pago preferido
          </span>
        </div>

        {/* Summary strip */}
        <div
          className="flex items-center"
          style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '12px 14px', gap: '10px', border: '1px solid #1B2333' }}
        >
          <CreditCard size={18} color="#24A8F5" />
          <div className="flex-1">
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>4 productos en tu carrito</span>
          </div>
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
            Total: $4.698.996
          </span>
          <ChevronRight size={16} color="#AAB3C5" />
        </div>

        {/* MercadoPago card */}
        <button
          onClick={() => navigate('/checkout/confirm/mercadopago')}
          className="flex flex-col border-none cursor-pointer text-left w-full"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '18px', gap: '12px', border: '1px solid #24A8F5' }}
        >
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
              <CreditCard size={22} color="#24A8F5" />
            </div>
            <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700' }}>
                  Pagar con MercadoPago
                </span>
              </div>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
                Tarjeta, cuotas y otros medios disponibles
              </span>
            </div>
            <ChevronRight size={18} color="#24A8F5" />
          </div>
          <div
            className="flex items-center"
            style={{ backgroundColor: '#0D2E52', borderRadius: '20px', padding: '4px 10px', gap: '4px', alignSelf: 'flex-start' }}
          >
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '600' }}>★ Recomendado</span>
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <ShieldCheck size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
              Pago seguro gestionado por MercadoPago
            </span>
          </div>
        </button>

        {/* Crypto card */}
        <button
          onClick={() => navigate('/checkout/crypto')}
          className="flex flex-col border-none cursor-pointer text-left w-full"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '18px', gap: '12px', border: '1px solid #1B2333' }}
        >
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div style={{ backgroundColor: '#1A150A', borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
              <Bitcoin size={22} color="#F59E0B" />
            </div>
            <div className="flex flex-col flex-1" style={{ gap: '2px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700' }}>
                Pagar con criptomonedas
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
                BTC, ETH o USDT
              </span>
            </div>
            <ChevronRight size={18} color="#AAB3C5" />
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <RefreshCw size={14} color="#AAB3C5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
              Conversión automática a pesos argentinos
            </span>
          </div>
        </button>

        {/* Trust badges */}
        <div className="flex items-center justify-center" style={{ gap: '16px', padding: '16px 0' }}>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <ShieldCheck size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Pago seguro</span>
          </div>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <Truck size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Envío gratis</span>
          </div>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <RefreshCw size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>30 días de devolución</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP CONTENT ═══════════════ */}
      <div className="hidden md:flex w-full" style={{ padding: '40px 80px', gap: '30px' }}>

        {/* Left */}
        <div className="flex flex-col" style={{ flex: 1, gap: '24px' }}>
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>Método de pago</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '15px' }}>Elegí cómo querés pagar tu compra</span>
          </div>

          {/* MercadoPago card */}
          <button
            onClick={() => navigate('/checkout/confirm/mercadopago')}
            className="flex items-center border-none cursor-pointer text-left"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px', gap: '16px', border: '1px solid #24A8F5', width: '100%' }}
          >
            <div style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '14px', flexShrink: 0 }}>
              <CreditCard size={26} color="#24A8F5" />
            </div>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>Pagar con MercadoPago</span>
                <div style={{ backgroundColor: '#0D2E52', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '10px', fontWeight: '600' }}>★ Recomendado</span>
                </div>
              </div>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>Tarjeta, cuotas y otros medios disponibles</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>Pago seguro gestionado por MercadoPago</span>
            </div>
            <ChevronRight size={20} color="#24A8F5" />
          </button>

          {/* Crypto card */}
          <button
            onClick={() => navigate('/checkout/crypto')}
            className="flex items-center border-none cursor-pointer text-left"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px', gap: '16px', border: '1px solid #1B2333', width: '100%' }}
          >
            <div style={{ backgroundColor: '#1A150A', borderRadius: '12px', padding: '14px', flexShrink: 0 }}>
              <Bitcoin size={26} color="#F59E0B" />
            </div>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>Pagar con criptomonedas</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>BTC, ETH o USDT · Conversión automática a pesos argentinos</span>
            </div>
            <ChevronRight size={20} color="#AAB3C5" />
          </button>
        </div>

        <SummaryPanel ctaEnabled={false} />
      </div>

      <Footer />
    </div>
  )
}

export default Checkout
