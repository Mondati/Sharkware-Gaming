import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const CONFIRM_PATH = '/checkout/confirm/mercadopago'

const PendingOrderRedirect = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Corre solo al montar: MercadoPago no hace auto_return en localhost, así que
  // al volver a la app (carga completa) recuperamos el pago en curso desde el flag
  // y llevamos al usuario a la pantalla de confirmación. Deps vacías a propósito:
  // re-evaluar por cada navegación generaría un loop home → confirm → home mientras
  // la orden siga PENDING.
  useEffect(() => {
    const pending = localStorage.getItem('sw_pending_order')
    if (!pending) return
    if (pathname === CONFIRM_PATH) return
    navigate(`${CONFIRM_PATH}?order=${pending}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default PendingOrderRedirect
