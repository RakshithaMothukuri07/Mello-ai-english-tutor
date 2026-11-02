"use client"

import type { Conversation, User } from "./types"

const USERS_KEY = "mello:users"
const SESSION_KEY = "mello:session"
const CONV_KEY = (email: string) => `mello:conversations:${email}`

function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function setJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getUsers(): User[] {
  return getJSON<User[]>(USERS_KEY, [])
}

export function saveUser(user: User) {
  const users = getUsers()
  const exists = users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())
  if (!exists) {
    users.push(user)
    setJSON(USERS_KEY, users)
  } else {
    const next = users.map((u) => (u.email.toLowerCase() === user.email.toLowerCase() ? user : u))
    setJSON(USERS_KEY, next)
  }
}

export function findUser(email: string) {
  const users = getUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function setSession(email: string) {
  setJSON(SESSION_KEY, { email })
}

export function clearSession() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(SESSION_KEY)
}

export function getSession(): { email: string } | null {
  return getJSON<{ email: string } | null>(SESSION_KEY, null)
}

export function getConversations(email: string): Conversation[] {
  return getJSON<Conversation[]>(CONV_KEY(email), [])
}

export function saveConversation(email: string, conv: Conversation) {
  const list = getConversations(email)
  list.unshift(conv)
  setJSON(CONV_KEY(email), list)
}
