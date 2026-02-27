import CitationLink from '../components/CitationLink'

export function parseChatContent(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const pattern = /\[\[cite:([^|]+)\|([^\]]+)\]\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index))
    }
    parts.push(
      <CitationLink key={`cite-${match.index}`} entryId={match[1]} displayText={match[2]} />,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex))
  }

  return parts
}
