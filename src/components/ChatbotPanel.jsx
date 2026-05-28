import { useEffect, useRef, useState } from 'react'
import { Bot, X, Send } from 'lucide-react'
import { sendChatbotMessage } from '../api/chatbot'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: '¡Hola! Soy Sharkbot, tu asistente de Sharkware Gaming. ¿En qué te puedo ayudar?',
}

const ChatbotPanel = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await sendChatbotMessage({ conversationId, message: text })
      if (res?.conversationId && res.conversationId !== conversationId) {
        setConversationId(res.conversationId)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: res?.reply || '' }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'El asistente no está disponible ahora, intentá de nuevo en un rato.' },
      ])
    } finally {
      setLoading(false)
    }
  }

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

  const panelStyle = isMobile
    ? {
        position: 'fixed',
        top: '72px',
        left: '16px',
        right: '16px',
        bottom: '96px',
        backgroundColor: '#0E1424',
        border: '1px solid #1B2333',
        borderRadius: '14px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,255,0.25)',
        zIndex: 50,
        overflow: 'hidden',
      }
    : {
        position: 'fixed',
        bottom: '112px',
        right: '32px',
        width: '360px',
        height: '500px',
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 144px)',
        backgroundColor: '#0E1424',
        border: '1px solid #1B2333',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,255,0.25)',
        zIndex: 50,
        overflow: 'hidden',
      }

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar panel del chatbot"
        className="md:hidden fixed inset-0"
        style={{
          backgroundColor: 'rgba(6,8,16,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 49,
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      />
    <div className="flex flex-col" style={panelStyle}>
      <div
        className="flex items-center justify-between"
        style={{
          padding: '14px 16px',
          backgroundColor: '#060810',
          borderBottom: '1px solid #1B2333',
        }}
      >
        <div className="flex items-center" style={{ gap: '10px' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              backgroundColor: '#0E1424',
              border: '1px solid rgba(0,200,255,0.4)',
            }}
          >
            <Bot size={20} color="#24A8F5" />
          </div>
          <div className="flex flex-col">
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>
              Sharkbot
            </span>
            <span className="flex items-center" style={{ gap: '6px', color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#22C55E',
                  display: 'inline-block',
                }}
              />
              En línea
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center border-none cursor-pointer"
          aria-label="Cerrar chat"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: '#AAB3C5',
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-col"
        style={{
          flex: 1,
          padding: '16px',
          gap: '10px',
          overflowY: 'auto',
          backgroundColor: '#0A0C14',
        }}
      >
        {messages.map((m, i) => {
          const isUser = m.role === 'user'
          return (
            <div
              key={i}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                backgroundColor: isUser ? '#24A8F5' : '#1E2232',
                color: isUser ? '#FFFFFF' : '#F5F7FA',
                fontFamily: 'Poppins',
                fontSize: '13px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {m.content}
            </div>
          )
        })}
        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '14px 14px 14px 4px',
              backgroundColor: '#1E2232',
              color: '#AAB3C5',
              fontFamily: 'Poppins',
              fontSize: '13px',
              lineHeight: '1.5',
              opacity: 0.85,
              fontStyle: 'italic',
            }}
          >
            Escribiendo…
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center"
        style={{
          padding: '12px',
          gap: '8px',
          backgroundColor: '#060810',
          borderTop: '1px solid #1B2333',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Escribí tu mensaje..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '999px',
            backgroundColor: '#0E1424',
            border: '1px solid #1B2333',
            color: '#F5F7FA',
            fontFamily: 'Poppins',
            fontSize: '13px',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center justify-center border-none cursor-pointer"
          aria-label="Enviar mensaje"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            backgroundColor: '#24A8F5',
            color: '#FFFFFF',
            flexShrink: 0,
            opacity: loading || !input.trim() ? 0.6 : 1,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
    </>
  )
}

export default ChatbotPanel
