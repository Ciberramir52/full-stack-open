import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('renders content', async () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'Test Author',
    'url': 'http://www.testurl.com',
    'likes': 5,
    'user': {
      'name': 'TestUser',
    }
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('renders blog content', async () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'Test Author',
    'url': 'http://www.testurl.com',
    'likes': 5,
    'user': {
      'name': 'TestUser',
    }
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('Component testing is done with react-testing-library', { exact: false })
  const author = screen.getByText('Test Author', { exact: false })
  const url = screen.getByText('http://www.testurl.com', { exact: false })
  const likes = screen.getByText('5', { exact: false })
  const userName = screen.getByText('TestUser', { exact: false })

  expect(title).toBeVisible()
  expect(author).toBeVisible()
  expect(url).not.toBeVisible()
  expect(likes).not.toBeVisible()
  expect(userName).not.toBeVisible()
})

test('render/hide details when clicking on button view/hide', async () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'Test Author',
    'url': 'http://www.testurl.com',
    'likes': 5,
    'user': {
      'name': 'TestUser',
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} addLikes={mockHandler} deleteBlog={mockHandler} />)

  const url = screen.getByText('http://www.testurl.com', { exact: false })
  const likes = screen.getByText('5', { exact: false })
  const userName = screen.getByText('TestUser', { exact: false })

  expect(url).not.toBeVisible()
  expect(likes).not.toBeVisible()
  expect(userName).not.toBeVisible()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(url).toBeVisible()
  expect(likes).toBeVisible()
  expect(userName).toBeVisible()

  await user.click(button)

  expect(url).not.toBeVisible()
  expect(likes).not.toBeVisible()
  expect(userName).not.toBeVisible()
})

test('add likes when clicking like button', async () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'Test Author',
    'url': 'http://www.testurl.com',
    'likes': 5,
    'user': {
      'name': 'TestUser',
    }
  }

  const mockAddlikes = vi.fn()

  render(<Blog blog={blog} addLikes={mockAddlikes} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockAddlikes.mock.calls).toHaveLength(2)
})

test('delete blog when clicking delete button', async () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'Test Author',
    'url': 'http://www.testurl.com',
    'likes': 5,
    'user': {
      'name': 'TestUser',
    }
  }

  const mockDeleteBlog = vi.fn()

  render(<Blog blog={blog} deleteBlog={mockDeleteBlog} />)

  const user = userEvent.setup()
  const button = screen.getByText('delete')
  await user.click(button)

  expect(mockDeleteBlog.mock.calls).toHaveLength(1)
})