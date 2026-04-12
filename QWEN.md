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

### Endpoints REST Necesarios

#### Autenticación
- `POST /api/auth/login` → retorna JWT + rol
- `POST /api/auth/register` → crea usuario con rol USER
- `GET /api/auth/me` → retorna datos del usuario logueado

#### Productos
- `GET /api/products` → lista con paginación y filtros (categoría, búsqueda)
- `GET /api/products/{id}` → detalle de un producto
- `GET /api/categories` → lista de categorías
- `POST /api/admin/products` → crear producto (ADMIN)
- `PUT /api/admin/products/{id}` → editar producto (ADMIN)
- `DELETE /api/admin/products/{id}` → eliminar producto (ADMIN)

#### Carrito (opcional: persistir en DB)
- `GET /api/cart` → items del carrito del usuario
- `POST /api/cart` → agregar item
- `PUT /api/cart/{itemId}` → actualizar cantidad
- `DELETE /api/cart/{itemId}` → eliminar item

#### Pedidos
- `POST /api/orders` → crear pedido
- `GET /api/orders` → listar pedidos del usuario
- `GET /api/orders/{id}` → detalle de un pedido
- `GET /api/admin/orders` → listar todos los pedidos (ADMIN)

#### Usuarios (ADMIN)
- `GET /api/admin/users` → listar usuarios
- `PUT /api/admin/users/{id}/role` → cambiar rol

### Modelo de Base de Datos (Tablas)
```
users (id, email, password_hash, role, name, created_at)
products (id, name, brand, description, specs, price_usd, stock, category, image_url, active, created_at, updated_at)
categories (id, name, icon_color, bg_color)
cart_items (id, user_id, product_id, quantity)
orders (id, user_id, total, payment_method, payment_status, order_status, created_at)
order_items (id, order_id, product_id, quantity, unit_price)
```

### Cambios Requeridos en el Frontend
1. **Crear `src/api/`** con fetch wrappers para cada endpoint
2. **Reemplazar datos hardcodeados** por llamadas a la API
3. **Implementar carrito persistente** (Context API o Zustand)
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

## ✅ Completado en Sesión Anterior
- Mobile responsive completo (15 subtasks):
  - MobileSidebar con scroll lock
  - Navbar responsive
  - Home, ProductDetail, Cart, Login (mobile)
  - 4 páginas de Checkout (mobile)
  - Admin: bottom nav, header, stats 2x2, product cards, modal full-screen

---

## ⏳ Pendente para Próxima Sesión
- [ ] Backend Spring Boot + MySQL + Hibernate
- [ ] Spring Security + JWT auth
- [ ] API REST de productos/categorías
- [ ] API REST de auth (login/register)
- [ ] Conectar frontend a la API
- [ ] Implementar carrito persistente (Context/Zustand)
- [ ] Form validations y loading states
- [ ] Lógica de pedidos y confirmación de pago real
