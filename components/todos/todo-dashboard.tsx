"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TodoHeader } from "./todo-header"
import { TodoList } from "./todo-list"
import { TodoForm } from "./todo-form"
import { useAuth } from "@/contexts/auth-context"
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo, type Todo } from "@/lib/todos"

export const TodoDashboard: React.FC = () => {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Load todos on mount and when user changes
  useEffect(() => {
    if (user) {
      const userTodos = getTodos(user.id)
      setTodos(userTodos)
    }
  }, [user])

  const handleAddTodo = () => {
    setEditingTodo(null)
    setIsFormOpen(true)
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (todoData: {
    title: string
    description?: string
    priority: "low" | "medium" | "high"
    completed: boolean
  }) => {
    if (!user) return

    if (editingTodo) {
      // Update existing todo
      const updatedTodo = updateTodo(user.id, editingTodo.id, todoData)
      if (updatedTodo) {
        setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? updatedTodo : t)))
      }
    } else {
      // Create new todo
      const newTodo = createTodo(user.id, todoData)
      setTodos((prev) => [...prev, newTodo])
    }

    setIsFormOpen(false)
    setEditingTodo(null)
  }

  const handleToggleTodo = (todoId: string) => {
    if (!user) return

    const updatedTodo = toggleTodo(user.id, todoId)
    if (updatedTodo) {
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updatedTodo : t)))
    }
  }

  const handleDeleteTodo = (todoId: string) => {
    if (!user) return

    const success = deleteTodo(user.id, todoId)
    if (success) {
      setTodos((prev) => prev.filter((t) => t.id !== todoId))
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TodoHeader onAddTodo={handleAddTodo} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <TodoList todos={todos} onToggle={handleToggleTodo} onEdit={handleEditTodo} onDelete={handleDeleteTodo} />
      </main>

      <TodoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingTodo(null)
        }}
        onSubmit={handleFormSubmit}
        editingTodo={editingTodo}
      />
    </div>
  )
}
