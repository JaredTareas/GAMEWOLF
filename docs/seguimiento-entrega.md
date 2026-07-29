# Seguimiento de entrega — GameWolf

> Última revisión: 29 de julio de 2026.  
> Estados: ✅ **Hecho** · 🟡 **Parcial** · ⬜ **Pendiente** · ⚪ **Excepción autorizada / no aplicable**.

Este archivo se actualiza al terminar una tarea. Cuando se complete una fila parcial o pendiente, cambia su estado, escribe una breve evidencia y registra la fecha de revisión.

## Resumen por prioridad

| Prioridad | Bloque | Estado | Siguiente resultado verificable |
| --- | --- | --- | --- |
| Alta | API y pruebas | 🟡 | Completar auditoría de respuestas, Resources y colección Bruno. |
| Alta | Frontend | 🟡 | Rutas por rol, paginación y filtros server-side en todos los listados. |
| Alta | README y despliegue | 🟡 | Documentar dominio HTTPS, API productiva, Figma y procedimiento VPS. |
| Media | Evidencia final | 🟡 | Revisar GitHub Projects, commits de ambos y pruebas en producción. |

## Lista de requisitos

| Área | Requisito | Estado | Evidencia actual | Pendiente para cerrarlo |
| --- | --- | :---: | --- | --- |
| Base de datos | MySQL, al menos 5 tablas relacionadas y una relación N:M | ✅ | MySQL 8 / InnoDB; tablas de negocio y pivote `genero_videojuego`. | — |
| Base de datos | Migraciones Laravel | ✅ | `migrate:fresh --seed` ejecutado correctamente el 29/07. | — |
| Base de datos | Seeders con 10–15 registros por tabla principal | ✅ | 12 usuarios, géneros, videojuegos, carritos, pedidos y notificaciones; 24 detalles y relaciones N:M. | — |
| Base de datos | Respaldo `.sql` compatible | ✅ | `gamewolf.sql` regenerado con MySQL 8.0.46, sin MariaDB. | Exportarlo de nuevo antes de la entrega si cambian datos importantes. |
| Base de datos | Diagrama ER en README | ✅ | Imagen y diagrama relacional documentados en README. | — |
| Roles | Tres niveles y usuarios demo | ✅ | Roles `admin`, `empleado`, `cliente`; seeders y credenciales de prueba. | — |
| Roles | Middleware y autorización backend | ✅ | Rutas con `auth:sanctum` y middleware `rol`; actualización de perfil autorizada por Form Request. | — |
| Roles | Componentes/rutas protegidas en React | ✅ | Rutas con React Router para cada vista; redirección a la ruta inicial autorizada cuando el rol no tiene acceso. | Al desplegar, confirmar que Nginx redirige rutas SPA a `index.html`. |
| Seguridad | Contraseña segura, hash y `.env` | ✅ | Reglas frontend/backend, hash de Laravel, `.env` ignorado y `.env.example`. | Verificar que jamás se suban valores reales al hacer el push final. |
| Backend | API REST, Sanctum, login, registro, logout y recuperación | ✅ | Rutas API y controladores implementados. | Probar flujo completo en el VPS antes de la demo. |
| Backend | Form Requests para las validaciones | ✅ | Incluye `ActualizarFotoPerfilRequest` y `ActualizarUsuarioRequest`; no quedan validaciones inline en controladores. | Mantener esta regla en cambios futuros. |
| Backend | Errores JSON con HTTP correcto | 🟡 | Validaciones y autorización devuelven 422/403; autenticación usa API JSON. | Recorrer endpoints y documentar/probar 401, 403, 404 y 500 controlado. |
| Backend | Relaciones Eloquent y API Resources | ✅ | Modelos relacionados y Resources usados en API. | — |
| Pruebas | Pruebas automatizadas backend | 🟡 | Pruebas de seeders, correo, perfil y foto; suite local correcta. | Agregar cobertura de autorización/pedidos y errores críticos. |
| Frontend | Consumo de API mediante Fetch | ✅ | Cliente `fetch` centralizado en `services/api.js`. | — |
| Frontend | Loading states visibles | 🟡 | Carga inicial y formularios principales muestran estados de espera. | Agregar estado por acción en carrito y al cambiar estado de pedido. |
| Frontend | Manejo de errores de red | ✅ | `apiRequest` traduce errores de API/red y los paneles muestran un mensaje. | Verificación final manual en móvil y VPS. |
| Frontend | Validaciones bajo cada input | 🟡 | Login/registro, videojuegos y perfil validan bajo el campo y en tiempo real. | Completar validación visible de teléfono y contraseña al editar usuarios, y de archivos de videojuego. |
| Frontend | Diseño responsivo mobile/desktop | 🟡 | Estilos responsivos existentes. | Probar manualmente en móvil/tablet y corregir desbordamientos. |
| Frontend | Paginación server-side y filtros API en todos los listados | ✅ | Videojuegos, catálogo cliente, pedidos, usuarios y clientes envían `page`, `per_page`, `search`, `estado` o `rol` a la API y muestran sus metadatos. | — |
| Frontend | Navbar, perfil, avatar y cerrar sesión | ✅ | Barra interna con usuario, avatar/imagen, perfil y logout. | — |
| Frontend | Confirmación para acciones destructivas o importantes | 🟡 | Modales para eliminar videojuegos y usuarios; no usa `alert()`/`confirm()` nativos. | Pedir confirmación antes de crear un pedido y antes de cambiar estado de pedido (dispara WhatsApp). |
| Comunicación | Correo real al registrar usuario | ✅ | Gmail SMTP autorizado por docente; correo de bienvenida y registro de notificación implementados. | Conservar captura/correo recibido como evidencia de demo. |
| Comunicación | WhatsApp por acción real del sistema | ✅ | Cambio de estado de pedido dispara WhatsApp vía Twilio; prueba Sandbox realizada. | En demo, usar un número unido al Sandbox o configurar remitente productivo. |
| Comunicación | SMS | ⚪ | Docente autorizó cubrir comunicación con correo + WhatsApp, sin SMS. | Guardar la autorización del docente como evidencia. |
| Diseño | Figma navegable, paleta y logo | 🟡 | Figma existe y el logo está integrado. | Agregar enlace de Figma, justificación de paleta y navegación al README. |
| GitHub | Repositorio, README y commits de ambos | 🟡 | Repositorio y historial de ambos integrantes existentes. | Completar enlaces de Figma/VPS/API y revisar visibilidad pública. |
| GitHub Projects | Tablero público con actividad real | 🟡 | Enlace al proyecto incluido. | Verificar columnas Backlog/In Progress/Done e historial de tareas de ambos. |
| Bruno | Colección versionada: login, token y error | ✅ | Colección en `bruno/BrunoTest`: login admin/cliente, token protegido, 401, 403, 404, 422, paginación y filtro. Ejecutada el 29/07 en Producción VPS: 10/10 requests y 11/11 pruebas correctas. | Conservar capturas si se solicitan. |
| VPS | Backend, frontend, MySQL y HTTPS | ✅ | Proyecto accesible en `https://gamewolf.shop/` con HTTPS. | Prueba funcional completa en producción antes de entregar. |
| VPS | Nginx, Certbot, URL web y URL API documentadas | 🟡 | Dominio HTTPS funciona. | Documentar en README URL web, URL base API, Nginx/Certbot y pasos de despliegue. |
| Entrega final | Datos de integrantes, URLs y documentación en README/Classroom | 🟡 | Parte de la documentación existe. | Completar README y preparar el texto exacto para Classroom. |

## Próximo orden de trabajo

1. Completar auditoría API: respuestas JSON, Resources, autorización y casos de error en Bruno.
2. Terminar paginación/filtros y protección de vistas por rol en React.
3. Documentar producción, Figma y enlaces finales en README.
4. Probar en VPS con los tres roles y ensayar la demo con correo y WhatsApp.
5. Revisar GitHub Projects, visibilidad del repositorio y commits de ambos integrantes.
