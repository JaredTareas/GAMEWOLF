# GameWolf

Sistema web para la gestion y venta de videojuegos.

## Integrantes

- LUIS JARED GARCIA GARCIA
- LEONARDO FUENTES LOPEZ

## Descripcion

GameWolf es un sistema web para la gestion y venta de videojuegos. El sistema permite administrar videojuegos, usuarios, carritos y pedidos, ademas de ofrecer a los clientes la posibilidad de consultar el catalogo, realizar compras y dar seguimiento a sus pedidos.

## Estructura del proyecto

```text
GAMEWOLF/
  backend/   API REST con Laravel
  frontend/  Aplicacion React con Vite
  bruno/     Coleccion de pruebas de API
  docs/      Documentacion, diagramas y notas del proyecto
  assets/    Recursos visuales originales del proyecto
```

## Diagrama Entidad-Relación (ER) Y Diagrama Relacional

Diagrama ER <img width="1536" height="1024" alt="relacion gamewolf" src="https://github.com/user-attachments/assets/6287c0c0-e1c4-4538-8924-74b18acdc7c2" />



Diagrama Relacional ![Diagrama Relacional de GameWolf](./docs/diagra-ER-Game.png)

## Enlaces

- Repositorio: https://github.com/JaredTareas/GAMEWOLF.git
- GitHub Projects: https://github.com/users/JaredTareas/projects/1/views/1

## Guia de continuidad

Para revisar que esta hecho, como correr el proyecto y que falta por desarrollar:

- [Guia para companero](docs/guia-para-companero.md)
- [PDF para companero](docs/GameWolf-guia-para-companero.pdf)

## Primeros comandos locales

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

En PowerShell, si aparece el error de scripts deshabilitados con `npm`, usa:

```bash
npm.cmd run dev
```

## API base

Local:

```text
[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
```

## Usuarios demo

Todos usan la contrasena:

```text
GameWolf#2026
```

- Administrador: `admin@gamewolf.test`
- Empleado: `empleado@gamewolf.test`
- Cliente: `cliente@gamewolf.test`

## Endpoints iniciales

- `POST /api/autenticacion/registro`
- `POST /api/autenticacion/iniciar-sesion`
- `POST /api/autenticacion/recuperar-contrasena`
- `POST /api/autenticacion/restablecer-contrasena`
- `GET /api/autenticacion/perfil`
- `POST /api/autenticacion/cerrar-sesion`
- `GET /api/videojuegos`
- `POST /api/videojuegos`
- `GET /api/videojuegos/{videojuego}`
- `PUT /api/videojuegos/{videojuego}`
- `DELETE /api/videojuegos/{videojuego}`
- `GET /api/carrito`
- `POST /api/carrito/articulos`
- `PUT /api/carrito/articulos/{articuloCarrito}`
- `DELETE /api/carrito/articulos/{articuloCarrito}`
- `GET /api/pedidos`
- `POST /api/pedidos`
- `GET /api/pedidos/{pedido}`
- `PATCH /api/pedidos/{pedido}/estado`
- `GET /api/usuarios`
- `GET /api/usuarios/{usuario}`

## Notificaciones por WhatsApp con Twilio

La notificación de WhatsApp se dispara automáticamente cuando un administrador o empleado cambia el estado de un pedido desde el módulo de pedidos. No se envía si se intenta guardar el mismo estado que ya tenía el pedido.

Flujo:

1. El cliente realiza un pedido.
2. El administrador o empleado actualiza el estado del pedido.
3. El endpoint `PATCH /api/pedidos/{pedido}/estado` guarda el nuevo estado.
4. El backend manda un mensaje de WhatsApp al teléfono del cliente usando Twilio.
5. Cada intento queda guardado en la tabla `registros_notificacion`, con su estado, destinatario y respuesta del proveedor (incluido el SID de Twilio cuando fue aceptado).

Variables necesarias en `backend/.env`:

```env
TWILIO_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

El telefono del cliente debe estar guardado en formato E.164, por ejemplo:

```text
+5215550001001
```

Para WhatsApp en cuenta de prueba, el destinatario debe haber unido su número al sandbox de Twilio. Si faltan credenciales, el teléfono no tiene formato válido o Twilio rechaza el envío, el cambio de estado no se revierte: el intento queda registrado como `pendiente_configuracion` o `fallido` para auditoría.
