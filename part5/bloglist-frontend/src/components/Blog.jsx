import { useState } from 'react'
import blogService from '../services/blogs'

const Blog   = ({ blog, addLikes, deleteBlog, user = {} }) => {
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

  return (
    <div className='blog' style={blogStyle}>
      <div>
        <span>{blog.title} {blog.author}</span><button onClick={toggleVisibility}>{visibleButton}</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={() => addLikes(blog)}>like</button></p>
        <p>{blog.user.name}</p>
        {
          user.name === blog.user.name && <button onClick={() => deleteBlog(blog)}>delete</button>
        }
      </div>
    </div>
  )
}

export default Blog