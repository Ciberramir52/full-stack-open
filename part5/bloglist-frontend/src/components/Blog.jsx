import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, addLikes, deleteBlog }) => {
  // const [blogInfo, setBlogInfo] = useState(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const visibleButton = visible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onAddLikes = () => {
    const updatedBlog = {
      title: blog.title,
      likes: blog.likes + 1,
      author: blog.author,
      url: blog.url,
      // user: blog.user.id
    }
    blogService.addLikes(blog.id, { ...updatedBlog, user: blog.user.id })
    addLikes({ ...updatedBlog, id: blog.id, user: blog.user })
  }

  const onDeleteBlog = () => {
    blogService.deleteBlog(blog.id)
    deleteBlog(blog.id)
  }


  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visibleButton}</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={onAddLikes}>like</button></p>
        <p>{blog.user.name}</p>
        <button onClick={onDeleteBlog}>delete</button>
      </div>
    </div>
  )
}

export default Blog