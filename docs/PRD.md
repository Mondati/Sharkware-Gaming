# PRD — Sharkware Gaming

**Producto:** Sharkware Gaming
**Tipo:** Ecommerce de hardware gaming (Argentina)
**Versión del documento:** 1.0
**Fecha:** 2026-05-24
**Estado:** En desarrollo activo — preparación para demo/expo

---

## 1. Resumen ejecutivo

Sharkware Gaming es un ecommerce vertical de hardware gaming pensado para el mercado argentino. Permite a usuarios navegar un catálogo curado, comparar componentes, recibir builds de PC armadas por IA en base a presupuesto y uso, pagar con MercadoPago y consultar cotizaciones de criptomonedas en ARS.

El diferenciador competitivo es el **Builder IA**: un asistente que arma builds completas de PC a partir de un presupuesto y un caso de uso, validando compatibilidad real (socket, RAM type, wattage, longitud de GPU, cooler) contra el catálogo en vivo.

**Deploy:** todo en local para la expo — sin infraestructura cloud paga.

---

## 2. Objetivos

### Objetivos de negocio
- Demostrar un ecommerce funcional end-to-end (catálogo → carrito → pago real en sandbox → confirmación).
- Diferenciarse de competidores con un asistente de armado de PCs con IA real (no scripted).
- Mostrar dominio técnico: full-stack moderno (React 19 + Spring Boot 4 + MySQL), integración con MercadoPago, Groq y CoinGecko.

### Objetivos de producto
- Reducir la fricción de elegir componentes compatibles para usuarios no expertos.
- Ofrecer pagos confiables con la pasarela más usada en Argentina.
- Proveer información de mercado (cripto ↔ ARS) como utilidad complementaria.
- Habilitar gestión completa del catálogo desde un panel admin.

### No-objetivos (fuera de scope)
- Cripto **no** es método de pago. Solo widget conversor.
- Sin envíos físicos reales / cálculo de logística.
- Sin reviews ni cupones funcionales (solo placeholders UI).
- Sin sistema de recomendación por user (más allá del Builder IA conversacional).
- Sin app mobile nativa.

---

## 3. Personas / Usuarios

| Persona | Descripción | Necesidades |
|---|---|---|
| **Gamer novato** | Quiere armar una PC pero no sabe qué componentes son compatibles. | Recomendaciones guiadas, validación automática de compatibilidad, presupuesto claro. |
| **Gamer experto / DIY** | Sabe lo que busca, compara precios y specs. | Filtros potentes, specs completas, stock visible, comparar precios contra el mercado. |
| **Comprador casual** | Busca periféricos o upgrades puntuales (monitor, teclado, RAM). | Búsqueda rápida, checkout sin fricción. |
| **Admin / operador del negocio** | Gestiona catálogo, stock, pedidos. | Panel admin con CRUD de productos, edición rápida de stock, visibilidad de pedidos pendientes. |

---

## 4. Stack técnico

### Frontend (`ecommerce/`)
- React 19.2.5 + React Router 7.14
- Vite 8.0.4
- Tailwind CSS 4.2.2 (vía `@tailwindcss/vite`) — usado para layout/responsive; styling visual con inline `style={{}}` y hex hardcodeados
- Lucide React (íconos)
- Context API (`CartContext`, `AuthContext`) — sin Redux/Zustand
- Sin TypeScript, sin axios (fetch centralizado en `src/api/client.js`)

### Backend (`ecommerce-api/sharkware/`)
- Java 21 + Spring Boot 4.0.6
- Spring Data JPA + Hibernate
- MySQL 8 local (schema `sharkwaredb`, puerto 3306)
- Auth: `HttpSession` + `BCryptPasswordEncoder` (sin Spring Security completo)
- MercadoPago SDK Java 2.9.2 (sandbox)
- Groq Cloud (Llama 4 Scout) para Builder IA
- Cloudinary (free 25GB) para imágenes
- CoinGecko (sin API key, cache 60s) para tasas cripto
- Springdoc OpenAPI 2.8.13 (Swagger UI en `/swagger-ui.html`)

---

## 5. Funcionalidades — Historias de Usuario

### Catálogo y navegación
| HU | Descripción | Estado |
|---|---|---|
| HU1–HU7 | Catálogo, detalle, navegación, búsqueda, filtros, sort, paginación (server-side desde el inicio) | ✅ |
| HU30 | Indicar disponibilidad de stock (pill "¡Pocas unidades!" cuando 0 < stock ≤ 3) | ✅ |

