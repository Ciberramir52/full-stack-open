const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    let userTest;

    beforeEach(async () => {
        await User.deleteMany({});
        await Blog.deleteMany({});
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'cricri', passwordHash })
        await user.save()
        const response = await api
            .post('/api/login')
            .send({ username: user.username, password: 'sekret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const initialBlogs = helper.initialBlogs.map(b => ({ ...b, user: user.id }))
        await Blog.insertMany(initialBlogs);
        userTest = response.body;
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${userTest.token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${userTest.token}`)
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${userTest.token}`)
        const titles = response.body.map(e => e.title)
        assert.strictEqual(titles.includes('Tengo esta situacion'), true)
    })

    test('all the blogs has the identifier id instead of _id, also delete v property', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${userTest.token}`)

        response.body.forEach((e, index) => {
            // Verificar que cada libro tiene la propiedad 'id'
            assert.strictEqual('id' in e, true, `El blog en el índice ${index} tiene la propiedad 'id'`);

            // Verificar que no tiene la propiedad '_id'
            assert.strictEqual('_id' in e, false, `El blog en el índice ${index} no debería tener la propiedad '_id'`);

            // Verificar que no tiene la propiedad 'v'
            assert.strictEqual('v' in e, false, `El blog en el índice ${index} no debería tener la propiedad '_id'`);
        });
    })

    describe('viewing a specific blog', () => {
        test('a specific blog can be viewed', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, { ...blogToView, user: blogToView.user.toString() })
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/blogs/${invalidId}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .expect(400)
        })
    })

    describe('addition of a new blog', () => {
        test('a valid blog can be added ', async () => {
            const newBlog = {
                title: "Mi ida a Tailandia",
                author: "Pedro56",
                url: "http",
                likes: 100
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${userTest.token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            // const response = await api.get('/api/blogs')
            // assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(r => r.title)
            assert(titles.includes('Mi ida a Tailandia'))
        })

        test('blog without likes can be added as 0 likes', async () => {
            const newBlog = {
                title: "Mi ida a Tailandia",
                author: "Pedro56",
                url: "http",
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${userTest.token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            // const response = await api.get('/api/blogs')
            // assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const requiredObject = blogsAtEnd.find(r => r.title === 'Mi ida a Tailandia')

            assert.strictEqual(requiredObject.title, 'Mi ida a Tailandia')
            assert.strictEqual(requiredObject.likes, 0)
        })

        test('blog without content is not added', async () => {
            const newBlog = {
                likes: 2
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${userTest.token}`)
                .send(newBlog)
                .expect(400)

            // const response = await api.get('/api/blogs')
            // assert.strictEqual(response.body.length, helper.initialBlogs.length)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('a blog can be deleted', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const titles = blogsAtEnd.map(r => r.title)
            assert(!titles.includes(blogToDelete.title))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        })
    })

    describe('update of a blog', () => {
        test('fails with statuscode 404 if blog does not exist', async () => {
            const infoForUpdate = { likes: 3 }
            const validNonexistingId = await helper.nonExistingId()

            await api
                .put(`/api/blogs/${validNonexistingId}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .send(infoForUpdate)
                .expect(404)
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'
            const infoForUpdate = { likes: 3 }

            await api
                .put(`/api/blogs/${invalidId}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .send(infoForUpdate)
                .expect(400)
        })

        test('fails with statuscode 400 if there is no info to update', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .put(`/api/blogs/${invalidId}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .expect(400)
        })

        test('a valid blog can be updated', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const infoForUpdate = { likes: 3 }

            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .put(`/api/blogs/${blogToView.id}`)
                .set('Authorization', `Bearer ${userTest.token}`)
                .send(infoForUpdate)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, { ...blogToView, ...infoForUpdate, user: blogToView.user.toString() })
        })
    })
})

after(async () => {
    // await Blog.deleteMany({});
    // await User.deleteMany({});
    await mongoose.connection.close()
})