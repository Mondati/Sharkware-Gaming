# HU14 — Guía de integración del frontend con MercadoPago

Esta guía describe **exactamente** qué endpoints expone el backend tras implementar HU14 y cómo el front debe encadenarlos. El objetivo es que la implementación del frontend salga limpia, sin idas y vueltas.

> Backend listo: `feature/integrar-pago-hu14`. Endpoints nuevos: `POST /api/payments/mercadopago/preference` y `GET /api/orders/{id}/sync-payment`. Stock se decrementa atómicamente cuando una orden pasa `PENDING → PAID`.

---

## 1. Flujo completo

```
[Cart] ──► createOrder(items)                     POST /api/orders                201 { id, status:'PENDING', externalReference, total, items[] }
        ──► createMpPreference(order.id)          POST /api/payments/mercadopago/preference   200 { initPoint, preferenceId, orderId }
        ──► clearCart()
        ──► window.location.href = initPoint
                                                  (MP sandbox: login comprador de prueba + tarjeta APRO)
        ──► back_urls → /checkout/confirm/mercadopago?order={id}
        ──► syncPayment(order.id)                 GET /api/orders/{id}/sync-payment   200 { status:'PAID'|'FAILED'|'PENDING', paidAt, mpPaymentId, ... }
        ──► render según status
            └── si sigue PENDING: reintentar cada 3s hasta 10 veces (30s total)
```

Sin webhook. La sincronización corre de lado del front cada vez que se vuelve a la página de confirmación.

---

## 2. Contrato de los endpoints nuevos

Ambos requieren cookie de sesión (`JSESSIONID`). El `apiFetch` ya manda `credentials: 'include'`.

### 2.1 `POST /api/payments/mercadopago/preference`

**Request**
```json
{ "orderId": 42 }
```

**200 OK**
```json
{
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "preferenceId": "1234567890-abc-xyz",
  "orderId": 42
}
```

Si la orden ya tenía `mpPreferenceId` (porque el user pidió crear preference dos veces), el back devuelve la **misma** preference sin volver a crearla en MP. Esto evita doble pago.

**Errores**

| Status | `error` | Cuándo |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `orderId` faltante o cuerpo inválido |
| 401 | `UNAUTHORIZED` | sin cookie de sesión |
| 404 | `NOT_FOUND` | la orden no existe o no es del user logueado |
| 409 | `CONFLICT` | la orden ya no está en estado `PENDING` (ej. ya pagada o fallida) |
| 502 | `PAYMENT_PROVIDER_ERROR` | MercadoPago no respondió o devolvió error |

### 2.2 `GET /api/orders/{id}/sync-payment`

Llamar al volver de MP **y** durante el polling.

**200 OK** — devuelve el `OrderResponse` actualizado:
```json
{
  "id": 42,
  "status": "PAID",
  "total": 1234567.89,
  "externalReference": "f0c2...-uuid",
  "mpPreferenceId": "1234567890-abc-xyz",
  "createdAt": "2026-05-15T22:30:00Z",
  "paidAt": "2026-05-15T22:34:12Z",
  "items": [
    { "productId": 12, "productName": "RTX 4070 Ti", "unitPrice": 999999.00, "quantity": 1 }
  ]
}
```

Mapeo de estados que devuelve el back:
- `PAID` → MP `approved`. Stock ya fue decrementado. `paidAt` poblado.
- `FAILED` → MP `rejected`/`cancelled`, o stock se agotó entre la creación de la orden y el pago.
- `PENDING` → MP devolvió `pending`/`in_process` o todavía no apareció el pago. Reintentar.

Idempotente: llamarlo varias veces sobre una orden ya `PAID` devuelve el mismo response sin tocar MP ni stock.

**Errores**

| Status | `error` | Cuándo |
|---|---|---|
| 401 | `UNAUTHORIZED` | sin sesión |
| 404 | `NOT_FOUND` | orden inexistente o de otro user |
| 502 | `PAYMENT_PROVIDER_ERROR` | MercadoPago no respondió. El front puede reintentar. |

---

## 3. Wrappers a agregar en `src/api/orders.js`

```js
import { apiFetch } from './client'

// (ya existen) createOrder, getOrder, listOrders ...

export const createMpPreference = (orderId) =>
  apiFetch('/api/payments/mercadopago/preference', {
    method: 'POST',
    body: { orderId },
  })

export const syncPayment = (orderId) =>
  apiFetch(`/api/orders/${orderId}/sync-payment`)
```

---

## 4. Cambios en `Checkout.jsx`

`handlePay` actualmente hace `POST /api/orders` y navega. Extender para encadenar la preference y redirigir a MP.

```js
import { createOrder, createMpPreference } from '../api/orders'

const handlePay = async () => {
  setLoading(true)
  setError(null)
  try {
    const order = await createOrder(
      items.map(i => ({ productId: i.id, quantity: i.quantity }))
    )
    const pref = await createMpPreference(order.id)
    clearCart()
    window.location.href = pref.initPoint
  } catch (e) {
    if (e.status === 401) setError('Tu sesión expiró, ingresá de nuevo')
    else if (e.error === 'OUT_OF_STOCK') setError('Uno de los productos se quedó sin stock')
    else if (e.error === 'PAYMENT_PROVIDER_ERROR') setError('No se pudo iniciar el pago. Reintentá en un momento.')
    else if (e.error === 'CONFLICT') setError('La orden ya no está disponible para pagar')
    else setError('Ocurrió un error al iniciar el pago')
  } finally {
    setLoading(false)
  }
}
```

> `clearCart()` se llama **después** de `createMpPreference` exitoso y **antes** del redirect. Si el user cancela el pago en MP, la orden queda como `PENDING/FAILED` en DB y el cart local ya está vacío — reintentar es empezar desde cero.

