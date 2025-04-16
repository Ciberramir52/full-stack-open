import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const author = container.querySelector('#author')
  const title = container.querySelector('#title')
  const url = container.querySelector('#url')
  const sendButton = screen.getByText('create')

  await user.type(title, 'testing a form...')
  await user.type(author, 'Testing Author')
  await user.type(url, 'https://www.testurl.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing Author')
  expect(createBlog.mock.calls[0][0].url).toBe('https://www.testurl.com')
})