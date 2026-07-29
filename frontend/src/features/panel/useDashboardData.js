import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'

export function useDashboardData(token, rol) {
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
      const resumen = Object.entries(response.notificaciones ?? {})
        .map(([canal, notificacion]) => `${canal.toUpperCase()}: ${notificacion.estado}`)
        .join(' | ')
      showNotice(`${response.mensaje || 'Estado del pedido actualizado.'}${resumen ? ` ${resumen}` : ''}`)
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
      showNotice(response.mensaje || (usuarioId ? 'Usuario actualizado.' : 'Usuario creado.'))
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
