import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail, Lock, LogIn, Globe, Smartphone,
  ShieldCheck, Truck, RefreshCw, Eye, EyeOff, UserRound, ArrowLeft,
} from 'lucide-react'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (email === 'admin@sharkware.com' && password === 'admin123') {
      localStorage.setItem('sw_role', 'admin')
      navigate('/admin')
    } else if (email && password) {
      localStorage.setItem('sw_role', 'user')
      navigate('/')
    } else {
      setError('Completá el email y la contraseña.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ MOBILE VERSION ═══════════════ */}
      <div className="flex md:hidden flex-col min-h-screen">
        {/* Header */}
        <div
          className="flex items-center"
          style={{ height: '56px', padding: '0 16px', gap: '12px' }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '36px', height: '36px', backgroundColor: '#1E2232', borderRadius: '8px' }}
          >
            <ArrowLeft size={18} color="#F5F7FA" />
          </button>
          <div className="flex-1" />
          <div className="flex flex-col items-center" style={{ gap: '0' }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>
              SHARKWARE
            </span>
            <span style={{ color: '#37C3FF', fontFamily: 'Inter', fontSize: '7px', fontWeight: '700', letterSpacing: '2px' }}>
              GAMING
            </span>
          </div>
          <div className="flex-1" />
          <div style={{ width: '36px' }} />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 items-center" style={{ padding: '24px 24px 40px', gap: '24px' }}>
          {/* User icon */}
          <div className="flex items-center justify-center" style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid #24A8F5' }}>
            <UserRound size={36} color="#24A8F5" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center" style={{ gap: '8px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '24px', fontWeight: '800' }}>
              Bienvenido
            </span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', textAlign: 'center' }}>
              Ingresá a tu cuenta o creá una nueva
            </span>
          </div>

          {/* Tab Switcher */}
          <div
            className="flex w-full"
            style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '4px' }}
          >
            <button
              onClick={() => setActiveTab('login')}
              className="flex items-center justify-center flex-1 border-none cursor-pointer"
              style={{
                height: '40px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'login' ? '#24A8F5' : 'transparent',
                color: activeTab === 'login' ? '#FFFFFF' : '#AAB3C5',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: activeTab === 'login' ? '700' : 'normal',
              }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className="flex items-center justify-center flex-1 border-none cursor-pointer"
              style={{
                height: '40px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'register' ? '#24A8F5' : 'transparent',
                color: activeTab === 'register' ? '#FFFFFF' : '#AAB3C5',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: activeTab === 'register' ? '700' : 'normal',
              }}
            >
              Registrarse
            </button>
          </div>

          {/* Email */}
          <div className="flex flex-col w-full" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Email</span>
            <div
              className="flex items-center"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
            >
              <Mail size={18} color="#AAB3C5" />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none w-full"
                style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col w-full" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Contraseña</span>
            <div
              className="flex items-center"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
            >
              <Lock size={18} color="#AAB3C5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none w-full"
                style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px' }}
              />
              <button
                onClick={() => setShowPassword(v => !v)}
                className="flex items-center border-none cursor-pointer"
                style={{ background: 'none', padding: 0 }}
              >
                {showPassword ? <Eye size={18} color="#AAB3C5" /> : <EyeOff size={18} color="#AAB3C5" />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end w-full">
            <button className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
              <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
                ¿Olvidaste tu contraseña?
              </span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <span style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </span>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            className="flex items-center justify-center border-none cursor-pointer w-full"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', gap: '10px' }}
          >
            <LogIn size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
              Ingresar
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center w-full" style={{ gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>o continúa con</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
          </div>

          {/* Social buttons */}
          <div className="flex w-full" style={{ gap: '12px' }}>
            <button
              className="flex flex-1 items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', gap: '8px', border: '1px solid #1B2333' }}
            >
              <Globe size={18} color="#F5F7FA" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>Google</span>
            </button>
            <button
              className="flex flex-1 items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', gap: '8px', border: '1px solid #1B2333' }}
            >
              <Smartphone size={18} color="#F5F7FA" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>Apple</span>
            </button>
          </div>

          {/* Register link */}
          <div className="flex items-center justify-center" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
              ¿No tenés cuenta?
            </span>
            <button
              onClick={() => setActiveTab('register')}
              className="border-none cursor-pointer"
              style={{ background: 'none', padding: 0 }}
            >
              <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
                Registrate
              </span>
            </button>
          </div>

          {/* Terms */}
          <div className="flex flex-col items-center" style={{ gap: '4px', marginTop: 'auto' }}>
            <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px', textAlign: 'center' }}>
              Al continuar aceptás nuestros
            </span>
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '12px', textAlign: 'center' }}>
              Términos y Política de Privacidad
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP VERSION ═══════════════ */}
      <div className="hidden md:flex" style={{ minHeight: '100vh', backgroundColor: '#070B16' }}>

        {/* ── Left Panel ── */}
        <div
          className="flex flex-col justify-center"
          style={{ width: '50%', backgroundColor: '#0A0F1C', padding: '60px', gap: '32px' }}
        >
          {/* Logo */}
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#37C3FF', flexShrink: 0 }} />
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>
                SHARKWARE
              </span>
            </div>
            <span style={{ color: '#37C3FF', fontFamily: 'Inter', fontSize: '11px', fontWeight: '800', letterSpacing: '4px', paddingLeft: '18px' }}>
              GAMING
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '36px', fontWeight: '800', lineHeight: '1.25', margin: 0 }}>
            Tu gear, a un click de distancia
          </h1>

          {/* Subtext */}
          <p style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
            Accedé a las mejores ofertas en gaming gear, notebooks, GPUs y periféricos de última generación.
          </p>

          {/* Stats */}
          <div className="flex items-center" style={{ gap: '24px' }}>
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ color: '#37C3FF', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>10K+</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Clientes</span>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#1B2333' }} />
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ color: '#37C3FF', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>500+</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Productos</span>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#1B2333' }} />
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ color: '#37C3FF', fontFamily: 'Inter', fontSize: '28px', fontWeight: '800' }}>4.9★</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Rating</span>
            </div>
          </div>

          {/* Trust row */}
          <div className="flex items-center" style={{ gap: '20px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <ShieldCheck size={16} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Compra segura</span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <Truck size={16} color="#24A8F5" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>Envío gratis</span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <RefreshCw size={16} color="#F59E0B" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px' }}>30 días devolución</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div
          className="flex items-center justify-center"
          style={{ width: '50%', backgroundColor: '#070B16' }}
        >
          {/* Form Card */}
          <div
            className="flex flex-col"
            style={{ width: '440px', backgroundColor: '#0E1424', borderRadius: '20px', padding: '40px', gap: '24px', border: '1px solid #1B2333' }}
          >
            {/* Form Header */}
            <div className="flex flex-col items-center" style={{ gap: '8px' }}>
              <UserRound size={40} color="#24A8F5" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '24px', fontWeight: '800' }}>
                Bienvenido de vuelta
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px', textAlign: 'center' }}>
                Ingresá a tu cuenta de Sharkware Gaming
              </span>
            </div>

            {/* Tab Switcher */}
            <div
              className="flex"
              style={{ backgroundColor: '#070B16', borderRadius: '10px', padding: '4px' }}
            >
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center justify-center flex-1 border-none cursor-pointer"
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'login' ? '#24A8F5' : 'transparent',
                  color: activeTab === 'login' ? '#FFFFFF' : '#AAB3C5',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: activeTab === 'login' ? '700' : 'normal',
                }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="flex items-center justify-center flex-1 border-none cursor-pointer"
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'register' ? '#24A8F5' : 'transparent',
                  color: activeTab === 'register' ? '#FFFFFF' : '#AAB3C5',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: activeTab === 'register' ? '700' : 'normal',
                }}
              >
                Registrarse
              </button>
            </div>

            {/* Email */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Email</span>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
              >
                <Mail size={16} color="#AAB3C5" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>Contraseña</span>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
              >
                <Lock size={16} color="#AAB3C5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px' }}
                />
                <button
                  onClick={() => setShowPassword(v => !v)}
                  className="flex items-center border-none cursor-pointer"
                  style={{ background: 'none', padding: 0 }}
                >
                  {showPassword ? <Eye size={16} color="#AAB3C5" /> : <EyeOff size={16} color="#AAB3C5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600' }}>
                  ¿Olvidaste tu contraseña?
                </span>
              </button>
            </div>

            {/* Error */}
            {error && (
              <span style={{ color: '#EF4444', fontFamily: 'Inter', fontSize: '13px', textAlign: 'center' }}>
                {error}
              </span>
            )}

            {/* Login / Register button */}
            <button
              onClick={activeTab === 'login' ? handleLogin : undefined}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', gap: '10px', width: '100%' }}
            >
              <LogIn size={18} color="#FFFFFF" />
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '800' }}>
                {activeTab === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '12px' }}>o continúa con</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
            </div>

            {/* Social buttons */}
            <div className="flex" style={{ gap: '12px' }}>
              <button
                className="flex flex-1 items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '44px', gap: '8px', border: '1px solid #1B2333' }}
              >
                <Globe size={18} color="#F5F7FA" />
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>Google</span>
              </button>
              <button
                className="flex flex-1 items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '44px', gap: '8px', border: '1px solid #1B2333' }}
              >
                <Smartphone size={18} color="#F5F7FA" />
                <span style={{ color: '#F5F7FA', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>Apple</span>
              </button>
            </div>

            {/* Register / Login link */}
            <div className="flex items-center justify-center" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
                {activeTab === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
              </span>
              <button
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                className="border-none cursor-pointer"
                style={{ background: 'none', padding: 0 }}
              >
                <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
                  {activeTab === 'login' ? 'Registrate' : 'Iniciá sesión'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
