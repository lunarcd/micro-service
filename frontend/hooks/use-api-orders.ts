"use client"

import { useState, useCallback, useEffect } from "react"
import type { Order, OrderDetail } from "@/lib/types"

const API_URL = "http://localhost:8080/api/orders"

function mapOrderDetailToOrder(detail: OrderDetail): Order {
  return {
    id: detail.orderId,
    userId: detail.user.id,
    product: detail.product,
    price: detail.price,
  }
}

export function useApiOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_URL)
      const data: Order[] = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getOrders()
  }, [getOrders])

  const createOrder = useCallback(
    async (orderData: { userId: number; product: string; price: number }) => {
      setIsLoading(true)
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
                const err = await response.json().catch(() => ({}))
                throw new Error(err.message || `Failed to create order (status ${response.status})`)
              }

        const newOrderDetail: OrderDetail = await response.json()
        const newOrder = mapOrderDetailToOrder(newOrderDetail)
        setOrders((prev) => [...prev, newOrder])
        return newOrder
      } catch (error) {
        console.error("Failed to create order:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getOrderById = useCallback(
    async (id: number): Promise<OrderDetail | null> => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}/${id}`)
        const order: OrderDetail = await response.json()
        return order
      } catch (error) {
        console.error(`Failed to fetch order with id ${id}:`, error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { orders, isLoading, getOrders, createOrder, getOrderById }
}
