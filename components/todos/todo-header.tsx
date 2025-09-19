"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, Plus } from "lucide-react"

interface TodoHeaderProps {
  onAddTodo: () => void
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ onAddTodo }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user?.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={onAddTodo} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
