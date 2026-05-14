import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../hooks/useWindowWidth'

const SUPPORT_EMAIL = 'sharkwaregaming@gmail.com'
const SUPPORT_SUBJECT = 'Consulta de soporte — Sharkware Gaming'
const SUPPORT_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent(SUPPORT_SUBJECT)}`

const navLinks = [
  { label: 'Productos', to: '/search' },
  { label: 'Ofertas', to: '/search?badge=OFERTA' },
  { label: 'Soporte', href: SUPPORT_HREF, external: true },
  { label: 'Nosotros', to: '#' },
]

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null)
  const { sidePadding } = useWindowWidth()

  return (
    <>
      {/* ── Mobile Footer ── */}
      <footer
        className="md:hidden flex flex-col items-center w-full"
        style={{ backgroundColor: '#060810', padding: '20px 16px', gap: '16px' }}
      >
        <div style={{ backgroundColor: '#1E2232', height: '1px', width: '100%' }} />

        <div className="flex flex-col items-center" style={{ gap: '2px' }}>
          <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>
            SHARKWARE
          </span>
          <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '8px', fontWeight: '700', letterSpacing: '2px' }}>
            GAMING
          </span>
        </div>

        <div className="flex flex-wrap justify-center" style={{ gap: '20px' }}>
          {navLinks.map(({ label, to, href }) => {
            const sharedProps = {
              className: 'no-underline',
              onMouseEnter: () => setHoveredLink(label),
              onMouseLeave: () => setHoveredLink(null),
              style: { color: hoveredLink === label ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', transition: 'color 0.15s ease' },
            }
            return href
              ? <a key={label} href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>{label}</a>
              : <Link key={label} to={to} {...sharedProps}>{label}</Link>
          })}
        </div>

        <span style={{ color: '#454E64', fontFamily: 'Poppins', fontSize: '11px', textAlign: 'center' }}>
          © 2026 Sharkware Gaming. Todos los derechos reservados.
        </span>
      </footer>

      {/* ── Desktop Footer ── */}
      <footer
        className="hidden md:flex items-center w-full"
        style={{ backgroundColor: '#060810', padding: `24px ${sidePadding}`, gap: '32px', borderTop: '1px solid #1E2232' }}
      >
        <div className="flex flex-col" style={{ gap: '2px', flexShrink: 0 }}>
          <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '18px', fontWeight: '700', letterSpacing: '1px' }}>
            SHARKWARE
          </span>
          <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>
            GAMING
          </span>
        </div>

        <nav className="flex flex-1 justify-center" style={{ gap: '48px' }}>
          {navLinks.map(({ label, to, href }) => {
            const sharedProps = {
              className: 'no-underline',
              onMouseEnter: () => setHoveredLink(label),
              onMouseLeave: () => setHoveredLink(null),
              style: { color: hoveredLink === label ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', transition: 'color 0.15s ease' },
            }
            return href
              ? <a key={label} href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>{label}</a>
              : <Link key={label} to={to} {...sharedProps}>{label}</Link>
          })}
        </nav>

        <span style={{ color: '#454E64', fontFamily: 'Poppins', fontSize: '12px' }}>
          © 2026 Sharkware Gaming. Todos los derechos reservados.
        </span>
      </footer>
    </>
  )
}

export default Footer
