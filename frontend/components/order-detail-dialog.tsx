import { useEffect, useState } from "react"
import type { OrderDetail } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useApiOrders } from "@/hooks/use-api-orders"

interface OrderDetailDialogProps {
  orderId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailDialog({ orderId, open, onOpenChange }: OrderDetailDialogProps) {
  const { getOrderById, isLoading } = useApiOrders()
  const [order, setOrder] = useState<OrderDetail | null>(null)

  useEffect(() => {
    if (open && orderId) {
      const fetchOrder = async () => {
        const fetchedOrder = await getOrderById(orderId)
        setOrder(fetchedOrder)
      }
      fetchOrder()
    } else if (!open) {
      setOrder(null)
    }
  }, [open, orderId, getOrderById])

  if (isLoading || !order) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">Loading order details...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Order ID</label>
            <p className="mt-1 font-mono text-sm text-foreground">#{order.orderId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Product</label>
            <p className="mt-1 text-sm text-foreground">{order.product}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Price</label>
            <p className="mt-1 text-sm font-medium text-foreground">${order.price.toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">User ID</label>
            <p className="mt-1 font-mono text-sm text-foreground">{order.user.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">User Name</label>
            <p className="mt-1 font-mono text-sm text-foreground">{order.user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">User Email</label>
            <p className="mt-1 font-mono text-sm text-foreground">{order.user.email}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
