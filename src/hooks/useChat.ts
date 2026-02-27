import { useState, useCallback } from 'react'
import type { JournalEntry, ChatMessage } from '../types'
import { analyzeQuery } from '../utils/journalAnalyzer'

export function useChat(entries: JournalEntry[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    (content: string) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        citations: [],
        timestamp: new Date().toISOString(),
      }

      const result = analyzeQuery(content, entries)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.content,
        citations: result.citations,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setError(null)
    },
    [entries],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { messages, isStreaming: false, error, sendMessage, clearMessages, clearError }
}
