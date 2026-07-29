export function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('es-MX').format(new Date(value))
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
