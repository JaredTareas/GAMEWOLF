import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { apiRequest } from '../../services/api'
import { getImageUrl } from '../../utils/imagenes'
import { formatCurrency, formatDate } from '../../utils/formato'
import { useClientData } from './useClientData'
import { useDashboardData } from './useDashboardData'

export default function Content({ usuario, token, activeView }) {
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
    metaPedidos,
    usuarios,
    metaUsuarios,
    clientes,
    metaClientes,
    generos,
    metaGeneros,
    reporte,
    loading,
    error,
    notice,
    saveGame,
    deleteGame,
    updateOrderStatus,
    videojuegosSearch,
    setVideojuegosSearch,
    videojuegosPage,
    setVideojuegosPage,
    pedidosSearch,
    setPedidosSearch,
    pedidosEstado,
    setPedidosEstado,
    pedidosPage,
    setPedidosPage,
    usuariosSearch,
    setUsuariosSearch,
    usuariosRol,
    setUsuariosRol,
    usuariosPage,
    setUsuariosPage,
    clientesSearch,
    setClientesSearch,
    clientesPage,
    setClientesPage,
    saveUser,
    deleteUser,
    saveGenero,
    deleteGenero,
    generosSearch,
    setGenerosSearch,
    generosPage,
    setGenerosPage,
  } = useDashboardData(token, usuario.rol)

  return (
    <section className="content">
      <PageHeading title={title} subtitle="Resumen operativo de la tienda GameWolf" />

      {error && <p className="form-error">{error}</p>}
      {notice && <p className="toast-message">{notice}</p>}
      {loading && <p className="loading-text">Cargando informacion...</p>}
      {loading && <LoadingBlock message="Actualizando datos del panel..." />}

      {activeView === 'Inicio' && (
        <>
          <div className="metrics-grid">
            <Metric label="Videojuegos disponibles" value={metaVideojuegos?.total ?? videojuegos.length} tone="blue" />
            <Metric label="Pedidos registrados" value={metaPedidos?.total ?? pedidos.length} tone="violet" />
            <Metric label="Usuarios registrados" value={metaUsuarios?.total ?? '-'} tone="green" />
          </div>
          <OrdersTable pedidos={pedidos.slice(0, 5)} compact canManage onUpdateStatus={updateOrderStatus} />
        </>
      )}

      {activeView === 'Videojuegos' && (
        <GamesTable
          videojuegos={videojuegos}
          meta={metaVideojuegos}
          generos={generos}
          search={videojuegosSearch}
          onSearch={(value) => { setVideojuegosSearch(value); setVideojuegosPage(1) }}
          onPageChange={setVideojuegosPage}
          canManage
          onSave={saveGame}
          onDelete={deleteGame}
          canDelete={usuario.rol === 'admin'}
        />
      )}
      {activeView === 'Géneros' && usuario.rol === 'admin' && (
        <GenresTable
          generos={generos}
          meta={metaGeneros}
          search={generosSearch}
          onSearch={(value) => { setGenerosSearch(value); setGenerosPage(1) }}
          onPageChange={setGenerosPage}
          onSave={saveGenero}
          onDelete={deleteGenero}
        />
      )}
      {activeView === 'Pedidos' && (
        <OrdersTable
          pedidos={pedidos}
          meta={metaPedidos}
          search={pedidosSearch}
          estado={pedidosEstado}
          onSearch={(value) => { setPedidosSearch(value); setPedidosPage(1) }}
          onEstadoChange={(value) => { setPedidosEstado(value); setPedidosPage(1) }}
          onPageChange={setPedidosPage}
          canManage
          onUpdateStatus={updateOrderStatus}
        />
      )}
      {activeView === 'Clientes' && (
        <CustomersTable
          title="Clientes registrados"
          usuarios={clientes}
          meta={metaClientes}
          search={clientesSearch}
          onSearch={(value) => { setClientesSearch(value); setClientesPage(1) }}
          onPageChange={setClientesPage}
        />
      )}

      {activeView === 'Usuarios' && (
        <CustomersTable
          usuarios={usuarios}
          meta={metaUsuarios}
          search={usuariosSearch}
          rol={usuariosRol}
          showRoleFilter
          onSearch={(value) => { setUsuariosSearch(value); setUsuariosPage(1) }}
          onRolChange={(value) => { setUsuariosRol(value); setUsuariosPage(1) }}
          onPageChange={setUsuariosPage}
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
  const {
    videojuegos,
    metaVideojuegos,
    pedidos,
    metaPedidos,
    carrito,
    loading,
    error,
    notice,
    addingGameId,
    cartItemLoadingId,
    cartActionLoading,
    addToCart,
    updateCartItem,
    removeCartItem,
    createOrder,
    catalogoSearch,
    setCatalogoSearch,
    catalogoPage,
    setCatalogoPage,
    pedidosSearch,
    setPedidosSearch,
    pedidosEstado,
    setPedidosEstado,
    pedidosPage,
    setPedidosPage,
  } = useClientData(token)

  return (
    <section className="content">
      <PageHeading title={title} subtitle="Compra videojuegos y consulta el estado de tus pedidos" />

      {error && <p className="form-error">{error}</p>}
      {notice && <p className="toast-message">{notice}</p>}
      {loading && <p className="loading-text">Cargando informacion...</p>}
      {loading && <LoadingBlock message="Cargando catalogo, pedidos y carrito..." />}

      {activeView === 'Catalogo' && (
        <DataPanel title="Catálogo de videojuegos">
          <div className="panel-actions catalog-actions">
            <input
              type="search"
              placeholder="Buscar videojuego..."
              value={catalogoSearch}
              onChange={(event) => { setCatalogoSearch(event.target.value); setCatalogoPage(1) }}
            />
          </div>
        <div className="catalog-grid">
          {videojuegos.map((videojuego) => (
            <article className="game-card" key={videojuego.id}>
              <div className="game-cover">
                {videojuego.imagen ? <img src={getImageUrl(videojuego.imagen)} alt={videojuego.titulo} /> : videojuego.titulo.slice(0, 2).toUpperCase()}
              </div>
              <h3>{videojuego.titulo}</h3>
              <p>{videojuego.plataforma}</p>
              <p>{videojuego.generos?.map((genero) => genero.nombre).join(', ') || 'Sin género'}</p>
              <strong>${videojuego.precio}</strong>
              <button
                type="button"
                onClick={() => addToCart(videojuego.id)}
                disabled={addingGameId === videojuego.id}
              >
                {addingGameId === videojuego.id ? 'Agregando...' : 'Agregar al carrito'}
              </button>
            </article>
          ))}
        </div>
          <PaginationControls meta={metaVideojuegos} onPageChange={setCatalogoPage} />
        </DataPanel>
      )}

      {activeView === 'Carrito' && (
        <CartPanel
          carrito={carrito}
          onConfirm={createOrder}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeCartItem}
          cartItemLoadingId={cartItemLoadingId}
          cartActionLoading={cartActionLoading}
        />
      )}
      {activeView === 'Mis pedidos' && (
        <OrdersTable
          title="Mis pedidos"
          pedidos={pedidos}
          meta={metaPedidos}
          search={pedidosSearch}
          estado={pedidosEstado}
          onSearch={(value) => { setPedidosSearch(value); setPedidosPage(1) }}
          onEstadoChange={(value) => { setPedidosEstado(value); setPedidosPage(1) }}
          onPageChange={setPedidosPage}
        />
      )}
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

function LoadingBlock({ message = 'Cargando datos...' }) {
  return (
    <div className="loading-block" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <strong>{message}</strong>
    </div>
  )
}

function GamesTable({ videojuegos, meta, generos = [], search, onSearch, onPageChange, canManage = false, canDelete = false, onSave, onDelete }) {
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
              <td>{videojuego.generos?.map((genero) => genero.nombre).join(', ') || 'Sin género'}</td>
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
          generos={generos}
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

function GameFormModal({ videojuego, generos = [], onClose, onSubmit }) {
  const [form, setForm] = useState({
    titulo: videojuego?.titulo ?? '',
    descripcion: videojuego?.descripcion ?? '',
    plataforma: videojuego?.plataforma ?? 'PS5',
    precio: videojuego?.precio ?? '',
    stock: videojuego?.stock ?? '',
    imagen: videojuego?.imagen ?? '',
    estado: videojuego?.estado ?? 'activo',
    genero_ids: videojuego?.generos?.map((genero) => genero.id) ?? [],
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
    if (field === 'imagen' && value instanceof File) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(value.type)) {
        return 'La imagen debe ser JPG, PNG o WEBP.'
      }

      if (value.size > 2 * 1024 * 1024) {
        return 'La imagen no debe pesar más de 2 MB.'
      }
    }

    return ''
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    // Validar en tiempo real al escribir
    if (['titulo', 'descripcion', 'precio', 'stock', 'imagen'].includes(field)) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  function toggleGenero(generoId) {
    setForm((current) => {
      const existe = current.genero_ids.includes(generoId)

      return {
        ...current,
        genero_ids: existe
          ? current.genero_ids.filter((id) => id !== generoId)
          : [...current.genero_ids, generoId],
      }
    })
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
      imagen: validateField('imagen', form.imagen),
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
      form.genero_ids.forEach((generoId) => {
        formData.append('genero_ids[]', generoId)
      })

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

        <label className="field">
          <span>Géneros</span>
          <div className="checkbox-list">
            {generos.length === 0 ? (
              <small style={{ color: '#667085' }}>Primero registra géneros desde el módulo Géneros.</small>
            ) : (
              generos.map((genero) => (
                <label className="checkbox-option" key={genero.id}>
                  <input
                    type="checkbox"
                    checked={form.genero_ids.includes(genero.id)}
                    onChange={() => toggleGenero(genero.id)}
                  />
                  <span>{genero.nombre}</span>
                </label>
              ))
            )}
          </div>
        </label>

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
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => updateField('imagen', event.target.files[0])} 
          />
          {errors.imagen && <small style={{ color: '#dc2626', marginTop: '4px' }}>{errors.imagen}</small>}
          {!errors.imagen && <small style={{ color: '#667085', marginTop: '4px' }}>Formatos permitidos: JPG, PNG o WEBP. Máximo 2 MB.</small>}
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

function GenresTable({ generos, meta, search, onSearch, onPageChange, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGenre, setEditingGenre] = useState(null)
  const [genreToDelete, setGenreToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function openCreateModal() {
    setEditingGenre(null)
    setModalOpen(true)
  }

  function openEditModal(genero) {
    setEditingGenre(genero)
    setModalOpen(true)
  }

  async function handleConfirmDelete() {
    if (!genreToDelete) return

    setIsDeleting(true)
    await onDelete(genreToDelete.id)
    setIsDeleting(false)
    setGenreToDelete(null)
  }

  return (
    <DataPanel title="Gestión de géneros">
      <div className="panel-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Buscar género..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
        />
        <button className="primary-button small" type="button" onClick={openCreateModal}>
          Agregar género
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Slug</th>
            <th>Videojuegos asignados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {generos.map((genero) => (
            <tr key={genero.id}>
              <td>{genero.nombre}</td>
              <td>{genero.slug}</td>
              <td>{genero.videojuegos_count ?? 0}</td>
              <td>
                <div className="table-actions">
                  <button className="table-action" type="button" onClick={() => openEditModal(genero)}>
                    Editar
                  </button>
                  <button className="table-action danger" type="button" onClick={() => setGenreToDelete(genero)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {generos.length === 0 && (
        <p className="empty-state">Todavía no hay géneros registrados.</p>
      )}

      <PaginationControls meta={meta} onPageChange={onPageChange} />

      {modalOpen && (
        <GenreFormModal
          genero={editingGenre}
          onClose={() => setModalOpen(false)}
          onSubmit={async (payload) => {
            await onSave(payload, editingGenre?.id)
            setModalOpen(false)
          }}
        />
      )}

      {genreToDelete && (
        <ConfirmModal
          title="Eliminar género"
          message={`¿Estás seguro de que deseas eliminar "${genreToDelete.nombre}"? Solo se podrá eliminar si no está asignado a videojuegos.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setGenreToDelete(null)}
          isProcessing={isDeleting}
        />
      )}
    </DataPanel>
  )
}

function GenreFormModal({ genero, onClose, onSubmit }) {
  const [nombre, setNombre] = useState(genero?.nombre ?? '')
  const [error, setError] = useState('')
  const [apiError, setApiError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    if (!nombre.trim()) {
      setError('El nombre del género es obligatorio.')
      return
    }

    setSaving(true)
    try {
      await onSubmit({ nombre: nombre.trim() })
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
            <p className="eyebrow">Géneros</p>
            <h2>{genero ? 'Editar género' : 'Agregar género'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>X</button>
        </div>

        <label className="field">
          <span>Nombre del género</span>
          <input
            value={nombre}
            onChange={(event) => {
              setNombre(event.target.value)
              setError(event.target.value.trim() ? '' : 'El nombre del género es obligatorio.')
            }}
          />
          {error && <small style={{ color: '#dc2626', marginTop: '4px' }}>{error}</small>}
        </label>

        {apiError && <p className="form-error">{apiError}</p>}

        <div className="modal-actions">
          <button className="table-action" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary-button small" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar género'}
          </button>
        </div>
      </form>
    </div>
  )
}

function PaginationControls({ meta, onPageChange }) {
  if (!meta) return null

  return (
    <div className="pagination" aria-label="Paginación">
      <span>Mostrando {meta.from ?? 0}-{meta.to ?? 0} de {meta.total ?? 0} registros</span>
      {meta.last_page > 1 && (
        <div className="pagination-controls">
          <button
            className="primary-button small"
            type="button"
            disabled={meta.current_page === 1}
            onClick={() => onPageChange?.(meta.current_page - 1)}
          >
            Anterior
          </button>
          <span>Página {meta.current_page} de {meta.last_page}</span>
          <button
            className="primary-button small"
            type="button"
            disabled={meta.current_page === meta.last_page}
            onClick={() => onPageChange?.(meta.current_page + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

function OrdersTable({
  pedidos = [],
  meta = null,
  compact = false,
  title,
  canManage = false,
  onUpdateStatus,
  search = '',
  estado = '',
  onSearch,
  onEstadoChange,
  onPageChange,
}) {
  const [pendingStatusChange, setPendingStatusChange] = useState(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  function requestStatusChange(pedido, estado) {
    if (pedido.estado === estado) return

    setPendingStatusChange({
      pedidoId: pedido.id,
      folio: pedido.folio,
      previousEstado: pedido.estado,
      estado,
    })
  }

  async function confirmStatusChange() {
    if (!pendingStatusChange) return

    setIsUpdatingStatus(true)
    try {
      await onUpdateStatus?.(pendingStatusChange.pedidoId, pendingStatusChange.estado)
      setPendingStatusChange(null)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <DataPanel title={title || (compact ? 'Últimos pedidos' : 'Gestión de pedidos')}>
      {!compact && onSearch && (
        <div className="panel-actions list-filters">
          <input
            type="search"
            placeholder="Buscar por folio o cliente..."
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          <select value={estado} onChange={(event) => onEstadoChange?.(event.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pendiente">pendiente</option>
            <option value="pagado">pagado</option>
            <option value="enviado">enviado</option>
            <option value="entregado">entregado</option>
            <option value="cancelado">cancelado</option>
          </select>
        </div>
      )}
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
                    onChange={(event) => requestStatusChange(pedido, event.target.value)}
                    disabled={isUpdatingStatus}
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
      {meta ? <PaginationControls meta={meta} onPageChange={onPageChange} /> : <div className="pagination">Mostrando {pedidos.length} registros</div>}

      {pendingStatusChange && (
        <ConfirmModal
          title="Actualizar estado del pedido"
          message={`¿Cambiar el pedido ${pendingStatusChange.folio} de "${pendingStatusChange.previousEstado}" a "${pendingStatusChange.estado}"? Se enviará una notificación de WhatsApp al cliente.`}
          confirmLabel="Actualizar y notificar"
          isDanger={false}
          onConfirm={confirmStatusChange}
          onCancel={() => setPendingStatusChange(null)}
          isProcessing={isUpdatingStatus}
        />
      )}
    </DataPanel>
  )
}

function CustomersTable({
  title = 'Usuarios registrados',
  usuarios = [],
  meta = null,
  canManage = false,
  onSave,
  onDelete,
  search = '',
  rol = '',
  showRoleFilter = false,
  onSearch,
  onRolChange,
  onPageChange,
}) {
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
    <DataPanel title={title}>
      <div className="panel-actions list-filters">
        {onSearch && (
          <input
            type="search"
            placeholder={title === 'Clientes registrados' ? 'Buscar cliente...' : 'Buscar usuario...'}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        )}
        {showRoleFilter && (
          <select value={rol} onChange={(event) => onRolChange?.(event.target.value)}>
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="empleado">Empleado</option>
            <option value="cliente">Cliente</option>
          </select>
        )}
        {canManage && (
          <button className="primary-button small" type="button" onClick={openCreateModal}>
            Agregar usuario
          </button>
        )}
      </div>
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

      {meta && <PaginationControls meta={meta} onPageChange={onPageChange} />}

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
    if (field === 'telefono' && value && !/^[0-9+\-\s()]{8,15}$/.test(value)) return 'Ingresa un teléfono válido.'
    if (field === 'password') {
      if (!value && !usuario) return 'La contraseña es obligatoria.'
      if (value && value.length < 8) return 'Mínimo 8 caracteres.'
      if (value && !/[A-Z]/.test(value)) return 'Falta al menos una mayúscula.'
      if (value && !/[0-9]/.test(value)) return 'Falta al menos un número.'
      if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Falta un carácter especial.'
    }
    return ''
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (['nombre', 'email', 'telefono', 'password'].includes(field)) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    const newErrors = {
      nombre: validateField('nombre', form.nombre),
      email: validateField('email', form.email),
      telefono: validateField('telefono', form.telefono),
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
            {errors.telefono && <small style={{ color: '#dc2626' }}>{errors.telefono}</small>}
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
          <p className="empty-state">Todavía no hay pedidos registrados.</p>
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
    <DataPanel title="Configuración del sistema">
      <p className="panel-copy">
        Esta sección será solo para administradores. Aquí irán ajustes de tienda, notificaciones y datos de contacto.
      </p>
    </DataPanel>
  )
}

function CartPanel({ carrito, onConfirm, onUpdateItem, onRemoveItem, cartItemLoadingId = null, cartActionLoading = '' }) {
  const detalles = carrito?.detalles ?? []
  const [detalleToRemove, setDetalleToRemove] = useState(null)
  const [purchaseToConfirm, setPurchaseToConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const isCartBusy = Boolean(cartActionLoading) || isProcessing

  async function confirmRemoveItem() {
    if (!detalleToRemove) return

    setIsProcessing(true)
    try {
      await onRemoveItem(detalleToRemove.id)
      setDetalleToRemove(null)
    } finally {
      setIsProcessing(false)
    }
  }

  async function confirmPurchase() {
    setIsProcessing(true)
    try {
      await onConfirm()
      setPurchaseToConfirm(false)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <DataPanel title="Carrito de compras">
      {cartActionLoading && <LoadingBlock message={cartActionLoading} />}
      {detalles.length === 0 ? (
        <p className="empty-state">Tu carrito está vacío. Agrega videojuegos desde el catálogo.</p>
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
                      disabled={detalle.cantidad <= 1 || cartItemLoadingId === detalle.id || isCartBusy}
                    >
                      -
                    </button>
                    <span>{cartItemLoadingId === detalle.id ? '...' : detalle.cantidad}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateItem(detalle, detalle.cantidad + 1)}
                      disabled={cartItemLoadingId === detalle.id || isCartBusy}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${detalle.subtotal}</td>
                <td>
                  <button
                    className="table-action danger"
                    type="button"
                    onClick={() => setDetalleToRemove(detalle)}
                    disabled={cartItemLoadingId === detalle.id || isCartBusy}
                  >
                    {cartItemLoadingId === detalle.id ? 'Actualizando...' : 'Quitar'}
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
        <button type="button" onClick={() => setPurchaseToConfirm(true)} disabled={!detalles.length || isCartBusy}>
          {cartActionLoading ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </div>

      {detalleToRemove && (
        <ConfirmModal
          title="Quitar artículo del carrito"
          message={`¿Quieres quitar "${detalleToRemove.videojuego?.titulo || 'este videojuego'}" de tu carrito?`}
          onConfirm={confirmRemoveItem}
          onCancel={() => setDetalleToRemove(null)}
          isProcessing={isProcessing}
        />
      )}

      {purchaseToConfirm && (
        <ConfirmModal
          title="Confirmar compra"
          message={`¿Confirmas la compra por $${carrito?.total ?? 0}? Se registrará tu pedido y se descontará el stock disponible.`}
          confirmLabel="Sí, confirmar compra"
          isDanger={false}
          onConfirm={confirmPurchase}
          onCancel={() => setPurchaseToConfirm(false)}
          isProcessing={isProcessing}
        />
      )}
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
  const [photoError, setPhotoError] = useState('')
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
    setPhotoError('')
    setSuccessMsg('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('La foto debe ser JPG, PNG o WEBP.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('La foto no debe pesar más de 2 MB.')
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
      setPhotoError(err.message || 'No se pudo actualizar la foto de perfil.')
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
          {photoError ? (
            <small style={{ color: '#dc2626', marginTop: '4px' }}>{photoError}</small>
          ) : (
            <small style={{ color: '#667085', marginTop: '4px' }}>
            {photoSaving ? 'Subiendo foto...' : 'Formatos permitidos: JPG, PNG o WEBP. Máximo 2 MB.'}
            </small>
          )}
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

function ConfirmModal({ title, message, onConfirm, onCancel, isProcessing, confirmLabel = 'Sí, eliminar', isDanger = true }) {
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
            style={isDanger ? { backgroundColor: '#dc2626' } : undefined}
            type="button" 
            onClick={onConfirm} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

