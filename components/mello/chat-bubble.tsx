import type React from "react"
import { cn } from "@/lib/utils"

export function ChatBubble({
  align = "left",
  children,
}: {
  align?: "left" | "right"
  children: React.ReactNode
}) {
  const isRight = align === "right"
  return (
    <div className={cn("w-full", isRight ? "flex justify-end" : "flex justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-lg px-3 py-2 text-sm shadow-sm",
          isRight ? "bg-secondary text-foreground" : "bg-card text-foreground border",
        )}
      >
        {children}
      </div>
    </div>
  )
}
