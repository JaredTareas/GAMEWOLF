-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gamewolf
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `gamewolf`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `gamewolf` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `gamewolf`;

--
-- Table structure for table `articulos_carrito`
--

DROP TABLE IF EXISTS `articulos_carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articulos_carrito` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `carrito_id` bigint unsigned NOT NULL,
  `videojuego_id` bigint unsigned NOT NULL,
  `cantidad` int unsigned NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articulos_carrito_carrito_id_videojuego_id_unique` (`carrito_id`,`videojuego_id`),
  KEY `articulos_carrito_videojuego_id_foreign` (`videojuego_id`),
  CONSTRAINT `articulos_carrito_carrito_id_foreign` FOREIGN KEY (`carrito_id`) REFERENCES `carritos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `articulos_carrito_videojuego_id_foreign` FOREIGN KEY (`videojuego_id`) REFERENCES `videojuegos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articulos_carrito`
--

LOCK TABLES `articulos_carrito` WRITE;
/*!40000 ALTER TABLE `articulos_carrito` DISABLE KEYS */;
INSERT INTO `articulos_carrito` VALUES (1,1,1,2,1299.00,2598.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,2,2,1,999.00,999.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,3,3,1,1199.00,1199.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,4,4,2,499.00,998.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,5,5,1,899.00,899.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,6,6,1,1299.00,1299.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,7,7,2,999.00,1998.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,8,8,1,399.00,399.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,9,9,1,299.00,299.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,10,10,2,799.00,1598.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,11,11,1,699.00,699.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,12,12,1,1399.00,1399.00,'2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `articulos_carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carritos_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `carritos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
INSERT INTO `carritos` VALUES (1,6,'activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,7,'activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,8,'activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,9,'activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,10,'activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,11,'activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,12,'activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,6,'convertido','2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,7,'convertido','2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,8,'convertido','2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,9,'convertido','2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,10,'convertido','2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_pedido`
--

DROP TABLE IF EXISTS `detalles_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_pedido` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint unsigned NOT NULL,
  `videojuego_id` bigint unsigned NOT NULL,
  `cantidad` int unsigned NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detalles_pedido_pedido_id_foreign` (`pedido_id`),
  KEY `detalles_pedido_videojuego_id_foreign` (`videojuego_id`),
  CONSTRAINT `detalles_pedido_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalles_pedido_videojuego_id_foreign` FOREIGN KEY (`videojuego_id`) REFERENCES `videojuegos` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_pedido`
--

LOCK TABLES `detalles_pedido` WRITE;
/*!40000 ALTER TABLE `detalles_pedido` DISABLE KEYS */;
INSERT INTO `detalles_pedido` VALUES (1,1,1,2,1299.00,2598.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,1,2,2,999.00,1998.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,2,2,1,999.00,999.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,2,3,1,1199.00,1199.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,3,3,1,1199.00,1199.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,3,4,1,499.00,499.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,4,4,1,499.00,499.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,4,5,1,899.00,899.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,5,5,2,899.00,1798.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,5,6,2,1299.00,2598.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,6,6,1,1299.00,1299.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,6,7,1,999.00,999.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(13,7,7,1,999.00,999.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(14,7,8,1,399.00,399.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(15,8,8,1,399.00,399.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(16,8,9,1,299.00,299.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(17,9,9,2,299.00,598.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(18,9,10,2,799.00,1598.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(19,10,10,1,799.00,799.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(20,10,11,1,699.00,699.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(21,11,11,1,699.00,699.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(22,11,12,1,1399.00,1399.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(23,12,12,1,1399.00,1399.00,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(24,12,1,1,1299.00,1299.00,'2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `detalles_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genero_videojuego`
--

DROP TABLE IF EXISTS `genero_videojuego`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genero_videojuego` (
  `genero_id` bigint unsigned NOT NULL,
  `videojuego_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`genero_id`,`videojuego_id`),
  KEY `genero_videojuego_videojuego_id_foreign` (`videojuego_id`),
  CONSTRAINT `genero_videojuego_genero_id_foreign` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `genero_videojuego_videojuego_id_foreign` FOREIGN KEY (`videojuego_id`) REFERENCES `videojuegos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genero_videojuego`
--

LOCK TABLES `genero_videojuego` WRITE;
/*!40000 ALTER TABLE `genero_videojuego` DISABLE KEYS */;
INSERT INTO `genero_videojuego` VALUES (1,2,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(1,4,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(1,5,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,1,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,8,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,1,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,2,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,6,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,3,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,12,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,3,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,5,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,6,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,10,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,7,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,11,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,12,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,9,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,10,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,11,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,7,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,4,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,8,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,9,'2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `genero_videojuego` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generos`
--

DROP TABLE IF EXISTS `generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `generos_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generos`
--

LOCK TABLES `generos` WRITE;
/*!40000 ALTER TABLE `generos` DISABLE KEYS */;
INSERT INTO `generos` VALUES (1,'Accion','accion','2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,'Aventura','aventura','2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,'RPG','rpg','2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,'Deportes','deportes','2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,'Carreras','carreras','2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,'Terror','terror','2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,'Estrategia','estrategia','2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,'Multijugador','multijugador','2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,'Simulacion','simulacion','2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,'Puzzle','puzzle','2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,'Peleas','peleas','2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,'Indie','indie','2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_07_25_011057_create_personal_access_tokens_table',1),(5,'2026_07_25_011109_create_video_games_table',1),(6,'2026_07_25_011110_create_genres_table',1),(7,'2026_07_25_011111_create_carts_table',1),(8,'2026_07_25_011112_create_cart_items_table',1),(9,'2026_07_25_011113_create_orders_table',1),(10,'2026_07_25_011114_create_order_items_table',1),(11,'2026_07_25_011115_create_notification_logs_table',1),(12,'2026_07_25_011152_create_genre_video_game_table',1),(13,'2026_07_25_030235_add_plataforma_to_videojuegos_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `folio` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `fecha_pedido` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pedidos_folio_unique` (`folio`),
  KEY `pedidos_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `pedidos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,6,'GW-DEMO-0001','pendiente',4596.00,'2026-07-18 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,7,'GW-DEMO-0002','pagado',2198.00,'2026-07-19 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,8,'GW-DEMO-0003','enviado',1698.00,'2026-07-20 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,9,'GW-DEMO-0004','entregado',1398.00,'2026-07-21 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,10,'GW-DEMO-0005','pendiente',4396.00,'2026-07-22 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,11,'GW-DEMO-0006','pagado',2298.00,'2026-07-23 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,12,'GW-DEMO-0007','enviado',1398.00,'2026-07-24 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,6,'GW-DEMO-0008','entregado',698.00,'2026-07-25 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,7,'GW-DEMO-0009','pendiente',2196.00,'2026-07-26 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,8,'GW-DEMO-0010','pagado',1498.00,'2026-07-27 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,9,'GW-DEMO-0011','enviado',2098.00,'2026-07-28 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,10,'GW-DEMO-0012','entregado',2698.00,'2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros_notificacion`
--

DROP TABLE IF EXISTS `registros_notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_notificacion` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned DEFAULT NULL,
  `pedido_id` bigint unsigned DEFAULT NULL,
  `canal` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destinatario` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asunto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mensaje` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `respuesta_proveedor` text COLLATE utf8mb4_unicode_ci,
  `enviado_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `registros_notificacion_usuario_id_foreign` (`usuario_id`),
  KEY `registros_notificacion_pedido_id_foreign` (`pedido_id`),
  CONSTRAINT `registros_notificacion_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `registros_notificacion_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_notificacion`
--

LOCK TABLES `registros_notificacion` WRITE;
/*!40000 ALTER TABLE `registros_notificacion` DISABLE KEYS */;
INSERT INTO `registros_notificacion` VALUES (1,6,1,'email','cliente@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0001 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,7,2,'email','ana.torres@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0002 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,8,3,'email','bruno.garcia@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0003 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,9,4,'email','carla.mendoza@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0004 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,10,5,'email','elena.ruiz@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0005 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,11,6,'email','fernando.vega@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0006 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,12,7,'email','gabriela.soto@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0007 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,6,8,'email','cliente@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0008 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,7,9,'email','ana.torres@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0009 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,8,10,'email','bruno.garcia@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0010 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,9,11,'email','carla.mendoza@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0011 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,10,12,'email','elena.ruiz@gamewolf.test','Pedido demo GameWolf','El pedido GW-DEMO-0012 está listo para pruebas.','enviado','Dato de demostración generado por el seeder.','2026-07-29 15:29:18','2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `registros_notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_perfil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Luis Jared','admin@gamewolf.test','+5215550001001',NULL,'admin',NULL,'$2y$12$cLFcoh.oeT89wb6gh35tEOiw/M8QtAfVEfoDYVTZvqmLY7nRnITCy',NULL,'2026-07-29 15:29:15','2026-07-29 15:29:15'),(2,'Admin Soporte','admin.soporte@gamewolf.test','+5215550001002',NULL,'admin',NULL,'$2y$12$XOy3ymWoRxgAHp920280e.GUX9e.bM9KjU7GrYpqR85R8KEVr5mVC',NULL,'2026-07-29 15:29:15','2026-07-29 15:29:15'),(3,'Leonardo Fuentes','empleado@gamewolf.test','+5215550001003',NULL,'empleado',NULL,'$2y$12$4dAn48vKUZRks4DuaTB5ae5ipD5mcF.dsg/I3dLdeRQR8dL9M2pbe',NULL,'2026-07-29 15:29:16','2026-07-29 15:29:16'),(4,'Mariana Inventario','mariana.inventario@gamewolf.test','+5215550001004',NULL,'empleado',NULL,'$2y$12$jEwgziXcalQIIop.mIn0Zu4b7hBU3R0Hs4JSbgWIbdwPLF1tA01f2',NULL,'2026-07-29 15:29:16','2026-07-29 15:29:16'),(5,'Diego Pedidos','diego.pedidos@gamewolf.test','+5215550001005',NULL,'empleado',NULL,'$2y$12$bOcjuGYuAbkOUSjmmWoB0.sLC6phqDEZ/5w1z9fauTNSPOADevgh6',NULL,'2026-07-29 15:29:16','2026-07-29 15:29:16'),(6,'Cliente Demo','cliente@gamewolf.test','+5215550001006',NULL,'cliente',NULL,'$2y$12$icC2EZ.WlBI9Csd5lKYuquOCVM8SA96zoiXOoFsImYXc0U8.dm4Qa',NULL,'2026-07-29 15:29:16','2026-07-29 15:29:16'),(7,'Ana Torres','ana.torres@gamewolf.test','+5215550001007',NULL,'cliente',NULL,'$2y$12$UXfBMoHyowgPYHyRqVBeDuOUY3Fmob9I6VBQfhNIqHtWwdKk3zpvK',NULL,'2026-07-29 15:29:17','2026-07-29 15:29:17'),(8,'Bruno García','bruno.garcia@gamewolf.test','+5215550001008',NULL,'cliente',NULL,'$2y$12$3fQAIEmmZ/0oiwutJqGVoetZr6/NzzbrbiW21dBylY5/Z3RJDQR2q',NULL,'2026-07-29 15:29:17','2026-07-29 15:29:17'),(9,'Carla Mendoza','carla.mendoza@gamewolf.test','+5215550001009',NULL,'cliente',NULL,'$2y$12$B8EQ22SVDVWiAmC3ig2s8Or5x4.l47ZlWTwqZ36Nrp/oBet8S.N8i',NULL,'2026-07-29 15:29:17','2026-07-29 15:29:17'),(10,'Elena Ruiz','elena.ruiz@gamewolf.test','+5215550001010',NULL,'cliente',NULL,'$2y$12$.cS5wgErMvt.merFjDhLzelsnqDe/T0n8VOas.KJTrP1nEIm4saxS',NULL,'2026-07-29 15:29:17','2026-07-29 15:29:17'),(11,'Fernando Vega','fernando.vega@gamewolf.test','+5215550001011',NULL,'cliente',NULL,'$2y$12$GpPeg9G9bm/tVMu9gM2YIOiLFa7TOSEis8caFv5UeQ0Ws9Z7KzVxi',NULL,'2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,'Gabriela Soto','gabriela.soto@gamewolf.test','+5215550001012',NULL,'cliente',NULL,'$2y$12$6Qv4HegmpBJDQD8a7pzaquMrLl4ahe8qrm5N3FYiRjt5DibMZxZNi',NULL,'2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videojuegos`
--

DROP TABLE IF EXISTS `videojuegos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videojuegos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `plataforma` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Multiplataforma',
  `precio` decimal(10,2) NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `videojuegos_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videojuegos`
--

LOCK TABLES `videojuegos` WRITE;
/*!40000 ALTER TABLE `videojuegos` DISABLE KEYS */;
INSERT INTO `videojuegos` VALUES (1,'Elden Ring','elden-ring','Videojuego de RPG disponible en GameWolf.','PS5',1299.00,40,'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(2,'Cyberpunk 2077','cyberpunk-2077','Videojuego de Accion disponible en GameWolf.','Xbox Series X',999.00,38,'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(3,'Forza Horizon 5','forza-horizon-5','Videojuego de Carreras disponible en GameWolf.','Xbox Series X',1199.00,36,'https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(4,'Hades II','hades-ii','Videojuego de Accion disponible en GameWolf.','PC',499.00,44,'https://cdn.akamai.steamstatic.com/steam/apps/1145350/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(5,'Resident Evil 4','resident-evil-4','Videojuego de Terror disponible en GameWolf.','PS5',899.00,35,'https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(6,'Baldurs Gate 3','baldurs-gate-3','Videojuego de RPG disponible en GameWolf.','PC',1299.00,42,'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(7,'Street Fighter 6','street-fighter-6','Videojuego de Peleas disponible en GameWolf.','PS5',999.00,39,'https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(8,'Hollow Knight','hollow-knight','Videojuego de Aventura disponible en GameWolf.','Nintendo Switch',399.00,46,'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(9,'Stardew Valley','stardew-valley','Videojuego de Simulacion disponible en GameWolf.','PC',299.00,50,'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(10,'Civilization VI','civilization-vi','Videojuego de Estrategia disponible en GameWolf.','PC',799.00,37,'https://cdn.akamai.steamstatic.com/steam/apps/289070/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(11,'It Takes Two','it-takes-two','Videojuego de Multijugador disponible en GameWolf.','PS5',699.00,41,'https://cdn.akamai.steamstatic.com/steam/apps/1426210/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18'),(12,'EA Sports FC 26','ea-sports-fc-26','Videojuego de Deportes disponible en GameWolf.','PS5',1399.00,34,'https://cdn.akamai.steamstatic.com/steam/apps/3405690/header.jpg','activo','2026-07-29 15:29:18','2026-07-29 15:29:18');
/*!40000 ALTER TABLE `videojuegos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'gamewolf'
--

--
-- Dumping routines for database 'gamewolf'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-29  3:29:48
