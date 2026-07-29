import { BarChart3, CheckSquare, Gamepad2, Home, LogOut, Settings, ShoppingCart, UserCircle, Users } from 'lucide-react'
import { getImageUrl } from '../utils/imagenes'

export function Sidebar({ role, activeView, onNavigate, onLogout }) {
  return (
    <aside className={`sidebar sidebar-${role.key}`}>
      <div className="sidebar-brand">
        <img src="/img/logo-gamewolf.png" alt="GameWolf" />
        <strong>GameWolf</strong>
        <span>{role.label}</span>
      </div>

      <nav className="sidebar-nav" aria-label="Navegacion principal">
        {role.nav.map((item) => (
          <button
            className={activeView === item ? 'active' : ''}
            key={item}
            type="button"
            onClick={() => onNavigate(item)}
          >
            <span>{navIcon(item)}</span>
            {item}
          </button>
        ))}
      </nav>

      <button className="logout-link" type="button" onClick={onLogout}>
        <LogOut size={24} strokeWidth={2.4} />
        Cerrar sesión
      </button>
    </aside>
  )
}

export function Topbar({ role, usuario, onLogout }) {
  // Buscamos la foto en cualquiera de los dos nombres que haya usado tu compañero
  const foto = usuario.imagen_perfil || usuario.foto_perfil;
  const tieneFoto = foto && foto !== '';

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Panel interno</p>
        <h2>Bienvenido, {usuario.nombre}</h2>
      </div>
      <div className="user-box">
        <div className="avatar" style={{ overflow: 'hidden' }}>
          {tieneFoto ? (
            <img 
              src={getImageUrl(foto)} 
              alt="Perfil" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            usuario.nombre.slice(0, 1).toUpperCase()
          )}
        </div>
        
        <div>
          <strong>{usuario.nombre}</strong>
          <span>{usuario.email} - {role.label}</span>
        </div>
        <button type="button" onClick={onLogout}>
          Salir
        </button>
      </div>
    </header>
  )
}

function navIcon(item) {
  const icons = {
    Inicio: <Home size={23} strokeWidth={2.5} />,
    Videojuegos: <Gamepad2 size={23} strokeWidth={2.5} />,
    Géneros: <Gamepad2 size={23} strokeWidth={2.5} />,
    Pedidos: <ShoppingCart size={23} strokeWidth={2.5} />,
    Clientes: <Users size={23} strokeWidth={2.5} />,
    Usuarios: <UserCircle size={23} strokeWidth={2.5} />,
    Reportes: <BarChart3 size={23} strokeWidth={2.5} />,
    Configuracion: <Settings size={23} strokeWidth={2.5} />,
    Catalogo: <Gamepad2 size={23} strokeWidth={2.5} />,
    Carrito: <ShoppingCart size={23} strokeWidth={2.5} />,
    'Mis pedidos': <CheckSquare size={23} strokeWidth={2.5} />,
    Perfil: <UserCircle size={23} strokeWidth={2.5} />,
  }

  return icons[item] || <Gamepad2 size={23} strokeWidth={2.5} />
}

// Modal Confirmacion
