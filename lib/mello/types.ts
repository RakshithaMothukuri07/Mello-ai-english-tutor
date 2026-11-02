export type User = {
  email: string
  name: string
  password: string
}

export type Message = {
  sender: "user" | "ai"
  text: string
  timestamp: string
}

export type Feedback = {
  fluency: number
  grammar: string[]
  vocabulary: string[]
  summary: string
}

export type Conversation = {
  topic: string
  messages: Message[]
  feedback?: Feedback
  timestamp: string
  transcript?:string
}
