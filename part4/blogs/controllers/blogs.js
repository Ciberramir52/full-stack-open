const mongoose = require('mongoose')
const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    if (!request.token) return response.status(401).json({ error: 'no token provided' })

    const { title, author, url, likes = 0 } = request.body;

    // Verificar que los campos requeridos estén presentes
    if (!title || !author || !url) {
        return response.status(400).json({
            error: 'Missing required fields: title, author, url, likes or userId'
        });
    }

    const user = await User.findById(request.user.id)

    const blog = new Blog({ ...request.body, user: request.user.id, likes })
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save()
    response.status(201).json(savedBlog);
})

blogsRouter.get('/:id', async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    const blog = await Blog.findById(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {
    // await Blog.findByIdAndDelete(req.params.id);
    const blog = await Blog.findById(req.params.id);
    
    if (blog.user.toString() === req.user.id) {
        await Blog.deleteOne({ _id: req.params.id });
    }
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    const { likes } = req.body;

    if (!likes) {
        return response.status(400).json({
            error: 'Missing required field: likes'
        });
    }

    const response = await Blog.findById(req.params.id);
    const { _doc: blog } = response || {}

    if (blog) {
        const newBlog = { ...blog, likes }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, { new: true, runValidators: true, context: 'query' })
        res.json(updatedBlog)
    } else {
        res.status(404).end()
    }
})

module.exports = blogsRouter