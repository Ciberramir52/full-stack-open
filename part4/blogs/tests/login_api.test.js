const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const api = supertest(app)

describe('user login', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'kaka', passwordHash })

        await user.save()
    })

    test('let user login with right credentials', async () => {
        // const usersAtStart = await helper.usersInDb()

        const userLogin = {
            username: 'kaka',
            password: 'sekret',
        }

        const response = await api
            .post('/api/login')
            .send(userLogin)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const { body } = response;

        assert.strictEqual(body.username, userLogin.username)

        assert.ok(body.hasOwnProperty('token'));

        assert.strictEqual(typeof body.token, 'string');
    })

    test('deny user login with wrong username', async () => {
        // const usersAtStart = await helper.usersInDb()

        const userLogin = {
            username: 'kaka1',
            password: 'sekret',
        }

        const response = await api
            .post('/api/login')
            .send(userLogin)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        assert(response.body.error.includes("invalid username or password"))
    })

    test('deny user login with wrong password', async () => {
        // const usersAtStart = await helper.usersInDb()

        const userLogin = {
            username: 'kaka',
            password: 'sekret1',
        }

        const response = await api
            .post('/api/login')
            .send(userLogin)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        assert(response.body.error.includes("invalid username or password"))
    })

})

after(async () => {
    // await User.deleteMany({});
    await mongoose.connection.close()
})