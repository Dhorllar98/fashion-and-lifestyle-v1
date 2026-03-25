export interface Design {
  id: number
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
  availableColors: string[]
  availableFabrics: string[]
  isAvailable: boolean
  createdAt: string
}

export interface Measurement {
  id?: number
  clientName: string
  clientEmail: string
  chest: number
  waist: number
  hips: number
  shoulderWidth: number
  sleeveLength: number
  inseamLength: number
  height: number
  notes?: string
  submittedAt?: string
}

export enum OrderStatus {
  InProduction = 0,
  Ready = 1,
  Dispatched = 2,
  InTransit = 3,
  Delivered = 4,
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.InProduction]: 'In Production',
  [OrderStatus.Ready]: 'Ready',
  [OrderStatus.Dispatched]: 'Dispatched',
  [OrderStatus.InTransit]: 'In Transit',
  [OrderStatus.Delivered]: 'Delivered',
}

export interface Order {
  id: number
  orderNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string
  designId: number
  design?: Design
  measurementId: number
  selectedColor: string
  selectedFabric: string
  totalAmount: number
  isPaid: boolean
  paymentReference?: string
  status: OrderStatus
  trackingNote?: string
  orderDate: string
  estimatedDelivery?: string
  deliveredAt?: string
}

export interface OrderTrackingResult {
  orderNumber: string
  clientName: string
  status: OrderStatus
  trackingNote?: string
  orderDate: string
  estimatedDelivery?: string
  deliveredAt?: string
}

export interface CreateOrderPayload {
  clientName: string
  clientEmail: string
  clientPhone: string
  designId: number
  measurementId: number
  selectedColor: string
  selectedFabric: string
  totalAmount: number
}
