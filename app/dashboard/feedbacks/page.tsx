"use client"

import { useEffect, useState } from "react"
import { getConversations, getSession } from "@/lib/mello/storage"
import type { Conversation } from "@/lib/mello/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Calendar, BarChart3 } from "lucide-react"

export default function FeedbacksPage() {
  const [list, setList] = useState<Conversation[]>([])

  useEffect(() => {
    const session = getSession()
    if (session?.email) {
      setList(getConversations(session.email).filter((c) => !!c.feedback))
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-purple-600" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
          Past Sessions
        </h1>
      </div>
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent className="pt-6">
          {list.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">
                No feedback yet. Start a practice session to see results here.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {list.map((c, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="no-underline hover:no-underline">
                    <div className="grid w-full grid-cols-[1fr_auto_auto_auto] items-center gap-4 text-left text-sm md:text-base p-4 rounded-lg hover:bg-gradient-to-r from-purple-50 to-pink-50 transition-colors">
                      <span className="font-semibold text-purple-700">{c.topic}</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{new Date(c.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-600">
                          Fluency: <strong className="text-purple-700">{c.feedback?.fluency}%</strong>
                        </span>
                      </div>
                      <span className="text-gray-600 hidden md:inline truncate max-w-48">
                        {c.feedback?.summary.slice(0, 52)}
                        {(c.feedback?.summary ?? "").length > 52 ? "…" : ""}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="grid gap-6 md:grid-cols-1 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-b-xl">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-800">
                          <Sparkles className="h-5 w-5" />
                          Detailed Feedback
                        </h3>
                        <div className="rounded-lg border border-gray-200 p-4 bg-white">
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Overall Fluency: <span className="text-purple-600 font-bold">{c.feedback?.fluency}%</span></p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Grammar Suggestions</p>
                              <ul className="list-inside list-disc text-gray-600 space-y-1">
                                {c.feedback?.grammar.map((g, i) => (
                                  <li key={i} className="pl-2">{g}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Vocabulary Improvements</p>
                              <ul className="list-inside list-disc text-gray-600 space-y-1">
                                {c.feedback?.vocabulary.map((v, i) => (
                                  <li key={i} className="pl-2">{v}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Session Summary</p>
                              <p className="text-gray-600">{c.feedback?.summary}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}