import { useState } from 'react'
import { ChevronRight, Bitcoin, Coins, DollarSign } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const cryptoOptions = [
  { id: 'btc', label: 'Bitcoin', ticker: 'BTC', amount: '0.00094 BTC', icon: Bitcoin, iconColor: '#F59E0B', bg: '#1A150A', borderActive: '#F59E0B' },
  { id: 'eth', label: 'Ethereum', ticker: 'ETH', amount: '0.01482 ETH', icon: Coins, iconColor: '#6366F1', bg: '#0F0F1A', borderActive: '#6366F1' },
  { id: 'usdt', label: 'Tether', ticker: 'USDT', amount: '4.698,99 USDT', icon: DollarSign, iconColor: '#22C55E', bg: '#0A1A0F', borderActive: '#22C55E' },
]

const CheckoutCrypto = () => {
  const [selected, setSelected] = useState('btc')
  const navigate = useNavigate()
  const active = cryptoOptions.find(c => c.id === selected)

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="flex items-center w-full" style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="#1B2333" />
        <Link to="/checkout" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Método de pago</Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Pagar con cripto</span>
      </div>

      {/* Main */}
      <div className="flex w-full" style={{ padding: '40px 80px', gap: '30px' }}>

        {/* Left */}
        <div className="flex flex-col" style={{ flex: 1, gap: '24px' }}>
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>Pagar con criptomonedas</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '15px' }}>Seleccioná la moneda con la que querés pagar</span>
          </div>

          <div className="flex flex-col" style={{ gap: '12px' }}>
            {cryptoOptions.map(opt => {
              const Icon = opt.icon
              const isActive = selected === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className="flex items-center border-none cursor-pointer text-left"
                  style={{
                    backgroundColor: '#0E1424',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    gap: '16px',
                    border: `1px solid ${isActive ? opt.borderActive : '#1B2333'}`,
                    width: '100%',
                  }}
                >
                  <div style={{ backgroundColor: opt.bg, borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
                    <Icon size={24} color={opt.iconColor} />
                  </div>
                  <div className="flex flex-col" style={{ flex: 1, gap: '4px' }}>
                    <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700' }}>
                      {opt.label} <span style={{ color: '#AAB3C5', fontWeight: '400' }}>({opt.ticker})</span>
                    </span>
                    <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
                      Equivalente: {opt.amount}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${isActive ? opt.borderActive : '#1B2333'}`,
                      backgroundColor: isActive ? opt.borderActive : 'transparent',
                      flexShrink: 0,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Right */}
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
            <span style={{ color: '#FF8400', fontFamily: 'Inter', fontSize: '22px', fontWeight: '800' }}>$4.698.996</span>
          </div>
          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
          <div className="flex items-center" style={{ gap: '10px' }}>
            <active.icon size={18} color={active.iconColor} />
            <div className="flex flex-col" style={{ gap: '2px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>Pagás con</span>
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>
                {active.amount}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout/confirm/crypto')}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', width: '100%' }}
          >
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
              Continuar con {active.label}
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutCrypto
