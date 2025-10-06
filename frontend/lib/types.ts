export interface User {
  id: number
  name: string
  email: string
}

export interface Order {
  id: number
  userId: number
  product: string
  price: number
}

export interface OrderDetail {
    orderId: number
    product: string
    price: number
    user: User
}
