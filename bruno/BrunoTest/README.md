# Coleccion Bruno - GameWolf

Esta coleccion sirve para probar los endpoints principales de la API de GameWolf.

## Ambiente

Usar el ambiente:

```text
Produccion VPS
```

La variable principal es:

```text
base_url = https://gamewolf.shop/api
```

## Orden recomendado

Para que las variables se llenen solas, correr primero:

1. `01. Iniciar sesion - administrador`
2. `05. Iniciar sesion - cliente`
3. `10. Videojuegos con filtro y paginacion`
4. `11. Listar generos`

Despues ya se pueden correr los endpoints de CRUD, carrito, pedidos, usuarios y reportes.

## Variables que se generan automaticamente

- `token_admin`
- `token_cliente`
- `videojuego_id`
- `genero_id`
- `genero_creado_id`
- `videojuego_creado_id`
- `usuario_creado_id`
- `articulo_carrito_id`
- `pedido_id`

## Modulos cubiertos

- Autenticacion
- Recuperacion de contrasena
- Perfil protegido
- Videojuegos
- Generos
- Carrito de compras
- Pedidos
- Usuarios
- Reportes
- Casos de error 401, 403, 404 y 422

Nota: algunas pruebas crean registros temporales para demostrar POST, PUT y DELETE. Por eso se recomienda correrlas en el ambiente de pruebas o con datos de demostracion.
