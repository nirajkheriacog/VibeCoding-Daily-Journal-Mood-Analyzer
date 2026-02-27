import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/Layout'
import TodayPage from './pages/TodayPage'
import HistoryPage from './pages/HistoryPage'
import EntryDetailPage from './pages/EntryDetailPage'
import InsightsPage from './pages/InsightsPage'
import ChatPage from './pages/ChatPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: 'entries', element: <HistoryPage /> },
      { path: 'entries/:id', element: <EntryDetailPage /> },
      { path: 'insights', element: <InsightsPage /> },
      { path: 'chat', element: <ChatPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
