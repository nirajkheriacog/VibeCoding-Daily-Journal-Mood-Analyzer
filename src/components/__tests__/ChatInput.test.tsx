import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInput from '../ChatInput'

describe('ChatInput', () => {
  it('renders input and send button', () => {
    render(<ChatInput onSend={() => {}} disabled={false} />)
    expect(screen.getByPlaceholderText('Ask about your journal...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('send button is disabled when input is empty', () => {
    render(<ChatInput onSend={() => {}} disabled={false} />)
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })

  it('calls onSend with message on submit', async () => {
    const user = userEvent.setup()
    const handleSend = vi.fn()
    render(<ChatInput onSend={handleSend} disabled={false} />)

    await user.type(screen.getByPlaceholderText('Ask about your journal...'), 'How am I doing?')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(handleSend).toHaveBeenCalledWith('How am I doing?')
  })

  it('clears input after sending', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSend={() => {}} disabled={false} />)

    const input = screen.getByPlaceholderText('Ask about your journal...')
    await user.type(input, 'Test message')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(input).toHaveValue('')
  })

  it('shows disabled placeholder when disabled', () => {
    render(<ChatInput onSend={() => {}} disabled={true} />)
    expect(screen.getByPlaceholderText('Claude is thinking...')).toBeInTheDocument()
  })
})
