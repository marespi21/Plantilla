# Riwi Eats - Restaurant Management Template

Este proyecto es una plantilla funcional para una aplicación de gestión de restaurante utilizando **Vanilla JavaScript** y **LocalStorage** para la persistencia de datos.

## 🚀 Características

- **Roles de Usuario**:
  - **Admin**: Puede gestionar pedidos y cambiar estados.
  - **Usuario**: Puede ver el menú, agregar al carrito y ver sus pedidos.
- **Persistencia**: Los datos se guardan en el `localStorage` del navegador, simulando una base de datos.
- **Datos Iniciales**: Se cargan desde `src/db.json` si no existen datos previos.
- **Diseño Responsivo**: Interfaz moderna y adaptable a dispositivos móviles.

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```
2. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```
3. **Acceder a la aplicación**:
   Abre tu navegador en la URL que indica la terminal (usualmente `http://localhost:5173`).

## 🔑 Credenciales de Prueba

El sistema viene con usuarios pre-configurados (ver `src/db.json`):

| Rol   | Email          | Password |
|-------|----------------|----------|
| **Admin** | `admin@riwi.com` | `admin`  |
| **User**  | `user@riwi.com`  | `user`   |

## 📂 Estructura del Proyecto

```
src/
├── services/       # Lógica de negocio (Auth, Cart, Orders, Storage)
├── pages/          # Componentes de vista (Login, Dashboard, Profile)
├── db.json         # Datos iniciales (Seed)
├── main.js         # Router y punto de entrada
└── style.css       # Estilos globales
```

## 🎨 Personalización

### Agregar Productos
Edita el archivo `src/db.json` y agrega nuevos objetos al array `products`.
*Nota: Si ya ejecutaste la app, borra el LocalStorage o la key `products` para ver los cambios reflejados, ya que `db.json` solo se carga si no hay datos guardados.*

### Modificar Estilos
Todo el diseño se encuentra en `src/style.css`. Se utilizan variables CSS (`:root`) para facilitar el cambio de colores y temas.

## 📝 Reglas de Negocio Implementadas

1. **Estados del Pedido**: `pending` -> `preparando` -> `listo` -> `entregado`.
2. **Validación de Rutas**: Protege `/admin` y `/dashboard` según el rol del usuario logueado.
3. **Carrito**: Permite agregar múltiples items y calcula el total automáticamente.
