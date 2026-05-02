# Plan Backend — Sharkware (Estrategia "Todo en Local")

Documento de referencia para la integración del frontend con el backend Spring Boot. Se elabora bajo el criterio "todo en local" para la expo: ninguna pieza depende de servicios cloud pagos (no hay free tier de DB usable hoy).

**Ruta del backend:** `C:\Users\tomba\OneDrive\Escritorio\ecommerce-api\sharkware`
**Package base:** `com.ecommerce.sharkware`

---

## Stack en la notebook

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | Vite + React (`localhost:5173`) | `npm run dev` o `vite preview` |
| Backend | Spring Boot 4.0.6 + Java 21 (`localhost:8080`) | `mvnw package` + `java -jar` |
| DB | MySQL 8 local | schema `sharkwaredb`, user dedicado |
| Imágenes | Cloudinary (free tier 25GB) | URLs absolutas en `image_url` y `gallery` |
| Pagos | MercadoPago Checkout Pro (sandbox) | Sin webhook — sync via `back_urls` + `GET /v1/payments` |
| Bot IA | Google Gemini 1.5 Flash | Free tier (15 req/min) |
| Cripto | CoinGecko API | Solo conversor de cotización, NO método de pago |

**Lo que se elimina del proyecto original**:
- Render / Clever Cloud / Vercel (no aplica — todo local).
- ngrok (no hace falta sin webhook MP).
- Wallets cripto, QR, countdown, checkout cripto (cripto deja de ser método de pago).
- Endpoints `POST /api/payments/mercadopago/webhook` y rutas `/checkout/crypto*`.

---

## MercadoPago — flujo SIN webhook

### Cuentas y tarjetas de prueba
Documentación oficial: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/test/accounts

1. Crear **2 usuarios de prueba** desde el panel de developers:
   - **Vendedor de prueba** → de su sandbox sale el `TEST-` access token + public key (van al backend).
   - **Comprador de prueba** → con sus credenciales se loguea en MP al pagar durante la demo.

2. **Tarjetas de prueba (Argentina):**
   - Visa aprobada: `4509 9535 6623 3704`
   - Mastercard aprobada: `5031 7557 3453 0604`
   - Amex aprobada: `3711 803032 57522`
   - CVV: `123` · Vencimiento: cualquier futuro
   - Forzar resultado con nombre del titular: `APRO` (aprobado), `OTHE` (rechazado), `CONT` (pendiente).

### Endpoints MP
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/payments/mercadopago/preference` | Crea `Preference` con los `OrderItem`. Setea `external_reference = order.id` y `back_urls` apuntando a `http://localhost:5173/checkout/confirm/mercadopago?order={id}` con `auto_return=approved`. Devuelve `{ init_point, preference_id, order_id }`. Marca la `Order` como `PENDING_PAYMENT`. |
| GET | `/api/orders/{id}/sync-payment` | Llamado por el frontend cuando el usuario vuelve. Hace `GET https://api.mercadopago.com/v1/payments/search?external_reference={order_id}` con el access token, lee `status` (`approved`/`rejected`/`in_process`/`pending`) y actualiza la `Order`. Devuelve el estado actualizado. |

### Frontend `CheckoutConfirmMercadoPago.jsx`
- Al montar lee `?order=` de la URL → `GET /api/orders/{id}/sync-payment` → muestra estado.
- Mientras devuelva `pending`/`in_process`: reintenta cada 3s hasta 30s.

### `application.properties` MP
```
mercadopago.access-token=TEST-<vendedor>
mercadopago.public-key=TEST-<vendedor>
```

---

## Cripto — solo widget de conversión

**No hay flujo de pago cripto**. Es informativo, estilo widget de finanzas.

### Backend — único endpoint
`GET /api/crypto/rates` — llama a CoinGecko, cachea 60s en memoria, devuelve:
```json
{
  "btc_ars": 95000000,
  "eth_ars": 4500000,
  "usdt_ars": 1100,
  "updated_at": "2026-04-30T15:30:00Z"
}
```

### `application.properties` cripto
```
crypto.coingecko.url=https://api.coingecko.com/api/v3/simple/price
crypto.cache.ttl-seconds=60
```
**Sin wallets, sin quote, sin expiry.** Cero configuración por usuario.

