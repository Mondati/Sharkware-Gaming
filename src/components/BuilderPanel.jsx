import { useEffect, useRef, useState } from 'react'
import { Sparkles, X, Send, Loader } from 'lucide-react'
import { sendBuilderMessage } from '../api/builder'
import BuildCard from './BuildCard'

const QUICK_CHIPS = [
  'Gaming 800k, prefiero AMD',
  'Trabajo + algún juego, 1.200.000',
  'Streaming, hasta 1.500.000',
]

const WELCOME = '¡Hola! Soy tu asistente para armar PCs. Decime tu presupuesto en ARS y qué uso le vas a dar (gaming, trabajo, streaming) y te armo una build compatible con stock real.'

const BuilderPanel = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME }])
  const [conversationId, setConversationId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => {
      setIsMobile(mq.matches)
      document.body.style.overflow = mq.matches ? 'hidden' : ''
    }
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || loading) return
    setError(null)
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
      setError(msg)
      setMessages(m => [...m, { role: 'bot', text: msg }])
    } finally {
      setLoading(false)
    }
  }

  const panelStyle = isMobile
    ? {
        position: 'fixed', top: '72px', left: '12px', right: '12px', bottom: '96px',
        backgroundColor: '#0E1424', border: '1px solid #1B2333', borderRadius: '14px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,255,0.25)',
        zIndex: 50, overflow: 'hidden',
      }
    : {
        position: 'fixed', bottom: '104px', right: '32px',
        width: '420px', height: '600px',
        maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 144px)',
        backgroundColor: '#0E1424', border: '1px solid #1B2333', borderRadius: '16px',
        boxShadow: '0 16px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,200,255,0.30)',
        zIndex: 50, overflow: 'hidden',
      }

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar builder"
        className="md:hidden fixed inset-0"
        style={{
          backgroundColor: 'rgba(6,8,16,0.55)', backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', zIndex: 49, border: 'none', padding: 0, cursor: 'pointer',
        }}
      />
      <div className="flex flex-col" style={panelStyle}>
        <div
          className="flex items-center justify-between"
          style={{ padding: '14px 16px', backgroundColor: '#060810', borderBottom: '1px solid #1B2333' }}
        >
          <div className="flex items-center" style={{ gap: '10px' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: '36px', height: '36px', borderRadius: '999px',
                backgroundColor: '#0D1A40', border: '1px solid rgba(0,200,255,0.4)',
              }}
            >
              <Sparkles size={18} color="#24A8F5" />
            </div>
            <div className="flex flex-col">
              <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: 600 }}>
                Armá tu PC
              </span>
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
                Asistente IA · catálogo real
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center border-none cursor-pointer"
            aria-label="Cerrar"
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: 'transparent', color: '#AAB3C5',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex flex-col"
          style={{
            flex: 1, padding: '14px', gap: '10px',
            overflowY: 'auto', backgroundColor: '#0A0C14',
          }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '92%' }}>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  backgroundColor: m.role === 'user' ? '#1A9FFF' : '#1E2232',
                  color: '#F5F7FA',
                  fontFamily: 'Poppins',
                  fontSize: '13px',
                  lineHeight: 1.5,
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
                alignSelf: 'flex-start', padding: '10px 14px',
                borderRadius: '14px 14px 14px 4px', backgroundColor: '#1E2232', gap: '8px',
              }}
            >
              <Loader size={14} color="#24A8F5" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
                pensando…
              </span>
            </div>
          )}

          {!loading && messages.length === 1 && (
            <div className="flex flex-col" style={{ gap: '6px', marginTop: '4px' }}>
              {QUICK_CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="border-none cursor-pointer"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '7px 12px',
                    borderRadius: '999px',
                    backgroundColor: 'transparent',
                    border: '1px solid #24A8F5',
                    color: '#24A8F5',
                    fontFamily: 'Poppins',
                    fontSize: '12px',
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
          onSubmit={(e) => { e.preventDefault(); send() }}
          className="flex items-center"
          style={{ padding: '12px', gap: '8px', backgroundColor: '#060810', borderTop: '1px solid #1B2333' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={loading ? 'esperando respuesta…' : 'Escribí tu presupuesto y uso'}
            disabled={loading}
            maxLength={1000}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '999px',
              backgroundColor: '#0E1424', border: '1px solid #1B2333',
              color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px',
              opacity: loading ? 0.6 : 1,
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center border-none cursor-pointer"
            aria-label="Enviar"
            style={{
              width: '40px', height: '40px', borderRadius: '999px',
              backgroundColor: loading || !input.trim() ? '#1B2333' : '#24A8F5',
              color: '#FFFFFF', flexShrink: 0,
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  )
}

export default BuilderPanel
