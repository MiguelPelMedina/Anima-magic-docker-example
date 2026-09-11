import { Hechizo, HechizosResponse } from '../models/hechizo'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof body === 'object' && body?.message
      ? body.message
      : `La API respondió con el estado ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.data = body
    throw error
  }

  return body
}

function buildHechizosQuery(filters = {}) {
  const query = new URLSearchParams()
  const { page, skip, via, nivel, tipo } = filters

  if (page !== undefined && page !== null) query.set('page', page)
  if (skip !== undefined && skip !== null) query.set('skip', skip)
  if (via) query.set('via', via)
  if (nivel) query.set('nivel', nivel)

  if (Array.isArray(tipo)) {
    tipo.filter(Boolean).forEach((value) => query.append('tipo', value))
  }

  return query
}

/**
 * Obtiene la lista de hechizos aplicando los filtros indicados.
 * @param {{page?: number, skip?: number, via?: string, nivel?: string, tipo?: string[]}} filters
 */
export function getHechizos(filters = {}) {
  const query = buildHechizosQuery(filters).toString()
  const url = `${API_BASE_URL}/hechizos${query ? `?${query}` : ''}`

  return request(url).then((data) => HechizosResponse.fromJSON(data))
}

/**
 * Obtiene un hechizo por su identificador.
 * @param {string} id
 */
export function getHechizoById(id) {
  if (typeof id !== 'string' || !id.trim()) {
    return Promise.reject(new TypeError('El id del hechizo debe ser un string no vacío'))
  }

  return request(`${API_BASE_URL}/hechizos/${encodeURIComponent(id)}`)
    .then((data) => Hechizo.fromJSON(data))
}

export { API_BASE_URL }