### Frontend — `CryptoConverter.jsx` (nuevo)
- Componente reutilizable. Layout: input monto + selector moneda origen (ARS/BTC/ETH/USDT) + selector destino + resultado en vivo.
- Al montar `GET /api/crypto/rates`. Refresh cada 60s o botón manual. Muestra `updated_at`.
- Conversión bidireccional: `10000 ARS → BTC` y al revés.
- Se monta en Home (bloque destacado) y en una página propia `/crypto` para versión completa.

### Eliminaciones en frontend
- Borrar `pages/checkout/CheckoutCrypto.jsx` y `pages/checkout/CheckoutConfirmCrypto.jsx`.
- Borrar las rutas `/checkout/crypto` y `/checkout/confirm/crypto` del router.
- En `Checkout.jsx` quitar la opción "Cripto", dejar solo MercadoPago.

---

## Sprints

| # | Trabajo | Resultado |
|---|---|---|
| 1 | MySQL local instalado + Cloudinary + `data.sql` con 13 productos y URLs Cloudinary | Catálogo real desde API |
| 2 | `src/api/client.js` + migrar Home/ProductDetail/MobileSidebar/SearchResults a fetch | Frontend leyendo del backend |
| 3 | Auth (sesión HTTP + BCrypt) + entidades Cart/Order + endpoints CRUD | Login real, carrito y pedidos persistentes |
| 4 | MP Checkout Pro + `back_urls` + `GET /sync-payment` + limpieza checkout cripto | Pago end-to-end con cuentas de prueba |
| 5 | Gemini chatbot + `/api/crypto/rates` + `CryptoConverter.jsx` + `start-demo.bat` + ensayo | Listo para la expo |

---

## Sprint 1 — Datos base

### MySQL local
1. Instalar MySQL 8 en la notebook.
2. Crear schema y user:
   ```sql
   CREATE DATABASE sharkwaredb CHARACTER SET utf8mb4;
   CREATE USER 'sharkware'@'localhost' IDENTIFIED BY '<pass>';
   GRANT ALL PRIVILEGES ON sharkwaredb.* TO 'sharkware'@'localhost';
   ```
3. Ajustar `pom.xml`: quitar dependencias de H2 (`spring-boot-h2console`, `com.h2database:h2`).
4. `application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/sharkwaredb?useSSL=false&serverTimezone=UTC
   spring.datasource.username=sharkware
   spring.datasource.password=<pass>
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   spring.jpa.hibernate.ddl-auto=update
   spring.sql.init.mode=always
   spring.jpa.defer-datasource-initialization=true
   app.cors.allowed-origins=http://localhost:5173,http://localhost:4173
   ```

### Cloudinary
1. Crear cuenta gratis, anotar `cloud_name`.
2. Subir las 13 imágenes con `public_id = slug` en carpeta `products/`.
3. URLs de la forma: `https://res.cloudinary.com/<cloud>/image/upload/q_auto,f_auto/products/<slug>`.

### `data.sql`
- Reemplazar los 3 productos placeholder por los 13 reales del frontend (`src/data/products.js`).
- `image_url` apunta a Cloudinary, no a `/images/products/...`.
- Las 7 categorías ya están seedeadas, queda igual.

---

## Sprint 2 — Frontend integrado

### `src/api/client.js`
```js
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const api = (path, opts = {}) =>
  fetch(`${API_URL}${path}`, { credentials: 'include', ...opts })
    .then(r => r.ok ? r.json() : Promise.reject(r));

export const getProducts  = (params) => api(`/api/products?${new URLSearchParams(params)}`);
export const getProduct   = (id)     => api(`/api/products/${id}`);
export const getFacets    = (params) => api(`/api/products/facets?${new URLSearchParams(params)}`);
export const getCategories = ()      => api('/api/categories');
export const getRates     = ()       => api('/api/crypto/rates');
```

