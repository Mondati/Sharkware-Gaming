import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail, Lock, LogIn,
  ShieldCheck, Truck, RefreshCw, Eye, EyeOff, UserRound, ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()
  const { login, register, showToast } = useAuth()

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const PASS_RE = /^(?=.*[a-zA-Z])(?=.*\d).+$/

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setErrors({})
    setFormError('')
  }

  const clearFieldError = (field) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleLogin = async () => {
    const next = {}
    if (!EMAIL_RE.test(email)) next.email = 'Ingresá un email válido.'
    if (!password) next.password = 'Ingresá tu contraseña.'
    if (Object.keys(next).length) { setErrors(next); return }

    try {
      const u = await login({ email, password })
      showToast(`¡Bienvenido/a, ${u.name}!`)
      navigate(u.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setPassword('')
      if (err.status === 400 && err.fields) setErrors(err.fields)
      else if (err.status === 401) setFormError('Credenciales inválidas.')
      else setFormError('Ocurrió un error. Intentá de nuevo.')
    }
  }

  const handleSubmit = () => {
    if (activeTab === 'login') handleLogin()
    else handleRegister()
  }

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleRegister = async () => {
    const next = {}
    const nameVal = name.trim()
    if (!nameVal || nameVal.length < 2 || nameVal.length > 100 || !/^[a-zA-ZÀ-ÿ\s]+$/.test(nameVal))
      next.name = 'El nombre debe tener entre 2 y 100 letras.'
    if (!EMAIL_RE.test(email) || email.length > 120)
      next.email = 'Ingresá un email válido.'
    if (password.length < 8 || password.length > 72 || !PASS_RE.test(password))
      next.password = 'Mínimo 8 caracteres, al menos una letra y un número.'
    if (Object.keys(next).length) { setErrors(next); return }

    try {
      const u = await register({ name: nameVal, email, password })
      showToast(`¡Cuenta creada con éxito! Bienvenido/a, ${u.name}`)
      navigate('/')
    } catch (err) {
      setPassword('')
      if (err.status === 400 && err.fields) setErrors(err.fields)
      else if (err.status === 409) setErrors({ email: 'Ya existe una cuenta con ese email.' })
      else setFormError('Ocurrió un error. Intentá de nuevo.')
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

        {/* Content */}
        <div className="flex flex-col flex-1 items-center" style={{ padding: '24px 24px 40px', gap: '24px' }}>
          {/* User icon */}
          <div className="flex items-center justify-center" style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid #24A8F5' }}>
            <UserRound size={36} color="#24A8F5" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center" style={{ gap: '8px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '24px', fontWeight: '800' }}>
              Bienvenido
            </span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', textAlign: 'center' }}>
              Ingresá a tu cuenta o creá una nueva
            </span>
          </div>

          {/* Tab Switcher */}
          <div
            className="flex w-full"
            style={{ backgroundColor: '#0E1424', borderRadius: '10px', padding: '4px' }}
          >
            <button
              onClick={() => handleTabChange('login')}
              className="flex items-center justify-center flex-1 border-none cursor-pointer"
              style={{
                height: '40px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'login' ? '#24A8F5' : 'transparent',
                color: activeTab === 'login' ? '#FFFFFF' : '#AAB3C5',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: activeTab === 'login' ? '700' : 'normal',
              }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className="flex items-center justify-center flex-1 border-none cursor-pointer"
              style={{
                height: '40px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'register' ? '#24A8F5' : 'transparent',
                color: activeTab === 'register' ? '#FFFFFF' : '#AAB3C5',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: activeTab === 'register' ? '700' : 'normal',
              }}
            >
              Registrarse
            </button>
          </div>

          {/* Nombre (solo registro) */}
          {activeTab === 'register' && (
            <div className="flex flex-col w-full" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Nombre</span>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: `1px solid ${errors.name ? '#EF4444' : '#1B2333'}` }}
              >
                <UserRound size={18} color="#AAB3C5" />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => { setName(e.target.value); clearFieldError('name') }}
                  onKeyDown={onEnter}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
                />
              </div>
              {errors.name && <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{errors.name}</span>}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col w-full" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Email</span>
            <div
              className="flex items-center"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: `1px solid ${errors.email ? '#EF4444' : '#1B2333'}` }}
            >
              <Mail size={18} color="#AAB3C5" />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); clearFieldError('email') }}
                onKeyDown={onEnter}
                className="bg-transparent border-none outline-none w-full"
                style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
              />
            </div>
            {errors.email && <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col w-full" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Contraseña</span>
            <div
              className="flex items-center"
              style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '48px', padding: '0 16px', gap: '10px', border: `1px solid ${errors.password ? '#EF4444' : '#1B2333'}` }}
            >
              <Lock size={18} color="#AAB3C5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); clearFieldError('password') }}
                onKeyDown={onEnter}
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
            {errors.password && <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{errors.password}</span>}
          </div>

          {/* Forgot password (solo login) */}
          {activeTab === 'login' && (
            <div className="flex justify-end w-full">
              <button className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                  ¿Olvidaste tu contraseña?
                </span>
              </button>
            </div>
          )}

          {/* Error general */}
          {formError && (
            <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
              {formError}
            </span>
          )}

          {/* Botón principal */}
          <button
            onClick={activeTab === 'login' ? handleLogin : handleRegister}
            className="flex items-center justify-center border-none cursor-pointer w-full"
            style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '52px', gap: '10px' }}
          >
            <LogIn size={18} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '800' }}>
              {activeTab === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </span>
          </button>

          {/* Link alternativo login/registro */}
          <div className="flex items-center justify-center" style={{ gap: '6px' }}>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px' }}>
              {activeTab === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
            </span>
            <button
              onClick={() => handleTabChange(activeTab === 'login' ? 'register' : 'login')}
              className="border-none cursor-pointer"
              style={{ background: 'none', padding: 0 }}
            >
              <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
                {activeTab === 'login' ? 'Registrate' : 'Iniciá sesión'}
              </span>
            </button>
          </div>

          {/* Terms */}
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
      <div className="hidden md:flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#070B16' }}>

        {/* ── Left Panel ── */}
        <div
          className="flex flex-col justify-center"
          style={{ width: '50%', height: '100%', backgroundColor: '#0A0F1C', padding: '60px', gap: '32px' }}
        >
          {/* Logo */}
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

          {/* Headline */}
          <h1 style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '36px', fontWeight: '600', lineHeight: '1.25', margin: 0 }}>
            Tu gear, a un click de distancia
          </h1>

          {/* Subtext */}
          <p style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
            Accedé a las mejores ofertas en gaming gear, notebooks, GPUs y periféricos de última generación.
          </p>

          {/* Stats */}
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

          {/* Trust row */}
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

        {/* ── Right Panel ── */}
        <div
          className="flex items-center justify-center"
          style={{ width: '50%', height: '100%', backgroundColor: '#070B16' }}
        >
          {/* Form Card */}
          <div
            className="flex flex-col"
            style={{ width: '420px', backgroundColor: '#0E1424', borderRadius: '20px', padding: '28px 36px', gap: '16px', border: '1px solid #1B2333' }}
          >
            {/* Form Header */}
            <div className="flex flex-col items-center" style={{ gap: '6px' }}>
              <UserRound size={28} color="#24A8F5" />
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '20px', fontWeight: '800' }}>
                {activeTab === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
                {activeTab === 'login' ? 'Ingresá a tu cuenta de Sharkware Gaming' : 'Completá los datos para registrarte'}
              </span>
            </div>

            {/* Tab Switcher */}
            <div
              className="flex"
              style={{ backgroundColor: '#070B16', borderRadius: '10px', padding: '4px' }}
            >
              <button
                onClick={() => handleTabChange('login')}
                className="flex items-center justify-center flex-1 border-none cursor-pointer"
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'login' ? '#24A8F5' : 'transparent',
                  color: activeTab === 'login' ? '#FFFFFF' : '#AAB3C5',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: activeTab === 'login' ? '700' : 'normal',
                }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => handleTabChange('register')}
                className="flex items-center justify-center flex-1 border-none cursor-pointer"
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'register' ? '#24A8F5' : 'transparent',
                  color: activeTab === 'register' ? '#FFFFFF' : '#AAB3C5',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: activeTab === 'register' ? '700' : 'normal',
                }}
              >
                Registrarse
              </button>
            </div>

            {/* Nombre (solo registro) */}
            {activeTab === 'register' && (
              <div className="flex flex-col" style={{ gap: '5px' }}>
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Nombre</span>
                <div
                  className="flex items-center"
                  style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '44px', padding: '0 16px', gap: '10px', border: `1px solid ${errors.name ? '#EF4444' : '#1B2333'}` }}
                >
                  <UserRound size={16} color="#AAB3C5" />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={e => { setName(e.target.value); clearFieldError('name') }}
                    onKeyDown={onEnter}
                    className="bg-transparent border-none outline-none w-full"
                    style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
                  />
                </div>
                {errors.name && <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{errors.name}</span>}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col" style={{ gap: '5px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Email</span>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '44px', padding: '0 16px', gap: '10px', border: `1px solid ${errors.email ? '#EF4444' : '#1B2333'}` }}
              >
                <Mail size={16} color="#AAB3C5" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearFieldError('email') }}
                  onKeyDown={onEnter}
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px' }}
                />
              </div>
              {errors.email && <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col" style={{ gap: '5px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Contraseña</span>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#070B16', borderRadius: '10px', height: '44px', padding: '0 16px', gap: '10px', border: `1px solid ${errors.password ? '#EF4444' : '#1B2333'}` }}
              >
                <Lock size={16} color="#AAB3C5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearFieldError('password') }}
                  onKeyDown={onEnter}
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
              {errors.password && <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{errors.password}</span>}
            </div>

            {/* Forgot password (solo login) */}
            {activeTab === 'login' && (
              <div className="flex justify-end">
                <button className="border-none cursor-pointer" style={{ background: 'none', padding: 0 }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
                    ¿Olvidaste tu contraseña?
                  </span>
                </button>
              </div>
            )}

            {/* Error general */}
            {formError && (
              <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '13px', textAlign: 'center' }}>
                {formError}
              </span>
            )}

            {/* Botón principal */}
            <button
              onClick={activeTab === 'login' ? handleLogin : handleRegister}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{ backgroundColor: '#24A8F5', borderRadius: '12px', height: '46px', gap: '10px', width: '100%' }}
            >
              <LogIn size={18} color="#FFFFFF" />
              <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '800' }}>
                {activeTab === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </span>
            </button>

            {/* Link alternativo login/registro */}
            <div className="flex items-center justify-center" style={{ gap: '6px' }}>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
                {activeTab === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
              </span>
              <button
                onClick={() => handleTabChange(activeTab === 'login' ? 'register' : 'login')}
                className="border-none cursor-pointer"
                style={{ background: 'none', padding: 0 }}
              >
                <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '700' }}>
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
