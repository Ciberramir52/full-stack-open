const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI, PORT } = require('./utils/config')
const Blog = require('./models/blog')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

mongoose.set('strictQuery', false)

logger.info('connecting to MongoDB')

mongoose.connect(MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.info('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})