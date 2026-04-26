import { useEffect } from 'react'
import { Bot, X, Send } from 'lucide-react'

const ChatbotPanel = ({ onClose }) => {
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => {
      document.body.style.overflow = mq.matches ? 'hidden' : ''
    }
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      <div
        onClick={onClose}
        className="md:hidden fixed inset-0"
        style={{
          backgroundColor: 'rgba(6,8,16,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 49,
        }}
      />
    <div
      className="flex flex-col"
      style={{
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
      }}
    >
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
        className="flex flex-col"
        style={{
          flex: 1,
          padding: '16px',
          gap: '10px',
          overflowY: 'auto',
          backgroundColor: '#0A0C14',
        }}
      >
        <div
          style={{
            alignSelf: 'flex-start',
            maxWidth: '85%',
            padding: '10px 14px',
            borderRadius: '14px 14px 14px 4px',
            backgroundColor: '#1E2232',
            color: '#F5F7FA',
            fontFamily: 'Poppins',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
        >
          ¡Hola! Soy <strong style={{ color: '#24A8F5' }}>Sharkbot</strong>, tu asistente de Sharkware Gaming.
        </div>
        <div
          style={{
            alignSelf: 'flex-start',
            maxWidth: '85%',
            padding: '10px 14px',
            borderRadius: '14px 14px 14px 4px',
            backgroundColor: '#1E2232',
            color: '#F5F7FA',
            fontFamily: 'Poppins',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
        >
          ¿En qué te puedo ayudar hoy?
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
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
          className="flex items-center justify-center border-none cursor-pointer"
          aria-label="Enviar mensaje"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            backgroundColor: '#24A8F5',
            color: '#FFFFFF',
            flexShrink: 0,
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
