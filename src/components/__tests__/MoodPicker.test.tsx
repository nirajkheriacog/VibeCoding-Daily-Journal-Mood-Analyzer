import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MoodPicker from '../MoodPicker'
import { MOOD_LIST, MOODS } from '../../constants'

describe('MoodPicker', () => {
  it('renders all 6 mood options', () => {
    render(<MoodPicker value={null} onChange={() => {}} />)
    for (const mood of MOOD_LIST) {
      expect(screen.getByRole('radio', { name: MOODS[mood].label })).toBeInTheDocument()
    }
  })

  it('calls onChange with correct mood on click', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<MoodPicker value={null} onChange={handleChange} />)

    await user.click(screen.getByRole('radio', { name: 'Happy' }))
    expect(handleChange).toHaveBeenCalledWith('happy')
  })

  it('marks selected mood with aria-checked', () => {
    render(<MoodPicker value="calm" onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Calm' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Happy' })).toHaveAttribute('aria-checked', 'false')
  })
})
