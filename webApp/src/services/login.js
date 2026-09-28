const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

const AUTH_SESSION_KEY = 'authSession'

async function requestAuth(path, credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
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

  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(body))
  return body
}

/**
 * Inicia sesión y guarda la respuesta de autenticación localmente.
 * @param {{Nick: string, Password: string}} credentials
 */
export function login(credentials) {
  return requestAuth('login', credentials)
}

/**
 * Registra un usuario y guarda la respuesta de autenticación localmente.
 * @param {{Nick: string, Password: string}} credentials
 */
export function registro(credentials) {
  return requestAuth('registro', credentials)
}

export function getAuthSession() {
  const session = localStorage.getItem(AUTH_SESSION_KEY)
  return session ? JSON.parse(session) : null
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY)
}