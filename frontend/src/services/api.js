const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

function traducirErrorApi(mensaje) {
  if (!mensaje) return 'Error de conexión con la API.'

  const traducciones = {
    'The given data was invalid.': 'Los datos enviados no son válidos.' ,
    'Unauthenticated.': 'No has iniciado sesión.' ,
    'Unauthorized.': 'No tienes permiso para realizar esta acción.' ,
    'Forbidden.': 'No tienes permiso para realizar esta acción.' ,
    'Not Found.': 'No se encontró el recurso solicitado.' ,
    'Server Error': 'Ocurrió un error en el servidor.' ,
    'Failed to fetch': 'No se pudo conectar con la API.' ,
  }

  return traducciones[mensaje] || mensaje
}

export async function apiRequest(path, options = {}) {
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
    method: options.method || 'GET',
    headers,
    // Si es FormData se manda tal cual, si no, se convierte a JSON
    body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const firstValidationError = data.errors ? Object.values(data.errors).flat()[0] : null
    throw new Error(firstValidationError || data.mensaje || traducirErrorApi(data.message) || 'Error de conexión con la API.')
  }

  return data
}
