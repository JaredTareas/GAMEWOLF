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

export function useClientData(token) {
  const [videojuegos, setVideojuegos] = useState([])
  const [metaVideojuegos, setMetaVideojuegos] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [metaPedidos, setMetaPedidos] = useState(null)
  const [carrito, setCarrito] = useState(null)
  const [catalogoSearch, setCatalogoSearch] = useState('')
  const [catalogoPage, setCatalogoPage] = useState(1)
  const [pedidosSearch, setPedidosSearch] = useState('')
  const [pedidosEstado, setPedidosEstado] = useState('')
  const [pedidosPage, setPedidosPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  function showNotice(message) {
    setNotice(message)
    window.clearTimeout(showNotice.timeoutId)
    showNotice.timeoutId = window.setTimeout(() => setNotice(''), 2600)
  }

  function reloadData() {
    setRefreshKey((current) => current + 1)
  }

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')

      const videojuegosQuery = createQuery({
        search: catalogoSearch,
        page: catalogoPage,
        per_page: 8,
      })
      const pedidosQuery = createQuery({
        search: pedidosSearch,
        estado: pedidosEstado,
        page: pedidosPage,
        per_page: 10,
      })

      try {
        const [videojuegosRes, pedidosRes, carritoRes] = await Promise.all([
          apiRequest(`/videojuegos?${videojuegosQuery}`),
          apiRequest(`/pedidos?${pedidosQuery}`, { token }),
          apiRequest('/carrito', { token }),
        ])

        if (!active) return

        setVideojuegos(videojuegosRes.data ?? [])
        setMetaVideojuegos(videojuegosRes.meta ?? null)
        setPedidos(pedidosRes.data ?? [])
        setMetaPedidos(pedidosRes.meta ?? null)
        setCarrito(carritoRes.data ?? carritoRes)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    const delay = window.setTimeout(load, 300)

    return () => {
      active = false
      window.clearTimeout(delay)
    }
  }, [token, catalogoSearch, catalogoPage, pedidosSearch, pedidosEstado, pedidosPage, refreshKey])

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
      showNotice('Compra confirmada correctamente.')
      reloadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return {
    videojuegos,
    metaVideojuegos,
    pedidos,
    metaPedidos,
    carrito,
    loading,
    error,
    notice,
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
  }
}
