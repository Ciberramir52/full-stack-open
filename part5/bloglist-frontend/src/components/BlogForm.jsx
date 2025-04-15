import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const { title, author, url } = newBlog
  const handleBlogChange = (target) => {
    setNewBlog({
      ...newBlog,
      [target.name]: target.value
    })
  }

  const handleBlogCreate = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleBlogCreate}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="title"
            // onChange={({ target }) => setTitle(target.value)}
            onChange={({ target }) => handleBlogChange(target)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="author"
            // onChange={({ target }) => setAuthor(target.value)}
            onChange={({ target }) => handleBlogChange(target)}
          />
        </div>
        <div>
          url:
          <input
            type="url"
            value={url}
            name="url"
            // onChange={({ target }) => setUrl(target.value)}
            onChange={({ target }) => handleBlogChange(target)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm