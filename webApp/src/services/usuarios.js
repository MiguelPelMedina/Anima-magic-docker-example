import { LibroHechizo, Usuario } from '../models/usuario'
import { API_BASE_URL } from './hechizos'
import { getAuthSession } from './login'

function requiredId(id, name) {
  if (typeof id !== 'string' || !id.trim()) {
    throw new TypeError(`El ${name} debe ser un string no vacío`)
  }

  return encodeURIComponent(id)
}

async function requestUsuario(path, { method = 'GET', body } = {}) {
  const session = getAuthSession()
  if (!session?.token) {
    throw new Error('Debes iniciar sesión para acceder a los usuarios.')
  }

  const response = await fetch(`${API_BASE_URL}/usuarios${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const responseBody = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof responseBody === 'object' && responseBody?.message
      ? responseBody.message
      : `La API respondió con el estado ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.data = responseBody
    throw error
  }

  return responseBody
}

export async function getUsuarioById(id) {
  const usuarioId = requiredId(id, 'id del usuario')
  const data = await requestUsuario(`/${usuarioId}`)
  return Usuario.fromJSON(data)
}

export function deleteUsuario(id) {
  const usuarioId = requiredId(id, 'id del usuario')
  return requestUsuario(`/${usuarioId}`, { method: 'DELETE' })
}

export function crearLibroHechizo(id, libro) {
  const usuarioId = requiredId(id, 'id del usuario')
  return requestUsuario(`/${usuarioId}/spellbooks`, {
    method: 'POST',
    body: libro,
  })
}

export async function listarLibrosHechizos(id) {
  const usuarioId = requiredId(id, 'id del usuario')
  const data = await requestUsuario(`/${usuarioId}/spellbooks`)
  const libros = Array.isArray(data) ? data : data.LibrosHechizos ?? data.librosHechizos ?? []
  return libros.map((libro) => LibroHechizo.fromJSON(libro))
}

export function actualizarLibroHechizo(id, spellbookId, libro) {
  const usuarioId = requiredId(id, 'id del usuario')
  const libroId = requiredId(spellbookId, 'id del libro de hechizos')
  return requestUsuario(`/${usuarioId}/spellbooks/${libroId}`, {
    method: 'PUT',
    body: libro,
  })
}

export function eliminarLibroHechizo(id, spellbookId) {
  const usuarioId = requiredId(id, 'id del usuario')
  const libroId = requiredId(spellbookId, 'id del libro de hechizos')
  return requestUsuario(`/${usuarioId}/spellbooks/${libroId}`, { method: 'DELETE' })
}

export function agregarHechizoALibro(id, spellbookId, hechizoId) {
  const usuarioId = requiredId(id, 'id del usuario')
  const libroId = requiredId(spellbookId, 'id del libro de hechizos')
  requiredId(hechizoId, 'id del hechizo')
  return requestUsuario(`/${usuarioId}/spellbooks/${libroId}/hechizos`, {
    method: 'POST',
    body: { hechizoId },
  })
}

export function eliminarHechizoDeLibro(id, spellbookId, hechizoId) {
  const usuarioId = requiredId(id, 'id del usuario')
  const libroId = requiredId(spellbookId, 'id del libro de hechizos')
  const idHechizo = requiredId(hechizoId, 'id del hechizo')
  return requestUsuario(`/${usuarioId}/spellbooks/${libroId}/hechizos/${idHechizo}`, {
    method: 'DELETE',
  })
}