---

## 5. Cambios en `CheckoutConfirmMercadoPago.jsx`

Al montar lee `?order={id}`, llama `syncPayment` y polea mientras devuelva `PENDING`.

```js
import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { syncPayment } from '../api/orders'

const MAX_ATTEMPTS = 10
const POLL_INTERVAL_MS = 3000

export default function CheckoutConfirmMercadoPago() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const attemptsRef = useRef(0)

  useEffect(() => {
    if (!orderId) { setError('Falta el id de la orden'); return }
    let cancelled = false
    let timer

    const tick = async () => {
      try {
        const data = await syncPayment(orderId)
        if (cancelled) return
        setOrder(data)
        if (data.status === 'PENDING' && attemptsRef.current < MAX_ATTEMPTS - 1) {
          attemptsRef.current += 1
          timer = setTimeout(tick, POLL_INTERVAL_MS)
        } else if (data.status === 'PENDING') {
          setTimedOut(true)
        }
      } catch (e) {
        if (cancelled) return
        if (e.error === 'PAYMENT_PROVIDER_ERROR' && attemptsRef.current < MAX_ATTEMPTS - 1) {
          attemptsRef.current += 1
          timer = setTimeout(tick, POLL_INTERVAL_MS)
        } else {
          setError(e.message || 'No se pudo confirmar el pago')
        }
      }
    }

    tick()
    return () => { cancelled = true; if (timer) clearTimeout(timer) }
  }, [orderId])

  // Render según order?.status: PAID success, FAILED error, PENDING + timedOut info, etc.
}
```

UI por estado:
- **`PAID`** → check verde + "¡Pago confirmado!" + link "Ver mis pedidos" + resumen de items.
- **`FAILED` / `CANCELLED`** → cruz roja + "El pago no se completó" + botones "Volver al carrito" / "Ir al home". (El cart ya está vacío — el botón al carrito puede llevar al catálogo.)
- **`PENDING` + `timedOut`** → reloj amarillo + "El pago está en proceso. Te avisaremos cuando se confirme."
- **`PENDING` (poleando)** → skeleton + "Confirmando pago…".
- **`error`** → cartel rojo con el mensaje.

---

## 6. Idempotencia y reintentos

- Llamar `syncPayment` cualquier cantidad de veces es seguro: si la orden ya es `PAID`, el back devuelve el mismo resultado **sin** decrementar stock de nuevo ni golpear MP.
- Llamar `createMpPreference` sobre una orden `PAID` devuelve **409 CONFLICT**. Sobre una orden `PENDING` que ya tiene preference, devuelve la existente.
- Si el pago falló (`FAILED`), el front debe **crear una orden nueva** desde el carrito. Reusar la orden fallida está **fuera de scope** de HU14 — el back rechazará el `createMpPreference` con 409.

---

## 7. Cuenta y tarjetas de prueba (sandbox)

**Comprador de prueba** (creado desde *Tus integraciones → Cuentas de prueba*): logueate con su usuario+contraseña al llegar a MP. Si pide código de 6 dígitos, lo encontrás en la misma sección.

**Tarjetas (Argentina):**

| Marca | Número | CVV | Vencimiento |
|---|---|---|---|
| Visa crédito | `4509 9535 6623 3704` | `123` | `11/30` |
| Mastercard crédito | `5031 7557 3453 0604` | `123` | `11/30` |
| Amex crédito | `3711 803032 57522` | `1234` | `11/30` |

**Resultado forzado vía titular:**

| Titular | DNI | Resultado |
|---|---|---|
| `APRO` | `12345678` | Aprobado → `PAID` |
| `OTHE` | `12345678` | Rechazado → `FAILED` |
| `CONT` | — | Pendiente → `PENDING` (probar polling) |

---

## 8. Checklist de smoke end-to-end (navegador)

1. Login como usuario común → agregar 2 productos al cart → ir a `/checkout`.
2. Click "Pagar". DevTools → Network:
   - `POST /api/orders` → 201 con `id`, `externalReference` (UUID), `status: 'PENDING'`.
   - `POST /api/payments/mercadopago/preference` → 200 con `initPoint` y `preferenceId`.
3. Browser redirige a `mercadopago.com.ar/checkout/...`. Loguear con comprador de prueba.
4. Pagar con Visa `4509 9535 6623 3704`, titular `APRO`, DNI `12345678`.
5. MP redirige a `/checkout/confirm/mercadopago?order={id}`.
6. Network: `GET /api/orders/{id}/sync-payment` → 200 con `status: 'PAID'`, `paidAt` poblado, `mpPaymentId` presente.
7. UI muestra success. Verificar en MySQL Workbench:
   - `SELECT status, paid_at, mp_payment_id, external_reference FROM orders WHERE id={id};`
   - `SELECT id, stock FROM products WHERE id IN (...);` → stock decrementado.
8. **Idempotencia:** refrescar la página de confirmación → `sync-payment` se vuelve a llamar → mismo resultado, stock **no** cae de nuevo.
9. **Caso rechazado:** repetir flujo con titular `OTHE` → orden `FAILED`, stock intacto, UI muestra error.
10. **Caso pendiente:** repetir con titular `CONT` → ver el polling cada 3s en Network durante 30s, luego mensaje "en proceso".

---

## 9. Cosas que **no** tenés que hacer

- ❌ Tocar `CartContext.jsx` ni `Cart.jsx`.
- ❌ Mandar `total` o `unitPrice` al back — todo se snapshotea server-side desde `products`.
- ❌ Implementar webhook listener — la demo confirma por polling.
- ❌ Implementar retry de la misma orden fallida — fuera de scope.
- ❌ Decrementar stock client-side — lo hace el back atómicamente.
