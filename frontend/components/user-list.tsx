"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Plus } from "lucide-react"
import { UserDetailDialog } from "./user-detail-dialog"
import { CreateUserDialog } from "./create-user-dialog"
import { useApiUsers } from "@/hooks/use-api-users"

export function UserList() {
  const { users, createUser } = useApiUsers()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const handleViewUser = (userId: number) => {
    setSelectedUserId(userId)
    setIsDetailOpen(true)
  }

  const handleUserCreated = async (userData: { name: string; email: string }) => {
    await createUser(userData)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Users</h2>
          <p className="text-sm text-muted-foreground">Manage and view all users</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-muted/30">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-muted-foreground">{user.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Button variant="ghost" size="sm" onClick={() => handleViewUser(user.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedUserId && (
        <UserDetailDialog
          userId={selectedUserId}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}

      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onUserCreated={handleUserCreated}
      />
    </div>
  )
}
