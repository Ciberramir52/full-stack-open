import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [successfulMessage, setSuccessfulMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const { token = null } = user || {}

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    console.log('useEffect', user)
    blogService.getAll(token).then(blogs => {
      setBlogs(blogs)
    })
  }, [user, token])

  const handleAddBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.create(blogObject)

      console.log(blog)

      setSuccessfulMessage(
        `a new blog ${blog.title} by ${blog.author} added`
      )

      setTimeout(() => {
        setSuccessfulMessage(null)
      }, 5000)

      setBlogs(blogs.concat({ ...blog, user }))
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDeleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.deleteBlog(blog.id)
        const newBlogs = blogs.filter(b => b.id !== blog.id)
        setBlogs(newBlogs)
      }
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleAddLikes = (blog) => {
    try {
      const updatedBlog = {
        title: blog.title,
        likes: blog.likes + 1,
        author: blog.author,
        url: blog.url,
        // user: blog.user.id
      }
      blogService.addLikes(blog.id, { ...updatedBlog, user: blog.user.id })
      const updatedBlogs = blogs.map(b => b.id === blog.id ? { ...updatedBlog, id: blog.id, user: blog.user } : b)
      setBlogs(updatedBlogs)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel='log in'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <h3>Blog app, CloseDreamers, Ciberramir52 2025</h3>

      <Notification type="successful" message={successfulMessage} />
      <Notification type="error" message={errorMessage} />

      {
        user
          ? <p>{user.username} logged in <button onClick={handleLogOut}>logout</button></p>
          : loginForm()
      }


      {
        user &&
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={handleAddBlog} />
        </Togglable>
      }


      {user && blogs.sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog user={user} key={blog.id} blog={blog} addLikes={handleAddLikes} deleteBlog={handleDeleteBlog} />
        )}
    </div>
  )
}

export default App