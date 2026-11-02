"use client"

import useSWR from "swr"

export function useLocalStorageSWR<T>(key: string, fallback: T) {
  const fetcher = () => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    return raw ? (JSON.parse(raw) as T) : fallback
  }

  const { data, mutate, isLoading } = useSWR<T>(key, fetcher, {
    fallbackData: fallback,
    revalidateOnFocus: false,
  })

  function set(value: T | ((prev: T) => T)) {
    const next = value instanceof Function ? value(data as T) : value
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(next))
    }
    mutate(next, false)
  }

  return { data: data as T, set, mutate, isLoading }
}
