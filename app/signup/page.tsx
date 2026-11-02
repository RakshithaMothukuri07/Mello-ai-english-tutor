"use client";
import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { saveUser, setSession, findUser } from "@/lib/mello/storage"
import type { User } from "@/lib/mello/types"
import { Navbar } from "@/components/mello/navbar";

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const existing = findUser(email)
    if (existing) {
      setError("An account with this email already exists.")
      return
    }
    const user: User = { name, email, password }
    saveUser(user)
    setSession(email)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <Navbar/>
      <main className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-20">
        <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Create your account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Start practicing in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                <Input 
                  id="name" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-medium rounded-lg">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link className="font-medium text-purple-600 hover:text-purple-700 transition-colors underline" href="/login">
                  Log in
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-purple-600 mt-4">
                <CheckCircle className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}