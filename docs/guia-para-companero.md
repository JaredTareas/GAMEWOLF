# Guia de continuidad para GameWolf

Este documento resume lo que ya existe en el proyecto GameWolf, como correrlo en local, que archivos son importantes y que falta por hacer segun la rubrica de la tarea.

## 1. Resumen del proyecto

**Nombre:** GameWolf  
**Tipo:** sistema web full stack para gestion y venta de videojuegos.  
**Tecnologias actuales:**

- Frontend: React + Vite.
- Backend: Laravel.
- Base de datos: MySQL con XAMPP.
- Autenticacion: Laravel Sanctum.
- Estilos: CSS propio basado en el Figma de GameWolf.

La idea del sistema es que:

- Administrador y empleado gestionen videojuegos, clientes y pedidos.
- Cliente consulte catalogo, agregue videojuegos al carrito y confirme compras.
- El sistema permita seguimiento del estado de pedidos.
- Mas adelante se agreguen notificaciones por correo, SMS y WhatsApp.

## 2. Ubicacion del proyecto

La carpeta principal es:

```text
C:\Users\jared\Documents\Codex\2026-07-24\antes-de-hacer\work\GAMEWOLF
```

Estructura principal:

```text
GAMEWOLF/
  backend/       API REST con Laravel
  frontend/      Aplicacion React con Vite
  bruno/         Carpeta reservada para pruebas Bruno
  docs/          Documentacion del proyecto
  assets/img/    Imagenes originales del logo y fondos
  README.md      Guia principal del proyecto
```

## 3. Como correr el proyecto en local

Primero prender XAMPP y activar MySQL.

### Backend

Abrir una terminal:

```powershell
cd C:\Users\jared\Documents\Codex\2026-07-24\antes-de-hacer\work\GAMEWOLF\backend
php artisan serve
```

La API queda en:

```text
http://127.0.0.1:8000/api
```

Prueba rapida en navegador:

```text
http://127.0.0.1:8000/api/videojuegos
```

### Frontend

Abrir otra terminal:

```powershell
cd C:\Users\jared\Documents\Codex\2026-07-24\antes-de-hacer\work\GAMEWOLF\frontend
npm.cmd run dev
```

Normalmente Vite abre en:

```text
http://localhost:5173
```

Nota: se usa `npm.cmd` porque PowerShell puede bloquear `npm.ps1`.

## 4. Base de datos

Base creada en MySQL:

```text
gamewolf
```

Comando usado para crearla:

```sql
CREATE DATABASE gamewolf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Archivo de configuracion local:

```text
backend/.env
```

Configuracion esperada:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gamewolf
DB_USERNAME=root
DB_PASSWORD=
```

Para correr migraciones y seeders:

```powershell
cd backend
php artisan migrate --seed
```

Tablas principales actuales:

- `users`
- `videojuegos`
- `generos`
- `genero_videojuego`
- `carritos`
- `articulos_carrito`
- `pedidos`
- `detalles_pedido`
- `registros_notificacion`
- `personal_access_tokens`

La relacion muchos a muchos esta entre:

```text
videojuegos <-> generos
```

mediante:

```text
genero_videojuego
```

## 5. Usuarios de prueba

Todos usan la misma contrasena:

```text
GameWolf#2026
```

Usuarios:

```text
admin@gamewolf.test       rol: admin
empleado@gamewolf.test    rol: empleado
cliente@gamewolf.test     rol: cliente
```

## 6. Que ya funciona

### Backend

Ya existe API REST en:

```text
backend/routes/api.php
```

Rutas importantes:

```text
POST   /api/autenticacion/registro
POST   /api/autenticacion/iniciar-sesion
GET    /api/autenticacion/perfil
POST   /api/autenticacion/cerrar-sesion

GET    /api/videojuegos
POST   /api/videojuegos
GET    /api/videojuegos/{videojuego}
PUT    /api/videojuegos/{videojuego}
DELETE /api/videojuegos/{videojuego}

GET    /api/carrito
POST   /api/carrito/articulos
PUT    /api/carrito/articulos/{articuloCarrito}
DELETE /api/carrito/articulos/{articuloCarrito}

GET    /api/pedidos
POST   /api/pedidos
GET    /api/pedidos/{pedido}
PATCH  /api/pedidos/{pedido}/estado

GET    /api/usuarios
GET    /api/usuarios/{usuario}
```

Ya esta implementado:

