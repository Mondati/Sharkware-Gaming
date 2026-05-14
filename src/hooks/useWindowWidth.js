import { useState, useEffect } from 'react'

export function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  if (width >= 1920) return { sidePadding: '400px', cardFlex: 'calc(20% - 13px)' }
  if (width >= 1536) return { sidePadding: '200px', cardFlex: 'calc(20% - 13px)' }
  if (width >= 1280) return { sidePadding: '160px', cardFlex: 'calc(25% - 12px)' }
  if (width >= 1024) return { sidePadding: '80px',  cardFlex: 'calc(25% - 12px)' }
  return                   { sidePadding: '40px',  cardFlex: 'calc(33.333% - 11px)' }
}
