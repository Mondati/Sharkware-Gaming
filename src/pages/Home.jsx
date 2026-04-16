import { useState } from 'react'
import { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard, Bot } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/categories'
import { products, newProducts, notebooksList, monitorsList } from '../data/products'

const ICON_MAP = { Laptop, Cpu, Zap, MemoryStick, Monitor, HardDrive, Keyboard }

const notebookFilters = ['Todos', 'i7 / i9', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9']

const NB_FILTER_MAP = {
  'i7 / i9': (p) => p.spec.includes('i7') || p.spec.includes('i9'),
  'Ryzen 5': (p) => p.spec.includes('Ryzen 5'),
  'Ryzen 7': (p) => p.spec.includes('Ryzen 7'),
  'Ryzen 9': (p) => p.spec.includes('Ryzen 9'),
}

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeNbFilter, setActiveNbFilter] = useState('Todos')

  const filteredByCategory = activeCategory === 'all'
    ? null
    : products.filter((p) => p.category_id === activeCategory && p.active)

  const filteredNotebooks = activeNbFilter === 'Todos'
    ? notebooksList
    : notebooksList.filter(NB_FILTER_MAP[activeNbFilter] ?? (() => true))

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#0A0C14' }}>
      <Navbar cartCount={0} />

      {/* ═══════════════ HERO ═══════════════ */}

      {/* Desktop Hero */}
      <section
        className="hidden md:flex items-center w-full"
        style={{
          background: 'linear-gradient(130deg, #071530 0%, #0D1A40 40%, #0A0C14 100%)',
          height: '480px',
          padding: '0 80px',
          gap: '48px',
        }}
      >
        <div className="flex flex-col flex-1" style={{ gap: '20px' }}>
          <div
            className="flex items-center w-fit"
            style={{ backgroundColor: '#00C8FF22', borderRadius: '5px', padding: '5px 14px', gap: '8px' }}
          >
            <div style={{ backgroundColor: '#00C8FF', borderRadius: '50%', width: '6px', height: '6px', flexShrink: 0 }} />
            <span style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '11px', fontWeight: '600', letterSpacing: '2px' }}>
              NUEVO LANZAMIENTO
            </span>
          </div>
          <h1 style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '72px', fontWeight: '900', letterSpacing: '-4px', lineHeight: 1, margin: 0 }}>
            RTX 5090
          </h1>
          <p style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '16px', width: '520px', lineHeight: '1.5', margin: 0 }}>
            Build Personalizada Pro Edition — El poder definitivo para gaming extremo
          </p>
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '12px' }}>Precio desde</span>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '32px', fontWeight: '800' }}>$2.499.999 ARS</span>
          </div>
          <div className="flex items-center" style={{ gap: '14px' }}>
            <button
              style={{ backgroundColor: '#00C8FF', borderRadius: '8px', padding: '14px 28px', color: '#060810', fontFamily: 'Inter', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
            >
              Comprar ahora
            </button>
            <button
              style={{ backgroundColor: '#1E2232', borderRadius: '8px', padding: '14px 28px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Ver especificaciones
            </button>
            <div className="flex items-center" style={{ gap: '6px' }}>
              <Cpu size={14} color="#8890A4" />
              <span style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px' }}>Builds Personalizadas</span>
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ backgroundColor: '#1E2232', borderRadius: '20px', width: '400px', height: '380px', flexShrink: 0 }}
        >
          <span style={{ color: '#00C8FF44', fontFamily: 'Inter', fontSize: '48px', fontWeight: '900' }}>RTX 5090</span>
        </div>
      </section>

      {/* Mobile Hero */}
      <section
        className="flex md:hidden flex-col w-full"
        style={{
          background: 'linear-gradient(180deg, #071530 0%, #0A0C14 100%)',
          padding: '24px 16px 32px',
          gap: '16px',
        }}
      >
        <div
          className="flex items-center w-fit"
          style={{ backgroundColor: '#00C8FF22', borderRadius: '5px', padding: '4px 12px', gap: '6px' }}
        >
          <div style={{ backgroundColor: '#00C8FF', borderRadius: '50%', width: '5px', height: '5px', flexShrink: 0 }} />
          <span style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '9px', fontWeight: '600', letterSpacing: '2px' }}>
            NUEVO LANZAMIENTO
          </span>
        </div>
        <h1 style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '40px', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1, margin: 0 }}>
          RTX 5090
        </h1>
        <p style={{ color: '#8890A4', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
          Build Personalizada
        </p>
        <div className="flex flex-col" style={{ gap: '2px' }}>
          <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '24px', fontWeight: '800' }}>$2.499.999 ARS</span>
        </div>
        <div className="flex items-center" style={{ gap: '10px' }}>
          <button
            style={{ backgroundColor: '#00C8FF', borderRadius: '8px', padding: '12px 24px', color: '#060810', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
          >
            Comprar
          </button>
          <button
            style={{ backgroundColor: '#1E2232', borderRadius: '8px', padding: '12px 20px', color: '#FFFFFF', fontFamily: 'Inter', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            Ver specs
          </button>
        </div>
      </section>

      {/* ═══════════════ CATEGORY BAR ═══════════════ */}

      {/* Desktop Category Bar */}
      <div
        className="hidden md:flex items-center w-full"
        style={{
          backgroundColor: '#070B16',
          borderBottom: '1px solid #1B2333',
          height: '76px',
          padding: '14px 80px',
          gap: '10px',
        }}
      >
        {categories.map(({ id, label, icon }) => {
          const isActive = activeCategory === id
          const Icon = ICON_MAP[icon] ?? null
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className="flex items-center border-none cursor-pointer"
              style={{
                backgroundColor: isActive ? '#00C8FF' : '#1E2232',
                borderRadius: '20px',
                padding: '8px 18px',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {Icon && <Icon size={14} color={isActive ? '#060810' : '#8890A4'} />}
              <span style={{ color: isActive ? '#060810' : '#8890A4', fontFamily: 'Inter', fontSize: '13px', fontWeight: isActive ? '700' : '600' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Mobile Category Bar — horizontal scroll */}
      <div
        className="flex md:hidden w-full overflow-x-auto"
        style={{
          backgroundColor: '#070B16',
          borderBottom: '1px solid #1B2333',
          padding: '10px 16px',
          gap: '8px',
          flexShrink: 0,
          scrollbarWidth: 'none',
        }}
      >
        {categories.map(({ id, label, icon }) => {
          const isActive = activeCategory === id
          const Icon = ICON_MAP[icon] ?? null
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className="flex items-center border-none cursor-pointer flex-shrink-0"
              style={{
                backgroundColor: isActive ? '#00C8FF' : '#1E2232',
                borderRadius: '20px',
                padding: '6px 14px',
                gap: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              {Icon && <Icon size={12} color={isActive ? '#060810' : '#8890A4'} />}
              <span style={{ color: isActive ? '#060810' : '#8890A4', fontFamily: 'Inter', fontSize: '12px', fontWeight: isActive ? '700' : '600' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {/* ═══════════════ CATÁLOGO — filtrado por categoría o secciones por defecto ═══════════════ */}

      {filteredByCategory ? (
        <>
          {/* Desktop — categoría filtrada */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: '40px 80px', gap: '20px' }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700' }}>
              {categories.find((c) => c.id === activeCategory)?.label}
            </span>
            {filteredByCategory.length === 0 ? (
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
                No hay productos en esta categoría.
              </span>
            ) : (
              <div className="flex flex-wrap w-full" style={{ gap: '16px' }}>
                {filteredByCategory.map((p) => (
                  <ProductCard key={p.id} {...p} imgHeight={130} />
                ))}
              </div>
            )}
          </section>

          {/* Mobile — categoría filtrada */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '24px 16px', gap: '14px' }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>
              {categories.find((c) => c.id === activeCategory)?.label}
            </span>
            {filteredByCategory.length === 0 ? (
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
                No hay productos en esta categoría.
              </span>
            ) : (
              <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                {filteredByCategory.map((p) => (
                  <ProductCard key={p.id} {...p} mobile />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* ── Nuevos Productos ─────────────────────────────────────────── */}

          {/* Desktop */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: '40px 80px', gap: '20px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700' }}>
                Nuevos Productos
              </span>
              <Link to="#" className="no-underline" style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '14px' }}>
                Ver todos los productos →
              </Link>
            </div>
            <div className="flex w-full" style={{ gap: '16px' }}>
              {newProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>

          {/* Mobile */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '24px 16px', gap: '14px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>
                Nuevos Productos
              </span>
              <Link to="#" className="no-underline" style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '12px' }}>
                Ver más →
              </Link>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {newProducts.map((p) => (
                <ProductCard key={p.id} {...p} mobile />
              ))}
            </div>
          </section>

          {/* ── Notebooks Gamer ──────────────────────────────────────────── */}

          {/* Desktop */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: '0 80px 40px', gap: '20px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700' }}>
                Notebooks Gamer
              </span>
              <Link to="#" className="no-underline" style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '14px' }}>
                Ver todos →
              </Link>
            </div>
            <div className="flex" style={{ gap: '8px' }}>
              {notebookFilters.map((f) => {
                const isActive = activeNbFilter === f
                return (
                  <button
                    key={f}
                    onClick={() => setActiveNbFilter(f)}
                    className="border-none cursor-pointer"
                    style={{
                      backgroundColor: isActive ? '#00C8FF' : '#1E2232',
                      borderRadius: '20px',
                      padding: '6px 16px',
                      color: isActive ? '#060810' : '#8890A4',
                      fontFamily: 'Inter',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : 'normal',
                    }}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
            {filteredNotebooks.length === 0 ? (
              <span style={{ color: '#AAB3C5', fontFamily: 'Inter', fontSize: '14px' }}>
                Sin resultados para este filtro.
              </span>
            ) : (
              <div className="flex w-full" style={{ gap: '16px' }}>
                {filteredNotebooks.map((p) => (
                  <ProductCard key={p.id} {...p} imgHeight={130} />
                ))}
              </div>
            )}
          </section>

          {/* Mobile */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '0 16px 24px', gap: '14px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>
                Notebooks Gamer
              </span>
              <Link to="#" className="no-underline" style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '12px' }}>
                Ver más →
              </Link>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {filteredNotebooks.map((p) => (
                <ProductCard key={p.id} {...p} mobile />
              ))}
            </div>
          </section>

          {/* ── Monitores Gaming ─────────────────────────────────────────── */}

          {/* Desktop */}
          <section className="hidden md:flex flex-col w-full" style={{ padding: '0 80px 40px', gap: '20px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '24px', fontWeight: '700' }}>
                Monitores Gaming
              </span>
              <Link to="#" className="no-underline" style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '14px' }}>
                Ver todos →
              </Link>
            </div>
            <div className="flex w-full" style={{ gap: '16px' }}>
              {monitorsList.map((p) => (
                <ProductCard key={p.id} {...p} imgHeight={130} />
              ))}
            </div>
          </section>

          {/* Mobile */}
          <section className="flex md:hidden flex-col w-full" style={{ padding: '0 16px 24px', gap: '14px' }}>
            <div className="flex items-center w-full">
              <span className="flex-1" style={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '18px', fontWeight: '700' }}>
                Monitores Gaming
              </span>
              <Link to="#" className="no-underline" style={{ color: '#00C8FF', fontFamily: 'Inter', fontSize: '12px' }}>
                Ver más →
              </Link>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {monitorsList.map((p) => (
                <ProductCard key={p.id} {...p} mobile />
              ))}
            </div>
          </section>
        </>
      )}

      <Footer />

      {/* Chatbot FAB */}
      <button
        className="flex items-center justify-center border-none cursor-pointer"
        aria-label="Chatbot"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '64px',
          height: '64px',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 50,
        }}
      >
        <Bot size={32} color="#FFFFFF" />
      </button>
    </div>
  )
}

export default Home
