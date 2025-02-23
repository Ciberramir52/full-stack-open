const _ = require('lodash')

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlogs = (blogs) => {
    const reducer = (favorite, item) => {
        return item.likes > favorite.likes ? item : favorite
    }

    return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    const authors = _.groupBy(blogs, 'author')
    const blogsQuantityPerAuthor = _.mapValues(authors, (author) => author.length)
    const maxAuthor = _.maxBy(Object.entries(blogsQuantityPerAuthor), (author) => author[1])
    return { author: maxAuthor[0], blogs: maxAuthor[1] }
}

const mostLikes = (blogs) => {
    const authors = _.groupBy(blogs, 'author')
    const reducer = (sum, item) => sum + item.likes
    const blogsLikesPerAuthor = _.mapValues(authors, (author) => author.reduce(reducer, 0))
    const maxAuthor = _.maxBy(Object.entries(blogsLikesPerAuthor), (author) => author[1])
    return { author: maxAuthor[0], likes: maxAuthor[1] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlogs,
    mostBlogs,
    mostLikes
}