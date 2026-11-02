"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Conversation } from "@/lib/mello/types"
import Vapi from "@vapi-ai/web"
import { Loader2, Mic, MicOff, Play, StopCircle, Volume2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ConversationView({
  topic,
  onEnd,
}: {
  topic: string
  onEnd: (conv: Conversation) => void
}) {
  const [vapi, setVapi] = useState<any>(null)
  const [status, setStatus] = useState<"idle" | "ready" | "starting" | "live" | "processing" | "ended" | "error">("idle")
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const transcriptRef = useRef("")

  useEffect(() => {
    const assistantId = "995c85eb-7f3c-4463-bb7f-dae16d93bc6f" // Your new assistant ID
    const publicApiKey = "ca35b9c0-eff7-4035-ab52-037470ee2100" // Replace with your actual public key from dashboard

    const vapiInstance = new Vapi(publicApiKey) // Fixed: Pass public API key here
    setVapi(vapiInstance)
    console.log("🧠 Vapi instance created with public key")

    vapiInstance.on("call-start", () => {
      console.log("📞 Call started")
      setStatus("live")
      setIsListening(true)
      setError(null) // Clear any prior errors
    })

    vapiInstance.on("call-end", () => {
      console.log("📞 Call ended")
      setStatus("ended")
      setIsListening(false)
    })

    vapiInstance.on("error", (error: any) => {
      console.error("❌ Vapi error:", error)
      setStatus("error")
      setError(error.message || "Unknown Vapi error")
    })

    vapiInstance.on("message", (message: any) => {
      if (message.type === "transcript") {
        const newLine = `\n${message.role === "user" ? "You" : "AI"}: ${message.transcript}`
        transcriptRef.current += newLine
        setTranscript(transcriptRef.current)
      }
    })

    setStatus("ready")

    return () => {
      if (vapiInstance) {
        vapiInstance.stop()
      }
    }
  }, [])

  async function requestMicPermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("🎤 Microphone permission granted")
    } catch (err: unknown) {
      console.error("🎤 Mic permission denied:", err instanceof Error ? err.message : err)
      alert("Please enable microphone access for this feature to work.")
      return false
    }
    return true
  }

  async function startSession() {
  if (!vapi) {
    setError("Vapi not initialized")
    setStatus("error")
    return
  }

  const hasMic = await requestMicPermission()
  if (!hasMic) return

  setStatus("starting")
  setError(null)

  try {
    const assistantId = "995c85eb-7f3c-4463-bb7f-dae16d93bc6f" // Your assistant ID
    // Fixed: Second arg is the overrides object directly (no extra 'assistantOverrides' wrapper)
    await vapi.start(assistantId, {
      variableValues: { topic }, // Passes { topic: 'your-topic-value' } to {{topic}} in prompt
    })
    console.log("🚀 Session started successfully")
  } catch (err: unknown) { // Fixed: Explicit typing for TS
    console.error("💥 Start session failed:", err)
    setStatus("error")
    setError((err as Error).message || "Failed to start session—check console for details")
  }
}

async function endSession() {
  if (!vapi) return
  vapi.stop()
  setStatus("processing")

  try {
    const res = await fetch("/api/vapi-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, transcript }),
    })
    if (!res.ok) throw new Error("Feedback API failed")
    const data = await res.json()

    const conv: Conversation = {
      topic,
      messages: [],
      transcript,
      feedback: data.feedback,
      timestamp: new Date().toISOString(),
    }
    onEnd(conv)
  } catch (err: unknown) {  // Fixed: Explicitly type as unknown (or Error if you prefer)
    console.error("Feedback error:", err)
    setError("Session saved, but feedback failed")  // Note: This assumes you have setError from state
  }
}

  // ... (Rest of your JSX remains the same, but add error display in the status section)

  return (
    <div className="flex flex-col h-[70vh] w-full max-w-4xl mx-auto">
      {/* Header - unchanged */}
      <Card className="mb-4 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Volume2 className="h-6 w-6" />
              Practice Conversation
            </CardTitle>
            <CardDescription className="text-lg">
              Topic: <Badge variant="secondary" className="ml-2">{topic}</Badge>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {status === "live" && (
              <Badge variant={isListening ? "default" : "secondary"} className="flex items-center gap-1">
                {isListening ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                {isListening ? "Listening" : "Muted"}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-6">
          {/* Status Indicators - Updated with error handling */}
          <div className="flex justify-between items-center mb-4">
            {status === "idle" && (
              <div className="text-center w-full">
                <div className="text-muted-foreground text-sm mb-2">Ready to start your conversation</div>
              </div>
            )}

            {status === "ready" && (
              <Button 
                onClick={startSession} 
                className="mx-auto w-48 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Speaking
              </Button>
            )}

            {status === "starting" && (
              <div className="flex items-center gap-2 text-blue-600 mx-auto">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Connecting...</span>
              </div>
            )}

            {status === "live" && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Live Conversation</span>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={endSession}
                  className="flex items-center gap-2 shadow-lg"
                  size="lg"
                >
                  <StopCircle className="h-4 w-4" />
                  End Session
                </Button>
              </div>
            )}

            {status === "processing" && (
              <div className="flex items-center gap-2 text-blue-600 mx-auto">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing your session...</span>
              </div>
            )}

            {status === "ended" && (
              <div className="text-center w-full text-green-600">
                <div className="text-lg font-medium mb-2">✅ Session Completed!</div>
                <div className="text-sm text-muted-foreground">Feedback is being prepared</div>
              </div>
            )}

            {status === "error" && (
              <div className="text-center w-full text-red-600">
                <div className="text-lg font-medium mb-2">❌ Error Starting Session</div>
                <div className="text-sm text-red-500">{error}</div>
                <Button onClick={startSession} variant="outline" className="mt-2">
                  Retry
                </Button>
              </div>
            )}
          </div>

          {/* Separator */}
          <Separator className="my-4" />

          {/* Transcript - unchanged */}
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Conversation Transcript
            </h3>
            <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {transcript || (
                <div className="text-center text-muted-foreground italic py-8">
                  Transcript will appear here once the conversation starts...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Tips - unchanged */}
      {status === "live" && (
        <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-700">
            💡 Tip: Speak clearly and naturally. The AI will respond based on your topic.
          </div>
        </Card>
      )}
    </div>
  )
}