import { Users, ChevronRight, ExternalLink, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../hooks/useWindowWidth'
import Footer from '../components/Footer'

const MONO = 'Poppins, sans-serif'
const HERO = '"Rajdhani", "Poppins", sans-serif'

const PRESENTATION_URL = 'https://mondati.github.io/sharkware-presentacion/'

const TEAM = [
  { name: 'Agustín Mondati', role: 'Desarrollador' },
  { name: 'Lucca Goria', role: 'Desarrollador' },
  { name: 'Franco Champane', role: 'Desarrollador' },
  { name: 'Tomás Lombardo', role: 'Desarrollador' },
]

const SectionLabel = ({ children }) => (
  <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
    <span style={{ color: '#24A8F5', fontFamily: MONO, fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>
      {children}
    </span>
    <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(36,168,245,0.15)' }} />
  </div>
)

const TeamCard = ({ member }) => (
  <div
    style={{
      background: 'linear-gradient(180deg, rgba(36,168,245,0.06) 0%, rgba(36,168,245,0) 70%), #0E1424',
      border: '1px solid #1B2333',
      borderRadius: 14,
      padding: '24px 22px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 14,
    }}
  >
    <div
      aria-hidden
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        backgroundColor: '#0D1A40',
        border: '1px solid rgba(36,168,245,0.30)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <User size={26} color="#24A8F5" />
    </div>
    <div className="flex flex-col" style={{ gap: 4 }}>
      <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: 16, fontWeight: 600 }}>
        {member.name}
      </span>
      <span style={{ color: '#8890A4', fontFamily: MONO, fontSize: 11, letterSpacing: 1.5 }}>
        {member.role.toUpperCase()}
      </span>
    </div>
  </div>
)

const AboutPage = () => {
  const { sidePadding } = useWindowWidth()

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>

      {/* Mobile header */}
      <div
        className="flex md:hidden items-center w-full"
        style={{ backgroundColor: '#0A0F1C', height: '56px', padding: '0 16px', gap: '10px' }}
      >
        <Users size={18} color="#24A8F5" />
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
          Nosotros
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
          Nosotros
        </span>
      </div>

      <main className="flex flex-col flex-1 w-full">

        {/* HERO — Misión */}
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
              background: 'linear-gradient(90deg, transparent 0%, #24A8F5 30%, #00C8FF 50%, #24A8F5 70%, transparent 100%)',
              opacity: 0.6,
            }}
          />

          <div className="flex items-center" style={{ gap: 10, marginBottom: 24 }}>
            <Users size={14} color="#24A8F5" />
            <span style={{ color: '#24A8F5', fontFamily: MONO, fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>
              SHARKWARE // QUIÉNES SOMOS
            </span>
            <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(36,168,245,0.15)' }} />
            <span style={{ color: '#8890A4', fontFamily: MONO, fontSize: 10, letterSpacing: 2 }}>
              v1.0 · GAMING
            </span>
          </div>

          <div
            className="grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 8 }}
          >
            <h1
              style={{
                fontFamily: HERO,
                color: '#F5F7FA',
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              Somos
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #24A8F5 0%, #00C8FF 50%, #24A8F5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 24px rgba(36,168,245,0.4))',
                }}
              >
                Sharkware
              </span>
              <span style={{ color: '#24A8F5' }}>.</span>
            </h1>
            <p
              style={{
                color: '#AAB3C5',
                fontFamily: 'Poppins',
                fontSize: 15,
                maxWidth: 560,
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Sharkware Gaming es un ecommerce de hardware gamer en Argentina. Curamos un catálogo
              de componentes y periféricos, con pago seguro vía MercadoPago y stock real en cada
              producto. Además sumamos diferenciadores propios: un Builder IA que arma tu PC según
              presupuesto y uso, y un conversor cripto a peso en vivo. Hecho por un equipo que también juega.
            </p>
          </div>
        </section>

        {/* [ 01 ] EQUIPO */}
        <section style={{ padding: `60px ${sidePadding} 40px` }}>
          <SectionLabel>[ 01 ] EQUIPO</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {TEAM.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </section>

        {/* [ 02 ] LA PRESENTACIÓN */}
        <section
          style={{
            padding: `40px ${sidePadding} 80px`,
            background:
              'radial-gradient(50% 60% at 50% 0%, rgba(36,168,245,0.06) 0%, transparent 60%), #070B16',
          }}
        >
          <SectionLabel>[ 02 ] LA PRESENTACIÓN</SectionLabel>
          <div
            style={{
              maxWidth: 860,
              margin: '0 auto',
              background: 'linear-gradient(180deg, rgba(36,168,245,0.06) 0%, rgba(36,168,245,0) 70%), #0E1424',
              border: '1px solid #1B2333',
              borderRadius: 14,
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 24,
            }}
          >
            <p style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: 480 }}>
              Conocé en detalle los diferenciadores del proyecto, la arquitectura y las decisiones
              técnicas detrás de Sharkware Gaming.
            </p>

            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid #1B2333',
                backgroundColor: '#0A0C14',
              }}
            >
              <iframe
                src={PRESENTATION_URL}
                title="Presentación Sharkware Gaming"
                loading="lazy"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
              />
            </div>

            <a
              href={PRESENTATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline flex items-center"
              style={{
                gap: 8,
                backgroundColor: '#24A8F5',
                color: '#070B16',
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 22px',
                borderRadius: 10,
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00C8FF' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#24A8F5' }}
            >
              Abrir en pantalla completa
              <ExternalLink size={16} />
            </a>
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
            // se abre en una pestaña nueva · proyecto académico Sharkware Gaming
          </p>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