### Carrito y compra
| HU | Descripción | Estado |
|---|---|---|
| HU8–HU12 | Agregar / ver / modificar / eliminar / vaciar carrito (100% client-side, localStorage `sw_cart`) | ✅ |
| HU13 | Simular compra → crear orden `PENDING` | ✅ |
| HU14 | Integración MercadoPago Checkout Pro (sandbox, sin webhook — confirmación vía `back_urls` + `GET /v1/payments/search`) | ✅ |
| HU15 | Confirmar compra → `/checkout/summary/:id` + `/mis-pedidos` + auto-cancel 30min | ✅ |
| HU32 | Descuento atómico de stock al confirmar el pago | ✅ |

### Cuentas
| HU | Descripción | Estado |
|---|---|---|
| HU16 | Registro de usuario (auto-login) | ✅ |
| HU17 | Login (sesión HTTP) | ✅ |
| HU18 | Logout | ✅ |
| HU19 | Validar datos + sesión (`@Pattern` + `fields` en 400, `GET /me` con `loading`) | ✅ |

### Admin
| HU | Descripción | Estado |
|---|---|---|
| HU20 | Editar producto (modal con galería selectiva) | ✅ |
| HU21 | Eliminar producto (hard delete; 409 si tiene `order_items`) | ✅ |
| HU22 | Validar formulario de producto en admin (espejo client/server) | ✅ |
| HU23 | Listar productos con paginación server-side | ✅ |
| HU24 | Crear producto nuevo (multipart con imágenes reales) | ✅ |
| HU25 | Persistencia (8 tablas + repos + seed admin) | ✅ |
| HU31 | Gestionar stock desde admin — quick-edit inline + modal | ✅ |

### Features complementarias
| HU | Descripción | Estado |
|---|---|---|
| HU28 | Conversor cripto BTC/ETH/USDT ↔ ARS (widget en `/crypto` con backend cache 60s y UI tipo terminal) | ✅ |
| HU29 | Responsive mobile / tablet / desktop (breakpoint único `md:` 768px + `useWindowWidth`) | ✅ |
| HU26 | FAQ automáticas vía IA (Chatbot con Gemini — pendiente) | ⏳ Sprint 5 |
| HU27 | Ofertas de productos | ⏳ Sprint 5 |

### Diferenciador competitivo (fuera del scope HU original)
| Feature | Descripción | Estado |
|---|---|---|
| **Builder IA** | Asistente conversacional que arma builds de PC completas (8 categorías) a partir de presupuesto + uso, validando compatibilidad real contra el catálogo. Implementado con Groq + Llama 4 Scout (function-calling). | ✅ |

---

## 6. Requisitos funcionales detallados

### 6.1. Autenticación
- Sesión HTTP real (cookie `JSESSIONID`, timeout 30min).
- Restauración tras F5 vía `GET /api/auth/me` con flag `loading=true` (evita flashes en `ProtectedRoute`).
- Registro hardcodea `role="user"`. **Admins se crean solo via seed** (`admin@sharkware.com` / `admin123`).
- Email duplicado → 409. Login inválido → 401 genérico.

### 6.2. Carrito y checkout
- Carrito anónimo y logueado comparten `localStorage sw_cart`.
- `POST /api/orders` valida stock y precios contra `products` (snapshot en `order_items`).
- Flujo de pago:
  1. `Cart` → `Checkout` → `createOrder` (`PENDING`, `externalReference=UUID`).
  2. `/checkout/summary/:id` — re-valida stock real, datos del user, breakdown.
  3. Click "Confirmar y pagar" → `createMpPreference` → `clearCart()` → redirect a MP.
  4. Vuelta a `/checkout/confirm/mercadopago?order=:id` → polling `syncPayment` cada 3s (máx 30s).
- Decremento atómico en `markPaid`: `UPDATE products SET stock = stock - :qty WHERE id = :id AND stock >= :qty`. Si rowcount = 0 → orden `FAILED`.

### 6.3. Recuperación de PENDING (mitigación de `auto_return` no soportado en localhost)
- Auto-sync defensivo en `GET /api/orders` para PENDING < 1h.
- Botón manual "Verificar pago" en `/mis-pedidos`.
- Auto-cancel de PENDING > 30min via scheduler global (`@Scheduled fixedDelay=300s`).
- Flag `sw_pending_order` en localStorage para recovery UX.

### 6.4. Admin
- Interceptor `/api/admin/**` valida `role=admin` en sesión.
- CRUD de productos con multipart (data JSON + image + gallery + keepGallery).
- Quick-edit inline de stock vía `PATCH /api/admin/products/{id}/stock`.
- Dashboard `GET /api/admin/stats` con totales globales (no paginados): `totalProducts`, `pendingOrders`, `outOfStockProducts`, `totalCategories`.
- Cards "Pedidos pendientes" reemplaza la métrica de "Activos" (`Product.active` es siempre `true`).

