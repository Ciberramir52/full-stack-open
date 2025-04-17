const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Pavarotti',
                username: 'frijolito52',
                password: 'insecurepass'
            }
        })
        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Blog app, CloseDreamers, Ciberramir52 2025')).toBeVisible()
    })

    describe('log in form can be opened', () => {
        test('user can log in', async ({ page }) => {
            await loginWith(page, 'frijolito52', 'insecurepass')

            await expect(page.getByText('frijolito52 logged in')).toBeVisible()
        })

        test('login fails with wrong password', async ({ page }) => {
            await loginWith(page, 'frijolito52', 'insecurepass2')

            const errorDiv = await page.locator('.error')

            await expect(errorDiv).toContainText('wrong username or password')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })

        describe('when logged in', () => {
            beforeEach(async ({ page }) => {
                await loginWith(page, 'frijolito52', 'insecurepass')
            })

            test('a new blog can be created', async ({ page }) => {
                await createBlog(page, 'El sandwich de crema', 'Linguini', 'https://www.test.com')
                await expect(page.getByText('El sandwich de crema Linguini')).toBeVisible()
            })

            describe('and several blogs exists', () => {
                beforeEach(async ({ page }) => {
                    await createBlog(page, 'El sandwich de crema', 'Linguini', 'https://www.test.com')
                    await createBlog(page, 'Pisando cocos', 'Costenio', 'https://www.testscs.com')
                    await createBlog(page, 'Carta Blanca', 'Vicente', 'https://www.testvic.com')
                })

                test('one of those can show more details', async ({ page }) => {
                    const otherBlogElement = await page.getByText('Pisando cocos Costenio').locator('../..')
                    await otherBlogElement.getByRole('button', { name: 'view' }).click()
                    await expect(otherBlogElement.getByText('Pisando cocos Costenio')).toBeVisible()
                    await expect(otherBlogElement.getByText('https://www.testscs.com')).toBeVisible()
                    await expect(otherBlogElement.getByText('likes 0')).toBeVisible()
                    await expect(otherBlogElement.getByText('Pavarotti')).toBeVisible()
                })

                describe('when showing more details', () => {
                    beforeEach(async ({ page }) => {
                        const otherBlogElement = await page.getByText('Pisando cocos Costenio').locator('..')
                        await otherBlogElement.getByRole('button', { name: 'view' }).click()
                    })

                    test('likes can be added', async ({ page }) => {
                        const otherBlogElement = await page.getByText('Pisando cocos Costenio').locator('../..')
                        await otherBlogElement.getByRole('button', { name: 'like' }).click()
                        await expect(otherBlogElement.getByText('likes 1')).toBeVisible()
                    })

                    describe('when adding likes', () => {
                        beforeEach(async ({ page }) => {
                            const anotherBlogElement = await page.getByText('Carta Blanca Vicente').locator('../..')
                            await anotherBlogElement.getByRole('button', { name: 'view' }).click()
                            await anotherBlogElement.getByRole('button', { name: 'like' }).click()
                            await anotherBlogElement.getByRole('button', { name: 'like' }).click()
                        })

                        test('check if the blogs are sorted by likes', async ({ page }) => {
                            const blogs = page.locator('.blog')
                            await expect(blogs.nth(0)).toContainText('Carta Blanca Vicente')
                        })
                    })

                    test('user non-creator of the blog cannot delete blog', async ({ page, request }) => {
                        await page.getByRole('button', { name: 'logout' }).click()

                        await request.post('/api/users', {
                            data: {
                                name: 'Cristiano',
                                username: 'comandante',
                                password: 'siusiusiu'
                            }
                        })

                        await loginWith(page, 'comandante', 'siusiusiu')

                        const otherBlogElement = await page.getByText('Pisando cocos Costenio').locator('../..')
                        await otherBlogElement.getByRole('button', { name: 'view' }).click()
                        await expect(otherBlogElement.getByText('Pisando cocos Costenio')).toBeVisible()
                        await expect(otherBlogElement.getByText('https://www.testscs.com')).toBeVisible()
                        await expect(otherBlogElement.getByText('likes 0')).toBeVisible()
                        await expect(otherBlogElement.getByText('Pavarotti')).toBeVisible()

                        await expect(otherBlogElement.getByRole('button', { name: 'delete' })).not.toBeVisible()
                    })

                    test('blog creator user can see delete button of his blog', async ({ page }) => {
                        const otherBlogElement = await page.getByText('Pisando cocos Costenio').locator('../..')
                        await expect(otherBlogElement.getByRole('button', { name: 'delete' })).toBeVisible()
                    })

                    test('creator of a blog can delete blog', async ({ page }) => {
                        const otherBlogElement = await page.getByText('Pisando cocos Costenio').locator('../..')
                        await otherBlogElement.getByRole('button', { name: 'delete' }).click()

                        page.on('dialog', async (dialog) => {
                            expect(dialog.type()).toBe('confirm')
                            expect(dialog.message()).toContain('Remove blog Pisando cocos by Costenio')
                            await dialog.accept()
                        });

                        await expect(page.getByText('Pisando cocos Costenio')).not.toBeVisible();
                    })
                })
            })
        })
    })

})