### Migraciones
- `Home.jsx`: 3 fetches (newProducts, notebooks, monitors) + `?cat=` cuando hay filtro de categoría.
- `ProductDetail.jsx`: `getProduct(id)` + `getProducts({ category, exclude: id, size: 5 })` para relacionados.
- `MobileSidebar.jsx`: `getCategories()` (hoy lee de `data/categories.js`).
- `SearchResults.jsx`: `getProducts({ q, category, brand, minPrice, maxPrice, sort, page, size: 12 })` + `getFacets({ q, category })` para `FilterPanel`.

### Loading/Error
- Skeleton simple en cada fetch + mensaje "no se pudo cargar" en error.
- Borrar `src/data/products.js` y `src/data/categories.js` cuando todo lo anterior funcione (mantener `sortOptions.js` y `specsSchema.js`).

---

## Sprint 3 — Auth + Carrito + Pedidos

### Auth (sesión HTTP + BCrypt)
- Entidad `User` (`id, email, passwordHash, name, role`).
- `POST /api/auth/login` valida credenciales, setea `userId` + `role` en `HttpSession`, devuelve user.
- `POST /api/auth/register` crea user con `role=USER`, hashea password con `BCryptPasswordEncoder`.
- `GET /api/auth/me` lee de la sesión.
- `POST /api/auth/logout` `session.invalidate()`.
- Seed admin: `admin@sharkware.com / admin123` con `role=ADMIN`.
- `AdminInterceptor` (HandlerInterceptor) valida `session.role == ADMIN` para `/api/admin/**`.
- Frontend con `credentials: 'include'` para que viaje la cookie `JSESSIONID`.

### Cart
- Entidad `CartItem` (`id, user_id, product_id, quantity`) con `UNIQUE(user_id, product_id)`.
- Endpoints: `GET/POST/PUT/DELETE /api/cart/*` + `POST /api/cart/merge` (al loguearse).
- Cart anónimo sigue en `localStorage` vía `CartContext`. Al login se mergea.

### Orders
- Entidades `Order` (`id, user_id, total_ars, payment_method, status, created_at`) y `OrderItem` (`id, order_id, product_id, quantity, unit_price_ars` snapshot).
- `payment_method` = `'MERCADOPAGO'` (único valor — cripto ya no es método).
- `status` = `PENDING` | `PAID` | `CANCELLED`.
- `POST /api/orders` crea desde el cart actual.

---

## Sprint 4 — MercadoPago (sin webhook)

Ver sección "MercadoPago — flujo SIN webhook" arriba.

Trabajo concreto:
1. Agregar dependencia `com.mercadopago:sdk-java` al `pom.xml`.
2. `MercadoPagoService` que arma `Preference` desde una `Order` con `external_reference = order.id`, `back_urls.success = http://localhost:5173/checkout/confirm/mercadopago?order={id}`, `auto_return = approved`.
3. `POST /api/payments/mercadopago/preference` recibe `{ orderId }`, devuelve `init_point`.
4. `GET /api/orders/{id}/sync-payment` consulta `/v1/payments/search?external_reference=` y actualiza `Order.status` + `Payment.status`.
5. Frontend `Checkout.jsx`: solo MercadoPago como opción (eliminar selector). Botón "Pagar" → `POST /api/orders` → `POST /api/payments/mercadopago/preference` → `window.location = init_point`.
6. Frontend `CheckoutConfirmMercadoPago.jsx`: al montar lee `?order=`, llama sync-payment con polling 3s/30s.
7. Borrar las páginas/rutas/opción de cripto checkout.

---

## Sprint 5 — Chatbot + Cripto + Demo

### Chatbot Gemini
- `POST /api/chatbot/message` recibe `{ message }`, devuelve `{ reply }`.
- `GeminiService` hace POST a `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` con system prompt: "Sos Sharkbot, asistente de Sharkware Gaming. Catálogo: <resumen breve>. Solo respondés sobre productos, precios, envíos."
- Frontend: `ChatbotPanel.jsx` ya existe — conectar el submit al endpoint.
- API key en `application.properties`:
  ```
  gemini.api-key=AIzaSy-xxxxx
  gemini.model=gemini-1.5-flash
  ```

### Cripto conversor
Ver sección "Cripto — solo widget de conversión" arriba.

