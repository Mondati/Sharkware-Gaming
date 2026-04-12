import { useState, useEffect } from 'react'
import {
  ChevronRight, Bitcoin, Hourglass, QrCode, Copy,
  ShieldCheck, Package, RotateCcw, CircleCheckBig,
  X, ArrowLeft, CreditCard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const BTC_ADDRESS = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
const INITIAL_SECONDS = 14 * 60 + 59

const CheckoutConfirmCrypto = () => {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [seconds])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const handleCopy = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>
      <Navbar />

      {/* ═══════════════ MOBILE HEADER ═══════════════ */}
      <div
        className="flex md:hidden items-center justify-between w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px' }}
      >
        <Link to="/checkout/crypto" className="flex items-center no-underline">
          <ArrowLeft size={20} color="#F5F7FA" />
        </Link>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
            Pagar con Bitcoin
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>
            Confirmá tu transferencia
          </span>
        </div>
        <Link to="/checkout/crypto" className="flex items-center no-underline">
          <X size={20} color="#AAB3C5" />
        </Link>
      </div>

      {/* ═══════════════ DESKTOP BREADCRUMB ═══════════════ */}
      <div className="hidden md:flex items-center w-full" style={{ backgroundColor: '#0A0F1C', height: '44px', padding: '0 80px', gap: '8px' }}>
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Inicio</Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Confirmá tu transferencia</span>
      </div>

      {/* ═══════════════ TIMER BANNER (both mobile & desktop) ═══════════════ */}
      <div
        className="flex items-center justify-center w-full"
        style={{ backgroundColor: '#1A1000', padding: '10px 16px', gap: '8px' }}
      >
        <Hourglass size={14} color="#F59E0B" />
        <span style={{ color: '#F59E0B', fontFamily: 'Inter', fontSize: '12px', fontWeight: '600' }}>
          Este pago expira en {mm}:{ss} — No cerrés esta pantalla
        </span>
      </div>

      {/* ═══════════════ MOBILE CONTENT ═══════════════ */}
      <div className="flex md:hidden flex-col w-full" style={{ padding: '16px', gap: '16px' }}>

        {/* QR card */}
        <div
          className="flex flex-col items-center"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '24px 16px', gap: '16px', border: '1px solid #1B2333' }}
        >
          <div
            className="flex items-center justify-center"
            style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', width: '160px', height: '160px' }}
          >
            <QrCode size={132} color="#000000" />
          </div>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', textAlign: 'center' }}>
            Escaneá para transferir exactamente:
          </span>
          <div className="flex items-center justify-center" style={{ gap: '8px' }}>
            <Bitcoin size={20} color="#F59E0B" />
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '22px', fontWeight: '700' }}>
              0.00094 BTC
            </span>
          </div>
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
            ≈ $4.698.996 ARS
          </span>
        </div>

        {/* Address card */}
        <div
          className="flex flex-col"
          style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '14px', gap: '8px', border: '1px solid #1B2333' }}
        >
          <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>
            Dirección de Bitcoin
          </span>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Inter', fontSize: '11px', wordBreak: 'break-all' }}>
              {BTC_ADDRESS}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#1B2333', borderRadius: '6px', padding: '6px', flexShrink: 0 }}
            >
              <Copy size={14} color={copied ? '#22C55E' : '#AAB3C5'} />
            </button>
          </div>
        </div>

        {/* Confirm button */}
        <button
          className="flex items-center justify-center border-none cursor-pointer w-full"
          style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '50px', gap: '10px' }}
        >
          <CircleCheckBig size={18} color="#FFFFFF" />
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
            Ya realicé la transferencia
          </span>
        </button>

        {/* Trust badges */}
        <div className="flex items-center justify-center" style={{ gap: '16px', padding: '8px 0' }}>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <ShieldCheck size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Pago seguro</span>
          </div>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <Package size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>Envío gratis</span>
          </div>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <RotateCw size={14} color="#22C55E" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '11px' }}>30 días de devolución</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP CONTENT ═══════════════ */}
      <div className="hidden md:flex items-center w-full" style={{ padding: '40px 80px', gap: '30px' }}>

        {/* Left */}
        <div className="flex flex-col" style={{ flex: 1, gap: '24px' }}>
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>Confirmá tu transferencia</span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '15px' }}>Pagar con Bitcoin · Paso 3 de 3</span>
          </div>

          {/* QR card */}
          <div
            className="flex flex-col"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '28px', gap: '16px', border: '1px solid #1B2333' }}
          >
            <div className="flex flex-col items-center" style={{ gap: '16px' }}>
              <div
                className="flex items-center justify-center"
                style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', width: '160px', height: '160px' }}
              >
                <QrCode size={132} color="#000000" />
              </div>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>
                Escaneá para transferir exactamente:
              </span>
              <div className="flex items-center justify-center" style={{ gap: '8px' }}>
                <Bitcoin size={20} color="#F59E0B" />
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700' }}>0.00094 BTC</span>
              </div>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>≈ $4.698.996 ARS</span>
            </div>
          </div>

          {/* Address card */}
          <div
            className="flex flex-col"
            style={{ backgroundColor: '#0E1424', borderRadius: '14px', padding: '16px', gap: '10px', border: '1px solid #1B2333' }}
          >
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>Dirección de Bitcoin</span>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Inter', fontSize: '12px', wordBreak: 'break-all' }}>
                {BTC_ADDRESS}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: '#1B2333', borderRadius: '6px', padding: '4px 8px', flexShrink: 0 }}
              >
                <Copy size={14} color={copied ? '#22C55E' : '#AAB3C5'} />
              </button>
            </div>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center" style={{ gap: '24px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <ShieldCheck size={14} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>Pago seguro</span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <Package size={14} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>Envío gratis</span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <RotateCw size={14} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>30 días de devolución</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          className="flex flex-col"
          style={{ width: '380px', flexShrink: 0, backgroundColor: '#0E1424', borderRadius: '14px', padding: '21px 24px 30px 24px', gap: '16px', border: '1px solid #1B2333' }}
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
          <span style={{ color: '#22C55E', fontFamily: 'Inter', fontSize: '12px' }}>en 12 cuotas sin interés de $391.583</span>
          <div style={{ backgroundColor: '#1B2333', height: '1px' }} />
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>Método de pago</span>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <Bitcoin size={18} color="#F59E0B" />
              <span style={{ flex: 1, color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>Bitcoin (BTC)</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>0.00094 BTC</span>
            </div>
          </div>
          <button
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', gap: '10px', width: '100%' }}
          >
            <CircleCheckBig size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '15px', fontWeight: '700' }}>
              Ya realicé la transferencia
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutConfirmCrypto
