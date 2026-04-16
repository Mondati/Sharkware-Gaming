# Sharkware Gaming — Ecommerce Frontend (Prototipo Estático)

## 📋 Resumen del Proyecto

Prototipo frontend estático de un ecommerce de gaming hardware. **Sin backend aún** — todos los datos están hardcodeados. Funcionalidades como carrito persistente, autenticación real, procesamiento de pagos y gestión de productos se implementarán en futuras iteraciones.

### Tech Stack Actual
- **Framework:** React 19 (JSX, sin TypeScript)
- **Bundler:** Vite 8
- **Estilos:** Tailwind CSS v4 (vía `@tailwindcss/vite` plugin) + inline `style={{}}`
- **Routing:** react-router-dom v7
- **Iconos:** lucide-react
- **Estado local:** `useState` en cada componente (sin Context/Redux/Zustand)

### Paleta de Colores
| Uso | Hex |
|-----|-----|
| Fondos oscuros | `#060810`, `#070B16`, `#0A0C14`, `#0E1424` |
| Cards | `#1E2232` |
| Bordes | `#1B2333` |
| Texto principal | `#F5F7FA` |
| Texto secundario | `#AAB3C5`, `#8890A4` |
| Acento azul | `#24A8F5`, `#00C8FF`, `#37C3FF` |
| Acento naranja | `#FF8400` |
| Verde (éxito/stock) | `#22C55E` |
| Rojo (error/sin stock) | `#EF4444` |

### Estructura de Archivos
```
src/
├── App.jsx                          # RouterProvider wrapper
├── index.css                        # Tailwind import + global dark styles
├── main.jsx                         # Entry point
├── router/
│   └── index.jsx                    # 9 rutas + ProtectedRoute
├── components/
│   ├── Navbar.jsx                   # Responsive: mobile compact header + desktop full navbar
│   ├── Footer.jsx                   # Responsive: mobile compact + desktop full
│   ├── ProductCard.jsx              # Con prop `mobile` para versión compacta
│   ├── MobileSidebar.jsx            # Sidebar hamburguesa con categorías y links
│   ├── AdminBottomNav.jsx           # Bottom nav fija para admin mobile (5 ítems)
│   └── ProtectedRoute.jsx           # Check simple de localStorage sw_role
└── pages/
    ├── Home.jsx                     # Hero, categorías, productos (responsive)
    ├── ProductDetail.jsx            # Galería, info, tabs, relacionados (responsive)
    ├── Cart.jsx                     # Items + resumen (responsive)
    ├── Login.jsx                    # Full-screen mobile / split-panel desktop
    ├── Checkout.jsx                 # Selección método de pago (responsive)
    ├── CheckoutConfirmMercadoPago.jsx # Confirmación MP (responsive)
    ├── CheckoutCrypto.jsx           # Selección cripto (responsive)
    ├── CheckoutConfirmCrypto.jsx    # QR + dirección BTC + countdown (responsive)
    └── AdminPanel.jsx               # Dashboard + CRUD productos (responsive)
```

### Auth Hardcodeado (Temporal)
- `admin@sharkware.com` / `admin123` → `localStorage.sw_role = 'admin'` → redirige a `/admin`
- Cualquier otra credencial → `localStorage.sw_role = 'user'` → redirige a `/`

### Patrón Responsive
- Breakpoint principal: `md:` (768px)
- Mobile: `md:hidden`
- Desktop: `hidden md:flex` o `hidden md:block`
- Mobile sidebar se abre desde el Navbar hamburguesa y **bloquea el scroll** del body con `useEffect`

### Rutas
| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | Home.jsx | Público |
| `/product/:id` | ProductDetail.jsx | Público |
| `/cart` | Cart.jsx | Público |
| `/login` | Login.jsx | Público |
| `/checkout` | Checkout.jsx | Público |
| `/checkout/confirm/mercadopago` | CheckoutConfirmMercadoPago.jsx | Público |
| `/checkout/crypto` | CheckoutCrypto.jsx | Público |
| `/checkout/confirm/crypto` | CheckoutConfirmCrypto.jsx | Público |
| `/admin` | AdminPanel.jsx | Protegido (sw_role=admin) |

---

## 🚧 Próxima Fase: Backend con Spring Boot

### Tech Stack Propuesto
- **Lenguaje:** Java 17+
- **Framework:** Spring Boot 3.x
- **ORM:** Hibernate / Spring Data JPA
- **Build:** Maven
- **Base de datos:** MySQL 8.x
- **Seguridad:** Spring Security + JWT

### Modelo de Base de Datos (10 Tablas)

#### 1. `users`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `email` | VARCHAR(255) UNIQUE | Login |
| `password_hash` | VARCHAR(255) | BCrypt |
| `role` | ENUM('USER','ADMIN') | |
| `first_name` | VARCHAR(100) | |
| `last_name` | VARCHAR(100) | |
| `phone` | VARCHAR(20) | Contacto/envíos |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

#### 2. `categories`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `name` | VARCHAR(100) | "Laptops", "Monitores" |
| `slug` | VARCHAR(100) UNIQUE | URL-friendly |
| `parent_id` | BIGINT FK → categories | NULL = raíz (soporta multinivel) |
| `icon_color` | VARCHAR(20) | HEX para frontend |
| `bg_color` | VARCHAR(20) | HEX para frontend |
| `sort_order` | INT | Orden de visualización |

#### 3. `products`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `name` | VARCHAR(255) | |
| `slug` | VARCHAR(255) UNIQUE | URL-friendly |
| `brand` | VARCHAR(100) | "MSI", "NVIDIA" |
| `description` | TEXT | |
| `specs` | JSON | Specs flexibles por categoría |
| `price_ars` | DECIMAL(12,2) | Precio en pesos argentinos |
| `stock` | INT | |
| `category_id` | BIGINT FK → categories | |
| `badge` | ENUM('HOT','NUEVO','OFERTA',NULL) | Cartelito |
| `image_url` | VARCHAR(500) | Imagen principal |
| `gallery` | JSON | Array de URLs (galería) |
| `active` | BOOLEAN DEFAULT true | Soft delete |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

#### 4. `cart_items`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `user_id` | BIGINT FK → users | NULL = carrito anónimo (session) |
| `product_id` | BIGINT FK → products | |
| `quantity` | INT | |
| `created_at` | TIMESTAMP | |

#### 5. `orders`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `user_id` | BIGINT FK → users | |
| `total_ars` | DECIMAL(12,2) | |
| `payment_method` | ENUM('MERCADOPAGO','BTC','USDT','ETH') | |
| `payment_status` | ENUM('PENDING','PAID','FAILED','REFUNDED') | |
| `order_status` | ENUM('CREATED','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') | |
| `payment_reference` | VARCHAR(255) | preference_id de MercadoPago |
| `shipping_address` | JSON | Calle, ciudad, CP, etc. |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

#### 6. `order_items`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `order_id` | BIGINT FK → orders | |
| `product_id` | BIGINT FK → products | |
| `quantity` | INT | |
| `unit_price` | DECIMAL(12,2) | Precio al momento de la compra |

#### 7. `chatbot_conversations` (IA Chatbot)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `user_id` | BIGINT FK → users | NULL = anónimo |
| `session_id` | VARCHAR(100) | Identifica sesión |
| `created_at` | TIMESTAMP | |

#### 8. `chatbot_messages`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `conversation_id` | BIGINT FK → chatbot_conversations | |
| `role` | ENUM('USER','ASSISTANT') | |
| `message` | TEXT | |
| `created_at` | TIMESTAMP | |

#### 9. `email_logs` (Automatización emails)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `user_id` | BIGINT FK → users | |
| `order_id` | BIGINT FK → orders | NULLABLE |
| `email_type` | ENUM('ORDER_CONFIRMED','SHIPPED','WELCOME') | |
| `status` | ENUM('PENDING','SENT','FAILED') | |
| `sent_at` | TIMESTAMP | |

#### 10. `price_cache` (Conversión cripto)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | BIGINT PK AUTO | |
| `currency` | ENUM('BTC','USDT','ETH') | |
| `price_ars` | DECIMAL(12,2) | Valor cacheado |
| `fetched_at` | TIMESTAMP | Última actualización |

### Endpoints REST Necesarios

#### Autenticación
- `POST /api/auth/register` → crea usuario con rol USER
- `POST /api/auth/login` → retorna JWT + datos usuario
- `GET /api/auth/me` → retorna datos del usuario logueado

#### Productos y Categorías
- `GET /api/categories` → lista completa (árbol multinivel)
- `GET /api/products` → lista con paginación, filtros (categoría, búsqueda), ordenamiento
- `GET /api/products/{id}` → detalle de un producto con galería + relacionados
- `POST /api/admin/products` → crear producto (ADMIN)
- `PUT /api/admin/products/{id}` → editar producto (ADMIN)
- `DELETE /api/admin/products/{id}` → eliminar producto (ADMIN)

#### Carrito
- `GET /api/cart` → items del carrito del usuario
- `POST /api/cart` → agregar item
- `PUT /api/cart/{itemId}` → actualizar cantidad
- `DELETE /api/cart/{itemId}` → eliminar item

#### Pedidos
- `POST /api/orders` → crear pedido + integración MercadoPago
- `GET /api/orders` → listar pedidos del usuario
- `GET /api/orders/{id}` → detalle de un pedido
- `GET /api/admin/orders` → listar todos los pedidos (ADMIN)

#### Chatbot IA
- `POST /api/chatbot/message` → enviar mensaje a IA, guardar conversación, retornar respuesta

#### Email Automático
- Servicio interno que dispara emails en: order confirmed, shipped, welcome

#### Conversión Cripto
- Servicio interno que consulta API externa (CoinGecko/Binance) y cachea en `price_cache`

#### Usuarios (ADMIN)
- `GET /api/admin/users` → listar usuarios
- `PUT /api/admin/users/{id}/role` → cambiar rol

### Plan de Implementación (6 Fases)

#### Fase 1: Proyecto Spring Boot
1. Scaffold del proyecto — Spring Initializr con: Spring Boot 3.x, Web, Security, JPA, MySQL, Validation, Lombok
2. Configuración — `application.yml` con datasource MySQL, JPA/Hibernate props, puerto 8080
3. Modelos/Entidades — Las 10 tablas definidas arriba
4. Repositories — Spring Data JPA para cada entidad con consultas personalizadas (búsqueda, filtros, paginación)

#### Fase 2: Autenticación
5. Spring Security + JWT — Config de seguridad, filtros JWT, password BCrypt
6. Auth endpoints — register, login, me

#### Fase 3: Productos y Categorías
7. GET /api/categories — lista completa (árbol multinivel)
8. GET /api/products — paginación + búsqueda + filtro por categoría + ordenamiento
9. GET /api/products/{id} — detalle con galería + relacionados
10. CRUD Admin — POST/PUT/DELETE /api/admin/products (requiere rol ADMIN)

#### Fase 4: Carrito y Pedidos
11. Carrito — GET/POST/PUT/DELETE /api/cart (persistente por usuario)
12. Pedidos — POST /api/orders (crear pedido), GET /api/orders (historial), GET /api/orders/{id} (detalle)
13. Integración MercadoPago — SDK para crear preference, webhook de pago

#### Fase 5: IA y Extras
14. Chatbot IA — Endpoint para enviar mensaje a API de IA y obtener respuesta, guardar conversación
15. Email automático — Servicio de email (JavaMail) para confirmación de pedido, envío, bienvenida
16. Conversión cripto — Servicio que consulta API externa (CoinGecko/Binance) y cachea en price_cache

#### Fase 6: Conexión Frontend
17. `src/api/` — Fetch wrappers para todos los endpoints
18. Context API — Carrito persistente global + Auth context (JWT)
19. Reemplazar datos hardcodeados por llamadas a la API
20. Loading states, errores, validaciones con react-hook-form

### Cambios Requeridos en el Frontend
1. **Crear `src/api/`** con fetch wrappers para cada endpoint
2. **Reemplazar datos hardcodeados** por llamadas a la API
3. **Implementar carrito persistente** (Context API)
4. **Auth real con JWT** (guardar token en localStorage)
5. **ProtectedRoute real** → verificar JWT + rol antes de renderizar
6. **Manejo de loading states** y errores en cada página
7. **Formularios con validación** (react-hook-form o similar)

---

## 📝 Decisiones de Arquitectura Tomadas

1. **Sin estado global** — Cada página maneja su propio `useState`. El carrito NO se sincroniza entre páginas en este prototipo.
2. **Inline styles** — La mayoría del styling usa `style={{}}` con hex hardcodeados. Tailwind se usa solo para responsive utilities (`md:hidden`, `grid-cols-2`, `flex`, etc.).
3. **Sin archivos de datos** — Todo está hardcodeado como arrays JS dentro de los componentes. No hay directorio `src/data/`.
4. **ProductCard con prop `mobile`** — El mismo componente renderiza versión desktop o mobile según esta prop.
5. **Admin bottom nav** — Solo visible en mobile. Reemplaza el sidebar lateral del desktop.

---

## ✅ Completado
- Mobile responsive completo (15 subtasks):
  - MobileSidebar con scroll lock
  - Navbar responsive
  - Home, ProductDetail, Cart, Login (mobile)
  - 4 páginas de Checkout (mobile)
  - Admin: bottom nav, header, stats 2x2, product cards, modal full-screen
- Cambio de colores: precios a blanco, badges "MÁS VENDIDO"/"OFERTA" a rojo

---

## ⏳ Pendiente para Próxima Sesión
- [ ] Fase 1: Backend Spring Boot + MySQL + Hibernate (scaffold + entidades + repos)
- [ ] Fase 2: Spring Security + JWT auth
- [ ] Fase 3: API REST de productos/categorías
- [ ] Fase 4: API REST de carrito/pedidos + MercadoPago
- [ ] Fase 5: Chatbot IA + email automático + conversión cripto
- [ ] Fase 6: Conectar frontend a la API (Context API, fetch wrappers, loading states)
