export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
  userId: string
}

export type TodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt">

// Local storage key for todos
const TODOS_STORAGE_KEY = "todo-app-todos"

// Get todos from localStorage for a specific user
export const getTodos = (userId: string): Todo[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(TODOS_STORAGE_KEY)
  const allTodos: Todo[] = stored ? JSON.parse(stored) : []
  return allTodos
    .filter((todo) => todo.userId === userId)
    .map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
    }))
}

// Save todos to localStorage
export const saveTodos = (todos: Todo[]) => {
  if (typeof window === "undefined") return
  const stored = localStorage.getItem(TODOS_STORAGE_KEY)
  const allTodos: Todo[] = stored ? JSON.parse(stored) : []

  // Remove existing todos for this user and add new ones
  const otherUserTodos = allTodos.filter((todo) => !todos.some((t) => t.userId === todos[0]?.userId))
  const updatedTodos = [...otherUserTodos, ...todos]

  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos))
}

// Create a new todo
export const createTodo = (userId: string, todoInput: Omit<TodoInput, "userId">): Todo => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    ...todoInput,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const existingTodos = getTodos(userId)
  const updatedTodos = [...existingTodos, newTodo]
  saveTodos(updatedTodos)

  return newTodo
}

// Update a todo
export const updateTodo = (userId: string, todoId: string, updates: Partial<TodoInput>): Todo | null => {
  const todos = getTodos(userId)
  const todoIndex = todos.findIndex((todo) => todo.id === todoId)

  if (todoIndex === -1) return null

  const updatedTodo = {
    ...todos[todoIndex],
    ...updates,
    updatedAt: new Date(),
  }

  todos[todoIndex] = updatedTodo
  saveTodos(todos)

  return updatedTodo
}

// Delete a todo
export const deleteTodo = (userId: string, todoId: string): boolean => {
  const todos = getTodos(userId)
  const filteredTodos = todos.filter((todo) => todo.id !== todoId)

  if (filteredTodos.length === todos.length) return false

  saveTodos(filteredTodos)
  return true
}

// Toggle todo completion
export const toggleTodo = (userId: string, todoId: string): Todo | null => {
  const todos = getTodos(userId)
  const todo = todos.find((t) => t.id === todoId)

  if (!todo) return null

  return updateTodo(userId, todoId, { completed: !todo.completed })
}
