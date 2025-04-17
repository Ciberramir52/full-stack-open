const express = require('express')
const { MONGODB_URI } = require('./utils/config')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const errorHandler = require('./controllers/errorHandler')
const loginRouter = require('./controllers/login')
const tokenExtractor = require('./middlewares/tokenExtractor')
const userExtractor = require('./middlewares/userExtractor')

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
app.use(tokenExtractor)

app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

module.exports = app