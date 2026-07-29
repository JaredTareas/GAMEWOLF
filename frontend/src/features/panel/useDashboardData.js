import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'

function createQuery(params) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.set(key, String(value))
    }
  })

  return query.toString()
}

const emptyListResponse = { data: [], meta: null }

export function useDashboardData(token, rol) {
  const [state, setState] = useState({
    videojuegos: [],
    metaVideojuegos: null,
    pedidos: [],
    metaPedidos: null,
    usuarios: [],
    metaUsuarios: null,
    clientes: [],
    metaClientes: null,
    generos: [],
    metaGeneros: null,
    reporte: null,
    loading: true,
    error: '',
    notice: '',
  })
  const [videojuegosSearch, setVideojuegosSearch] = useState('')
  const [videojuegosPage, setVideojuegosPage] = useState(1)
  const [pedidosSearch, setPedidosSearch] = useState('')
  const [pedidosEstado, setPedidosEstado] = useState('')
  const [pedidosPage, setPedidosPage] = useState(1)
  const [usuariosSearch, setUsuariosSearch] = useState('')
  const [usuariosRol, setUsuariosRol] = useState('')
  const [usuariosPage, setUsuariosPage] = useState(1)
  const [clientesSearch, setClientesSearch] = useState('')
  const [clientesPage, setClientesPage] = useState(1)
  const [generosSearch, setGenerosSearch] = useState('')
  const [generosPage, setGenerosPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)

  function showNotice(message) {
    setState((current) => ({ ...current, notice: message }))
    window.clearTimeout(showNotice.timeoutId)
    showNotice.timeoutId = window.setTimeout(() => {
      setState((current) => ({ ...current, notice: '' }))
    }, 2600)
  }

  function reloadData() {
    setRefreshKey((current) => current + 1)
  }

  useEffect(() => {
    let active = true

    async function load() {
      setState((current) => ({ ...current, loading: true, error: '' }))

      const videojuegosQuery = createQuery({
        search: videojuegosSearch,
        page: videojuegosPage,
        per_page: 10,
      })
      const pedidosQuery = createQuery({
        search: pedidosSearch,
        estado: pedidosEstado,
        page: pedidosPage,
        per_page: 10,
      })
      const usuariosQuery = createQuery({
        search: usuariosSearch,
        rol: usuariosRol,
        page: usuariosPage,
        per_page: 10,
      })
      const clientesQuery = createQuery({
        search: clientesSearch,
        rol: 'cliente',
        page: clientesPage,
        per_page: 10,
      })
      const generosQuery = createQuery({
        search: generosSearch,
        page: generosPage,
        per_page: 10,
      })
      const puedeConsultarUsuarios = ['admin', 'empleado'].includes(rol)

      try {
        const [videojuegosRes, pedidosRes, usuariosRes, clientesRes, generosRes, reporteRes] = await Promise.all([
          apiRequest(`/videojuegos?${videojuegosQuery}`),
          apiRequest(`/pedidos?${pedidosQuery}`, { token }),
          rol === 'admin' ? apiRequest(`/usuarios?${usuariosQuery}`, { token }) : Promise.resolve(emptyListResponse),
          puedeConsultarUsuarios ? apiRequest(`/usuarios?${clientesQuery}`, { token }) : Promise.resolve(emptyListResponse),
          apiRequest(`/generos?${generosQuery}`, { token }),
          puedeConsultarUsuarios ? apiRequest('/reportes/resumen', { token }) : Promise.resolve({ data: null }),
        ])

        if (!active) return

        setState({
          videojuegos: videojuegosRes.data ?? [],
          metaVideojuegos: videojuegosRes.meta ?? null,
          pedidos: pedidosRes.data ?? [],
          metaPedidos: pedidosRes.meta ?? null,
          usuarios: usuariosRes.data ?? [],
          metaUsuarios: usuariosRes.meta ?? null,
          clientes: clientesRes.data ?? [],
          metaClientes: clientesRes.meta ?? null,
          generos: generosRes.data ?? [],
          metaGeneros: generosRes.meta ?? null,
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

    const delay = window.setTimeout(load, 300)

    return () => {
      active = false
      window.clearTimeout(delay)
    }
  }, [
    token,
    rol,
    videojuegosSearch,
    videojuegosPage,
    pedidosSearch,
    pedidosEstado,
    pedidosPage,
    usuariosSearch,
    usuariosRol,
    usuariosPage,
    clientesSearch,
    clientesPage,
    generosSearch,
    generosPage,
    refreshKey,
  ])

  async function updateOrderStatus(pedidoId, estado) {
    setState((current) => ({ ...current, error: '' }))

    try {
      const response = await apiRequest(`/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        token,
        body: { estado },
      })

      const resumen = Object.entries(response.notificaciones ?? {})
        .map(([canal, notificacion]) => `${canal.toUpperCase()}: ${notificacion.estado}`)
        .join(' | ')
      showNotice(`${response.mensaje || 'Estado del pedido actualizado.'}${resumen ? ` ${resumen}` : ''}`)
      reloadData()
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
    }
  }

  async function saveGame(payload, videojuegoId = null) {
    setState((current) => ({ ...current, error: '' }))

    try {
      let method = videojuegoId ? 'PUT' : 'POST'
      let body = payload

      if (payload instanceof FormData && videojuegoId) {
        payload.append('_method', 'PUT')
        method = 'POST'
      }

      await apiRequest(videojuegoId ? `/videojuegos/${videojuegoId}` : '/videojuegos', {
        method,
        token,
        body,
      })

      showNotice(videojuegoId ? 'Videojuego actualizado.' : 'Videojuego agregado.')
      reloadData()
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

      showNotice(response.mensaje || 'Videojuego eliminado.')
      reloadData()
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

      showNotice(response.mensaje || (usuarioId ? 'Usuario actualizado.' : 'Usuario creado.'))
      reloadData()
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
      throw err
    }
  }

  async function deleteUser(usuarioId) {
    setState((current) => ({ ...current, error: '' }))

    try {
      const response = await apiRequest(`/usuarios/${usuarioId}`, { method: 'DELETE', token })
      showNotice(response.mensaje || 'Usuario eliminado.')
      reloadData()
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
    }
  }

  async function saveGenero(payload, generoId = null) {
    setState((current) => ({ ...current, error: '' }))

    try {
      const response = await apiRequest(generoId ? `/generos/${generoId}` : '/generos', {
        method: generoId ? 'PUT' : 'POST',
        token,
        body: payload,
      })

      showNotice(response.mensaje || (generoId ? 'Género actualizado.' : 'Género creado.'))
      reloadData()
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
      throw err
    }
  }

  async function deleteGenero(generoId) {
    setState((current) => ({ ...current, error: '' }))

    try {
      const response = await apiRequest(`/generos/${generoId}`, { method: 'DELETE', token })
      showNotice(response.mensaje || 'Género eliminado.')
      reloadData()
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }))
    }
  }

  return {
    ...state,
    saveGame,
    deleteGame,
    updateOrderStatus,
    saveUser,
    deleteUser,
    saveGenero,
    deleteGenero,
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
    generosSearch,
    setGenerosSearch,
    generosPage,
    setGenerosPage,
  }
}
