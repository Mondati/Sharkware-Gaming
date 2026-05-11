<div align="center">
  <img src="public/images/logo.png" alt="Sharkware Gaming" width="200" />

  # Sharkware Gaming

  **Ecommerce de hardware gaming para el mercado argentino**

  ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white)
  ![React Router](https://img.shields.io/badge/React_Router-7.14-CA4245?logo=reactrouter&logoColor=white)
</div>

---

## Descripción

Sharkware Gaming es una tienda online de componentes y periféricos gaming —notebooks, GPUs, monitores, RAM, almacenamiento y periféricos— orientada al mercado argentino. La aplicación implementa el flujo completo de un ecommerce: catálogo, búsqueda, filtros, carrito persistente, checkout con MercadoPago, panel administrativo con CRUD de productos y autenticación real basada en sesiones HTTP.

El frontend está construido con **React 19 + Vite** y se conecta a un backend **Spring Boot 4 + MySQL 8** (ver `ecommerce-api/sharkware/`). El detalle completo del modelo de datos, endpoints REST y plan por sprints vive en [`CLAUDE.md`](./CLAUDE.md).

> [!NOTE]
> Algunas pantallas del catálogo todavía leen de `src/data/products.js` (seed estático de 70 productos). La migración integral del front a los endpoints `/api/products` y `/api/categories` está planificada para el Sprint 2. El panel admin, auth y el flujo MercadoPago ya consumen el backend real.

## Funcionalidades

- **Catálogo** con búsqueda por nombre/marca/spec, filtros combinables (categoría, marca, rango de precios), ordenamiento y paginación — todo el estado persiste en la URL.
- **Detalle de producto** con specs adaptativas por categoría, galería de imágenes y productos relacionados.
- **Carrito persistente** anónimo (`CartContext` + `useReducer` + `localStorage`) que al loguearse hace merge con el carrito del usuario en el backend.
- **Autenticación real** vía `HttpSession` + `BCryptPasswordEncoder` — login, registro con auto-login, logout y restauración de sesión en F5.
- **Checkout con MercadoPago** (sandbox) — preferencia + `back_urls` + sincronización por `external_reference` (sin webhook).
- **Panel administrativo** (`/admin`) protegido por rol con CRUD de productos: listado paginado server-side, creación y edición con upload multipart (imagen principal + galería de hasta 3) y validación espejo de las reglas del backend.
- **Chatbot Sharkbot** (Gemini 1.5 Flash) como FAB flotante en todo el sitio salvo `/login` y `/admin`.
- **Diseño responsive** mobile-first con breakpoint único en 768px y padding lateral escalado por viewport (40px → 400px).
- **Code splitting** de la ruta `/admin` con `React.lazy` + `Suspense`.

## Stack tecnológico

| Capa | Herramienta | Versión |
|---|---|---|
| Framework | React | 19.2 |
| Routing | React Router DOM | 7.14 |
| Estilos | Tailwind CSS (`@tailwindcss/vite`) | 4.2 |
| Iconos | Lucide React | 1.8 |
| Build tool | Vite | 8.0 |
| Estado global | Context API + `useReducer` + `localStorage` | — |
| Fetch | `apiFetch` propio sobre `fetch` con `credentials: 'include'` | — |

Sin TypeScript, sin Redux/Zustand, sin axios, sin react-hook-form. Toda la red pasa por `src/api/client.js`.

## Cómo correr el proyecto

### Pre-requisitos

- Node.js 18 o superior
- npm 9 o superior
- Backend corriendo en `http://localhost:8080` (ver `ecommerce-api/sharkware/`) para que funcionen auth, admin y checkout.

### Instalación

```bash
git clone https://github.com/Mondati/Sharkware-Gaming.git
cd Sharkware-Gaming
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:5173`.

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con Hot Module Replacement |
| `npm run build` | Build optimizado para producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Análisis estático con ESLint |

### Credenciales de prueba

- **Admin:** el backend siembra un usuario admin al arrancar. Las credenciales se comparten por canal privado al equipo del proyecto.
- **Usuario normal:** registrarse desde el tab "Registrarse" en `/login` (el endpoint hardcodea `role="user"`).

> [!IMPORTANT]
> Las variables sensibles (tokens de MercadoPago, API keys de Gemini/Cloudinary, credenciales de MySQL y mail) viven en el `.env` del backend, que está en `.gitignore`. Nunca se versionan ni se publican aquí.

## Estructura del proyecto

```
src/
├── api/             client.js (apiFetch), auth.js, products.js
├── components/      Navbar, ProductCard, FilterPanel, MobileSidebar,
│                    Pagination, ProtectedRoute, ChatbotPanel, Toast, Footer…
├── context/         CartContext.jsx, AuthContext.jsx
├── hooks/           useWindowWidth.js
├── pages/
│   ├── Home.jsx, ProductDetail.jsx, SearchResults.jsx,
│   ├── Cart.jsx, Login.jsx,
│   ├── checkout/    Checkout, CheckoutConfirmMercadoPago (+ legacy crypto)
│   └── admin/       AdminPanel (lazy), ProductModal, AdminBottomNav
├── data/            sortOptions.js, products.js (seed temporal), categories.js
└── App.jsx, main.jsx, index.css
```

`AuthProvider` envuelve a `CartProvider` en `main.jsx` para que el carrito pueda leer el usuario al hacer merge.

## Historias de usuario

| HU | Descripción | Estado |
|---|---|---|
| HU1–HU7 | Catálogo, detalle, navegación, búsqueda, filtros, sort, paginación | ✅ |
| HU8–HU12 | Carrito: agregar, ver, modificar, eliminar, vaciar | ✅ |
| HU13–HU15 | Simular compra, integrar MercadoPago, confirmar | ⏳ Sprint 4 |
| HU16 | Registro de usuario (auto-login) | ✅ |
| HU17 | Login con `HttpSession` | ✅ |
| HU18 | Logout | ✅ |
| HU19 | Validación de datos + restauración de sesión | ✅ |
| HU20 | Editar producto desde admin (con galería selectiva) | ✅ |
| HU21 | Eliminar producto desde admin | ⏳ Sprint 5 |
| HU22 | Validación de formulario de producto (espejo del back) | ✅ |
| HU23 | Listado paginado de productos en admin | ✅ |
| HU24 | Crear producto desde admin (multipart) | ✅ |
| HU25 | Persistir productos, usuarios y pedidos en BD | ✅ back / ⏳ migración front (Sprint 2) |
| HU26 | FAQ automáticas vía Gemini | ⏳ Sprint 5 |
| HU27 | Ofertas de productos | ⏳ Sprint 5 |
| HU28 | Conversor BTC/ETH/USDT ↔ ARS | ⏳ Sprint 5 |
| HU29 | Adaptación mobile, tablet y desktop | ✅ |
| HU30 | Disponibilidad de stock | ⏳ Sprint 1 |
| HU31 | Gestión de stock desde admin | ⏳ Sprint 4 |
| HU32 | Descuento automático de stock al confirmar pago | ⏳ Sprint 4 |

## Decisiones de diseño

- **Mobile-first responsive** con un único breakpoint Tailwind (`md:` 768px). Cada bloque tiene dos versiones completas en lugar de ocultar elementos individuales.
- **Padding lateral dinámico** vía `useWindowWidth` — escala de 40px en tablet a 400px en 4K.
- **Estilos inline con paleta hardcodeada**: Tailwind solo para layout y responsive; los colores van en `style={{}}` para consistencia visual estricta.
- **Tipografía dual**: `Poppins` para todo el UI y `Rajdhani` exclusivamente para headings y títulos del hero.
- **Focus accesible global** en `src/index.css` (`:focus-visible { outline: 2px solid #24A8F5 }`) — nunca escribir `outline: 'none'` inline.
- **`CartContext` como única fuente de verdad** del carrito anónimo; al loguearse se mergea con el del usuario vía `POST /api/cart/merge`.
- **URL como estado**: filtros, búsqueda, ordenamiento y paginación viven en `useSearchParams`.
- **Code splitting selectivo** de `/admin` con `React.lazy` + `Suspense`.
- **Carrito oculto para admins** — el botón del Navbar desaparece cuando `user?.role === 'admin'`.

## API y autenticación

`src/api/client.js` expone `apiFetch(path, { method, body })`:

- Auto-añade `credentials: 'include'` para que el navegador envíe la cookie `JSESSIONID`.
- Detecta `FormData` y omite `Content-Type` para multipart.
- Devuelve `null` en `204 No Content`.
- En errores ≥ 400 lanza un `Error` con `status`, `code` y `fields` (este último permite mapear errores de validación campo por campo en los formularios).

Wrappers actuales:

- `src/api/auth.js` → `login`, `register`, `logout`, `me`.
- `src/api/products.js` → `getProducts`, `getProduct`, `getFacets`, `getCategories`, `listAdminProducts`, `createProduct`, `updateProduct`.

Base URL: `http://localhost:8080` por defecto (configurable vía `VITE_API_URL`).

## Métodos de pago

| Método | Estado |
|---|---|
| MercadoPago Checkout Pro (sandbox) | Integración real — preferencia + `back_urls` + `sync-payment` por `external_reference`. **Sin webhook.** |
| Cripto (BTC/ETH/USDT) | **No es método de pago** — Sprint 5 entregará un widget conversor ARS ↔ cripto alimentado por CoinGecko. |

> [!WARNING]
> Las pantallas legacy `CheckoutCrypto.jsx` y `CheckoutConfirmCrypto.jsx` quedan en el repo pero se eliminan en Sprint 4 junto con sus rutas.

## Roadmap

- [x] **Sprint 1** — Frontend estático con datos mock (HU1–HU12, HU29).
- [x] **Sprint 3** — Auth real (HU16–HU19) y panel admin con CRUD de productos (HU20, HU22, HU23, HU24).
- [ ] **Sprint 2** — Migración de Home/ProductDetail/SearchResults/FilterPanel a los endpoints `/api/products` y `/api/categories` (cierre UX de HU25).
- [ ] **Sprint 4** — Checkout MercadoPago end-to-end, decremento de stock transaccional (HU13–HU15, HU30–HU32).
- [ ] **Sprint 5** — HU21 (delete admin), chatbot Gemini (HU26), ofertas (HU27), conversor cripto (HU28).

## Contexto académico

Proyecto desarrollado como trabajo final integrador, aplicando el ciclo completo de análisis (historias de usuario), diseño (mockups, paleta de marca, accesibilidad por teclado) e implementación full-stack (frontend React + backend Spring Boot/MySQL).
