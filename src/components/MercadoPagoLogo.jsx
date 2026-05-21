import mpLogoV from '../assets/mp-logo-vertical.svg'
import mpLogoH from '../assets/mp-logo-horizontal.svg'

const MercadoPagoLogo = ({ size = 24, variant = 'vertical' }) => {
  if (variant === 'horizontal') {
    return <img src={mpLogoH} alt="MercadoPago" style={{ display: 'block', height: size, width: 'auto' }} />
  }
  return <img src={mpLogoV} alt="MercadoPago" width={size} height={size} style={{ display: 'block' }} />
}

export default MercadoPagoLogo
