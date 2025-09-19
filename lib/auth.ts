export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Local storage keys
const AUTH_STORAGE_KEY = "todo-app-auth"
const USERS_STORAGE_KEY = "todo-app-users"

// Get stored users from localStorage
export const getStoredUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Save users to localStorage
export const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

// Save current user to localStorage
export const saveCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

// Register a new user
export const registerUser = (
  email: string,
  password: string,
  name: string,
): { success: boolean; error?: string; user?: User } => {
  const users = getStoredUsers()

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "User already exists with this email" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
  }

  // Save password separately (in real app, this would be hashed)
  const passwords = JSON.parse(localStorage.getItem("todo-app-passwords") || "{}")
  passwords[email] = password
  localStorage.setItem("todo-app-passwords", JSON.stringify(passwords))

  // Save user
  users.push(newUser)
  saveUsers(users)

  return { success: true, user: newUser }
}

// Login user
export const loginUser = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  const users = getStoredUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  // Check password
  const passwords = JSON.parse(localStorage.getItem("todo-app-passwords") || "{}")
  if (passwords[email] !== password) {
    return { success: false, error: "Invalid password" }
  }

  return { success: true, user }
}

// Logout user
export const logoutUser = () => {
  saveCurrentUser(null)
}
