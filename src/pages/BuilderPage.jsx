import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, Loader, Cpu, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../hooks/useWindowWidth'
import Footer from '../components/Footer'
import BuildCard from '../components/BuildCard'
import { sendBuilderMessage } from '../api/builder'

const MONO = 'Poppins, sans-serif'
const HERO = '"Rajdhani", "Poppins", sans-serif'

const QUICK_CHIPS = [
  'Gaming 1080p AMD, presupuesto 1.000.000',
  'Trabajo + algún juego Intel, 1.500.000',
  'Streaming + edición, 2.500.000',
]

const WELCOME = '¡Hola! Soy tu asistente para armar PCs. Decime tu presupuesto en ARS y qué uso le vas a dar (gaming, trabajo, streaming) y te armo una build compatible con stock real.'

const BuilderPage = () => {
  const { sidePadding } = useWindowWidth()
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME }])
  const [conversationId, setConversationId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || loading) return
    setMessages(m => [...m, { role: 'user', text: message }])
    setInput('')
    setLoading(true)
    try {
      const res = await sendBuilderMessage({ conversationId, message })
      setConversationId(res.conversationId)
      setMessages(m => [...m, { role: 'bot', text: res.reply, build: res.build ?? null }])
    } catch (err) {
      const msg = err.status === 503
        ? 'El asistente está saturado, probá en un momento.'
        : 'No pude procesar el mensaje. Intentá de nuevo.'
      setMessages(m => [...m, { role: 'bot', text: msg }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* Mobile header */}
      <div
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px', gap: '10px' }}
      >
        <Cpu size={18} color="#24A8F5" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
          Armá tu PC
        </span>
      </div>

      {/* Desktop breadcrumb */}
      <div
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '44px', padding: `0 ${sidePadding}`, gap: '8px' }}
      >
        <Link to="/" className="no-underline" style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
          Inicio
        </Link>
        <ChevronRight size={14} color="#1B2333" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
          Armá tu PC
        </span>
      </div>

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          padding: `56px ${sidePadding} 40px`,
          backgroundColor: '#070B16',
          backgroundImage:
            'radial-gradient(60% 50% at 80% 0%, rgba(36,168,245,0.18) 0%, transparent 60%),' +
            'radial-gradient(40% 40% at 0% 100%, rgba(13,26,64,0.6) 0%, transparent 60%),' +
            'linear-gradient(rgba(36,168,245,0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(36,168,245,0.04) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
          overflow: 'hidden',
          borderBottom: '1px solid #1B2333',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              'linear-gradient(90deg, transparent 0%, #24A8F5 30%, #00C8FF 50%, #24A8F5 70%, transparent 100%)',
            opacity: 0.6,
          }}
        />

        <div className="flex items-center" style={{ gap: 10, marginBottom: 24 }}>
          <Cpu size={14} color="#24A8F5" />
          <span style={{ color: '#24A8F5', fontFamily: MONO, fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>
            SHARKWARE // PC BUILDER
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(36,168,245,0.15)' }} />
          <span
            style={{
              color: '#22C55E',
              fontFamily: MONO,
              fontSize: 10,
              backgroundColor: 'rgba(34,197,94,0.10)',
              border: '1px solid rgba(34,197,94,0.30)',
              padding: '2px 8px',
              borderRadius: 4,
              letterSpacing: 1.5,
            }}
          >
            BETA
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 8 }}>
          <h1
            style={{
              fontFamily: HERO,
              color: '#F5F7FA',
              fontSize: 'clamp(40px, 7vw, 80px)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            Armá tu PC{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #24A8F5 0%, #00C8FF 50%, #24A8F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 24px rgba(36,168,245,0.4))',
              }}
            >
              con IA
            </span>
            <span style={{ color: '#454E64' }}>.</span>
          </h1>
          <p
            style={{
              color: '#AAB3C5',
              fontFamily: 'Poppins',
              fontSize: 15,
              maxWidth: 600,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Contale tu presupuesto y para qué la vas a usar. El asistente arma una build compatible
            con stock real del catálogo, validando socket, RAM, wattage y tamaño de gabinete por vos.
          </p>
        </div>
      </section>

      {/* CHAT */}
      <section
        style={{
          padding: `48px ${sidePadding} 80px`,
          background:
            'radial-gradient(50% 60% at 50% 0%, rgba(36,168,245,0.06) 0%, transparent 60%), #070B16',
        }}
      >
        <div
          className="flex items-center"
          style={{ gap: 14, marginBottom: 20, maxWidth: 960, marginLeft: 'auto', marginRight: 'auto' }}
        >
          <span
            style={{
              color: '#24A8F5',
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 3,
              fontWeight: 500,
            }}
          >
            [ 01 ] CONVERSACIÓN
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(36,168,245,0.15)' }} />
        </div>

        <div
          className="flex flex-col"
          style={{
            maxWidth: 960,
            margin: '0 auto',
            backgroundColor: '#0E1424',
            border: '1px solid #1B2333',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(0,200,255,0.08), 0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="flex items-center"
            style={{
              padding: '14px 18px',
              backgroundColor: '#060810',
              borderBottom: '1px solid #1B2333',
              gap: 12,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                backgroundColor: '#0D1A40',
                border: '1px solid rgba(0,200,255,0.4)',
              }}
            >
              <Sparkles size={18} color="#24A8F5" />
            </div>
            <div className="flex flex-col">
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: 14, fontWeight: 600 }}>
                Asistente Sharkware
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: 11 }}>
                catálogo real · compatibilidad validada
              </span>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex flex-col"
            style={{
              minHeight: 360,
              maxHeight: '60vh',
              padding: 18,
              gap: 12,
              overflowY: 'auto',
              backgroundColor: '#0A0C14',
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}
              >
                <div
                  style={{
                    padding: '11px 15px',
                    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    backgroundColor: m.role === 'user' ? '#1A9FFF' : '#1E2232',
                    color: '#F5F7FA',
                    fontFamily: 'Poppins',
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.text}
                </div>
                {m.build && <BuildCard build={m.build} />}
              </div>
            ))}

            {loading && (
              <div
                className="flex items-center"
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 14px',
                  borderRadius: '14px 14px 14px 4px',
                  backgroundColor: '#1E2232',
                  gap: 8,
                }}
              >
                <Loader size={14} color="#24A8F5" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: 12 }}>
                  pensando…
                </span>
              </div>
            )}

            {!loading && messages.length === 1 && (
              <div className="flex flex-col" style={{ gap: 8, marginTop: 6 }}>
                {QUICK_CHIPS.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="border-none cursor-pointer"
                    style={{
                      alignSelf: 'flex-start',
                      padding: '8px 14px',
                      borderRadius: 999,
                      backgroundColor: 'transparent',
                      border: '1px solid #24A8F5',
                      color: '#24A8F5',
                      fontFamily: 'Poppins',
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-center"
            style={{
              padding: 14,
              gap: 10,
              backgroundColor: '#060810',
              borderTop: '1px solid #1B2333',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? 'esperando respuesta…' : 'Escribí tu presupuesto y uso'}
              disabled={loading}
              maxLength={1000}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: 999,
                backgroundColor: '#0E1424',
                border: '1px solid #1B2333',
                color: '#F5F7FA',
                fontFamily: 'Poppins',
                fontSize: 13.5,
                opacity: loading ? 0.6 : 1,
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center border-none cursor-pointer"
              aria-label="Enviar"
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                backgroundColor: loading || !input.trim() ? '#1B2333' : '#24A8F5',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        <p
          style={{
            color: '#454E64',
            fontFamily: MONO,
            fontSize: 10,
            textAlign: 'center',
            marginTop: 28,
            letterSpacing: 1.5,
          }}
        >
          // compatibilidades validadas contra catálogo real · stock sujeto a cambios
        </p>
      </section>

      <Footer />
    </div>
  )
}

export default BuilderPage
