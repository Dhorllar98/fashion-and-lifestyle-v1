import axios from 'axios'
import { getToken } from '@/lib/auth'
import type {
  AuthResponse,
  CreateOrderPayload,
  Design,
  LoginPayload,
  Measurement,
  Order,
  OrderTrackingResult,
  RegisterPayload,
} from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:5032/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach JWT when available ────────────────────────────
api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor — unwrap OkResponse/PagedResponse, extract errors ────
api.interceptors.response.use(
  response => {
    const d = response.data
    // Unwrap our ApiBaseResponse envelope { success, message, data, ... }
    if (d && typeof d === 'object' && 'success' in d && 'data' in d) {
      response.data = d.data
    }
    return response
  },
  error => {
    // Pull the exact message the backend sent
    const message: string =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  },
)

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', data).then(r => r.data),
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', data).then(r => r.data),
}

// ── Catalogue ──────────────────────────────────────────────────────────────────
export const catalogueApi = {
  getAll: () => api.get<Design[]>('/catalogue').then(r => r.data),
  getById: (id: number) => api.get<Design>(`/catalogue/${id}`).then(r => r.data),
  getByCategory: (category: string) =>
    api.get<Design[]>(`/catalogue/category/${category}`).then(r => r.data),
}

// ── Measurements ───────────────────────────────────────────────────────────────
export const measurementsApi = {
  submit: (data: Omit<Measurement, 'id' | 'submittedAt'>) =>
    api.post<Measurement>('/measurements', data).then(r => r.data),
  getById: (id: number) =>
    api.get<Measurement>(`/measurements/${id}`).then(r => r.data),
}

// ── Orders ─────────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (data: CreateOrderPayload) =>
    api.post<Order>('/orders', data).then(r => r.data),
  getById: (id: number) =>
    api.get<Order>(`/orders/${id}`).then(r => r.data),
  track: (orderNumber: string) =>
    api.get<OrderTrackingResult>(`/orders/track/${orderNumber}`).then(r => r.data),
  getByEmail: (email: string) =>
    api.get<Order[]>(`/orders/client/${email}`).then(r => r.data),
}

export default api
