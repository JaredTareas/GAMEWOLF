import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  CheckSquare,
  Gamepad2,
  Home,
  LogOut,
  Settings,
  ShoppingCart,
  UserCircle,
  Users,
} from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'
function getImageUrl(path) {
  if (!path) return ''
  
  // Si es un enlace externo completo, lo dejamos pasar
  if (path.startsWith('http')) return path;

  // Si trae la palabra storage (con o sin diagonal), le pegamos el dominio del backend
  if (path.includes('storage/')) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
  }
  
  return path
}

const roles = {
  admin: {
    key: 'admin',
    label: 'Administrador',
    // Agregamos 'Perfil' al final del arreglo
    nav: ['Inicio', 'Videojuegos', 'Pedidos', 'Clientes', 'Usuarios', 'Reportes', 'Configuracion', 'Perfil'],
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

  // NUEVO: Escuchador global para cuando el perfil se actualiza
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

function LoginScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState('login')
  const [formName, setFormName] = useState('') 
  const [email, setEmail] = useState('admin@gamewolf.test')
  const [password, setPassword] = useState('GameWolf#2026')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  function validateEmail(val) {
    if (!val) return 'El correo es obligatorio.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Ingresa un correo valido.'
    return ''
  }

  function validatePassword(val) {
    if (!val) return 'La contrasena es obligatoria.'
    if (val.length < 8) return 'Minimo 8 caracteres.'
    if (!/[A-Z]/.test(val)) return 'Falta al menos una mayuscula.'
    if (!/[0-9]/.test(val)) return 'Falta al menos un numero.'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return 'Falta un caracter especial.'
    return ''
  }

  function validateResetToken(val) {
    if (!val) return 'El token de recuperacion es obligatorio.'
    return ''
  }

  function changeMode(mode) {
    setAuthMode(mode)
    setErrors({})
    setApiError('')
    setNotice('')
  }

  function handleEmailChange(e) {
    const val = e.target.value
    setEmail(val)
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }))
  }

  function handlePasswordChange(e) {
    const val = e.target.value
    setPassword(val)
    setErrors((prev) => ({ ...prev, password: validatePassword(val) }))
  }

  function handlePasswordConfirmationChange(e) {
    const val = e.target.value
    setPasswordConfirmation(val)
    setErrors((prev) => ({
      ...prev,
      password_confirmation: val !== password ? 'La confirmacion no coincide.' : '',
    }))
  }

  function handleResetTokenChange(e) {
    const val = e.target.value
    setResetToken(val)
    setErrors((prev) => ({ ...prev, token: validateResetToken(val) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')
    setNotice('')

    const emailErr = validateEmail(email)

    if (authMode === 'register') {
      const nameErr = !formName.trim() ? 'El nombre es obligatorio.' : ''
      const passErr = validatePassword(password)
      const confirmationErr = passwordConfirmation !== password ? 'La confirmacion no coincide.' : ''
      
      setErrors({ email: emailErr, password: passErr, password_confirmation: confirmationErr, nombre: nameErr })
      if (emailErr || passErr || confirmationErr || nameErr) return

      setLoading(true)
      try {
        await apiRequest('/autenticacion/registro', {
          method: 'POST',
          body: { 
            nombre: formName, 
            email, 
            password, 
            password_confirmation: passwordConfirmation, 
            rol: 'cliente' 
          },
        })
        setNotice('Cuenta creada con éxito. Ahora puedes iniciar sesión.')
        setAuthMode('login')
        setPassword('')
        setPasswordConfirmation('')
      } catch (err) {
        setApiError(err.message || 'No se pudo crear la cuenta.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (authMode === 'recover') {
      setErrors({ email: emailErr })
      if (emailErr) return

      setLoading(true)
      try {
        const data = await apiRequest('/autenticacion/recuperar-contrasena', {
          method: 'POST',
          body: { email },
        })
        setNotice(`${data.mensaje} Si el correo esta en modo log, revisa backend/storage/logs/laravel.log.`)
        setAuthMode('reset')
      } catch (err) {
        setApiError(err.message || 'No se pudo enviar el token de recuperacion.')
      } finally {
        setLoading(false)
      }

      return
    }

    if (authMode === 'reset') {
      const tokenErr = validateResetToken(resetToken)
      const passErr = validatePassword(password)
      const confirmationErr = passwordConfirmation !== password ? 'La confirmacion no coincide.' : ''
      setErrors({
        email: emailErr,
        token: tokenErr,
        password: passErr,
        password_confirmation: confirmationErr,
      })

      if (emailErr || tokenErr || passErr || confirmationErr) return

      setLoading(true)
      try {
        const data = await apiRequest('/autenticacion/restablecer-contrasena', {
          method: 'POST',
          body: {
            email,
            token: resetToken,
            password,
            password_confirmation: passwordConfirmation,
          },
        })
        setNotice(data.mensaje)
        setPassword('')
        setPasswordConfirmation('')
        setResetToken('')
        setAuthMode('login')
      } catch (err) {
        setApiError(err.message || 'No se pudo restablecer la contrasena.')
      } finally {
        setLoading(false)
      }

      return
    }

    const passErr = validatePassword(password)
    setErrors({ email: emailErr, password: passErr })

    if (emailErr || passErr) return

    setLoading(true)
    try {
      const data = await apiRequest('/autenticacion/iniciar-sesion', {
        method: 'POST',
        body: { email, password },
      })
      onLogin(data)
    } catch (err) {
      setApiError(err.message || 'No se pudo iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-art" aria-label="GameWolf">
        <img src="/img/fondo-login.png" alt="" />
        <div className="login-art-overlay">
          <span>GameWolf Store</span>
          <strong>Gestiona, vende y controla tus videojuegos</strong>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <img className="login-logo" src="/img/logo-gamewolf.png" alt="GameWolf" />
          <h1>GameWolf</h1>
          <p className="muted">
            {authMode === 'login' && 'Ingresa tus datos para acceder al sistema'}
            {authMode === 'register' && 'Crea una cuenta para comprar videojuegos'}
            {authMode === 'recover' && 'Solicita un token para recuperar tu contrasena'}
            {authMode === 'reset' && 'Escribe el token recibido y tu nueva contrasena'}
          </p>

          {authMode === 'login' && (
            <div className="demo-users" aria-label="Usuarios de prueba">
              <button type="button" onClick={() => { setEmail('admin@gamewolf.test'); setPassword('GameWolf#2026'); setErrors({}) }}>Admin</button>
              <button type="button" onClick={() => { setEmail('empleado@gamewolf.test'); setPassword('GameWolf#2026'); setErrors({}) }}>Empleado</button>
              <button type="button" onClick={() => { setEmail('cliente@gamewolf.test'); setPassword('GameWolf#2026'); setErrors({}) }}>Cliente</button>
            </div>
          )}

          {authMode === 'register' && (
            <label className="field">
              <span>Nombre completo</span>
              <input value={formName} type="text" onChange={(e) => {
                setFormName(e.target.value)
                setErrors((prev) => ({ ...prev, nombre: !e.target.value ? 'El nombre es obligatorio.' : '' }))
              }} />
              {errors.nombre && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.nombre}</small>}
            </label>
          )}

          <label className="field">
            <span>Correo electronico</span>
            <input value={email} type="email" onChange={handleEmailChange} />
            {errors.email ? (
              <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.email}</small>
            ) : (
              <small>Usa uno de los usuarios demo o escribe un correo registrado.</small>
            )}
          </label>

          {authMode === 'reset' && (
            <label className="field">
              <span>Token de recuperacion</span>
              <input value={resetToken} type="text" onChange={handleResetTokenChange} />
              {errors.token ? (
                <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.token}</small>
              ) : (
                <small>Pega el token enviado al correo electronico.</small>
              )}
            </label>
          )}

          {authMode !== 'recover' && (
            <label className="field">
              <span>{authMode === 'reset' ? 'Nueva contrasena' : 'Contrasena'}</span>
              <input value={password} type="password" onChange={handlePasswordChange} />
              {errors.password ? (
                <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.password}</small>
              ) : (
                <small>Minimo 8 caracteres, una mayuscula, un numero y un caracter especial.</small>
              )}
            </label>
          )}

          {(authMode === 'reset' || authMode === 'register') && (
            <label className="field">
              <span>Confirmar contrasena</span>
              <input value={passwordConfirmation} type="password" onChange={handlePasswordConfirmationChange} />
              {errors.password_confirmation ? (
                <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.password_confirmation}</small>
              ) : (
                <small>Debe coincidir con la {authMode === 'reset' ? 'nueva ' : ''}contrasena.</small>
              )}
            </label>
          )}

          {apiError && <p className="form-error">{apiError}</p>}
          {notice && <p className="form-success" style={{ color: '#16a34a' }}>{notice}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {authMode === 'login' && (loading ? 'Entrando...' : 'Entrar')}
            {authMode === 'register' && (loading ? 'Creando...' : 'Crear cuenta')}
            {authMode === 'recover' && (loading ? 'Enviando...' : 'Enviar token')}
            {authMode === 'reset' && (loading ? 'Guardando...' : 'Restablecer contrasena')}
          </button>

          {authMode === 'login' && (
            <>
              <button className="link-button" type="button" onClick={() => changeMode('recover')}>
                Olvidaste tu contraseña
              </button>
              <button className="link-button" type="button" onClick={() => changeMode('register')} style={{ marginTop: '10px' }}>
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </>
          )}

          {authMode === 'recover' && (
            <button className="link-button" type="button" onClick={() => changeMode('reset')}>
              Ya tengo un token
            </button>
          )}

          {authMode !== 'login' && (
            <button className="link-button" type="button" onClick={() => changeMode('login')}>
              Volver a iniciar sesion
            </button>
          )}
        </form>
      </section>
    </main>
  )
}
function Sidebar({ role, activeView, onNavigate, onLogout }) {
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
        Cerrar sesion
      </button>
    </aside>
  )
}

function Topbar({ role, usuario, onLogout }) {
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

function Content({ usuario, token, activeView }) {
  const title = useMemo(() => {
    if (activeView === 'Inicio') return 'Dashboard principal'
    return activeView
  }, [activeView])

  if (usuario.rol === 'cliente') {
    return <ClientView activeView={activeView} title={title} usuario={usuario} token={token} />
  }

  return <AdminEmployeeView usuario={usuario} token={token} activeView={activeView} title={title} />
}

function AdminEmployeeView({ usuario, token, activeView, title }) {
  const {
    videojuegos,
    metaVideojuegos, 
    pedidos,
    usuarios,
    reporte,
    loading,
    error,
    notice,
    saveGame,
    deleteGame,
    updateOrderStatus,
    search, 
    setSearch, 
    page, 
    setPage,
    saveUser,   
    deleteUser  
  } = useDashboardData(token, usuario.rol)

  return (
    <section className="content">
      <PageHeading title={title} subtitle="Resumen operativo de la tienda GameWolf" />

      {error && <p className="form-error">{error}</p>}
      {notice && <p className="toast-message">{notice}</p>}
      {loading && <p className="loading-text">Cargando informacion...</p>}

      {activeView === 'Inicio' && (
        <>
          <div className="metrics-grid">
            <Metric label="Videojuegos disponibles" value={videojuegos.length} tone="blue" />
            <Metric label="Pedidos registrados" value={pedidos.length} tone="violet" />
            <Metric label="Usuarios registrados" value={usuarios.length || '-'} tone="green" />
          </div>
          <OrdersTable pedidos={pedidos.slice(0, 5)} compact canManage onUpdateStatus={updateOrderStatus} />
        </>
      )}

      {activeView === 'Videojuegos' && (
        <GamesTable
          videojuegos={videojuegos}
          meta={metaVideojuegos}
          search={search}
          onSearch={(val) => { setSearch(val); setPage(1); }} // Regresa a pag 1 al buscar
          onPageChange={(newPage) => setPage(newPage)}
          canManage
          onSave={saveGame}
          onDelete={deleteGame}
          canDelete={usuario.rol === 'admin'}
        />
      )}
      {activeView === 'Pedidos' && <OrdersTable pedidos={pedidos} canManage onUpdateStatus={updateOrderStatus} />}
      {activeView === 'Clientes' && <CustomersTable usuarios={usuarios.filter((item) => item.rol === 'cliente')} />}
      
   
      {activeView === 'Usuarios' && (
        <CustomersTable 
          usuarios={usuarios} 
          canManage={usuario.rol === 'admin'} 
          onSave={saveUser} 
          onDelete={deleteUser} 
        />
      )}
      

      {activeView === 'Reportes' && <ReportsPanel reporte={reporte} />}
      {activeView === 'Configuracion' && <SettingsPanel />}
      {activeView === 'Perfil' && <ProfilePanel usuario={usuario} token={token} />}
      {usuario.rol === 'empleado' && activeView === 'Clientes' && (
        <p className="notice">El empleado puede consultar clientes, pero no editar usuarios ni roles.</p>
      )}
    </section>
  )
}

function ClientView({ activeView, title, usuario, token }) {
  const { videojuegos, pedidos, carrito, loading, error, notice, addToCart, updateCartItem, removeCartItem, createOrder } = useClientData(token)

  return (
    <section className="content">
      <PageHeading title={title} subtitle="Compra videojuegos y consulta el estado de tus pedidos" />

      {error && <p className="form-error">{error}</p>}
      {notice && <p className="toast-message">{notice}</p>}
      {loading && <p className="loading-text">Cargando informacion...</p>}

      {activeView === 'Catalogo' && (
        <div className="catalog-grid">
          {videojuegos.map((videojuego) => (
            <article className="game-card" key={videojuego.id}>
              <div className="game-cover">
                {videojuego.imagen ? <img src={getImageUrl(videojuego.imagen)} alt={videojuego.titulo} /> : videojuego.titulo.slice(0, 2).toUpperCase()}
              </div>
              <h3>{videojuego.titulo}</h3>
              <p>{videojuego.plataforma}</p>
              <p>{videojuego.generos?.map((genero) => genero.nombre).join(', ') || 'Sin genero'}</p>
              <strong>${videojuego.precio}</strong>
              <button type="button" onClick={() => addToCart(videojuego.id)}>
                Agregar al carrito
              </button>
            </article>
          ))}
        </div>
      )}

      {activeView === 'Carrito' && (
        <CartPanel
          carrito={carrito}
          onConfirm={createOrder}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeCartItem}
        />
      )}
      {activeView === 'Mis pedidos' && <OrdersTable pedidos={pedidos} compact />}      
      {activeView === 'Perfil' && <ProfilePanel usuario={usuario} token={token} />}
    </section>
  )
}

function PageHeading({ title, subtitle }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">GameWolf</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

function Metric({ label, value, tone }) {
  return (
    <article className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function GamesTable({ videojuegos, meta, search, onSearch, onPageChange, canManage = false, canDelete = false, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  
  const [gameToDelete, setGameToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function openCreateModal() {
    setEditingGame(null)
    setModalOpen(true)
  }

  function openEditModal(videojuego) {
    setEditingGame(videojuego)
    setModalOpen(true)
  }

  async function handleConfirmDelete() {
    if (!gameToDelete) return
    setIsDeleting(true)
    await onDelete(gameToDelete.id)
    setIsDeleting(false)
    setGameToDelete(null) 
  }

  return (
    <DataPanel title="Gestion de videojuegos">
      <div className="panel-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Buscar videojuego..." 
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
        />
        {canManage && (
          <button className="primary-button small" type="button" onClick={openCreateModal}>
            Agregar videojuego
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Titulo</th>
            <th>Genero</th>
            <th>Plataforma</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            {canManage && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {videojuegos.map((videojuego) => (
            <tr key={videojuego.id}>
              <td>
                <div className="table-cover">
                  {videojuego.imagen ? <img src={getImageUrl(videojuego.imagen)} alt={videojuego.titulo} /> : videojuego.titulo.slice(0, 2).toUpperCase()}
                </div>
              </td>
              <td>{videojuego.titulo}</td>
              <td>{videojuego.generos?.map((genero) => genero.nombre).join(', ') || 'Sin genero'}</td>
              <td>{videojuego.plataforma}</td>
              <td>${videojuego.precio}</td>
              <td>{videojuego.stock}</td>
              <td><StatusBadge status={videojuego.estado} /></td>
              {canManage && (
                <td>
                  <div className="table-actions">
                    <button className="table-action" type="button" onClick={() => openEditModal(videojuego)}>
                      Editar
                    </button>
                    {canDelete && (
                      <button 
                        className="table-action danger" 
                        type="button" 
                        onClick={() => setGameToDelete(videojuego)} // Abre el modal de confirmación
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {meta && meta.last_page > 1 && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            className="primary-button small" 
            type="button" 
            disabled={meta.current_page === 1} 
            onClick={() => onPageChange(meta.current_page - 1)}
          >
            Anterior
          </button>
          <span>Página {meta.current_page} de {meta.last_page}</span>
          <button 
            className="primary-button small" 
            type="button" 
            disabled={meta.current_page === meta.last_page} 
            onClick={() => onPageChange(meta.current_page + 1)}
          >
            Siguiente
          </button>
        </div>
      )}

      {modalOpen && (
        <GameFormModal
          videojuego={editingGame}
          onClose={() => setModalOpen(false)}
          onSubmit={async (payload) => {
            await onSave(payload, editingGame?.id)
            setModalOpen(false)
          }}
        />
      )}

      {/* NUEVO: RENDERIZADO DEL MODAL DE CONFIRMACIÓN */}
      {gameToDelete && (
        <ConfirmModal
          title="Eliminar videojuego"
          message={`¿Estás seguro de que deseas eliminar "${gameToDelete.titulo}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setGameToDelete(null)}
          isProcessing={isDeleting}
        />
      )}
    </DataPanel>
  )
}

function GameFormModal({ videojuego, onClose, onSubmit }) {
  const [form, setForm] = useState({
    titulo: videojuego?.titulo ?? '',
    descripcion: videojuego?.descripcion ?? '',
    plataforma: videojuego?.plataforma ?? 'PS5',
    precio: videojuego?.precio ?? '',
    stock: videojuego?.stock ?? '',
    imagen: videojuego?.imagen ?? '',
    estado: videojuego?.estado ?? 'activo',
  })
  const [errors, setErrors] = useState({}) 
  const [apiError, setApiError] = useState('')
  const [saving, setSaving] = useState(false)

  // Reglas de validación
  function validateField(field, value) {
    if (field === 'titulo' && !value.trim()) return 'El título es obligatorio.'
    if (field === 'descripcion' && !value.trim()) return 'La descripción es obligatoria.'
    if (field === 'precio' && (value === '' || Number(value) < 0)) return 'Ingresa un precio válido (mayor o igual a 0).'
    if (field === 'stock' && (value === '' || Number(value) < 0)) return 'Ingresa un stock válido (mayor o igual a 0).'
    return ''
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    // Validar en tiempo real al escribir
    if (['titulo', 'descripcion', 'precio', 'stock'].includes(field)) {
      const valToValidate = typeof value === 'string' ? value : String(value)
      setErrors((prev) => ({ ...prev, [field]: validateField(field, valToValidate) }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    // Validar todos los campos al intentar enviar
    const newErrors = {
      titulo: validateField('titulo', form.titulo),
      descripcion: validateField('descripcion', form.descripcion),
      precio: validateField('precio', String(form.precio)),
      stock: validateField('stock', String(form.stock)),
    }
    
    setErrors(newErrors)

    // Si algún mensaje no está vacío, detenemos el envío
    if (Object.values(newErrors).some(msg => msg !== '')) {
      return
    }

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('titulo', form.titulo)
      formData.append('descripcion', form.descripcion)
      formData.append('plataforma', form.plataforma)
      formData.append('precio', Number(form.precio))
      formData.append('stock', Number(form.stock))
      formData.append('estado', form.estado)

      if (form.imagen instanceof File) {
        formData.append('imagen', form.imagen)
      } else if (typeof form.imagen === 'string' && form.imagen !== '') {
        formData.append('imagen', form.imagen)
      }

      await onSubmit(formData)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal-card" onSubmit={handleSubmit}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Videojuegos</p>
            <h2>{videojuego ? 'Editar videojuego' : 'Agregar videojuego'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>X</button>
        </div>

        <label className="field">
          <span>Titulo</span>
          <input value={form.titulo} onChange={(event) => updateField('titulo', event.target.value)} />
          {errors.titulo && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.titulo}</small>}
        </label>

        <label className="field">
          <span>Descripcion</span>
          <textarea value={form.descripcion} onChange={(event) => updateField('descripcion', event.target.value)} />
          {errors.descripcion && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.descripcion}</small>}
        </label>

        <div className="form-grid">
          <label className="field">
            <span>Plataforma</span>
            <select value={form.plataforma} onChange={(event) => updateField('plataforma', event.target.value)}>
              <option value="PS5">PS5</option>
              <option value="Xbox Series X">Xbox Series X</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
              <option value="PC">PC</option>
              <option value="Multiplataforma">Multiplataforma</option>
            </select>
          </label>

          <label className="field">
            <span>Precio</span>
            <input type="number" min="0" step="0.01" value={form.precio} onChange={(event) => updateField('precio', event.target.value)} />
            {errors.precio && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.precio}</small>}
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Stock</span>
            <input type="number" min="0" value={form.stock} onChange={(event) => updateField('stock', event.target.value)} />
            {errors.stock && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.stock}</small>}
          </label>
        </div>

        <label className="field">
          <span>Imagen</span>
          <input 
            type="file" 
            accept="image/*"
            onChange={(event) => updateField('imagen', event.target.files[0])} 
          />
          {typeof form.imagen === 'string' && form.imagen && (
            <small style={{ marginTop: '5px', display: 'block', color: '#666' }}>
              Archivo actual guardado: {form.imagen.split('/').pop()}
            </small>
          )}
        </label>

        <label className="field">
          <span>Estado</span>
          <select value={form.estado} onChange={(event) => updateField('estado', event.target.value)}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
        </label>

        {apiError && <p className="form-error">{apiError}</p>}

        <div className="modal-actions">
          <button className="table-action" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary-button small" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

function OrdersTable({ pedidos = [], compact = false, canManage = false, onUpdateStatus }) {
  return (
    <DataPanel title={compact ? 'Ultimos pedidos' : 'Gestion de pedidos'}>
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            {canManage && <th>Accion</th>}
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.folio}</td>
              <td>{pedido.cliente?.nombre || 'Cliente'}</td>
              <td>{formatDate(pedido.fecha_pedido)}</td>
              <td>${pedido.total}</td>
              <td><StatusBadge status={pedido.estado} /></td>
              {canManage && (
                <td>
                  <select
                    className="status-select"
                    value={pedido.estado}
                    onChange={(event) => onUpdateStatus(pedido.id, event.target.value)}
                  >
                    <option value="pendiente">pendiente</option>
                    <option value="pagado">pagado</option>
                    <option value="enviado">enviado</option>
                    <option value="entregado">entregado</option>
                    <option value="cancelado">cancelado</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">Mostrando {pedidos.length} registros</div>
    </DataPanel>
  )
}

function CustomersTable({ usuarios = [], canManage = false, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function openCreateModal() { setEditingUser(null); setModalOpen(true) }
  function openEditModal(usuario) { setEditingUser(usuario); setModalOpen(true) }

  async function handleConfirmDelete() {
    if (!userToDelete) return
    setIsDeleting(true)
    await onDelete(userToDelete.id)
    setIsDeleting(false)
    setUserToDelete(null)
  }

  return (
    <DataPanel title="Usuarios registrados">
      {canManage && (
        <div className="panel-actions" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="primary-button small" type="button" onClick={openCreateModal}>
            Agregar usuario
          </button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>Rol</th>
            {canManage && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono || '-'}</td>
              <td><StatusBadge status={usuario.rol} /></td>
              {canManage && (
                <td>
                  <div className="table-actions">
                    <button className="table-action" type="button" onClick={() => openEditModal(usuario)}>
                      Editar
                    </button>
                    <button className="table-action danger" type="button" onClick={() => setUserToDelete(usuario)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <UserFormModal
          usuario={editingUser}
          onClose={() => setModalOpen(false)}
          onSubmit={async (payload) => {
            await onSave(payload, editingUser?.id)
            setModalOpen(false)
          }}
        />
      )}

      {userToDelete && (
        <ConfirmModal
          title="Eliminar cuenta de usuario"
          message={`¿Estás seguro de que deseas eliminar a "${userToDelete.nombre}"? Esta acción borrará su acceso por completo.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setUserToDelete(null)}
          isProcessing={isDeleting}
        />
      )}
    </DataPanel>
  )
}

function UserFormModal({ usuario, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? '',
    email: usuario?.email ?? '',
    password: '',
    telefono: usuario?.telefono ?? '',
    rol: usuario?.rol ?? 'cliente',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [saving, setSaving] = useState(false)

  function validateField(field, value) {
    if (field === 'nombre' && !value.trim()) return 'El nombre es obligatorio.'
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo válido.'
    if (field === 'password' && !usuario) { // Solo es obligatoria al crear, opcional al editar
      if (!value) return 'La contraseña es obligatoria.'
      if (value.length < 8) return 'Mínimo 8 caracteres.'
      if (!/[A-Z]/.test(value)) return 'Falta al menos una mayúscula.'
      if (!/[0-9]/.test(value)) return 'Falta al menos un número.'
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Falta un carácter especial.'
    }
    return ''
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (['nombre', 'email', 'password'].includes(field)) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    const newErrors = {
      nombre: validateField('nombre', form.nombre),
      email: validateField('email', form.email),
      password: validateField('password', form.password),
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(msg => msg !== '')) return

    setSaving(true)
    try {
      const payload = { ...form }
      if (usuario && !payload.password) {
        delete payload.password 
      }
      await onSubmit(payload)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal-card" onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Gestión de Usuarios</p>
            <h2>{usuario ? 'Editar usuario' : 'Registrar usuario'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>X</button>
        </div>

        <label className="field">
          <span>Nombre completo</span>
          <input value={form.nombre} onChange={(e) => updateField('nombre', e.target.value)} />
          {errors.nombre && <small style={{ color: '#dc2626' }}>{errors.nombre}</small>}
        </label>

        <div className="form-grid">
          <label className="field">
            <span>Correo electrónico</span>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            {errors.email && <small style={{ color: '#dc2626' }}>{errors.email}</small>}
          </label>
          <label className="field">
            <span>Teléfono</span>
            <input value={form.telefono} onChange={(e) => updateField('telefono', e.target.value)} />
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Contraseña {usuario && '(Opcional)'}</span>
            <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} />
            {errors.password && <small style={{ color: '#dc2626' }}>{errors.password}</small>}
          </label>
          
          <label className="field">
            <span>Nivel de acceso (Rol)</span>
            <select value={form.rol} onChange={(e) => updateField('rol', e.target.value)}>
              <option value="cliente">Cliente</option>
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
        </div>

        {apiError && <p className="form-error">{apiError}</p>}

        <div className="modal-actions">
          <button className="table-action" type="button" onClick={onClose}>Cancelar</button>
          <button className="primary-button small" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar usuario'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ReportsPanel({ reporte }) {
  const pedidosPorEstado = reporte?.pedidos_por_estado ?? {}

  return (
    <DataPanel title="Reportes">
      <div className="report-grid">
        <Metric label="Ingresos totales" value={formatCurrency(reporte?.ingresos_totales ?? 0)} tone="green" />
        <Metric label="Ingresos de hoy" value={formatCurrency(reporte?.ingresos_hoy ?? 0)} tone="blue" />
        <Metric label="Pedidos de hoy" value={reporte?.pedidos_hoy ?? 0} tone="violet" />
        <Metric label="Pedidos totales" value={reporte?.pedidos_totales ?? 0} tone="green" />
        <Metric label="Stock bajo" value={reporte?.stock_bajo ?? 0} tone="violet" />
      </div>

      <div className="report-status">
        <h3>Pedidos por estado</h3>
        {Object.keys(pedidosPorEstado).length === 0 ? (
          <p className="empty-state">Todavia no hay pedidos registrados.</p>
        ) : (
          <div className="status-summary">
            {Object.entries(pedidosPorEstado).map(([estado, total]) => (
              <span key={estado}>
                {estado}: <strong>{total}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </DataPanel>
  )
}

function SettingsPanel() {
  return (
    <DataPanel title="Configuracion del sistema">
      <p className="panel-copy">
        Esta seccion sera solo para administradores. Aqui iran ajustes de tienda, notificaciones y datos de contacto.
      </p>
    </DataPanel>
  )
}

function CartPanel({ carrito, onConfirm, onUpdateItem, onRemoveItem }) {
  const detalles = carrito?.detalles ?? []

  return (
    <DataPanel title="Carrito de compras">
      {detalles.length === 0 ? (
        <p className="empty-state">Tu carrito esta vacio. Agrega videojuegos desde el catalogo.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Videojuego</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle) => (
              <tr key={detalle.id}>
                <td>{detalle.videojuego?.titulo}</td>
                <td>${detalle.precio_unitario}</td>
                <td>
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => onUpdateItem(detalle, Math.max(1, detalle.cantidad - 1))}
                      disabled={detalle.cantidad <= 1}
                    >
                      -
                    </button>
                    <span>{detalle.cantidad}</span>
                    <button type="button" onClick={() => onUpdateItem(detalle, detalle.cantidad + 1)}>
                      +
                    </button>
                  </div>
                </td>
                <td>${detalle.subtotal}</td>
                <td>
                  <button className="table-action danger" type="button" onClick={() => onRemoveItem(detalle.id)}>
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="cart-total">
        <span>Total</span>
        <strong>${carrito?.total ?? 0}</strong>
        <button type="button" onClick={onConfirm} disabled={!detalles.length}>
          Confirmar compra
        </button>
      </div>
    </DataPanel>
  )
}

function ProfilePanel({ usuario, token }) {
  const [form, setForm] = useState({
    nombre: usuario.nombre || '',
    telefono: usuario.telefono || '',
    imagen_perfil: usuario.imagen_perfil || '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [photoSaving, setPhotoSaving] = useState(false)

  function validateField(field, value) {
    if (field === 'nombre' && !value.trim()) return 'El nombre es obligatorio.'
    if (field === 'telefono' && value && !/^[0-9+\-\s()]{8,15}$/.test(value)) return 'Ingresa un teléfono válido.'
    return ''
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setApiError('')
    setSuccessMsg('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setApiError('La foto debe ser JPG, PNG o WEBP.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setApiError('La foto no debe pesar mas de 2 MB.')
      return
    }

    const formData = new FormData()
    formData.append('foto_perfil', file)

    setPhotoSaving(true)
    try {
      const response = await apiRequest(`/usuarios/${usuario.id}/foto-perfil`, {
        method: 'POST',
        token,
        body: formData,
      })

      const updatedUser = response.data
      setForm((current) => ({ ...current, imagen_perfil: updatedUser.imagen_perfil || '' }))
      localStorage.setItem('gamewolf_usuario', JSON.stringify(updatedUser))
      window.dispatchEvent(new CustomEvent('usuario-actualizado', { detail: updatedUser }))
      setSuccessMsg('Foto de perfil actualizada correctamente.')
    } catch (err) {
      setApiError(err.message || 'No se pudo actualizar la foto de perfil.')
    } finally {
      setPhotoSaving(false)
      event.target.value = ''
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')
    setSuccessMsg('')

    const newErrors = {
      nombre: validateField('nombre', form.nombre),
      telefono: validateField('telefono', form.telefono),
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(msg => msg !== '')) return

    setSaving(true)
    try {
      // Usamos el endpoint PUT hacia el ID del usuario
      const response = await apiRequest(`/usuarios/${usuario.id}`, {
        method: 'PUT',
        token,
        body: {
          nombre: form.nombre,
          telefono: form.telefono,
        },
      })
      
      setSuccessMsg('Perfil actualizado correctamente.')
      
      // Actualizamos los datos locales para que persistan si recarga la página
      const updatedUser = response.data ?? { ...usuario, nombre: form.nombre, telefono: form.telefono }
      localStorage.setItem('gamewolf_usuario', JSON.stringify(updatedUser))
      
      // Disparamos el evento para que App.jsx actualice la barra superior instantáneamente
      window.dispatchEvent(new CustomEvent('usuario-actualizado', { detail: updatedUser }))

    } catch (err) {
      setApiError(err.message || 'No se pudo actualizar el perfil. Verifica tu conexión.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DataPanel title="Perfil del cliente">
      <form className="profile-form" onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="profile-photo-preview">
          {form.imagen_perfil ? (
            <img src={getImageUrl(form.imagen_perfil)} alt="Vista previa de perfil" />
          ) : (
            <span>{form.nombre.slice(0, 1) || 'G'}</span>
          )}
        </div>

        <p className="panel-copy" style={{ marginBottom: '20px' }}>
          Actualiza tus datos de contacto. Estos se utilizarán para la entrega de tus pedidos.
        </p>

        <label className="field">
          <span>Nombre completo</span>
          <input value={form.nombre} onChange={(e) => updateField('nombre', e.target.value)} />
          {errors.nombre && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.nombre}</small>}
        </label>
        
        <label className="field">
          <span>Correo electrónico (Identificador fijo)</span>
          <input 
            value={usuario.email} 
            readOnly 
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }} 
          />
        </label>
        
        <label className="field">
          <span>Teléfono</span>
          <input value={form.telefono} onChange={(e) => updateField('telefono', e.target.value)} />
          {errors.telefono && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.telefono}</small>}
        </label>

        <label className="field">
          <span>Foto de perfil</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} disabled={photoSaving} />
          <small style={{ color: '#667085', marginTop: '4px' }}>
            {photoSaving ? 'Subiendo foto...' : 'Formatos permitidos: JPG, PNG o WEBP. Maximo 2 MB.'}
          </small>
        </label>

        {apiError && <p className="form-error">{apiError}</p>}
        {successMsg && <p className="toast-message" style={{ position: 'relative', marginTop: '10px', display: 'block' }}>{successMsg}</p>}

        <div style={{ marginTop: '20px' }}>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </DataPanel>
  )
}

function DataPanel({ title, children }) {
  return (
    <article className="data-panel">
      <h2>{title}</h2>
      {children}
    </article>
  )
}

function StatusBadge({ status }) {
  const className = String(status).toLowerCase().replaceAll(' ', '-')
  return <span className={`status ${className}`}>{status}</span>
}

function useDashboardData(token, rol) {
  const [state, setState] = useState({ videojuegos: [], metaVideojuegos: null, pedidos: [], usuarios: [], reporte: null, loading: true, error: '', notice: '' })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  function showNotice(message) {
    setState((current) => ({ ...current, notice: message }))
    window.clearTimeout(showNotice.timeoutId)
    showNotice.timeoutId = window.setTimeout(() => {
      setState((current) => ({ ...current, notice: '' }))
    }, 2600)
  }

  useEffect(() => {
    let active = true

    async function load() {
      // Activamos el loading al cambiar de página o buscar
      setState((current) => ({ ...current, loading: true, error: '' }))
      
      try {
        // Armamos los parámetros para la URL
        const queryParams = new URLSearchParams()
        if (search) queryParams.append('search', search)
        queryParams.append('page', page)

        const [videojuegosRes, pedidosRes, usuariosRes, reporteRes] = await Promise.all([
          apiRequest(`/videojuegos?${queryParams.toString()}`), // URL con filtros
          apiRequest('/pedidos', { token }),
          ['admin', 'empleado'].includes(rol) ? apiRequest('/usuarios', { token }) : Promise.resolve({ data: [] }),
          ['admin', 'empleado'].includes(rol) ? apiRequest('/reportes/resumen', { token }) : Promise.resolve({ data: null }),
        ])

        if (!active) return
        setState({
          videojuegos: videojuegosRes.data ?? [],
          metaVideojuegos: videojuegosRes.meta ?? null, // 4. Guardamos la metadata
          pedidos: pedidosRes.data ?? [],
          usuarios: usuariosRes.data ?? [],
          reporte: reporteRes.data ?? null,
          loading: false,
          error: '',
          notice: '',
        })
      } catch (err) {
        if (!active) return
        setState((current) => ({ ...current, loading: false, error: err.message }))
      }
    }
    const delay = setTimeout(() => { load() }, 300)
    return () => {
      active = false
      clearTimeout(delay)
    }
  }, [token, rol, search, page])

  async function updateOrderStatus(pedidoId, estado) {
    setState((current) => ({ ...current, error: '' }))

    try {
      const response = await apiRequest(`/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        token,
        body: { estado },
      })

      setState((current) => ({
        ...current,
        pedidos: current.pedidos.map((pedido) => (pedido.id === pedidoId ? response.data : pedido)),
      }))
      showNotice('Estado del pedido actualizado.')
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
    }
  }

  async function saveGame(payload, videojuegoId = null) {
    setState((current) => ({ ...current, error: '' }))

    try {
      let method = videojuegoId ? 'PUT' : 'POST'
      let body = payload

      // PHP no lee archivos físicos en peticiones PUT directas.
      // Convertimos a POST y agregamos _method = PUT al FormData.
      if (payload instanceof FormData && videojuegoId) {
        payload.append('_method', 'PUT')
        method = 'POST'
      }

      const response = await apiRequest(videojuegoId ? `/videojuegos/${videojuegoId}` : '/videojuegos', {
        method,
        token,
        body,
      })

      setState((current) => ({
        ...current,
        videojuegos: videojuegoId
          ? current.videojuegos.map((item) => (item.id === videojuegoId ? response.data : item))
          : [response.data, ...current.videojuegos],
      }))
      showNotice(videojuegoId ? 'Videojuego actualizado.' : 'Videojuego agregado.')
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
      throw err
    }
  }

  async function deleteGame(videojuegoId) {
    setState((current) => ({ ...current, error: '' }))

    try {
      const response = await apiRequest(`/videojuegos/${videojuegoId}`, {
        method: 'DELETE',
        token,
      })

      setState((current) => ({
        ...current,
        videojuegos: current.videojuegos.filter((item) => item.id !== videojuegoId),
      }))
      showNotice(response.mensaje || 'Videojuego eliminado.')
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
    }
  }
  
  async function saveUser(payload, usuarioId = null) {
    setState((current) => ({ ...current, error: '' }))
    try {
      const method = usuarioId ? 'PUT' : 'POST'
      const response = await apiRequest(usuarioId ? `/usuarios/${usuarioId}` : '/usuarios', {
        method,
        token,
        body: payload,
      })
      setState((current) => ({
        ...current,
        usuarios: usuarioId
          ? current.usuarios.map((item) => (item.id === usuarioId ? response.data : item))
          : [response.data, ...current.usuarios],
      }))
      showNotice(usuarioId ? 'Usuario actualizado.' : 'Usuario creado.')
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
      throw err
    }
  }

  async function deleteUser(usuarioId) {
    setState((current) => ({ ...current, error: '' }))
    try {
      const response = await apiRequest(`/usuarios/${usuarioId}`, { method: 'DELETE', token })
      setState((current) => ({
        ...current,
        usuarios: current.usuarios.filter((item) => item.id !== usuarioId),
      }))
      showNotice(response.mensaje || 'Usuario eliminado.')
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
    }
  }
  
  return { ...state, saveGame, deleteGame, updateOrderStatus, search, setSearch, page, setPage, saveUser, deleteUser }
}

function useClientData(token) {
  const [videojuegos, setVideojuegos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [carrito, setCarrito] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function showNotice(message) {
    setNotice(message)
    window.clearTimeout(showNotice.timeoutId)
    showNotice.timeoutId = window.setTimeout(() => setNotice(''), 2600)
  }

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [videojuegosRes, pedidosRes, carritoRes] = await Promise.all([
        apiRequest('/videojuegos'),
        apiRequest('/pedidos', { token }),
        apiRequest('/carrito', { token }),
      ])

      setVideojuegos(videojuegosRes.data ?? [])
      setPedidos(pedidosRes.data ?? [])
      setCarrito(carritoRes.data ?? carritoRes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [token])

  async function addToCart(videojuegoId) {
    setError('')
    try {
      const response = await apiRequest('/carrito/articulos', {
        method: 'POST',
        token,
        body: { videojuego_id: videojuegoId, cantidad: 1 },
      })
      setCarrito(response.data)
      showNotice('Videojuego agregado al carrito.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateCartItem(detalle, cantidad) {
    setError('')
    try {
      const response = await apiRequest(`/carrito/articulos/${detalle.id}`, {
        method: 'PUT',
        token,
        body: {
          videojuego_id: detalle.videojuego.id,
          cantidad,
        },
      })
      setCarrito(response.data)
      showNotice('Cantidad actualizada.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeCartItem(detalleId) {
    setError('')
    try {
      const response = await apiRequest(`/carrito/articulos/${detalleId}`, {
        method: 'DELETE',
        token,
      })
      setCarrito(response.data)
      showNotice('Videojuego eliminado del carrito.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function createOrder() {
    setError('')
    try {
      await apiRequest('/pedidos', { method: 'POST', token, body: {} })
      await load()
      showNotice('Compra confirmada correctamente.')
    } catch (err) {
      setError(err.message)
    }
  }

  return { videojuegos, pedidos, carrito, loading, error, notice, addToCart, updateCartItem, removeCartItem, createOrder }
}

async function apiRequest(path, options = {}) {
  // Detectamos si el cuerpo es FormData para archivos
  const isFormData = options.body instanceof FormData

  const headers = {
    Accept: 'application/json',
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
  }

  // Si NO es FormData, le ponemos el Content-Type de JSON
  if (options.body && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    // Si es FormData se manda tal cual, si no, se convierte a JSON
    body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const firstValidationError = data.errors ? Object.values(data.errors).flat()[0] : null
    throw new Error(firstValidationError || data.mensaje || data.message || 'Error de conexion con la API.')
  }

  return data
}

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('es-MX').format(new Date(value))
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function navIcon(item) {
  const icons = {
    Inicio: <Home size={23} strokeWidth={2.5} />,
    Videojuegos: <Gamepad2 size={23} strokeWidth={2.5} />,
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
function ConfirmModal({ title, message, onConfirm, onCancel, isProcessing }) {
  return (
    <div className="modal-backdrop" role="presentation" style={{ zIndex: 100 }}>
      <div className="modal-card" style={{ maxWidth: '400px' }}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Confirmación</p>
            <h2 style={{ fontSize: '1.25rem' }}>{title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onCancel} disabled={isProcessing}>X</button>
        </div>
        
        <p style={{ padding: '15px 0', color: '#4b5563', lineHeight: '1.5' }}>
          {message}
        </p>

        <div className="modal-actions" style={{ marginTop: '10px' }}>
          <button className="table-action" type="button" onClick={onCancel} disabled={isProcessing}>
            Cancelar
          </button>
          <button 
            className="primary-button small" 
            style={{ backgroundColor: '#dc2626' }} 
            type="button" 
            onClick={onConfirm} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
