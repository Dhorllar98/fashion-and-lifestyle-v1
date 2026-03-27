export interface AuthUser {
  userId: number
  fullName: string
  email: string
  role: string
  token: string
  expiresAt: string
}

const TOKEN_KEY = 'fl_token'
const USER_KEY  = 'fl_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as AuthUser) : null
}

export function setAuth(user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, user.token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('auth-change'))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event('auth-change'))
}

export function isLoggedIn(): boolean {
  return Boolean(getToken())
}
