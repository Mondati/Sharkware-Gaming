# Sharkware Gaming — Contexto del Proyecto para Claude

## Resumen

Ecommerce de gaming hardware (Argentina). Prototipo frontend estático — sin backend aún. Todos los datos están en `src/data/`. El objetivo final es conectar este frontend a un backend Spring Boot + MySQL.

**Producto:** Tienda online de componentes y periféricos gaming (notebooks, GPUs, monitores, RAM, etc.)
**Mercado:** Argentina (precios en ARS, métodos de pago: MercadoPago, cripto BTC/ETH/USDT)

---

## Tech Stack

| Herramienta | Versión |
|---|---|
| React | 19.2.0 |
| React DOM | 19.2.0 |
| React Router DOM | 7.14.0 |
| Tailwind CSS | 4.2.2 (vía `@tailwindcss/vite`) |
| Lucide React | 1.8.0 |
| Vite | 8.0.4 |

Sin TypeScript. Sin Context API / Redux / Zustand. Sin axios. Sin react-hook-form.

---

## Paleta de Colores

Todos los colores están hardcodeados como inline `style={{}}`. Nunca usar valores distintos a estos.

| Uso | Hex |
|---|---|
| Fondo principal | `#0A0C14` |
| Fondo secundario | `#070B16` |
| Fondo cards/inputs | `#0E1424` |
| Fondo navbar | `#060810` |
| Fondo hero | `#0A0F1C`, `#0D1A40`, `#071530` |
| Cards / elementos | `#1E2232`, `#121420` |
| Bordes | `#1B2333` |
| Texto principal | `#F5F7FA` |
| Texto secundario | `#AAB3C5`, `#8890A4` |
| Acento azul | `#24A8F5`, `#00C8FF`, `#1A9FFF` |
| Verde (éxito/stock) | `#22C55E` |
| Rojo (error/badge) | `#EF4444` |
| Naranja/Amarillo | `#F59E0B`, `#FF8400` |

---

## Estructura de Archivos (Estado Actual)

```
ecommerce/
├── public/
│   └── images/
│       └── products/          # VACÍA — imágenes a agregar manualmente (.gitkeep)
├── src/
│   ├── App.jsx                # RouterProvider wrapper
│   ├── main.jsx               # Entry point
│   ├── index.css              # Tailwind import + global dark styles
│   ├── data/                  # ← NUEVO (HU1)
│   │   ├── categories.js      # 8 categorías, icon como string key
│   │   └── products.js        # 13 productos + helpers newProducts/notebooksList/monitorsList
│   ├── router/
│   │   └── index.jsx          # 9 rutas + ProtectedRoute
│   ├── components/
│   │   ├── Navbar.jsx         # Responsive: mobile compact + desktop full, prop cartCount
│   │   ├── Footer.jsx         # Responsive: mobile compact + desktop full
│   │   ├── ProductCard.jsx    # prop mobile para versión compacta, link a /product/:id
│   │   ├── MobileSidebar.jsx  # Sidebar hamburguesa, bloquea body scroll
│   │   ├── AdminBottomNav.jsx # Bottom nav fija admin mobile (5 ítems)
│   │   └── ProtectedRoute.jsx # Lee localStorage sw_role
│   └── pages/
│       ├── Home.jsx           # Hero + CategoryBar + 3 secciones de productos
│       ├── ProductDetail.jsx  # Galería + info + tabs + relacionados (useParams ✅)
│       ├── Cart.jsx           # Items hardcodeados + resumen + link a /checkout
│       ├── Login.jsx          # Auth mock via localStorage
│       ├── Checkout.jsx       # Selección método de pago
│       ├── CheckoutConfirmMercadoPago.jsx
│       ├── CheckoutCrypto.jsx # Selección cripto (BTC/ETH/USDT)
│       ├── CheckoutConfirmCrypto.jsx # QR + dirección + countdown
│       └── AdminPanel.jsx     # Dashboard + CRUD productos (852 líneas)
├── CLAUDE.md                  # Este archivo
├── QWEN.md                    # Doc original con plan completo de backend
├── package.json
└── vite.config.js
```

