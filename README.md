# GameWolf

Sistema web para la gestion y venta de videojuegos.

## Estructura inicial

```text
GAMEWOLF/
  backend/   API REST con Laravel
  frontend/  Aplicacion React con Vite
  bruno/     Coleccion de pruebas de API
  docs/      Documentacion, diagramas y notas del proyecto
  assets/    Recursos visuales originales del proyecto
```

## Integrantes

- Garcia Garcia Luis Jared
- Fuentes Lopez Leonardo

## Enlaces

- Repositorio: https://github.com/JaredTareas/GAMEWOLF.git
- GitHub Projects: https://github.com/users/JaredTareas/projects/1/views/1

## Guia de continuidad

Para revisar que esta hecho, como correr el proyecto y que falta por desarrollar:

- [Guia para companero](docs/guia-para-companero.md)

## Primeros comandos locales

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
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
http://127.0.0.1:8000/api
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
- `GET /api/autenticacion/perfil`
- `POST /api/autenticacion/cerrar-sesion`
- `GET /api/videojuegos`
- `POST /api/videojuegos`
- `GET /api/carrito`
- `POST /api/carrito/articulos`
- `GET /api/pedidos`
- `POST /api/pedidos`
- `PATCH /api/pedidos/{pedido}/estado`
- `GET /api/usuarios`
