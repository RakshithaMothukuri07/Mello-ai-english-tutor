"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clearSession, findUser, getSession } from "@/lib/mello/storage"
import { useRouter } from "next/navigation"
import { Users, LogOut } from "lucide-react"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const s = getSession()
    if (s?.email) {
      const u = findUser(s.email)
      setEmail(s.email)
      setName(u?.name ?? "")
    }
  }, [])

  function logout() {
    clearSession()
    router.replace("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-purple-600" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
          Your Profile
        </h1>
      </div>
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl w-full max-w-md">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">{name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">Email Address</p>
              <p className="text-lg font-semibold text-gray-900">{email}</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={logout}
            className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg flex items-center gap-2 justify-center"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}