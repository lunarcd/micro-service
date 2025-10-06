"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Plus } from "lucide-react"
import { OrderDetailDialog } from "./order-detail-dialog"
import { CreateOrderDialog } from "./create-order-dialog"
import { useApiOrders } from "@/hooks/use-api-orders"

export function OrderList() {
  const { orders, createOrder, isLoading } = useApiOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsDetailOpen(true)
  }

  const handleOrderCreated = async (orderData: { userId: number; product: string; price: number }) => {
    await createOrder(orderData)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Orders</h2>
          <p className="text-sm text-muted-foreground">Manage and view all orders</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-muted/30">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-muted-foreground">#{order.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{order.userId}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{order.product}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    ${order.price.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedOrderId && (
        <OrderDetailDialog
          orderId={selectedOrderId}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}

      <CreateOrderDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  )
}
