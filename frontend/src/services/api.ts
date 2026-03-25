import axios from 'axios'
import type { Design, Measurement, Order, OrderTrackingResult, CreateOrderPayload } from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Catalogue
export const catalogueApi = {
  getAll: () => api.get<Design[]>('/catalogue').then(r => r.data),
  getById: (id: number) => api.get<Design>(`/catalogue/${id}`).then(r => r.data),
  getByCategory: (category: string) =>
    api.get<Design[]>(`/catalogue/category/${category}`).then(r => r.data),
}

// Measurements
export const measurementsApi = {
  submit: (data: Omit<Measurement, 'id' | 'submittedAt'>) =>
    api.post<Measurement>('/measurements', data).then(r => r.data),
  getById: (id: number) => api.get<Measurement>(`/measurements/${id}`).then(r => r.data),
}

// Orders
export const ordersApi = {
  create: (data: CreateOrderPayload) =>
    api.post<Order>('/orders', data).then(r => r.data),
  getById: (id: number) => api.get<Order>(`/orders/${id}`).then(r => r.data),
  track: (orderNumber: string) =>
    api.get<OrderTrackingResult>(`/orders/track/${orderNumber}`).then(r => r.data),
  getByEmail: (email: string) =>
    api.get<Order[]>(`/orders/client/${email}`).then(r => r.data),
}

export default api