- Login con Laravel Sanctum.
- Registro de cliente.
- Logout.
- Middleware por rol.
- Form Requests para validaciones.
- API Resources para respuestas JSON.
- Modelos y relaciones Eloquent.
- Seeders con usuarios y videojuegos.
- CRUD de videojuegos.
- Carrito.
- Crear pedido desde carrito.
- Cambiar estado de pedido.
- Validacion para no eliminar videojuegos que ya estan en pedidos.

### Frontend

Archivo principal:

```text
frontend/src/App.jsx
```

Estilos principales:

```text
frontend/src/App.css
```

Ya funciona:

- Login real contra la API.
- Guardado de token en `localStorage`.
- Menu segun rol.
- Sidebar con diseno inspirado en Figma.
- Catalogo real desde MySQL.
- Imagenes externas para videojuegos.
- Tabla de videojuegos con imagen, genero, plataforma, precio, stock y estado.
- Modal para agregar videojuego.
- Modal para editar videojuego.
- Eliminar videojuego si no esta relacionado con pedidos.
- Mensaje si no se puede eliminar por estar en pedidos.
- Carrito del cliente.
- Agregar videojuegos al carrito.
- Sumar cantidad si se agrega el mismo videojuego.
- Editar cantidad con `+` y `-`.
- Quitar producto del carrito.
- Confirmar compra.
- Ver pedidos.
- Cambiar estado de pedidos como admin o empleado.
- Mensajes tipo notificacion dentro de la app, sin usar `alert()`.

## 7. Archivos importantes del backend

Modelos:

```text
backend/app/Models/User.php
backend/app/Models/Videojuego.php
backend/app/Models/Genero.php
backend/app/Models/Carrito.php
backend/app/Models/ArticuloCarrito.php
backend/app/Models/Pedido.php
backend/app/Models/DetallePedido.php
backend/app/Models/RegistroNotificacion.php
```

Controladores:

```text
backend/app/Http/Controllers/Api/AutenticacionController.php
backend/app/Http/Controllers/Api/VideojuegoController.php
backend/app/Http/Controllers/Api/CarritoController.php
backend/app/Http/Controllers/Api/PedidoController.php
backend/app/Http/Controllers/Api/UsuarioController.php
```

Requests:

```text
backend/app/Http/Requests/Auth/IniciarSesionRequest.php
backend/app/Http/Requests/Auth/RegistrarUsuarioRequest.php
backend/app/Http/Requests/GuardarVideojuegoRequest.php
backend/app/Http/Requests/ActualizarVideojuegoRequest.php
backend/app/Http/Requests/GuardarArticuloCarritoRequest.php
backend/app/Http/Requests/CrearPedidoRequest.php
backend/app/Http/Requests/ActualizarEstadoPedidoRequest.php
```

Resources:

```text
backend/app/Http/Resources/UsuarioResource.php
backend/app/Http/Resources/VideojuegoResource.php
backend/app/Http/Resources/CarritoResource.php
backend/app/Http/Resources/PedidoResource.php
backend/app/Http/Resources/DetallePedidoResource.php
```

Middleware:

```text
backend/app/Http/Middleware/RolMiddleware.php
```

Rutas:

```text
backend/routes/api.php
```

Seeders:

```text
backend/database/seeders/DatabaseSeeder.php
```

## 8. Archivos importantes del frontend

```text
frontend/src/App.jsx
frontend/src/App.css
frontend/src/main.jsx
frontend/index.html
frontend/package.json
frontend/public/img/logo-gamewolf.png
frontend/public/img/fondo-sidebar.png
frontend/public/img/fondo-login.png
```

La API base esta definida en `App.jsx`:

```js
const API_URL = 'http://127.0.0.1:8000/api'
```

Cuando se despliegue, esto se debe cambiar a la URL real de la API del VPS.

## 9. Flujo actual del sistema

### Cliente

1. Inicia sesion con `cliente@gamewolf.test`.
2. Entra al catalogo.
3. Agrega videojuegos al carrito.
4. Entra a carrito.
5. Modifica cantidades o quita productos.
6. Confirma compra.
7. Consulta sus pedidos.

### Administrador

1. Inicia sesion con `admin@gamewolf.test`.
2. Ve dashboard.
3. Gestiona videojuegos:
   - agregar
   - editar
   - eliminar si no tiene pedidos
4. Consulta pedidos.
5. Cambia estado de pedido.
6. Consulta usuarios/clientes.

### Empleado

1. Inicia sesion con `empleado@gamewolf.test`.
2. Consulta videojuegos.
3. Agrega/edita videojuegos.
4. Consulta pedidos.
5. Cambia estado de pedido.
6. Consulta clientes.
7. No tiene menu de usuarios, reportes ni configuracion completa.

## 10. Cosas que faltan

Faltantes importantes por rubrica:

