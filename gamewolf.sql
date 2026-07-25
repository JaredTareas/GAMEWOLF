-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-07-2026 a las 06:15:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gamewolf`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulos_carrito`
--

CREATE TABLE `articulos_carrito` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `carrito_id` bigint(20) UNSIGNED NOT NULL,
  `videojuego_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `articulos_carrito`
--

INSERT INTO `articulos_carrito` (`id`, `carrito_id`, `videojuego_id`, `cantidad`, `precio_unitario`, `subtotal`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 1, 899.00, 899.00, '2026-07-25 08:34:33', '2026-07-25 08:34:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`id`, `usuario_id`, `estado`, `created_at`, `updated_at`) VALUES
(1, 3, 'convertido', '2026-07-25 07:57:33', '2026-07-25 08:34:37'),
(2, 3, 'activo', '2026-07-25 08:34:41', '2026-07-25 08:34:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `videojuego_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO `detalles_pedido` (`id`, `pedido_id`, `videojuego_id`, `cantidad`, `precio_unitario`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 899.00, 899.00, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(2, 1, 2, 1, 1199.00, 1199.00, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(3, 1, 3, 1, 699.00, 699.00, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(4, 2, 1, 1, 899.00, 899.00, '2026-07-25 08:34:37', '2026-07-25 08:34:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`id`, `nombre`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Accion', 'accion', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(2, 'Aventura', 'aventura', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(3, 'RPG', 'rpg', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(4, 'Deportes', 'deportes', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(5, 'Carreras', 'carreras', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(6, 'Terror', 'terror', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(7, 'Estrategia', 'estrategia', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(8, 'Multijugador', 'multijugador', '2026-07-25 07:37:18', '2026-07-25 07:37:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genero_videojuego`
--

CREATE TABLE `genero_videojuego` (
  `genero_id` bigint(20) UNSIGNED NOT NULL,
  `videojuego_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `genero_videojuego`
--

INSERT INTO `genero_videojuego` (`genero_id`, `videojuego_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(1, 9, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(2, 6, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(2, 12, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(3, 2, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(4, 7, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(4, 11, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(5, 3, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(6, 5, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(7, 8, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(8, 4, '2026-07-25 07:37:18', '2026-07-25 07:37:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_07_25_011057_create_personal_access_tokens_table', 1),
(5, '2026_07_25_011109_create_video_games_table', 1),
(6, '2026_07_25_011110_create_genres_table', 1),
(7, '2026_07_25_011111_create_carts_table', 1),
(8, '2026_07_25_011112_create_cart_items_table', 1),
(9, '2026_07_25_011113_create_orders_table', 1),
(10, '2026_07_25_011114_create_order_items_table', 1),
(11, '2026_07_25_011115_create_notification_logs_table', 1),
(12, '2026_07_25_011152_create_genre_video_game_table', 1),
(13, '2026_07_25_030235_add_plataforma_to_videojuegos_table', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `folio` varchar(255) NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente',
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fecha_pedido` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `usuario_id`, `folio`, `estado`, `total`, `fecha_pedido`, `created_at`, `updated_at`) VALUES
(1, 3, 'GW-DEMO-0001', 'entregado', 2797.00, '2026-07-25 07:37:18', '2026-07-25 07:37:18', '2026-07-25 08:59:44'),
(2, 3, 'GW-20260725-PGSYDR', 'entregado', 899.00, '2026-07-25 08:34:37', '2026-07-25 08:34:37', '2026-07-25 08:59:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'gamewolf-api', '6004aece30d89eb2537bd0557ccec7b866ccdacb12f4f5b28d9ffd8661cac5c2', '[\"*\"]', NULL, NULL, '2026-07-25 07:48:28', '2026-07-25 07:48:28'),
(2, 'App\\Models\\User', 1, 'gamewolf-api', '42f343895944f7504d52879b84512e363d9f977b10b777ad546d2f9bab712a3e', '[\"*\"]', NULL, NULL, '2026-07-25 07:49:05', '2026-07-25 07:49:05'),
(25, 'App\\Models\\User', 1, 'gamewolf-api', 'aabcf207c65c4c12acd73ed07e9e4b432bc590f0c9d6a359ba8acf65af4ed8a7', '[\"*\"]', '2026-07-25 08:46:05', NULL, '2026-07-25 08:46:03', '2026-07-25 08:46:05'),
(26, 'App\\Models\\User', 1, 'gamewolf-api', 'f7b84275e10a02a4b45466e9c4fe2b576ae9fe15112c23b75732b83b0db9ff52', '[\"*\"]', '2026-07-25 08:46:19', NULL, '2026-07-25 08:46:18', '2026-07-25 08:46:19'),
(27, 'App\\Models\\User', 1, 'gamewolf-api', 'b60069470497ed7b242a33262e192e6f7ab37532f8b40869ddbbe3355eee3de0', '[\"*\"]', '2026-07-25 08:46:31', NULL, '2026-07-25 08:46:30', '2026-07-25 08:46:31'),
(30, 'App\\Models\\User', 1, 'gamewolf-api', '4bedfafefadf80d62a24fd8087b2f02f25af1c8e8c3d588ff8d8e8cc576032e8', '[\"*\"]', '2026-07-25 08:52:23', NULL, '2026-07-25 08:52:20', '2026-07-25 08:52:23'),
(34, 'App\\Models\\User', 1, 'gamewolf-api', 'e5ff753fbb243e2d7d178a0101d0c0a6e20a64a84e9b5e8885b6e21eeb7504ca', '[\"*\"]', '2026-07-25 08:56:46', NULL, '2026-07-25 08:56:45', '2026-07-25 08:56:46'),
(35, 'App\\Models\\User', 1, 'gamewolf-api', 'daf2d6329b62d61b65af3c01d69edef1fe3bc0cfaada2cdd985b717d21da46f0', '[\"*\"]', '2026-07-25 08:58:26', NULL, '2026-07-25 08:58:25', '2026-07-25 08:58:26'),
(42, 'App\\Models\\User', 1, 'gamewolf-api', 'fa489a3d5ac85f3e1d34ca4896d4a5730fa0da495e769b1781807e6556415dab', '[\"*\"]', '2026-07-25 09:12:44', NULL, '2026-07-25 09:12:36', '2026-07-25 09:12:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_notificacion`
--

CREATE TABLE `registros_notificacion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pedido_id` bigint(20) UNSIGNED DEFAULT NULL,
  `canal` varchar(255) NOT NULL,
  `destinatario` varchar(255) NOT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `mensaje` text NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente',
  `respuesta_proveedor` text DEFAULT NULL,
  `enviado_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `registros_notificacion`
--

INSERT INTO `registros_notificacion` (`id`, `usuario_id`, `pedido_id`, `canal`, `destinatario`, `asunto`, `mensaje`, `estado`, `respuesta_proveedor`, `enviado_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'email', 'admin@gamewolf.test', 'GameWolf demo', 'Datos iniciales cargados para probar el sistema.', 'pendiente', NULL, NULL, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(2, 3, 2, 'email', 'cliente@gamewolf.test', 'Estado de pedido GameWolf', 'Tu pedido GW-20260725-PGSYDR fue registrado.', 'pendiente', NULL, NULL, '2026-07-25 08:34:37', '2026-07-25 08:34:37'),
(3, 3, 2, 'sms', '+5215550001003', 'Estado de pedido GameWolf', 'Tu pedido GW-20260725-PGSYDR fue registrado.', 'pendiente', NULL, NULL, '2026-07-25 08:34:37', '2026-07-25 08:34:37'),
(4, 3, 2, 'whatsapp', '+5215550001003', 'Estado de pedido GameWolf', 'Tu pedido GW-20260725-PGSYDR fue registrado.', 'pendiente', NULL, NULL, '2026-07-25 08:34:37', '2026-07-25 08:34:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('RwZkxS1UR5IVKMwiitXfTsKArdCf6TN1dV66C5dT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'eyJfdG9rZW4iOiJ5TU1RUXpLaXp1VW5GMnd2dFl1a1pqcGt1Q3BPMU1XdDFHZ29sUFo3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1784943911);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `imagen_perfil` varchar(255) DEFAULT NULL,
  `rol` varchar(255) NOT NULL DEFAULT 'cliente',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `telefono`, `imagen_perfil`, `rol`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Luis Jared', 'admin@gamewolf.test', '+5215550001001', NULL, 'admin', NULL, '$2y$12$FFAKJ.6VMPAaNUvu3.BqrukGNKYadC1Fi9CJqc3HXI3SYmWZpu7HC', NULL, '2026-07-25 07:37:17', '2026-07-25 07:37:17'),
(2, 'Leonardo Fuentes', 'empleado@gamewolf.test', '+5215550001002', NULL, 'empleado', NULL, '$2y$12$yDQ1TkLrR87Gn6baC1hafuLdItmazaZEKRSn3kSvWHXtM50HcM0aW', NULL, '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(3, 'Cliente Demo', 'cliente@gamewolf.test', '+5215550001003', NULL, 'cliente', NULL, '$2y$12$SCmvmLlHiyHb/q9.E32DieizjjsIzAv6ThatHDY2GPjojprjEUL2q', NULL, '2026-07-25 07:37:18', '2026-07-25 07:37:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videojuegos`
--

CREATE TABLE `videojuegos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `plataforma` varchar(255) NOT NULL DEFAULT 'Multiplataforma',
  `precio` decimal(10,2) NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `videojuegos`
--

INSERT INTO `videojuegos` (`id`, `titulo`, `slug`, `descripcion`, `plataforma`, `precio`, `stock`, `imagen`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Elden Ring', 'cyber-quest', 'RPG de mundo abierto disponible en GameWolf.', 'PS5', 899.00, 17, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 08:34:37'),
(2, 'Cyberpunk 2077', 'shadow-kingdom-2', 'Videojuego de accion futurista disponible en GameWolf.', 'Xbox Series X', 1199.00, 12, 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 08:59:11'),
(3, 'Forza Horizon 5', 'turbo-rally-x', 'Juego de carreras disponible en GameWolf.', 'Xbox Series X', 699.00, 21, 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(4, 'Hades II', 'arena-legends', 'Roguelike de accion disponible en GameWolf.', 'PC', 499.00, 30, 'https://cdn.akamai.steamstatic.com/steam/apps/1145350/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(5, 'Resident Evil 4', 'haunted-pixel', 'Survival horror disponible en GameWolf.', 'PS5', 399.00, 10, 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(6, 'Baldurs Gate 3', 'galaxy-raiders', 'RPG de aventura disponible en GameWolf.', 'PC', 799.00, 16, 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(7, 'Street Fighter 6', 'manager-pro-26', 'Juego de peleas disponible en GameWolf.', 'PS5', 999.00, 14, 'https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(8, 'Hollow Knight', 'castle-tactics', 'Aventura de exploracion disponible en GameWolf.', 'Nintendo Switch', 599.00, 9, 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(9, 'Stardew Valley', 'neon-fighters', 'Simulador de granja y gestion disponible en GameWolf.', 'PC', 749.00, 25, 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(11, 'Red Dead Redemption 2', 'street-goal', 'Aventura western disponible en GameWolf.', 'PS5', 549.00, 19, 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18'),
(12, 'Monster Hunter World', 'ocean-mystery', 'Accion multijugador disponible en GameWolf.', 'PC', 459.00, 13, 'https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg', 'activo', '2026-07-25 07:37:18', '2026-07-25 07:37:18');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulos_carrito`
--
ALTER TABLE `articulos_carrito`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `articulos_carrito_carrito_id_videojuego_id_unique` (`carrito_id`,`videojuego_id`),
  ADD KEY `articulos_carrito_videojuego_id_foreign` (`videojuego_id`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carritos_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalles_pedido_pedido_id_foreign` (`pedido_id`),
  ADD KEY `detalles_pedido_videojuego_id_foreign` (`videojuego_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `generos_slug_unique` (`slug`);

--
-- Indices de la tabla `genero_videojuego`
--
ALTER TABLE `genero_videojuego`
  ADD PRIMARY KEY (`genero_id`,`videojuego_id`),
  ADD KEY `genero_videojuego_videojuego_id_foreign` (`videojuego_id`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pedidos_folio_unique` (`folio`),
  ADD KEY `pedidos_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indices de la tabla `registros_notificacion`
--
ALTER TABLE `registros_notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registros_notificacion_usuario_id_foreign` (`usuario_id`),
  ADD KEY `registros_notificacion_pedido_id_foreign` (`pedido_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `videojuegos`
--
ALTER TABLE `videojuegos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `videojuegos_slug_unique` (`slug`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulos_carrito`
--
ALTER TABLE `articulos_carrito`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `registros_notificacion`
--
ALTER TABLE `registros_notificacion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `videojuegos`
--
ALTER TABLE `videojuegos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `articulos_carrito`
--
ALTER TABLE `articulos_carrito`
  ADD CONSTRAINT `articulos_carrito_carrito_id_foreign` FOREIGN KEY (`carrito_id`) REFERENCES `carritos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `articulos_carrito_videojuego_id_foreign` FOREIGN KEY (`videojuego_id`) REFERENCES `videojuegos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `carritos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `detalles_pedido_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_pedido_videojuego_id_foreign` FOREIGN KEY (`videojuego_id`) REFERENCES `videojuegos` (`id`);

--
-- Filtros para la tabla `genero_videojuego`
--
ALTER TABLE `genero_videojuego`
  ADD CONSTRAINT `genero_videojuego_genero_id_foreign` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `genero_videojuego_videojuego_id_foreign` FOREIGN KEY (`videojuego_id`) REFERENCES `videojuegos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `registros_notificacion`
--
ALTER TABLE `registros_notificacion`
  ADD CONSTRAINT `registros_notificacion_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `registros_notificacion_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
