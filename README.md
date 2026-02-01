# Riwi Eats - Plantilla SPA Vanilla JS

Una plantilla de Aplicación de Página Única (SPA) moderna y ligera construida con **Vanilla JavaScript** y **Vite**. Este proyecto está diseñado como punto de partida para construir aplicaciones tipo e-commerce con autenticación basada en roles y un backend simulado.

## 🚀 Características

-   **⚡ Potenciado por Vite**: Servidor de desarrollo y herramienta de construcción extremadamente rápidos.
-   **🔐 Autenticación**: Inicio de sesión básico con email/contraseña y control de acceso basado en roles (Admin vs Usuario).
-   **🛒 Carrito de Compras**: Carrito totalmente funcional con persistencia (localStorage).
-   **📦 Gestión de Pedidos**:
    -   **Usuarios**: Crear pedidos y ver historial.
    -   **Admins**: Ver todos los pedidos y gestionar estados (Pendiente -> Preparando -> Listo -> Entregado).
-   **🎨 UI Moderna**: Diseño limpio inspirado en modo oscuro usando variables CSS para fácil personalización.
-   **📱 Responsivo**: Diseño amigable para móviles.
-   **💾 Backend Simulado**: Usa `json-server` para simular una API REST.

---

## 🛠️ Instalación y Configuración

### 1. Prerrequisitos
-   [Node.js](https://nodejs.org/) (recomendado v16+)
-   npm (viene con Node.js)

### 2. Clonar e Instalar
Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repositorio>
cd Plantilla
npm install
```

### 3. Iniciar el Backend (API Simulada)
Este proyecto usa `json-server` para simular una base de datos. Se incluye un script para ejecutarlo apuntando al archivo correcto (`src/db.json`).

```bash
npm run server
```

La API correrá en `http://localhost:3000`.

### 4. Iniciar el Frontend
En una terminal separada:

```bash
npm run dev
```

La aplicación correrá en `http://localhost:5173`.

---

## 📂 Estructura del Proyecto

```text
Plantilla/
├── src/
│   ├── pages/           # Lógica de vistas (Login, Dashboard, Menú, etc.)
│   ├── services/        # Lógica de negocio y llamadas API (Auth, Cart, Orders)
│   ├── templates/       # Fragmentos HTML (uso opcional)
│   ├── db.json          # Archivo de base de datos simulada (Usuarios, Productos, Pedidos)
│   ├── main.js          # Punto de entrada y lógica del Router
│   ├── style.css        # Estilos globales y Variables CSS
│   └── ...
├── index.html           # Punto de entrada HTML principal
├── package.json         # Dependencias y Scripts
└── vite.config.js       # Configuración de Vite
```

---

## 🎨 Guía de Personalización

### Cambiar Colores
Abre `src/style.css` y modifica las variables `:root`:

```css
:root {
  --primary: #FF4B2B;       /* Color principal de la marca */
  --bg-dark: #121212;       /* Color de fondo */
  --radius: 12px;           /* Radio de borde para tarjetas/botones */
  /* ... */
}
```

### Agregar Productos
Edita `src/db.json` y agrega ítems al array `products`:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Hamburguesa Nueva",
      "price": 12000,
      "category": "Comida Rápida",
      "image": "https://url-de-imagen.com/imagen.jpg"
    }
  ]
}
```

### Agregar Nueva Página
1.  Crea un nuevo archivo en `src/pages/miPagina.js`.
2.  Exporta una función de renderizado (ej: `export function renderMiPagina(container) { ... }`).
3.  Impórtala en `src/main.js`.
4.  Agrega una condición de ruta en la función `router()` en `src/main.js`.

---

## 🔑 Credenciales por Defecto

| Rol   | Email           | Contraseña |
| :--- | :-------------- | :------- |
| **Admin** | `admin@riwi.com` | `admin`  |
| **User**  | `user@riwi.com`  | `user`   |

---

## 📚 Endpoints de la API (JSON Server)

-   `GET /users` - Listar todos los usuarios
-   `GET /products` - Listar ítems del menú
-   `GET /orders` - Listar todos los pedidos
-   `POST /orders` - Crear un nuevo pedido

---

## Licencia
Este proyecto es de código abierto y está disponible para fines educativos.
