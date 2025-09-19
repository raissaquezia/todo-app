"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Todo } from "@/lib/todos"

interface TodoItemProps {
    todo: Todo
    onToggle: (id: string) => void
    onEdit: (todo: Todo) => void
    onDelete: (id: string) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false)

    const getPriorityColor = (priority: Todo["priority"]) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        }
    }

    const handleEdit = () => {
        console.log("[v0] Edit clicked for todo:", todo.id)
        onEdit(todo)
    }

    const handleDelete = () => {
        console.log("[v0] Delete clicked for todo:", todo.id)
        onDelete(todo.id)
    }

    return (
        <Card
            className={`transition-all duration-200 ${todo.completed ? "opacity-60" : ""} ${isHovered ? "shadow-md" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} className="mt-1" />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3
                                    className={`font-medium text-sm ${
                                        todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                                    }`}
                                >
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p
                                        className={`text-sm mt-1 ${
                                            todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"
                                        }`}
                                    >
                                        {todo.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={getPriorityColor(todo.priority)}>
                                    {todo.priority}
                                </Badge>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => console.log("[v0] Dropdown trigger clicked")}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleEdit}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Created {todo.createdAt.toLocaleDateString()}</span>
                            {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                                <span>Updated {todo.updatedAt.toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
