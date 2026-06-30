import { useEffect, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useAuth } from '../context/AuthContext'

const MicButton = ({ value, onChange, disabled, size = 44, onListeningChange }) => {
  const { showToast } = useAuth()
  const baseRef = useRef('')

  const { supported, listening, start, stop } = useSpeechRecognition({
    onResult: (text) => {
      onChange((baseRef.current ? baseRef.current + ' ' : '') + text)
    },
    onError: (code) => {
      if (code === 'no-speech') return
      showToast(
        code === 'not-allowed' || code === 'service-not-allowed'
          ? 'Activá el micrófono desde el 🔒 de la barra del navegador'
          : 'No se pudo usar el micrófono, probá de nuevo'
      )
    },
  })

  // Avisa al form para cambiar el placeholder del input a "Escuchando…".
  useEffect(() => {
    onListeningChange?.(listening)
  }, [listening, onListeningChange])

  if (!supported) return null

  const handleClick = () => {
    if (listening) {
      stop()
    } else {
      baseRef.current = value
      start()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={listening ? 'Detener' : 'Hablar'}
      title={listening ? 'Detener' : 'Hablar'}
      className={`flex items-center justify-center cursor-pointer${listening ? ' sw-mic-pulse' : ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        flexShrink: 0,
        backgroundColor: listening ? 'var(--error)' : 'transparent',
        border: listening ? '1px solid var(--error)' : '1px solid var(--border)',
        color: listening ? 'var(--text-strong)' : 'var(--accent)',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {listening ? <Square size={14} fill="currentColor" /> : <Mic size={18} />}
    </button>
  )
}

export default MicButton
