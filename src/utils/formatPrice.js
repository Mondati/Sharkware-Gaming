const ARS_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export const formatARS = (n) => ARS_FORMATTER.format(Number(n) || 0)
