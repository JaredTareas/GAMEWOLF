import { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'

export function useClientData(token) {
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
