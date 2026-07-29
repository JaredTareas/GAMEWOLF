# Seguimiento de entrega — GameWolf

> Última revisión: 29 de julio de 2026.  
> Estados: ✅ **Hecho** · 🟡 **Parcial** · ⬜ **Pendiente** · ⚪ **Excepción autorizada / no aplicable**.

Este archivo se actualiza al terminar una tarea. Cuando se complete una fila parcial o pendiente, cambia su estado, escribe una breve evidencia y registra la fecha de revisión.

## Resumen por prioridad

| Prioridad | Bloque | Estado | Siguiente resultado verificable |
| --- | --- | --- | --- |
| Alta | Acciones y responsividad del frontend | 🟡 | Completar estados de carga por acción y la prueba visual en móvil/tablet. |
| Alta | API y pruebas Bruno | ✅ | API revisada; colección Bruno ejecutada en producción con autenticación, autorización y errores. |
| Alta | README y despliegue | 🟡 | Documentar dominio HTTPS, API productiva, Figma y procedimiento VPS. |
| Media | Evidencia final y responsividad | 🟡 | Revisar GitHub Projects, commits de ambos y probar visualmente en móvil/tablet. |

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
| Roles | CRUD total del administrador | 🟡 | Usuarios, videojuegos y pedidos tienen gestión administrativa. Géneros/categorías existen como relación N:M, pero todavía no tienen API y pantalla propias de CRUD. | Definir si serán un módulo independiente; si lo son, implementar su CRUD o documentar que se administran desde el catálogo de videojuegos. |
| Seguridad | Variables sensibles, hash y contraseñas | ✅ | `.env` no está versionado, `backend/.env.example` contiene placeholders, Laravel guarda hashes y las reglas frontend/backend están alineadas. | Verificar que jamás se suban valores reales al hacer el push final. |
| Backend | API REST, Sanctum, login, registro, logout y recuperación | ✅ | `routes/api.php` define los endpoints; Sanctum entrega/revoca token y existen los flujos de registro y recuperación/restablecimiento. | Ensayar el flujo completo en VPS antes de la demo. |
| Backend | Recuperación de contraseña por correo | ✅ | Solicita un enlace de uso único con vigencia de 60 minutos; el formulario se abre con correo y token precargados, restablece el hash y revoca tokens previos. | Configurar `FRONTEND_URL=https://gamewolf.shop` en el `.env` del VPS y ensayar con un correo real. |
| Backend | Form Requests para las validaciones | ✅ | Todas las entradas que crean o modifican datos usan Form Requests; no hay validaciones inline en controladores. | Mantener esta regla en cambios futuros. |
| Backend | Errores JSON con HTTP correcto | ✅ | `bootstrap/app.php` fuerza JSON en `/api/*`; validación, autenticación, autorización y binding cubren 422, 401, 403 y 404. Bruno los comprobó en producción; errores no controlados devuelven JSON 500. | Conservar la colección Bruno y sus capturas. |
| Backend | Relaciones Eloquent y API Resources | ✅ | Relaciones `belongsTo`, `hasMany`, `hasOne` y N:M definidas; endpoints de entidades responden con Resources. | — |
| Pruebas | Pruebas automatizadas backend | 🟡 | Pruebas de seeders, correo, perfil y foto; suite local correcta. | Agregar cobertura de autorización/pedidos y errores críticos. |
| Frontend | Consumo de API mediante Fetch | ✅ | Cliente `fetch` centralizado en `services/api.js`. | — |
| Frontend | Rutas protegidas según rol | ✅ | React Router redirige vistas no autorizadas y el menú se construye por rol; backend mantiene la protección real de endpoints. | Confirmar el fallback SPA de Nginx en VPS. |
| Frontend | Loading states visibles | 🟡 | Carga inicial, login y formularios principales muestran espera. | Agregar espera y deshabilitar controles al agregar/editar/quitar carrito y al cambiar estado de pedido. |
| Frontend | Manejo de errores de red | ✅ | `apiRequest` traduce errores de API/red y los paneles muestran un mensaje. | Verificación final manual en móvil y VPS. |
| Frontend | Validaciones bajo cada input | ✅ | Login/registro/recuperación, usuarios, videojuegos y perfil validan bajo el campo y en tiempo real; imágenes validan tipo y tamaño también en Form Requests. | — |
| Frontend | Diseño responsivo mobile/desktop | 🟡 | Estilos responsivos existentes. | Probar manualmente en móvil/tablet y corregir desbordamientos. |
| Frontend | Paginación server-side y filtros API en todos los listados | ✅ | Videojuegos, catálogo cliente, pedidos, usuarios y clientes envían `page`, `per_page`, `search`, `estado` o `rol` a la API y muestran sus metadatos. | — |
| Frontend | Navbar, perfil, avatar y cerrar sesión | ✅ | Barra interna con usuario, avatar/imagen, perfil y logout. | — |
| Frontend | Confirmación para acciones destructivas o importantes | ✅ | Modales para eliminar usuarios/videojuegos, quitar artículo del carrito, confirmar compra y actualizar estado con WhatsApp; no usa `alert()`/`confirm()` nativos. | — |
| Comunicación | Correo real al registrar usuario | ⚪ | Se envía correo de bienvenida por Gmail SMTP y queda bitácora en `registros_notificacion`; el docente autorizó esta alternativa a Postfix/SPF/DKIM. | Conservar autorización docente y evidencia del correo recibido para la demo. |
| Comunicación | WhatsApp por acción real del sistema | ✅ | El cambio de estado de pedido ejecuta Twilio desde el backend y registra el resultado; la prueba Sandbox llegó al teléfono unido. | En demo, usar un número unido al Sandbox o configurar remitente productivo. |
| Comunicación | SMS | ⚪ | Docente autorizó cubrir comunicación con correo + WhatsApp, sin SMS. | Guardar la autorización del docente como evidencia. |
| Diseño | Figma navegable, paleta y logo | 🟡 | Figma existe y el logo está integrado. | Agregar enlace de Figma, justificación de paleta y navegación al README. |
| GitHub | Repositorio público e historial de ambos | ✅ | Repositorio público confirmado el 29/07; historial con commits descriptivos de JaredTareas y Leonardo Fuentes López. | Mantener la distribución real de contribuciones hasta la entrega. |
| GitHub | README completo | 🟡 | Incluye descripción, instalación, credenciales, ER, repositorio y Projects. | Añadir lista explícita de tecnologías, URL web `https://gamewolf.shop/`, API `https://gamewolf.shop/api` y enlace de Figma. |
| GitHub Projects | Tablero público con actividad real | 🟡 | El enlace al Project está en README. | Verificar sin iniciar sesión que su visibilidad sea **Public**, y que contenga Backlog, To Do, In Progress, In Review y Done con actividad real. |
| Bruno | Colección versionada: login, token y error | ✅ | Colección en `bruno/BrunoTest`: login admin/cliente, token protegido, 401, 403, 404, 422, paginación y filtro. Ejecutada el 29/07 en Producción VPS: 10/10 requests y 11/11 pruebas correctas. | Conservar capturas si se solicitan. |
| VPS | Backend, frontend, MySQL y HTTPS | ✅ | `https://gamewolf.shop/` respondió 200 por HTTPS desde Nginx el 29/07; Bruno confirmó endpoints de la API productiva. | Prueba funcional completa en producción antes de entregar. |
| VPS | Nginx, Certbot, URL web y URL API documentadas | 🟡 | Dominio HTTPS funciona. | Documentar en README URL web, URL base API, Nginx/Certbot y pasos de despliegue. |
| Entrega final | Datos de integrantes, URLs y documentación en README/Classroom | 🟡 | Parte de la documentación existe. | Completar README y preparar el texto exacto para Classroom. |

## Próximo orden de trabajo

1. Agregar estados de carga por acción en carrito y al cambiar estado de pedido.
2. Decidir y resolver el CRUD de géneros/categorías para garantizar el CRUD total del administrador.
3. Completar README con tecnologías, URL web/API productivas y Figma; guardar evidencia de las excepciones de Gmail y SMS.
4. Probar en VPS con los tres roles, además de móvil/tablet, y ensayar la demo con correo y WhatsApp.
5. Confirmar que GitHub Projects sea público, tenga las cinco columnas requeridas y conserve actividad real de ambos integrantes.

## Matriz de rúbrica (100 puntos)

> Esta es una estimación técnica basada en la evidencia del repositorio y la prueba en VPS; el puntaje final lo decide el docente. Los estados 🟡 no significan que el módulo no funcione, sino que aún falta cerrar una evidencia o requisito específico de la rúbrica.

| Criterio | Puntos | Estado | Evidencia / riesgo para el puntaje completo |
| --- | :---: | :---: | --- |
| Base de datos | 10 | ✅ | MySQL, migraciones, seeders, ER y `gamewolf.sql` actualizados. |
| Backend Laravel | 15 | ✅ | API REST, Sanctum, middleware de rol, Form Requests, Eloquent y Resources implementados. |
| Frontend React | 15 | 🟡 | Rutas, fetch, filtros/paginación server-side, navbar, validaciones y modales están listos. Falta loading por acción y prueba responsive real. |
| Usuarios y roles | 10 | 🟡 | Tres roles, middleware y rutas React están correctos. En README conviene nombrar explícitamente la cuenta admin como **usuario developer/de evaluación** para evitar ambigüedad de la rúbrica. |
| Comunicación | 10 | ⚪ | WhatsApp funciona. Correo Gmail y ausencia de SMS son excepciones autorizadas por docente; conservar esa autorización y evidencias de entrega para sostener el puntaje. |
| Diseño en Figma | 10 | 🟡 | Figma existe y el logo está integrado. Falta enlace público, prototipo navegable y justificación de paleta en README. |
| GitHub | 12 | 🟡 | Repositorio público y commits de ambos confirmados. Falta README completo con tecnologías, URLs productivas y Figma. |
| GitHub Projects | 12 | 🟡 | Existe enlace. Verificar visibilidad pública, columnas Backlog/To Do/In Progress/In Review/Done y actividad histórica real. |
| Bruno | 6 | ✅ | Colección versionada y ejecutada en VPS: login/token, protegida y errores 401/403/404/422. |

### Penalizaciones verificadas

| Penalización | Estado actual |
| --- | --- |
| Un solo integrante con commits | ✅ Evitada: hay historial de JaredTareas y Leonardo Fuentes López. |
| Validaciones solo en frontend | ✅ Evitada: las operaciones de escritura usan Form Requests. |
| Paginación/filtros solo en cliente | ✅ Evitada: se envían parámetros a la API y Laravel pagina. |
| Contraseñas planas o `.env` versionado | ✅ Evitada: Laravel almacena hashes y `.env` está ignorado. |
