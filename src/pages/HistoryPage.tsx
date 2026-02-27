import { useOutletContext } from 'react-router'
import type { EntriesContextType } from '../types'
import EntryList from '../components/EntryList'

export default function HistoryPage() {
  const { entries } = useOutletContext<EntriesContextType>()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Journal History</h2>
      <EntryList entries={entries} />
    </div>
  )
}