### 6.5. Builder IA
- Endpoint `POST /api/builder/message` público (`{ conversationId?, message }`).
- Sesión in-memory (`ConcurrentMap`), se pierde al reiniciar (ok para expo).
- Loop con `MAX_ITERATIONS=14`, ventana de historial 6.
- **Tracking de presupuesto** server-side:
  - Detecta presupuesto del primer mensaje con regex (`2.000.000`, `2M`, `800k`, `1,5 millones`).
  - Tolerancia: `[budget − 200.000, budget + 100.000]`.
  - Short-circuit si `budget < MIN_VIABLE_BUDGET (800.000)` → responde sin llamar a Groq.
  - Inyecta system message extra con el rango; `proposeBuild` reporta `withinBudget` y `budgetGap`.
- Tools (function-calling) contra catálogo real:
  - `searchProducts` / `searchProductsBatch` (con filtros `socket`, `ramType`).
  - `getProduct`, `checkCpuMotherCompat`, `checkRamCompat`, `recommendPsu`, `proposeBuild`.
- Validación de compatibilidad: socket CPU/mother, ramType mother/RAM, TDP + headroom 30%, longitud GPU vs gabinete, cooler vs socket.
- `pickFirstByCategory` auto-completa categorías que el LLM omita, respetando socket y ramType ya elegidos.
- 503 `BUILDER_UNAVAILABLE` si Groq falla tras 3 retries (backoff 1.5s/3s/6s).

### 6.6. Conversor cripto
- `GET /api/crypto/rates` público — cache in-memory 60s.
- Frontend `/crypto` con UI tipo terminal: ticker de 3 cotizaciones (BTC/ETH/USDT), converter bidireccional con auto-refresh 60s.
- Fallback graceful: si CoinGecko falla pero hay cache previa, devuelve la vieja; si no hay cache → 503 `RATES_UNAVAILABLE`.

---

## 7. Modelo de datos

8 tablas principales en MySQL `sharkwaredb`:

| Tabla | Notas |
|---|---|
| `categories` | PK String. 11 categorías seed (notebooks, cpu, gpu, ram, monitors, storage, peripherals, coolers, gabinetes, motherboard, psu). |
| `products` | `priceArs` BigDecimal(12,2), `specs` JSON, enum `Badge`. 30 productos seed cubriendo build completo. |
| `product_images` | FK CASCADE DELETE. `is_primary=true` (1 exacto) + `is_primary=false` (máx 3 galería). |
| `users` | `email` UNIQUE(120), `passwordHash` BCrypt(72), `role` default `"user"`. |
| `orders` | enum `OrderStatus` (PENDING/PAID/CANCELLED/FAILED), `external_reference` UNIQUE (UUID), `mp_preference_id`, `mp_payment_id`, `paid_at`. |
| `order_items` | Snapshot `product_name` + `unit_price` para histórico. |

**Sin tablas `carts` / `cart_items`** — carrito 100% en `localStorage`.

---

## 8. Endpoints (resumen)

```
# Auth
POST   /api/auth/login | register | logout
GET    /api/auth/me

# Catálogo público
GET    /api/categories
GET    /api/products              ?q&category&brand&minPrice&maxPrice&sort&page&size&exclude&badge
GET    /api/products/{id}
GET    /api/products/facets       ?q&category

# Órdenes
POST   /api/orders                { paymentMethod: 'MERCADOPAGO', items[] }
GET    /api/orders                # auto-sync PENDING <1h, auto-cancel >30min
GET    /api/orders/{id}
GET    /api/orders/{id}/summary
GET    /api/orders/{id}/sync-payment

# Pagos
POST   /api/payments/mercadopago/preference

# Cripto
GET    /api/crypto/rates

# Builder IA
POST   /api/builder/message       { conversationId?, message }

# Admin (🔒)
GET    /api/admin/products
POST   /api/admin/products        multipart
PUT    /api/admin/products/{id}   multipart
PATCH  /api/admin/products/{id}/stock
DELETE /api/admin/products/{id}
GET    /api/admin/stats
GET    /api/admin/orders
PUT    /api/admin/orders/{id}/status
GET    /api/admin/users
PUT    /api/admin/users/{id}/role
```

---

## 9. UX / UI

### Diseño visual
- Paleta dark con fondos `#0A0C14` / `#070B16` y acentos azules `#24A8F5` / `#00C8FF`.
- Tipografía dual: `Poppins` (UI body) + `Rajdhani` (solo headings y hero).
- Iconografía Lucide.
- Estilo "gaming terminal" en páginas hero (`/crypto`, `/builder`) con grid pattern, glow, mono.

### Responsive
- Breakpoint único `md:` (768px).
- `useWindowWidth()` hook devuelve `{ sidePadding, cardFlex }` para 5 buckets de viewport (768→1920+).
- Mobile y desktop renderizan **dos versiones completas** del bloque (no se ocultan elementos individuales).
- Grids horizontales en Home con scroll custom (`.sw-scroll`), max 5 cards visibles.

