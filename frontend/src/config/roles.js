export const roles = {
  admin: {
    key: 'admin',
    label: 'Administrador',
    // Agregamos 'Perfil' al final del arreglo
    nav: ['Inicio', 'Videojuegos', 'Géneros', 'Pedidos', 'Clientes', 'Usuarios', 'Reportes', 'Configuracion', 'Perfil'],
  },
  empleado: {
    key: 'empleado',
    label: 'Empleado',
    // Agregamos 'Perfil' al final del arreglo
    nav: ['Inicio', 'Videojuegos', 'Pedidos', 'Clientes', 'Perfil'],
  },
  cliente: {
    key: 'cliente',
    label: 'Cliente',
    nav: ['Catalogo', 'Carrito', 'Mis pedidos', 'Perfil'],
  },
}
