
"use client"

import { useState, useCallback, useEffect } from "react"
import type { User } from "@/lib/types"

const API_URL = "http://localhost:8080/api/users"

export function useApiUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const createUser = useCallback(
    async (userData: { name: string; email: string }) => {
      setIsLoading(true)
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
        const newUser = await response.json()
        setUsers((prev) => [...prev, newUser])
        return newUser
      } catch (error) {
        console.error("Failed to create user:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getUserById = useCallback(
    async (id: number) => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}/${id}`)
        const user = await response.json()
        return user
      } catch (error) {
        console.error(`Failed to fetch user with id ${id}:`, error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    users,
    isLoading,
    getUsers,
    createUser,
    getUserById,
  }
}
