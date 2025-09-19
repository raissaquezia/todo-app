 "use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthScreen } from "@/components/auth/auth-screen"
import { TodoDashboard } from "@/components/todos/todo-dashboard"

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return user ? <TodoDashboard /> : <AuthScreen />
}
