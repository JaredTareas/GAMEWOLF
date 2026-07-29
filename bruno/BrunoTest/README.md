# Pruebas API con Bruno

Colección ejecutable de GameWolf para **Bruno** (formato OpenCollection YAML). Usa el entorno **Producción VPS** con la URL base:

```text
https://gamewolf.shop/api
```

## Cómo ejecutarla

1. Abre la carpeta `bruno/BrunoTest` en Bruno.
2. Selecciona el entorno **Producción VPS**.
3. Ejecuta la colección en orden, desde `01. Iniciar sesión - administrador`.
4. Bruno guarda los tokens de administrador y cliente durante la ejecución para las peticiones siguientes.

La colección no crea, modifica ni elimina videojuegos, usuarios ni pedidos de producción. La petición `GET /carrito` puede crear un carrito vacío si el cliente aún no tiene uno activo, porque ese es el comportamiento actual de la API.

## Última ejecución verificada

- Fecha: 29 de julio de 2026.
- Entorno: **Producción VPS** (`https://gamewolf.shop/api`).
- Resultado: **10/10 requests correctos y 11/11 pruebas correctas** mediante Bruno CLI.

## Cobertura incluida

| Escenario | Petición | Resultado esperado |
| --- | --- | --- |
| Login y token de administrador | `POST /autenticacion/iniciar-sesion` | `200`, token Sanctum y rol admin. |
| Token en ruta protegida | `GET /autenticacion/perfil` | `200` con token admin. |
| Pedidos protegidos/paginados | `GET /pedidos?per_page=2` | `200` y metadatos de paginación. |
| Error de validación | `POST /videojuegos` con datos incompletos | `422`. |
| Login y carrito de cliente | Login cliente + `GET /carrito` | `200`. |
| Acceso denegado por rol | Admin en `GET /carrito` | `403`. |
| Sin autenticación | `GET /autenticacion/perfil` sin token | `401`. |
| Recurso no encontrado | `GET /videojuegos/999999` | `404`. |
| Filtro y paginación | `GET /videojuegos?search=Elden&per_page=2` | `200` con paginación server-side. |

## Rutas reales del proyecto

La colección sigue `backend/routes/api.php`. Por eso no se incluyen `/categorias` ni `/clientes`: no son endpoints expuestos por la API actual.

- Los géneros se gestionan mediante `genero_ids` al crear o actualizar videojuegos.
- Los clientes son usuarios con rol `cliente`; se consultan mediante `GET /usuarios?rol=cliente` para los roles autorizados.
- Los artículos del carrito usan `/carrito/articulos/{articuloCarrito}`, no `/carrito/{id}`.

Las pruebas de creación, edición, borrado de videojuegos y cambios de estado de pedido se hacen manualmente durante la demo, porque modifican datos y el último caso puede disparar una notificación de WhatsApp.
