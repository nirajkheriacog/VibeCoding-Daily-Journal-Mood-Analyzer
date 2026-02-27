import { useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router'
import type { EntriesContextType } from '../types'
import { useChat } from '../hooks/useChat'
import ChatMessageBubble from '../components/ChatMessageBubble'
import ChatInput from '../components/ChatInput'

const SUGGESTED_QUESTIONS = [
  'What patterns do you see in my mood?',
  'When was I happiest?',
  'Are there any triggers for my anxious days?',
  'Give me a summary of my journal.',
  'How was my week?',
]

export default function ChatPage() {
  const { entries } = useOutletContext<EntriesContextType>()
  const { messages, error, sendMessage, clearMessages, clearError } = useChat(entries)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Ask My Journal</h2>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearMessages}
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-4xl mb-3">&#128172;</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ask anything about your journal
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Get insights, find patterns, or revisit past entries. Your {entries.length}{' '}
              journal {entries.length === 1 ? 'entry is' : 'entries are'} ready to explore.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-3 flex items-center justify-between flex-shrink-0">
          <p className="text-sm">{error}</p>
          <button
            type="button"
            onClick={clearError}
            className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput onSend={sendMessage} disabled={false} />
      </div>
    </div>
  )
}
