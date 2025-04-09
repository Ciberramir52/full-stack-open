const Blog = require("../models/blog")
const User = require('../models/user')
require('dotenv').config()

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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

// Connect once before all tests
// before(async () => {
//     await mongoose.connect(process.env.TEST_MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
// });

// Disconnect after all tests
// after(async () => {
//     await mongoose.connection.close();
// });

// // Reset data before each test
// beforeEach(async () => {
//     await Blog.deleteMany({});
//     await User.deleteMany({});
// });


module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb
}