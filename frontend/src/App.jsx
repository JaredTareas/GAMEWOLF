import { useEffect, useState } from 'react'
import './App.css'
import { roles } from './config/roles'
import { apiRequest } from './services/api'
import LoginScreen from './features/auth/LoginScreen'
import { Sidebar, Topbar } from './components/navegacion'
import Content from './features/panel/Panel'

function App() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('gamewolf_usuario')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('gamewolf_token'))
  const [activeView, setActiveView] = useState('Inicio')

  useEffect(() => {
    if (!usuario) return
    setActiveView(usuario.rol === 'cliente' ? 'Catalogo' : 'Inicio')
  }, [usuario ? usuario.rol : null])

  useEffect(() => {
    function handleUpdate(e) {
      setUsuario(e.detail)
    }

    window.addEventListener('usuario-actualizado', handleUpdate)
    return () => window.removeEventListener('usuario-actualizado', handleUpdate)
  }, [])

  function handleLogin(data) {
    localStorage.setItem('gamewolf_token', data.token)
    localStorage.setItem('gamewolf_usuario', JSON.stringify(data.usuario))
    setToken(data.token)
    setUsuario(data.usuario)
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
  }

  if (!usuario || !token) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const currentRole = roles[usuario.rol] ?? roles.cliente

  return (
    <div className="app-shell">
      <Sidebar role={currentRole} activeView={activeView} onNavigate={setActiveView} onLogout={handleLogout} />
      <main className="workspace">
        <Topbar role={currentRole} usuario={usuario} onLogout={handleLogout} />
        <Content usuario={usuario} token={token} activeView={activeView} />
      </main>
    </div>
  )
}

export default App
