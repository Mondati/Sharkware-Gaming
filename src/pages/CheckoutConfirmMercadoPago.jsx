import { ChevronRight, Wallet, CreditCard, Smartphone, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CheckoutConfirmMercadoPago = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="flex items-center w-full" style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Confirmar pedido</span>
      </div>

      {/* Main */}
      <div className="flex w-full" style={{ padding: '40px 80px', gap: '32px' }}>

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
            <span style={{ color: '#FF8400', fontFamily: 'Inter', fontSize: '22px', fontWeight: '800' }}>$4.698.996</span>
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
