const Blog = require("../models/blog")

const initialBlogs = [
    {
        title: "Como ven?",
        author: "Anonimous",
        url: "http",
        likes: 2
    },
    {
        title: "Tengo esta situacion",
        author: "user2250",
        url: "http",
        likes: 3
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: 'None', likes: 0, url: 'http' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}