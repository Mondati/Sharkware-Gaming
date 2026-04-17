import { useState } from 'react'
import { Camera, X, Play, Music2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const desktopLinks = {
  Productos: ['Notebooks Gamer', 'Desktops Gamer', 'Monitores', 'Periféricos', 'Sillas Gamer'],
  Empresa: ['Nosotros', 'Blog', 'Trabaja con nosotros', 'Prensa'],
  Soporte: ['Centro de ayuda', 'Garantía', 'Envíos', 'Devoluciones'],
}

const mobileLinks = {
  Productos: ['Notebooks', 'Desktops', 'Monitores', 'Periféricos'],
  Empresa: ['Nosotros', 'Contacto', 'Garantía', 'Envíos'],
}

const paymentMethods = ['VISA', 'Mastercard', 'AMEX', 'Mercado Pago', 'Naranja X']
const mobilePayments = ['VISA', 'MC', 'AMEX']

const socials = [
  { icon: Camera, label: 'Instagram' },
  { icon: X, label: 'Twitter' },
  { icon: Play, label: 'YouTube' },
  { icon: Music2, label: 'TikTok' },
]

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null)
  const [hoveredSocial, setHoveredSocial] = useState(null)

  return (
    <>
      {/* ── Mobile Footer ── */}
      <footer
        className="md:hidden flex flex-col w-full"
        style={{ backgroundColor: '#060810', padding: '24px 16px 20px', gap: '20px' }}
      >
        {/* Divider */}
        <div style={{ backgroundColor: '#1E2232', height: '1px', width: '100%' }} />

        {/* Brand */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <div className="flex flex-col">
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '16px', fontWeight: '700', letterSpacing: '1px' }}>
              SHARKWARE
            </span>
            <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '8px', fontWeight: '700', letterSpacing: '2px' }}>
              GAMING
            </span>
          </div>
          <p style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
            Tu tienda gamer de confianza — Sharkware Gaming
          </p>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col" style={{ gap: '10px' }}>
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700' }}>
            Suscribite al Newsletter
          </span>
          <div
            className="flex items-center"
            style={{ backgroundColor: '#1E2232', borderRadius: '7px', padding: '10px 14px', gap: '8px' }}
          >
            <input
              type="email"
              placeholder="Tu email"
              className="bg-transparent border-none outline-none w-full"
              style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}
            />
          </div>
          <button
            className="cursor-pointer border-none"
            style={{ backgroundColor: '#00C8FF', borderRadius: '7px', padding: '10px 0', color: '#060810', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}
          >
            Suscribirme
          </button>
        </div>

        {/* Link columns */}
        <div className="flex" style={{ gap: '32px' }}>
          {Object.entries(mobileLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col" style={{ gap: '8px' }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '12px', fontWeight: '700' }}>
                {heading}
              </span>
              {links.map((link) => (
                <Link
                  key={link}
                  to="#"
                  className="no-underline"
                  onMouseEnter={() => setHoveredLink(link)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{ color: hoveredLink === link ? '#F5F7FA' : '#8890A4', fontFamily: 'Inter', fontSize: '12px', transition: 'color 0.15s ease' }}
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Payments + Copyright */}
        <div className="flex items-center w-full" style={{ gap: '12px' }}>
          <div className="flex" style={{ gap: '6px' }}>
            {mobilePayments.map((method) => (
              <span
                key={method}
                style={{ backgroundColor: '#1E2232', borderRadius: '6px', padding: '5px 10px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '10px', fontWeight: '700' }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
        <span style={{ color: '#454E64', fontFamily: 'Inter', fontSize: '11px' }}>
          © 2025 Sharkware Gaming. Todos los derechos reservados.
        </span>
      </footer>

      {/* ── Desktop Footer ── */}
      <footer
        className="hidden md:flex flex-col w-full"
        style={{ backgroundColor: '#060810', padding: '48px 400px 40px 400px', gap: '32px' }}
      >
        {/* Divider */}
        <div style={{ backgroundColor: '#1E2232', height: '1px', width: '100%' }} />

        {/* Top: Brand + Links */}
        <div className="flex w-full" style={{ gap: '48px', justifyContent: 'center' }}>
          {/* Brand */}
          <div className="flex flex-col" style={{ gap: '16px', width: '260px', flexShrink: 0 }}>
            <div className="flex flex-col">
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700', letterSpacing: '1px' }}>
                SHARKWARE
              </span>
              <span style={{ color: '#24A8F5', fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '2px' }}>
                GAMING
              </span>
            </div>
            <p style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px', width: '240px', lineHeight: '1.5' }}>
              Tu tienda gamer de confianza. Componentes, notebooks, desktops y periféricos al mejor precio — Sharkware Gaming.
            </p>
            {/* Socials */}
            <div className="flex" style={{ gap: '10px' }}>
              {socials.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  onMouseEnter={() => setHoveredSocial(label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className="flex items-center justify-center cursor-pointer border-none"
                  style={{ backgroundColor: hoveredSocial === label ? '#252840' : '#1E2232', borderRadius: '8px', padding: '8px', width: '36px', height: '36px', transition: 'background-color 0.15s ease' }}
                >
                  <Icon size={16} color={hoveredSocial === label ? '#AAB3C5' : '#8890A4'} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-1" style={{ gap: '48px' }}>
            {Object.entries(desktopLinks).map(([heading, links]) => (
              <div key={heading} className="flex flex-col" style={{ gap: '12px' }}>
                <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>
                  {heading}
                </span>
                {links.map((link) => (
                  <Link
                    key={link}
                    to="#"
                    className="no-underline"
                    onMouseEnter={() => setHoveredLink(link)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{ color: hoveredLink === link ? '#F5F7FA' : '#8890A4', fontFamily: 'Inter', fontSize: '13px', transition: 'color 0.15s ease' }}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            ))}

            {/* Newsletter */}
            <div className="flex flex-col" style={{ gap: '12px', width: '220px' }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}>
                Newsletter
              </span>
              <p style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px', width: '200px', lineHeight: '1.5' }}>
                Recibí ofertas y novedades exclusivas.
              </p>
              <div
                className="flex items-center"
                style={{ backgroundColor: '#1E2232', borderRadius: '7px', padding: '10px 14px', gap: '8px' }}
              >
                <input
                  type="email"
                  placeholder="Tu email"
                  className="bg-transparent border-none outline-none w-full"
                  style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}
                />
              </div>
              <button
                className="cursor-pointer border-none"
                style={{ backgroundColor: '#00C8FF', borderRadius: '7px', padding: '10px 0', color: '#060810', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700' }}
              >
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: payments + copyright */}
        <div className="flex items-center w-full" style={{ gap: '20px', justifyContent: 'center' }}>
          <div className="flex" style={{ gap: '8px' }}>
            {paymentMethods.map((method) => (
              <span
                key={method}
                style={{ backgroundColor: '#1E2232', borderRadius: '6px', padding: '6px 12px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700' }}
              >
                {method}
              </span>
            ))}
          </div>
          <div className="flex-1" />
          <span style={{ color: '#454E64', fontFamily: 'Inter', fontSize: '12px' }}>
            © 2025 Sharkware Gaming Store. Todos los derechos reservados.
          </span>
        </div>
      </footer>
    </>
  )
}

export default Footer
