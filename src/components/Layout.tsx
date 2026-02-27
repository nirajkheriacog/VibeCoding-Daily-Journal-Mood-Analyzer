import { NavLink, Outlet } from 'react-router'
import { useEntries } from '../hooks/useEntries'

const NAV_ITEMS = [
  { to: '/', label: 'Today' },
  { to: '/entries', label: 'History' },
  { to: '/insights', label: 'Insights' },
  { to: '/chat', label: 'Ask' },
]

export default function Layout() {
  const entriesHook = useEntries()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">Daily Journal</h1>
          <nav className="flex gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Outlet context={entriesHook} />
      </main>
    </div>
  )
}