### Accesibilidad
- Reglas globales en `index.css`: `:focus { outline: none }` + `:focus-visible { outline: 2px solid #24A8F5 }`.
- **Nunca** escribir `outline: 'none'` inline (rompe a11y por teclado).

### Componentes destacados
- `ProductCard` con `StockDot` (pill "Pocas unidades" compacta).
- `BuildCard` con header, items linkeados, fila Presupuesto + delta coloreado, warnings, botón "Agregar build al carrito".
- `CryptoConverter` con orb central de swap rotatorio.
- Toast global posicionado `bottom: 104px` (no choca con botón chatbot).

---

## 10. Métricas de éxito (KPIs propuestos para demo)

| Métrica | Target |
|---|---|
| Tiempo end-to-end de checkout (cart → pago confirmado) | < 90s |
| Tasa de builds completas del Builder IA con `withinBudget=true` | ≥ 80% |
| Tiempo medio de respuesta del Builder por turno | < 8s |
| Latencia API catálogo (`GET /api/products`) | < 200ms p95 |
| Sin errores 5xx en demo | 0 |
| Cobertura de categorías con productos seed | 11/11 |

---

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| MercadoPago rechaza `auto_return` en localhost | Polling `syncPayment` + botón manual + auto-sync en `listOrders` + scheduler de auto-cancel. |
| Groq free tier 30K TPM saturado | System prompt achicado (~260 tokens), `max_tokens=512`, logging por iteración, retries con backoff. |
| Cripto upstream (CoinGecko) caído | Cache in-memory + fallback a cache vieja con warn; 503 solo si nunca hubo cache. |
| LLM elige componentes incompatibles | Tools `checkCpuMotherCompat` / `checkRamCompat`; params `socket`/`ramType` en search; flujo secuencial obligatorio en system prompt; `pickFirstByCategory` defensivo. |
| Sesión Builder en memoria (se pierde al reiniciar) | Aceptado — UX de expo, conversaciones son cortas. |
| Stock race entre `createOrder` y pago | Decremento atómico en SQL; orden cae a `FAILED` si rowcount = 0. |

---

## 12. Decisiones cerradas relevantes

- **Auth: HttpSession + BCrypt** (no JWT).
- **Carrito client-side** (no en BD). Backend recibe items en body y valida.
- **Reviews y cupones**: UI placeholder, sin tabla/endpoints.
- **Categorías fijas** (seed estático, sin CRUD).
- **Admin solo via seed.**
- **Search/filtros/sort/paginación = server-side** desde el inicio.
- **Builder IA usa Groq + Llama 4 Scout** (no Gemini — free tier de Gemini es muy ajustado para function-calling).
- **Builder IA ≠ Chatbot FAQ (HU26)** — features de negocio separadas, distintos endpoints, paquetes, providers.

---

## 13. Roadmap (próximos sprints)

### Sprint 2 — Migración front a API
- Crear wrappers `getProducts/getProduct/getFacets/getCategories/getRates` en `src/api/`.
- Cada componente con skeleton de carga + mensaje de error.
- Borrar `src/data/products.js` y `categories.js` (mantener `sortOptions.js`, `specsSchema.js`).

### Sprint 5 — Features pendientes
- **HU26**: Chatbot FAQ con Google Gemini 2.0 Flash. Endpoint `POST /api/chatbot/message`. `ChatbotPanel.jsx` ya existe como shell estático.
- **HU27**: Ofertas de productos.

### Mejoras pendientes
- AdminPanel form actualmente en USD → migrar a ARS.
- Helpers de IDs hardcodeados en `products.js` → queries reales (`?badge=NUEVO`, etc.) tras Sprint 2.

---

## 14. Apéndice — Demo flow (ensayo end-to-end)

1. Login admin → ver panel.
2. Logout → register nuevo usuario.
3. Catálogo → buscar → filtrar → detalle.
4. Cart → checkout → summary (stock real, datos user, total) → confirmar → MP (comprador prueba + `APRO`) → vuelta → polling → "PAGADO".
5. `/mis-pedidos`: orden como `PAID`. (Si quedó `PENDING`, click "Verificar pago".)
6. Home → hero "¿No sabés qué comprar?" → `/builder` → "Gaming Intel, presupuesto 1.500.000" → BuildCard con delta verde → "Agregar build al carrito".
7. Edge cases Builder:
   - Inviable (`"500000"`) → respuesta inmediata sin llamar a Groq.
   - Sano → build cae en `[budget−200k, budget+100k]`.
8. Carrito con build → checkout → mismo flujo MP.
9. `/crypto` → cotizaciones live + converter bidireccional.
10. (Cuando esté implementado) Chatbot FAQ → políticas/envíos.

---

**Documento mantenido en `docs/PRD.md`. Para detalles técnicos de implementación ver [`CLAUDE.md`](../CLAUDE.md) y [`docs/plan-backend.md`](./plan-backend.md).**
