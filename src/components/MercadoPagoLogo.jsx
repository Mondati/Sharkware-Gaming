import mpLogoV from '../assets/mp-logo-vertical.svg'
import mpLogoH from '../assets/mp-logo-horizontal.svg'
import { useTheme } from '../context/ThemeContext'

// ancho/alto del viewBox del logo horizontal (1048.82 / 425.2)
const H_RATIO = 1048.82 / 425.2

const MercadoPagoLogo = ({ size = 24, variant = 'vertical' }) => {
  const { theme } = useTheme()
  const horizontal = variant === 'horizontal'
  const src = horizontal ? mpLogoH : mpLogoV

  // El SVG es blanco (pensado para fondo oscuro). En retro desaparecería sobre el
  // beige, así que lo teñimos con --text-strong usando el SVG como máscara.
  if (theme === 'retro') {
    const mask = `url(${src}) center / contain no-repeat`
    return (
      <span
        role="img"
        aria-label="MercadoPago"
        style={{
          display: 'block',
          height: size,
          width: horizontal ? size * H_RATIO : size,
          backgroundColor: 'var(--text-strong)',
          WebkitMask: mask,
          mask,
        }}
      />
    )
  }

  if (horizontal) {
    return <img src={mpLogoH} alt="MercadoPago" style={{ display: 'block', height: size, width: 'auto' }} />
  }
  return <img src={mpLogoV} alt="MercadoPago" width={size} height={size} style={{ display: 'block' }} />
}

export default MercadoPagoLogo
