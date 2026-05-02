import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail, Lock, UserPlus, Globe, Smartphone,
  ShieldCheck, Truck, RefreshCw, Eye, EyeOff, UserRound, ArrowLeft, User,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    if (!name.trim()) return 'Ingresá tu nombre.'
    if (name.length > 100) return 'El nombre no puede superar 100 caracteres.'
    if (!email.trim()) return 'Ingresá tu email.'
    if (!EMAIL_RE.test(email)) return 'El email no tiene un formato válido.'
    if (email.length > 120) return 'El email no puede superar 120 caracteres.'
    if (!password) return 'Ingresá una contraseña.'
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (password.length > 72) return 'La contraseña no puede superar 72 caracteres.'
    return ''
  }

  const handleSubmit = async () => {
    const v = validate()
    if (v) { setError(v); return }
    setError('')
    setSubmitting(true)
    try {
      const user = await register({ name, email, password })
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      if (err?.status === 409) setError('Ese email ya está registrado.')
      else if (err?.status === 400) setError(err.message || 'Datos inválidos.')
      else setError('Ocurrió un error. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* ═══════════════ MOBILE VERSION ═══════════════ */}
      <div className="flex md:hidden flex-col min-h-screen">
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
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>
              SHARKWARE
            </span>
            <span style={{ color: '#37C3FF', fontFamily: 'Poppins', fontSize: '7px', fontWeight: '700', letterSpacing: '2px' }}>
              GAMING
            </span>
          </div>
          <div className="flex-1" />
          <div style={{ width: '36px' }} />
        </div>

        <div className="flex flex-col flex-1 items-center" style={{ padding: '24px 24px 40px', gap: '24px' }}>
          <div className="flex items-center justify-center" style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid #24A8F5' }}>
            <UserRound size={36} color="#24A8F5" />
          </div>

          <div className="flex flex-col items-center" style={{ gap: '8px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
              Creá tu cuenta
            </span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', textAlign: 'center' }}>
              Sumate a Sharkware Gaming en un minuto
            </span>
          </div>

          <div
            className="flex w-full"
            style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '4px' }}
          >
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center flex-1 border-none cursor-pointer"
              style={{
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#AAB3C5',
                fontFamily: 'Poppins',
                fontSize: '14px',
              }}
            >
              Iniciar sesión
            </button>
            <button
              className="flex items-center justify-center flex-1 border-none cursor-pointer"
              style={{
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#24A8F5',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '700',
              }}
            >
              Registrarse
            </button>
          </div>

          {/* Name */}
          <div className="flex flex-col w-full" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Nombre</span>
            <div
              className="flex items-center"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
            >
              <User size={18} color="#AAB3C5" />
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={100}
                className="bg-transparent border-none outline-none w-full"
                style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col w-full" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Email</span>
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
                maxLength={120}
                className="bg-transparent border-none outline-none w-full"
                style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col w-full" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Contraseña</span>
            <div
              className="flex items-center"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
            >
              <Lock size={18} color="#AAB3C5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={72}
                className="bg-transparent border-none outline-none w-full"
                style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
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

          {error && (
            <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </span>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center border-none cursor-pointer w-full"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', gap: '10px', opacity: submitting ? 0.7 : 1 }}
          >
            <UserPlus size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </span>
          </button>

          <div className="flex items-center w-full" style={{ gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>o continúa con</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
          </div>

          <div className="flex w-full" style={{ gap: '12px' }}>
            <button
              className="flex flex-1 items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', gap: '8px', border: '1px solid #1B2333' }}
            >
              <Globe size={18} color="#F5F7FA" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>Google</span>
            </button>
            <button
              className="flex flex-1 items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', gap: '8px', border: '1px solid #1B2333' }}
            >
              <Smartphone size={18} color="#F5F7FA" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>Apple</span>
            </button>
          </div>

          <div className="flex items-center justify-center" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
              ¿Ya tenés cuenta?
            </span>
            <button
              onClick={() => navigate('/login')}
              className="border-none cursor-pointer"
              style={{ background: 'none', padding: 0 }}
            >
              <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                Iniciá sesión
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center" style={{ gap: '4px', marginTop: 'auto' }}>
            <span style={{ color: '#8890A4', fontFamily: 'Poppins', fontSize: '12px', textAlign: 'center' }}>
              Al continuar aceptás nuestros
            </span>
            <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '12px', textAlign: 'center' }}>
              Términos y Política de Privacidad
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP VERSION ═══════════════ */}
      <div className="hidden md:flex" style={{ minHeight: '100vh', backgroundColor: '#070B16' }}>

        <div
          className="flex flex-col justify-center"
          style={{ width: '50%', backgroundColor: '#0A0F1C', padding: '60px', gap: '32px' }}
        >
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#37C3FF', flexShrink: 0 }} />
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>
                SHARKWARE
              </span>
            </div>
            <span style={{ color: '#37C3FF', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '800', letterSpacing: '4px', paddingLeft: '18px' }}>
              GAMING
            </span>
          </div>

          <h1 style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '36px', fontWeight: '800', lineHeight: '1.25', margin: 0 }}>
            Unite a la comunidad gamer
          </h1>

          <p style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
            Creá tu cuenta y guardá tu carrito, seguí tus pedidos y accedé a ofertas exclusivas.
          </p>

          <div className="flex items-center" style={{ gap: '24px' }}>
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ color: '#37C3FF', fontFamily: 'Poppins', fontSize: '28px', fontWeight: '800' }}>10K+</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Clientes</span>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#1B2333' }} />
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ color: '#37C3FF', fontFamily: 'Poppins', fontSize: '28px', fontWeight: '800' }}>500+</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Productos</span>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#1B2333' }} />
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ color: '#37C3FF', fontFamily: 'Poppins', fontSize: '28px', fontWeight: '800' }}>4.9★</span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Rating</span>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: '20px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <ShieldCheck size={16} color="#22C55E" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Compra segura</span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <Truck size={16} color="#24A8F5" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>Envío gratis</span>
            </div>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <RefreshCw size={16} color="#F59E0B" />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>30 días devolución</span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-center"
          style={{ width: '50%', backgroundColor: '#070B16' }}
        >
          <div
            className="flex flex-col"
            style={{ width: '440px', backgroundColor: '#0E1424', borderRadius: '20px', padding: '40px', gap: '24px', border: '1px solid #1B2333' }}
          >
            <div className="flex flex-col items-center" style={{ gap: '8px' }}>
              <UserRound size={40} color="#24A8F5" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
                Creá tu cuenta
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', textAlign: 'center' }}>
                Registrate y empezá a comprar en Sharkware Gaming
              </span>
            </div>

            <div
              className="flex"
              style={{ backgroundColor: '#070B16', borderRadius: '10px', padding: '4px' }}
            >
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center flex-1 border-none cursor-pointer"
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#AAB3C5',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                }}
              >
                Iniciar sesión
              </button>
              <button
                className="flex items-center justify-center flex-1 border-none cursor-pointer"
                style={{
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#24A8F5',
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: '700',
                }}
              >
                Registrarse
              </button>
            </div>

            {/* Name */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Nombre</span>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
              >
                <User size={16} color="#AAB3C5" />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={100}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Email</span>
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
                  maxLength={120}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Contraseña</span>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: '1px solid #1B2333' }}
              >
                <Lock size={16} color="#AAB3C5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  maxLength={72}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
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

            {error && (
              <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
                {error}
              </span>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', gap: '10px', width: '100%', opacity: submitting ? 0.7 : 1 }}
            >
              <UserPlus size={18} color="#FFFFFF" />
              <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
                {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </span>
            </button>

            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>o continúa con</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1B2333' }} />
            </div>

            <div className="flex" style={{ gap: '12px' }}>
              <button
                className="flex flex-1 items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '44px', gap: '8px', border: '1px solid #1B2333' }}
              >
                <Globe size={18} color="#F5F7FA" />
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>Google</span>
              </button>
              <button
                className="flex flex-1 items-center justify-center border-none cursor-pointer"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '44px', gap: '8px', border: '1px solid #1B2333' }}
              >
                <Smartphone size={18} color="#F5F7FA" />
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>Apple</span>
              </button>
            </div>

            <div className="flex items-center justify-center" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
                ¿Ya tenés cuenta?
              </span>
              <button
                onClick={() => navigate('/login')}
                className="border-none cursor-pointer"
                style={{ background: 'none', padding: 0 }}
              >
                <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                  Iniciá sesión
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
