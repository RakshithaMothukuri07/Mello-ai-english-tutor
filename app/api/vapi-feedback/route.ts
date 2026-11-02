import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDgoT-te6vUY2gXagf9m4cQ9_zcVndBWQI")
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

export async function POST(req: Request) {
  try {
    const { topic, transcript } = await req.json()

    const prompt = `
You are an English communication evaluator.
Analyze this conversation transcript on the topic "${topic}".
Return feedback as JSON ONLY in this format:

{
  "fluency": number (0-100),
  "grammar": [ "short grammar suggestion 1", "short grammar suggestion 2", ... ],
  "vocabulary": [ "short vocab suggestion 1", "short vocab suggestion 2", ... ],
  "summary": "1-2 sentence overall feedback about the user's communication"
}

Transcript:
${transcript}

⚠️ Do not include any explanations, markdown, or extra text. Return pure JSON only.
    `

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    })

    const rawText = result.response.text().trim()
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    let feedback = null

    if (jsonMatch) {
      feedback = JSON.parse(jsonMatch[0])
    } else {
      feedback = {
        fluency: 70,
        grammar: ["Couldn’t analyze grammar due to parsing issue."],
        vocabulary: ["Couldn’t analyze vocabulary due to parsing issue."],
        summary: "Partial analysis returned. Please retry.",
      }
    }

    console.log("✅ Feedback generated:", feedback)

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("❌ Error generating feedback:", error)
    return NextResponse.json(
      {
        feedback: {
          fluency: 50,
          grammar: ["Error analyzing grammar."],
          vocabulary: ["Error analyzing vocabulary."],
          summary: "There was a problem generating feedback.",
        },
      },
      { status: 200 }
    )
  }
}