---

## Estructura de Datos (src/data/)

### categories.js
```js
{ id, label, icon }
// icon es string (e.g. 'Laptop') — se resuelve en Home.jsx con ICON_MAP
// ids: 'all', 'notebooks', 'cpu', 'gpu', 'ram', 'monitors', 'storage', 'peripherals'
```

### products.js
```js
{
  id,           // number — PK
  brand,        // string — "NVIDIA", "ASUS"
  name,         // string — nombre del producto
  slug,         // string — URL-friendly
  spec,         // string — resumen de specs para tarjeta
  description,  // string — texto largo (todos los productos tienen descripción)
  price_ars,    // number — precio numérico (para DB: DECIMAL 12,2)
  price,        // string — "$X.XXX.XXX" (para UI, se elimina al conectar backend)
  badge,        // null | 'NUEVO' | 'HOT' | 'OFERTA'
  stock,        // number
  category_id,  // string — FK a categories.id
  image_url,    // string — "/images/products/slug.jpg"
  gallery,      // string[] — array de URLs (id:13 tiene 4 entries, resto vacío)
  specs,        // object — TODOS los productos tienen specs, campos varían por categoría:
                //   notebooks: { cpu, gpu, ram, storage, display, os, battery, connectivity, weight }
                //   gpu: { chipset, vram, interface, tdp, outputs, resolution }
                //   monitors: { panel, resolution, refreshRate, responseTime, hdr, sync }
  active,       // boolean
}
```

**Helpers exportados:** `newProducts` (ids 1-4), `notebooksList` (ids 5-8), `monitorsList` (ids 9-12)

---

## Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Home.jsx | Público |
| `/product/:id` | ProductDetail.jsx | Público |
| `/cart` | Cart.jsx | Público |
| `/login` | Login.jsx | Público |
| `/checkout` | Checkout.jsx | Público |
| `/checkout/confirm/mercadopago` | CheckoutConfirmMercadoPago.jsx | Público |
| `/checkout/crypto` | CheckoutCrypto.jsx | Público |
| `/checkout/confirm/crypto` | CheckoutConfirmCrypto.jsx | Público |
| `/admin` | AdminPanel.jsx | Protegido (sw_role = 'admin') |

---

## Auth Hardcodeada (Temporal)

- `admin@sharkware.com` / `admin123` → `localStorage.sw_role = 'admin'` → `/admin`
- Cualquier otra credencial → `localStorage.sw_role = 'user'` → `/`

---

## Patrón Responsive

- Breakpoint único: `md:` (768px — Tailwind default)
- Mobile: `className="flex md:hidden"`
- Desktop: `className="hidden md:flex"` o `"hidden md:block"`
- Siempre hay dos versiones completas del bloque, no se ocultan elementos individuales

---

## Convenciones de Código

- **Styling:** 95% inline `style={{}}` con hex hardcodeados. Tailwind solo para layout y responsive utilities.
- **Sin comentarios de qué hace** — solo de por qué (restraint intencional).
- **Estado local:** `useState` en cada componente. Sin lifting de estado global todavía.
- **Nombres de archivos:** PascalCase para componentes/páginas, camelCase para data.
- **Sin PropTypes ni TypeScript.**
- **Lucide icons** siempre importados por nombre: `import { Cpu, Monitor } from 'lucide-react'`
- **ICON_MAP en Home.jsx:** resuelve el `icon` string de `categories.js` al componente real.

---

## Layout Desktop — Convenciones de Padding

Todos los contenedores de contenido desktop usan `padding lateral de 400px` para centrar el contenido (mismo criterio que compragamer.com):

