"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ConversationView } from "@/components/mello/conversation"
import type { Conversation } from "@/lib/mello/types"
import { getSession, saveConversation } from "@/lib/mello/storage"
import { BookOpen, Sparkles, Mic, Globe, Users, ArrowRight } from "lucide-react"

const PRESETS = [
  { label: "Travel Adventures", icon: Globe, description: "Practice describing your dream vacation." },
  { label: "Job Interview", icon: Users, description: "Prepare for common interview questions." },
  { label: "Daily Life", icon: BookOpen, description: "Talk about your routine and hobbies." },
  { label: "Technology Trends", icon: Sparkles, description: "Discuss the latest in AI and gadgets." },
]

export default function PracticePage() {
  const router = useRouter()
  const [topic, setTopic] = useState<string>("")
  const [started, setStarted] = useState(false)

  function startWith(t: string) {
    setTopic(t)
    setStarted(true)
  }

  function handleEnd(conv: Conversation) {
    const session = getSession()
    if (session?.email) {
      saveConversation(session.email, conv)
    }
    router.push("/dashboard/feedbacks")
  }

  if (!started) {
    return (
      <div className="mx-auto px-4 py-8 max-w-9xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3 mx-auto bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
            <Mic className="h-12 w-12 text-purple-600" />
            AI Conversation Practice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Improve your speaking skills with intelligent AI feedback. Choose a topic or create your own.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-3">
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  <Sparkles className="h-6 w-6" />
                  Quick Start Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {PRESETS.map((preset) => {
                  const Icon = preset.icon
                  return (
                    <div
                      key={preset.label}
                      className="group cursor-pointer p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-gradient-to-br from-purple-50 to-pink-50 transition-all duration-300 hover:shadow-md"
                      onClick={() => startWith(preset.label)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-purple-700 transition-colors">{preset.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <BookOpen className="h-5 w-5" />
                Custom Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                  Your Topic
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Favorite books, Climate change, or anything on your mind..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-12 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button 
                onClick={() => startWith(topic)} 
                disabled={!topic.trim()}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg"
                size="lg"
              >
                Start Custom Chat
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="text-xs text-gray-600 text-center">
                <Badge variant="outline" className="mr-1 border-purple-300 text-purple-600">Pro Tip</Badge>
                Be specific for better AI responses!
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Powered by advanced AI for real-time feedback on pronunciation, fluency, and more.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-9xl">
      <div className="flex justify-center">
        <ConversationView topic={topic} onEnd={handleEnd} />
      </div>
    </div>
  )
}