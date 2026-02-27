import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EntryForm from '../EntryForm'
import type { JournalEntry } from '../../types'

describe('EntryForm', () => {
  it('renders empty form in create mode', () => {
    render(<EntryForm onSubmit={() => {}} />)
    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByLabelText('Journal Entry')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Save Entry' })).toBeInTheDocument()
  })

  it('pre-fills form in edit mode', () => {
    const entry: JournalEntry = {
      id: '1',
      date: '2026-02-27',
      mood: 'happy',
      title: 'My Day',
      body: 'Great day!',
      createdAt: '2026-02-27T10:00:00.000Z',
    }
    render(<EntryForm initialData={entry} onSubmit={() => {}} />)
    expect(screen.getByLabelText('Title')).toHaveValue('My Day')
    expect(screen.getByLabelText('Journal Entry')).toHaveValue('Great day!')
    expect(screen.getByRole('button', { name: 'Update Entry' })).toBeInTheDocument()
  })

  it('shows validation when submitting without mood or title', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<EntryForm onSubmit={handleSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Save Entry' }))

    expect(screen.getByText('Please select a mood')).toBeInTheDocument()
    expect(screen.getByText('Title is required')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with correct data on valid submission', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<EntryForm onSubmit={handleSubmit} />)

    await user.click(screen.getByRole('radio', { name: 'Happy' }))
    await user.type(screen.getByLabelText('Title'), 'My Great Day')
    await user.type(screen.getByLabelText('Journal Entry'), 'Today was awesome')
    await user.click(screen.getByRole('button', { name: 'Save Entry' }))

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        mood: 'happy',
        title: 'My Great Day',
        body: 'Today was awesome',
      }),
    )
  })

  it('shows cancel button when onCancel is provided', () => {
    render(<EntryForm onSubmit={() => {}} onCancel={() => {}} />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })
})
