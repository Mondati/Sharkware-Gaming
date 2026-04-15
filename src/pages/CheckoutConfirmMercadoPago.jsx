import {
  ChevronRight, Wallet, CreditCard, Smartphone, Calendar,
  ShieldCheck, Truck, RefreshCw, X, ArrowLeft, Lock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CheckoutConfirmMercadoPago = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>
      <Navbar />

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px' }}
      >
        <Link to="/checkout" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
            Confirmar pedido
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>
            Paso 3 de 3
          </span>
        </div>
        <Link to="/checkout" className="flex items-center no-underline">
          <X size={20} color="#AAB3C5" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div className="hidden md:flex items-center w-full" style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Confirmar pedido</span>
      </div>

      {/* ═══════════════ MOBILE CONTENT ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '20px' }}>

        {/* Order summary */}
        <div
          className="flex flex-col"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '16px', gap: '12px', border: '1px solid #1B2333' }}
        >
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
            Resumen del pedido
          </span>
          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
              Subtotal (4 ítems)
            </span>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
              $4.698.996
            </span>
          </div>

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Envío</span>
            <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>Gratis</span>
          </div>

          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center">
            <span className="flex-1" style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>Total</span>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '22px', fontWeight: '800' }}>
              $4.698.996
            </span>
          </div>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>
            en 12 cuotas sin interés de $391.583
          </span>
        </div>

        {/* MercadoPago card */}
        <div
          className="flex flex-col"
          style={{
            backgroundColor: '#0E1424',
            borderRadius: '14px',
            padding: '18px',
            gap: '14px',
            borderTop: '3px solid #24A8F5',
            borderLeft: '1px solid #1B2333',
            borderRight: '1px solid #1B2333',
            borderBottom: '1px solid #1B2333',
          }}
        >
          {/* Header */}
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
              <Wallet size={22} color="#24A8F5" />
            </div>
            <div className="flex flex-col" style={{ gap: '2px' }}>
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700' }}>
                MercadoPago
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
                Método de pago seleccionado
              </span>
            </div>
          </div>

          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.5' }}>
            Serás redirigido a MercadoPago para completar tu pago de forma segura.
          </span>

          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center" style={{ gap: '8px' }}>
            <CreditCard size={16} color="#24A8F5" />
            <Smartphone size={16} color="#24A8F5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
              Tarjeta · Efectivo · Billetera virtual
            </span>
          </div>

          <div className="flex items-center" style={{ gap: '8px' }}>
            <Calendar size={16} color="#22C55E" />
            <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '12px', fontWeight: '600' }}>
              Hasta 12 cuotas sin interés
            </span>
          </div>
        </div>

        {/* Checkout button */}
        <button
          className="flex items-center justify-center border-none cursor-pointer w-full"
          style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '50px', gap: '10px' }}
        >
          <Lock size={18} color="#FFFFFF" />
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '800' }}>
            Continuar con MercadoPago
          </span>
        </button>

        {/* Trust badges */}
        <div className="flex flex-col items-center" style={{ gap: '8px' }}>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <ShieldCheck size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
              Transacción protegida con cifrado SSL
            </span>
          </div>
          <div className="flex items-center justify-center" style={{ gap: '16px' }}>
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
      </div>

      {/* ═══════════════ DESKTOP CONTENT ═══════════════ */}
      <div className="hidden md:flex w-full" style={{ padding: '40px 80px', gap: '32px' }}>

        {/* Left */}
        <div className="flex flex-col" style={{ flex: 1, gap: '24px' }}>
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>Confirmar pedido</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '15px' }}>Completá el pago de forma segura con MercadoPago</span>
          </div>

          {/* MercadoPago card */}
          <div
            className="flex flex-col"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px', gap: '16px', borderTop: '3px solid #24A8F5', borderLeft: '1px solid #1B2333', borderRight: '1px solid #1B2333', borderBottom: '1px solid #1B2333' }}
          >
            {/* Header */}
            <div className="flex items-center" style={{ gap: '14px' }}>
              <div style={{ backgroundColor: '#0A1F3F', borderRadius: '12px', padding: '14px', flexShrink: 0 }}>
                <Wallet size={26} color="#24A8F5" />
              </div>
              <div className="flex flex-col" style={{ gap: '4px' }}>
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700' }}>MercadoPago</span>
                <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Pago seguro con tu cuenta</span>
              </div>
            </div>

            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
              Serás redirigido a MercadoPago para completar el pago de forma segura.
            </span>

            <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

            <div className="flex items-center" style={{ gap: '12px' }}>
              <CreditCard size={18} color="#24A8F5" />
              <Smartphone size={18} color="#24A8F5" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px' }}>
                Tarjeta de crédito / débito &nbsp;·&nbsp; App MercadoPago
              </span>
            </div>

            <div className="flex items-center" style={{ gap: '12px' }}>
              <Calendar size={18} color="#22C55E" />
              <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '14px' }}>Hasta 12 cuotas sin interés</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          className="flex flex-col"
          style={{ width: '380px', flexShrink: 0, backgroundColor: '#0E1424', borderRadius: '14px', padding: '37px 24px 24px 24px', gap: '25px', border: '1px solid #1B2333' }}
        >
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '800' }}>Resumen del pedido</span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Subtotal: $4.698.996 &nbsp;·&nbsp; Envío gratis</span>

          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />

          <div className="flex items-center">
            <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Inter', fontSize: '18px', fontWeight: '800' }}>Total</span>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '22px', fontWeight: '800' }}>$4.698.996</span>
          </div>

          <button
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', width: '100%' }}
          >
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
              Continuar con MercadoPago
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutConfirmMercadoPago
