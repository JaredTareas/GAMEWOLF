export const rutaPorVista = {
  Inicio: '/inicio',
  Videojuegos: '/videojuegos',
  Pedidos: '/pedidos',
  Clientes: '/clientes',
  Usuarios: '/usuarios',
  Reportes: '/reportes',
  Configuracion: '/configuracion',
  Catalogo: '/catalogo',
  Carrito: '/carrito',
  'Mis pedidos': '/mis-pedidos',
  Perfil: '/perfil',
}

export function rutaInicialPorRol(rol) {
  return rol === 'cliente' ? rutaPorVista.Catalogo : rutaPorVista.Inicio
}
