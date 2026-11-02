"use client"

import { useCallback, useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => WebSpeechRecognition
    SpeechRecognition?: new () => WebSpeechRecognition
  }
}
type WebSpeechRecognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: any) => void) | null
  onend: (() => void) | null
}

export function useSpeechRecognition(lang = "en-US") {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<WebSpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (Ctor) {
      setSupported(true)
      const rec = new Ctor()
      rec.lang = lang
      rec.continuous = true
      rec.interimResults = true
      recognitionRef.current = rec
    } else {
      setSupported(false)
    }
  }, [lang])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    setTranscript("")
    try {
      recognitionRef.current.onresult = (event: any) => {
        let text = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript
        }
        setTranscript(text.trim())
      }
      recognitionRef.current.onend = () => setListening(false)
      recognitionRef.current.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {}
    setListening(false)
  }, [])

  const reset = useCallback(() => setTranscript(""), [])

  return { supported, listening, transcript, start, stop, reset }
}