- Recuperacion de contrasena con Sanctum/Laravel.
- Validaciones frontend mas completas bajo cada input.
- Paginacion real visible en frontend usando metadata de Laravel.
- Filtros de busqueda enviados al backend.
- Confirmacion con modal antes de eliminar videojuegos.
- CRUD de usuarios completo para admin.
- Perfil editable para cliente.
- Reportes reales con datos calculados.
- Tabla/gestion de notificaciones.
- Envio real de correo con Postfix en VPS.
- Envio real de SMS con Twilio o equivalente.
- Envio real de WhatsApp con Twilio o WhatsApp Cloud API.
- Coleccion Bruno.
- Diagrama ER en README.
- Script `.sql` de respaldo.
- README final completo.
- Subir a GitHub.
- Tablero GitHub Projects publico y actualizado.
- Commits de ambos integrantes.
- Figma navegable final y link en README.
- Deploy en VPS con Nginx, HTTPS y Certbot.

## 11. Tareas recomendadas para el companero

Para que el historial de commits refleje trabajo real de ambos, el companero puede tomar estas tareas:

1. **Bruno**
   - Crear coleccion en `bruno/`.
   - Agregar request de login.
   - Guardar token.
   - Probar endpoint protegido.
   - Agregar caso de error 403 o 422.

2. **README**
   - Completar descripcion del proyecto.
   - Agregar tecnologias.
   - Agregar instrucciones de instalacion.
   - Agregar credenciales demo.
   - Agregar endpoints principales.
   - Agregar links de GitHub Project y Figma.

3. **Diagrama ER**
   - Crear diagrama con tablas actuales.
   - Documentar relaciones:
     - users 1:N pedidos
     - pedidos 1:N detalles_pedido
     - videojuegos 1:N detalles_pedido
     - users 1:N carritos
     - carritos 1:N articulos_carrito
     - videojuegos N:M generos

4. **Filtros y paginacion**
   - En frontend, usar `meta` y `links` que devuelve Laravel.
   - Agregar busqueda en videojuegos.
   - Enviar filtro a `/api/videojuegos?search=...`.

5. **Perfil de cliente**
   - Hacer formulario para editar datos del cliente.
   - Crear endpoint si hace falta.
   - Validar campos en frontend y backend.

6. **Confirmaciones con modal**
   - Antes de eliminar videojuego, mostrar modal.
   - No usar `confirm()` nativo.

7. **Notificaciones**
   - Revisar `RegistroNotificacion`.
   - Preparar estructura para Twilio/correo.
   - Dejar variables en `.env.example`.

## 12. Pendientes delicados

### No subir `.env`

El archivo:

```text
backend/.env
```

no debe subirse a GitHub.

Solo debe subirse:

```text
backend/.env.example
```

### Commits de ambos

La rubrica penaliza si solo un integrante tiene commits. Cada integrante debe hacer commits propios con mensajes claros.

Ejemplos:

```text
feat: agregar coleccion Bruno para autenticacion
docs: completar README con instalacion local
feat: agregar filtros de videojuegos
feat: crear perfil editable del cliente
```

### No presentar como proyecto terminado

Ya hay una base funcional, pero todavia faltan cosas importantes de entrega final, sobre todo:

- VPS.
- HTTPS.
- Bruno.
- notificaciones reales.
- README final.
- Figma navegable.

## 13. Estado aproximado

Avance estimado actual:

```text
Base del proyecto: 80%
Base de datos: 65%
Backend/API: 55%
Frontend visual: 50%
Roles/login: 65%
Carrito/pedidos: 55%
CRUD videojuegos: 65%
Documentacion: 20%
Figma: 35%
Deploy: 0%
Notificaciones: 0%
Bruno: 0%
GitHub/Projects: 15%
```

Avance general aproximado:

```text
40% - 45%
```

## 14. Pruebas rapidas

### Probar API de videojuegos

Abrir:

```text
http://127.0.0.1:8000/api/videojuegos
```

### Probar login con PowerShell

```powershell
$respuesta = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/autenticacion/iniciar-sesion" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"admin@gamewolf.test","password":"GameWolf#2026"}'

$respuesta | ConvertTo-Json -Depth 5
```

### Probar backend

```powershell
cd backend
php artisan test
```

## 15. Recomendacion de siguiente avance

Lo mas conveniente para seguir es:

1. Completar README.
2. Crear Bruno collection.
3. Agregar filtros y paginacion en frontend.
4. Hacer perfil editable.
5. Preparar diagrama ER.

Con eso el proyecto empieza a cubrir partes muy importantes de la rubrica sin esperar hasta el final.
