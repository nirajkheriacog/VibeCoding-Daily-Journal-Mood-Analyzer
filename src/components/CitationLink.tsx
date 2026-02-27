import { Link } from 'react-router'

interface CitationLinkProps {
  entryId: string
  displayText: string
}

export default function CitationLink({ entryId, displayText }: CitationLinkProps) {
  return (
    <Link
      to={`/entries/${entryId}`}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors no-underline"
    >
      <span aria-hidden="true">&#128214;</span>
      {displayText}
    </Link>
  )
}
