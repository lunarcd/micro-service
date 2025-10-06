import { useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useApiUsers } from "@/hooks/use-api-users"

interface UserDetailDialogProps {
  userId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ userId, open, onOpenChange }: UserDetailDialogProps) {
  const { getUserById, isLoading } = useApiUsers()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (open && userId) {
      const fetchUser = async () => {
        const fetchedUser = await getUserById(userId)
        setUser(fetchedUser)
      }
      fetchUser()
    } else if (!open) {
      setUser(null)
    }
  }, [open, userId, getUserById])

  if (isLoading || !user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">Loading user details...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">ID</label>
            <p className="mt-1 font-mono text-sm text-foreground">{user.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="mt-1 text-sm text-foreground">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="mt-1 text-sm text-foreground">{user.email}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
