import type { Conversation, Message, Feedback } from "./types"

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function generateAIResponse(history: Message[]): Promise<string> {
  const lastUser = [...history].reverse().find((m) => m.sender === "user")?.text ?? ""
  const openers = [
    "That's interesting—could you tell me more?",
    "Great point! How did that make you feel?",
    "I see. What would you do next?",
    "Nice. Could you give an example?",
  ]
  const followUps = [
    "Why do you think that is?",
    "What challenges did you face?",
    "How would you describe it to a friend?",
    "What surprised you the most?",
  ]

  const echo = lastUser.length ? `I heard: "${lastUser}". ` : "Let's keep the conversation flowing. "

  // simulate latency
  await new Promise((res) => setTimeout(res, 600 + Math.random() * 800))
  return `${echo}${randomItem(openers)} ${randomItem(followUps)}`
}

export function generateFeedback(conv: Conversation): Feedback {
  const userMsgs = conv.messages.filter((m) => m.sender === "user")
  const words = userMsgs.reduce((acc, m) => acc + m.text.split(/\s+/).filter(Boolean).length, 0)
  const turns = userMsgs.length

  const fluencyBase = Math.min(95, Math.max(40, Math.round((words / Math.max(1, turns)) * 4 + 50)))
  const fluency = Math.min(100, Math.max(30, fluencyBase + (Math.random() * 10 - 5)))

  const grammar = [
    "Use past tense consistently when describing completed events.",
    "Watch subject-verb agreement in complex sentences.",
    "Try reducing filler words like 'umm' and 'you know'.",
  ]
  const vocabulary = [
    "Consider using 'nevertheless' instead of 'but' in formal contexts.",
    "Try 'efficient' or 'streamlined' for describing improvements.",
    "Use 'perspective' or 'standpoint' when offering opinions.",
  ]

  const summary = `You maintained a natural flow and conveyed ideas clearly about "${conv.topic}". Keep extending answers with short reasons and examples. Great job!`

  return {
    fluency: Math.round(fluency),
    grammar,
    vocabulary,
    summary,
  }
}
