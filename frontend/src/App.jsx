import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { roles } from './config/roles'
import { rutaInicialPorRol, rutaPorVista } from './config/rutas'
import { apiRequest } from './services/api'
import LoginScreen from './features/auth/LoginScreen'
import { Sidebar, Topbar } from './components/navegacion'
import Content from './features/panel/Panel'

const rolesInternos = ['admin', 'empleado']

function ProtectedPage({ usuario, token, view, allowedRoles, onLogout }) {
  const navigate = useNavigate()

  if (!allowedRoles.includes(usuario.rol)) {
    return <Navigate to={rutaInicialPorRol(usuario.rol)} replace />
  }

  const currentRole = roles[usuario.rol] ?? roles.cliente

  return (
    <div className="app-shell">
      <Sidebar
        role={currentRole}
        activeView={view}
        onNavigate={(nextView) => navigate(rutaPorVista[nextView] ?? rutaInicialPorRol(usuario.rol))}
        onLogout={onLogout}
      />
      <main className="workspace">
        <Topbar role={currentRole} usuario={usuario} onLogout={onLogout} />
        <Content usuario={usuario} token={token} activeView={view} />
      </main>
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('gamewolf_usuario')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('gamewolf_token'))

  useEffect(() => {
    function handleUpdate(event) {
      setUsuario(event.detail)
    }

    window.addEventListener('usuario-actualizado', handleUpdate)
    return () => window.removeEventListener('usuario-actualizado', handleUpdate)
  }, [])

  function handleLogin(data) {
    localStorage.setItem('gamewolf_token', data.token)
    localStorage.setItem('gamewolf_usuario', JSON.stringify(data.usuario))
    setToken(data.token)
    setUsuario(data.usuario)
    navigate(rutaInicialPorRol(data.usuario.rol), { replace: true })
  }

  function handleLogout() {
    if (token) {
      apiRequest('/autenticacion/cerrar-sesion', {
        method: 'POST',
        token,
      }).catch(() => {})
    }

    localStorage.removeItem('gamewolf_token')
    localStorage.removeItem('gamewolf_usuario')
    setToken(null)
    setUsuario(null)
    navigate('/login', { replace: true })
  }

  if (!usuario || !token) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const page = (view, allowedRoles) => (
    <ProtectedPage
      usuario={usuario}
      token={token}
      view={view}
      allowedRoles={allowedRoles}
      onLogout={handleLogout}
    />
  )

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={rutaInicialPorRol(usuario.rol)} replace />} />
      <Route path="/" element={<Navigate to={rutaInicialPorRol(usuario.rol)} replace />} />
      <Route path="/inicio" element={page('Inicio', rolesInternos)} />
      <Route path="/videojuegos" element={page('Videojuegos', rolesInternos)} />
      <Route path="/generos" element={page('Géneros', ['admin'])} />
      <Route path="/pedidos" element={page('Pedidos', rolesInternos)} />
      <Route path="/clientes" element={page('Clientes', rolesInternos)} />
      <Route path="/usuarios" element={page('Usuarios', ['admin'])} />
      <Route path="/reportes" element={page('Reportes', ['admin'])} />
      <Route path="/configuracion" element={page('Configuracion', ['admin'])} />
      <Route path="/catalogo" element={page('Catalogo', ['cliente'])} />
      <Route path="/carrito" element={page('Carrito', ['cliente'])} />
      <Route path="/mis-pedidos" element={page('Mis pedidos', ['cliente'])} />
      <Route path="/perfil" element={page('Perfil', ['admin', 'empleado', 'cliente'])} />
      <Route path="*" element={<Navigate to={rutaInicialPorRol(usuario.rol)} replace />} />
    </Routes>
  )
}

export default App
