import { useEffect, useRef, useState } from 'react'

const SR = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

export const supported = !!SR

export function useSpeechRecognition({ lang = 'es-AR', onResult, onEnd, onError } = {}) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const timeoutRef = useRef(null)
  const activeRef = useRef(false)

  // refs para handlers — evitan recrear la instancia si el caller pasa closures nuevas
  const onResultRef = useRef(onResult)
  const onEndRef = useRef(onEnd)
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onResultRef.current = onResult
    onEndRef.current = onEnd
    onErrorRef.current = onError
  })

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const stop = () => {
    clearTimer()
    recognitionRef.current?.stop()
  }

  const start = () => {
    if (!supported || activeRef.current) return
    const recognition = new SR()
    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onstart = () => {
      activeRef.current = true
      setListening(true)
    }
    recognition.onend = () => {
      activeRef.current = false
      clearTimer()
      setListening(false)
      onEndRef.current?.()
    }
    recognition.onerror = (e) => {
      activeRef.current = false
      clearTimer()
      setListening(false)
      onErrorRef.current?.(e.error)
    }
    recognition.onresult = (e) => {
      let text = ''
      let isFinal = false
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript
        if (e.results[i].isFinal) isFinal = true
      }
      onResultRef.current?.(text, isFinal)
    }

    recognitionRef.current = recognition
    recognition.start()
    timeoutRef.current = setTimeout(stop, 10000)
  }

  useEffect(() => () => {
    clearTimer()
    recognitionRef.current?.abort()
  }, [])

  return { supported, listening, start, stop }
}
