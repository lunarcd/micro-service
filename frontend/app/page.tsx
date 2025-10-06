import { UserList } from "@/components/user-list"
import { OrderList } from "@/components/order-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Management Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage users and orders from a single interface</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserList />
          </TabsContent>

          <TabsContent value="orders">
            <OrderList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