| Componente | Padding |
|---|---|
| Navbar desktop | `padding: '0 400px'` |
| Footer desktop | `padding: '48px 400px 40px'` |
| Home — Hero, secciones de productos | `padding: '0 400px'` / `'40px 400px'` / `'0 400px 40px'` |
| ProductDetail — secciones de contenido | `padding: '40px 400px 48px'` |
| ProductDetail — breadcrumb | `padding: '12px 80px'` ← **excepción**, barra full-width |
| Home — Category bar | `padding: '14px 400px'` ← **excepción**, barra full-width |

---

## Grids de Productos Desktop — Scroll Horizontal

Las 4 secciones de productos en Home.jsx (categoría filtrada, Nuevos, Notebooks, Monitores) usan scroll horizontal con máximo 5 cards visibles:

```jsx
<div className="flex sw-scroll" style={{ gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
  {products.map((p) => (
    <div key={p.id} style={{ flex: '1 0 calc(20% - 13px)', minWidth: 'calc(20% - 13px)' }}>
      <ProductCard {...p} imgHeight={210} />
    </div>
  ))}
</div>
```

- Con ≤5 cards: crecen con `flex-grow: 1` para llenar el ancho
- Con >5 cards: overflow horizontal con scroll estilizado
- Mobile: no aplica, sigue usando `grid grid-cols-2`

---

## Clase `.sw-scroll` (src/index.css)

Scrollbar estilizada para grids de productos. Track `#0A0C14`, thumb `#1E2232` (hover `#24A8F5`), 5px alto, radius 3px. Usar en contenedores con `overflowX: 'auto'` en desktop.

---

## ⏳ Pendiente — Responsive Padding con `useWindowWidth`

El padding lateral actual está hardcodeado a `400px` en todos los componentes desktop. Esto aplasta el contenido en pantallas de 1024px–1440px (ej: 1366px → solo 566px de contenido).

**Solución acordada:** hook `useWindowWidth` en `src/hooks/useWindowWidth.js` que devuelve el padding correcto según viewport. Los componentes lo llaman y lo usan en sus inline styles.

**Escala de padding:**
| Breakpoint | Viewport | Padding lateral | Cards visibles |
|---|---|---|---|
| md | 768px–1023px | 40px | 3 |
| lg | 1024px–1279px | 80px | 4 |
| xl | 1280px–1535px | 160px | 4–5 |
| 2xl | 1536px+ | 400px | 5 |

**Archivos a modificar:** `src/hooks/useWindowWidth.js` (nuevo), `Navbar.jsx`, `Footer.jsx`, `Home.jsx`, `ProductDetail.jsx`.

**Nota:** Los grids también deben ajustar `calc(20% - 13px)` según cards visibles por breakpoint.

---

## Historias de Usuario — Estado

| HU | Descripción | Estado |
|---|---|---|
| HU1 | Ver catálogo de productos | ✅ Completa |
| HU2 | Ver detalle de producto | ✅ Completa |
| HU3 | Navegación multinivel por categorías | ⏳ Pendiente |
| HU4 | Buscar productos por nombre | ⏳ Pendiente |
| HU5 | Filtrar por categoría y/o precio | ⏳ Pendiente |
| HU6 | Ordenar por precio o relevancia | ⏳ Pendiente |
| HU7 | Paginación de resultados | ⏳ Pendiente |
| HU8 | Agregar al carrito | ⏳ Pendiente — requiere Context API |
| HU9 | Ver carrito | ⏳ Pendiente — depende de HU8 |
| HU10 | Modificar carrito (qty + eliminar) | ⏳ Pendiente — depende de HU8 |

### Detalle HU1 ✅
- Catálogo visible con 3 secciones (Nuevos, Notebooks, Monitores)
- Category bar filtra productos por `category_id` en tiempo real
- Notebook filters filtran por tipo de CPU (`spec.includes('i7')`, etc.)
- `ProductCard` con placeholder elegante (brand + nombre) hasta cargar imágenes reales
- Cuando se agreguen JPGs a `public/images/products/`, aparecen automáticamente

