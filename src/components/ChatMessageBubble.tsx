import type { ChatMessage } from '../types'
import { parseChatContent } from '../utils/parseChatContent'

interface ChatMessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export default function ChatMessageBubble({ message, isStreaming }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-white border border-gray-200 text-gray-700'
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {isUser ? message.content : parseChatContent(message.content)}
          {isStreaming && !isUser && message.content.length > 0 && (
            <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
        {!isUser && message.content.length === 0 && isStreaming && (
          <div className="flex gap-1 py-1">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  )
}