### Script de arranque
`start-demo.bat`:
```bat
@echo off
start "MYSQL" cmd /k "net start MySQL80"
timeout /t 5
start "API"   cmd /k "java -jar target\sharkware-0.0.1-SNAPSHOT.jar"
timeout /t 8
start "WEB"   cmd /k "npx vite preview --port 5173"
```

### Ensayo end-to-end
1. Login con admin → ver panel.
2. Logout → register nuevo usuario.
3. Catálogo → buscar → filtrar → detalle.
4. Agregar al cart → checkout → MP (con comprador de prueba + tarjeta `APRO`) → vuelta → sync → "PAGADO".
5. Abrir chatbot → preguntar por una notebook.
6. Abrir conversor cripto → ver cotizaciones live.

---

## Modelo de datos resumido

```
users         (id, email, password_hash, name, role, created_at)
categories    (id VARCHAR PK, label, icon)                            -- seed estático
products      (id, brand, name, slug, spec, description, price_ars,
               badge, stock, category_id FK, image_url, gallery JSON,
               specs JSON, active, created_at)
cart_items    (id, user_id FK, product_id FK, quantity)               -- UNIQUE(user_id, product_id)
orders        (id, user_id FK, total_ars, payment_method, status, created_at)
order_items   (id, order_id FK, product_id FK, quantity, unit_price_ars)
payments      (id, order_id FK UNIQUE, external_ref UNIQUE, status,
               amount_ars, created_at)
```

`payments` solo registra MP (no hay otro método). `external_ref` viene del `payment.id` que devuelve MP cuando se hace el sync.

---

## Endpoints REST (resumen)

```
POST   /api/auth/login | register | logout
GET    /api/auth/me

GET    /api/categories
GET    /api/products              ?q=&category=&brand=&minPrice=&maxPrice=&sort=&page=&size=&exclude=&badge=
GET    /api/products/{id}
GET    /api/products/facets       ?q=&category=

GET    /api/cart
POST   /api/cart                  { productId, quantity }
PUT    /api/cart/{itemId}         { quantity }
DELETE /api/cart/{itemId}
POST   /api/cart/merge            { items: [{ productId, quantity }] }

POST   /api/orders                { paymentMethod: 'MERCADOPAGO' }
GET    /api/orders
GET    /api/orders/{id}
GET    /api/orders/{id}/sync-payment

POST   /api/payments/mercadopago/preference   { orderId }

GET    /api/crypto/rates

POST   /api/chatbot/message       { message }

GET    /api/admin/products        ?page=&size=&q=
POST   /api/admin/products        multipart: data + image + gallery[]
PUT    /api/admin/products/{id}   multipart
DELETE /api/admin/products/{id}   (soft delete: active=false)
GET    /api/admin/stats
GET    /api/admin/orders
PUT    /api/admin/orders/{id}/status
GET    /api/admin/users
PUT    /api/admin/users/{id}/role
```

---

## Estructura del backend (por feature)

```
com.ecommerce.sharkware/
├── SharkwareApplication.java
├── common/
│   ├── config/        WebConfig (CORS), AdminInterceptor, SecurityConfig (BCrypt), RestClientConfig
│   ├── exception/     GlobalExceptionHandler, NotFoundException, ValidationException, UnauthorizedException
│   └── util/          SlugUtil
├── auth/              User, AuthService, AuthController, dtos
├── category/          Category, CategoryService, CategoryController
├── product/           Product, ProductRepository (JpaSpecificationExecutor),
│                      ProductService, ProductController, AdminProductController,
│                      ProductSpecifications, dtos
├── cart/              CartItem, CartService (incluye merge), CartController
├── order/             Order, OrderItem, OrderService, OrderController, AdminOrderController
├── payment/           Payment, MercadoPagoService, PaymentService
├── crypto/            CryptoRatesService (CoinGecko + cache 60s), CryptoController
├── chatbot/           GeminiService, ChatbotController
└── image/             CloudinaryStorageService (multipart → SDK → URL)
```

`JpaSpecificationExecutor` evita combinatoria de métodos (`findByCategoryAndBrandAndPriceBetween...`). DTOs explícitos por endpoint — nunca se devuelven entidades JPA directamente.