### Detalle HU2 ✅
- `useParams` lee el ID de la URL → busca en `products[]`
- Pantalla "Producto no encontrado" + link a inicio si el ID no existe
- `displayGallery`: usa `product.gallery` si tiene ítems, sino `[image_url]`
- Thumbnails y dots generados dinámicamente desde `displayGallery`
- Click en thumbnail cambia imagen principal (`activeThumb`)
- `quickSpecs` y `detailSpecs` derivados de `product.specs` (todos los productos tienen specs)
- `quickSpecs` adapta los labels según categoría (cpu/gpu/ram para notebooks, chipset/vram para GPU, panel/resolución para monitores)
- Productos relacionados por `category_id`, excluyendo el actual, máximo 3

---

## Datos Hardcodeados Restantes (a resolver)

| Archivo | Qué está hardcodeado | Cuándo se resuelve |
|---|---|---|
| `Home.jsx` | Hero: "RTX 5090", "$2.499.999 ARS" | Al conectar backend (producto destacado) |
| `Cart.jsx` | `initialItems` con 3 productos fijos | HU8/HU9 |
| `Cart.jsx` | "12 cuotas sin interés de {total/12}" | Al conectar MP |
| `ProductDetail.jsx` | Rating "4.8", "(127 reseñas)" | Al conectar backend |
| `ProductDetail.jsx` | "12 cuotas sin interés de $ 241.666" | Al conectar MP |
| `AdminPanel.jsx` | `initialProducts` 5 items + categorías | Al conectar backend |
| `MobileSidebar.jsx` | Categorías propias (no leen de `data/categories.js`) | HU3 |
| `Checkout.jsx` | Totales "$4.698.996" hardcodeados | HU9 |
| `public/images/products/` | Carpeta vacía — JPGs a agregar manualmente | Cuando se tengan las imágenes |

---

## Decisiones de Arquitectura

1. **`price` como string + `price_ars` como número** — `price` es el string formateado que usan los componentes hoy; `price_ars` es el decimal que irá a la DB. Al conectar el backend se formateará `price_ars` en el componente y se elimina `price`.
2. **`image_url` como ruta local** — `/images/products/slug.jpg` servida por Vite desde `public/`. Cuando el backend esté listo, solo cambia el base URL (Spring Boot servirá las mismas imágenes desde `GET /api/images/{filename}`).
3. **`icon` en categories como string** — no se puede poner un componente React en un archivo de datos puro. Se resuelve con `ICON_MAP` en el componente que lo usa.
4. **`specs` en todos los productos** — cada categoría tiene sus propios campos. `quickSpecs` en ProductDetail usa `??` para mapear el campo correcto según categoría (ej: `cpu ?? chipset`, `gpu ?? panel`).
5. **`relatedProducts` por `category_id`** — se filtran automáticamente por misma categoría del producto actual, excluyendo el producto en vista. Máximo 3.
6. **Sin estado global aún** — el carrito se resetea al navegar. Se implementará con Context API en HU8.

---

## Próximos Pasos

### Frontend (HU3–HU10)
- **HU3:** Navegación multinivel — `MobileSidebar` debe leer de `data/categories.js`; breadcrumb en ProductDetail debe linkear a la categoría real
- **HU4–HU6:** Búsqueda, filtros y orden — sobre el catálogo del Home o nueva página `/products`
- **HU7:** Paginación — slice del array filtrado
- **HU8:** `CartContext` con `useContext` + `useReducer` — afecta Navbar (badge), ProductDetail (botón "Agregar"), Cart
- **HU9–HU10:** Cart page que lee del contexto en vez de `initialItems`

### Backend (ver QWEN.md para detalle completo)
- Fase 1: Spring Boot scaffold + 10 entidades + MySQL (`application.properties`)
- Fase 2: Spring Security + JWT
- Fase 3: API productos/categorías
- Fase 4: Carrito + Pedidos + MercadoPago
- Fase 5: Chatbot IA + emails + conversión cripto
- Fase 6: Conectar frontend (`src/api/`, Context API, reemplazar hardcodes)
