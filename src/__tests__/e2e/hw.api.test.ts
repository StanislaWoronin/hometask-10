import request from 'supertest'
import {app} from "../../index";

jest.setTimeout(30000)

describe('/posts', () => {
    beforeEach(async  () => {
        await  request(app).delete('/testing/all-data')
    })

// Blogs router test

    // Method POST

    it('Method POST /blogs. Expected 401 - unauthorized', async  () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .expect(401)
    })

    it('Method POST /blogs. Expected 400 - bad request', async () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "",
                "youtubeUrl": ""
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method POST /blogs. Expected 400 - so long request', async () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "iW5g62pgeFlDUQPf", // 16
                "youtubeUrl": "Tauarym2ql7Yd1HOYOX4e5cNULuH7w1w7B4ZRnFrRD39szf8oKDvmzYss8VU2dxTKyWl2Bs527HhycUrpigYpFsTiYnzN5ULlx034" // 101
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method POST /blogs + GET /blogs/id. Expected 201 - return new blog', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createResponse.body

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: createResponse.body.name,
            youtubeUrl: expect.stringMatching(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        })

        const blog = await request(app)
            .get(`/blogs/${createdBlog.id}`)
            .expect(200)

        expect(blog.body).toEqual(createdBlog)
    })

    it('Method POST /blogs/blogsId/posts. Expected 404 - blog not found', async () => {
        const createBlog = await request(app)
            .post('/blogs/0/posts')
            .send({
                "title": "string",
                "shortDescription": "string",
                "content": "string"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(404)
    })

    it('Method POST /blogs/blogsId/posts. Expected 401 - unauthorized', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createBlog.body

        await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .send({
                    "title": "Beautiful title",
                    "shortDescription": "Some interesting description",
                    "content": "Useful content"
            })
            .expect(401)
    })

    it('Method POST /blogs/blogsId/posts. Expected 400 - incorrect input model', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createBlog.body

        await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .send({
                "title": "",
                "shortDescription": "",
                "content": "",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method POST /blogs/blogsId/posts. Expected 400 - so long request', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createBlog.body

        await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .send({
                "title": "T3xdTb29DLyC1guW7us6dE9SOvAbb7c", // 31
                "shortDescription": "VM5sNPHGh9R6rbLuhxhYYSrbRSPSA1klIzZsNkP6TLAnp0zVpoCbKYhG83rExAFd5nSHGTyZdBuv3FjN5lWmMiX7O0mcrSD2GU9BK", // 101
                "content": "vrLXFe8tMVRPeg2hyM4JSs8gLXJKdwwj5SgwfRQIMrrcIKsoF3XXKpi102Bc0BKsKo9dZhw2sdJdqXYBGXOm7bkERRkawYzAncxnMjeD0uMmdDZdacVcgXMj2TrAAGz8hXkslsheanJglrShZJIkcvZ16rioXlrtys1ruKI6M9ckRIHILod3mxrWxDAsjlMuIWqSXhxrV0Pxnv5m7qGLHcHfuLhsqtcxnsYsHyDqctrUI21DJB4q5KK1t2CIUk8X8Gcsu0htLZoGIHghO4ZRWN8SEAgkRkI8boIQ7X68DcihnHjv00yunzaFDhMjwBWdso2aoakEui0u7LNvNp57C0ccOp5tNQnYnpxQHUfJ4nnt5zJSGAvlgKw1kFZjr7Kql2H9imVrh4U2Vs2vTEzLqWDwrG5OkzCo0q1M7fy52YNxMNO2n60hgUOECySmPvaqyyhhPAD17j88mM9j9TdANzFTCtWDkDEYVEpXAG95M8EGIpM1LJ7PoQJzszhMi7Odka25xK98FgnzwqB1cLHOfuyE6rqxguWe3bcEdJzAf16NLFQTQOu4jZfCIm0rSRnTWquEGyb7gHxQYlVM4BTbVPgj8THdc2QS28RGEvtS7A2ZUZSShIAlRHr99Hd8BuXN9N10FiiRH43i8oYukGqBb0F45F7Xh8BH6wj5D8lqXJW73iAlNePvSt4P569pLUAtPjp59HFQpPOByn34mszFPjbRgiSl7wE7gAU11rYU64zsbgS0QISBVYOXE6mtECwmLxBTi7clXGw37tWGt3cpqtyzKDMwUIBnfQBy0IjDalcIpmZFV9u2vK6EcsdOoyZcmJseTbU0owUJiJnKpqLE1zWFKC4Pvh4JitBRUuFufWDcuoSeZGCgYMJqjkDQTnbZe9RYz88iqwMbDq87TzmW62jZ52ow6MhQYYmaJfvbEYKHgaikXt0a94KTs5lXcqYh7jiqs6TYGSWHKdFLvw1K8omZu2QTo8d5aco3YRhv0", // 1001
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method POST /blogs/blogsId/posts + GET /posts/blogId. Expected 201 - return created post by blogId', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createBlog.body

        const createPost = await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdPost = createPost.body

        expect(createdPost).toEqual({
            id: expect.any(String),
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdBlog.id,
            blogName: createdBlog.name,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        })

        const post = await request(app)
            .get(`/posts/${createdPost.id}`)
            .expect(200)

        expect(post.body).toEqual(createdPost)
    })

    // Method GET (GET by id method is checked in POST)

    it('Method GET /blogs without input query parameters. ' +
             'Expected 200 - return page with blogs ', async () => {
        const createBlog1 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog1",
                "youtubeUrl": "https://someurl2.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

           const createBlog2 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog2",
                "youtubeUrl": "https://someurl2.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog1 = createBlog1.body
        const createdBlog2 = createBlog2.body

        const expectItems = [createdBlog2, createdBlog1]

        const givePageWithBlogs = await request(app)
            .get('/blogs')
            .expect(200)

        const createdPageWithBlogs = givePageWithBlogs.body

        expect(createdPageWithBlogs).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expectItems
        })
    })

    it('Method GET /blogs with searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc.' +
       'Expected 200 - return page with 2 blogs', async () => {
        const createBlog1 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog1",
                "youtubeUrl": "https://someurl4.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog2 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog2",
                "youtubeUrl": "https://someurl3.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog3 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog3",
                "youtubeUrl": "https://someurl2.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog4 = await request(app)
            .post('/blogs')
            .send({
                "name": "blog4",
                "youtubeUrl": "https://someurl1.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog1 = createBlog1.body
        const createdBlog2 = createBlog2.body
        const createdBlog3 = createBlog3.body

        const expectItems = [createdBlog3, createdBlog2]

        const createResponse = await request(app)
            .get('/blogs?searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc')
            .expect(200)

        const createdPageWithBlogs = createResponse.body

        expect(createdPageWithBlogs).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET /blogs with searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc&pageNumber=2.' +
        'Expected 200 - return page with 1 blog', async () => {
        const createBlog1 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog1",
                "youtubeUrl": "https://someurl4.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog2 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog2",
                "youtubeUrl": "https://someurl3.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog3 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog3",
                "youtubeUrl": "https://someurl2.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog4 = await request(app)
            .post('/blogs')
            .send({
                "name": "blog4",
                "youtubeUrl": "https://someurl1.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog1 = createBlog1.body

        const expectItems = [createdBlog1]

        const createResponse = await request(app)
            .get('/blogs?searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc&pageNumber=2')
            .expect(200)

        const createdPageWithBlogs = createResponse.body

        expect(createdPageWithBlogs).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET by id. Expected 404 - blog not found', async () => {
        await request(app)
            .get('/blogs/0')
            .expect(404)
    })

    it('Method GET /blogs/blogId/posts. Expect 404 - blog not found', async () => {
        await request(app)
            .get('/blogs/0')
            .expect(404)
    })

    it('Method GET /blogs/blogId/posts with pageSize=2&sortBy=title&sortDirection=asc&pageNumber=2' +
        'Expect 200 - return page with 1 post', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlogId = createNewBlog.body.id

        await request(app)
            .post(`/blogs/${createdBlogId}/posts`)
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .get(`/blogs/${createdBlogId}/posts?pageSize=2&sortBy=title&sortDirection=asc&pageNumber=2`)
            .expect(200)
    })

    it('Method GET /blogs/blogId/posts without input query parameters.' +
             'Expect 200 - return page with post', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        const createPost1 = await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .send({
                "title": "Beautiful title1",
                "shortDescription": "Some interesting description1",
                "content": "Useful content1",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost2 = await request(app)
            .post(`/blogs/${createdBlog.id}/posts`)
            .send({
                "title": "Beautiful title2",
                "shortDescription": "Some interesting description2",
                "content": "Useful content2",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdPost1 = createPost1.body
        const createdPost2 = createPost2.body

        const expectItems = [createdPost2, createdPost1]

        const givePageWithPosts = await request(app)
            .get(`/blogs/${createdBlog.id}/posts`)
            .expect(200)

        const createdPageWithPosts = givePageWithPosts.body

        expect(createdPageWithPosts).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expectItems
        })
    })

    it('Method GET /blogs/blogId/posts with pageSize=2&sortBy=title&sortDirection=asc' +
       'Expect 200 - return page with 2 posts', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlogs = createNewBlog.body

        await request(app)
            .post(`/blogs/${createdBlogs.id}/posts`)
            .send({
                "title": "Beautiful title4",
                "shortDescription": "Some interesting description4",
                "content": "Useful content4"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost2 = await request(app)
            .post(`/blogs/${createdBlogs.id}/posts`)
            .send({
                "title": "Beautiful title3",
                "shortDescription": "Some interesting description3",
                "content": "Useful content3",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost3 = await request(app)
            .post(`/blogs/${createdBlogs.id}/posts`)
            .send({
                "title": "Beautiful title2",
                "shortDescription": "Some interesting description2",
                "content": "Useful content2",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdPost2 = createPost2.body
        const createdPost3 = createPost3.body

        const expectItems = [createdPost3, createdPost2]

        const createResponse = await request(app)
            .get(`/blogs/${createdBlogs.id}/posts?pageSize=2&sortBy=title&sortDirection=asc`)
            .expect(200)

        const createdPageWithPosts = createResponse.body

        expect(createdPageWithPosts).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET /blogs/blogId/posts with pageSize=2&sortBy=title&sortDirection=asc&pageNumber=2' +
        'Expect 200 - return page with 1 post', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlogs = createNewBlog.body

        const createPost1 = await request(app)
            .post(`/blogs/${createdBlogs.id}/posts`)
            .send({
                "title": "Beautiful title4",
                "shortDescription": "Some interesting description4",
                "content": "Useful content4"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post(`/blogs/${createdBlogs.id}/posts`)
            .send({
                "title": "Beautiful title3",
                "shortDescription": "Some interesting description3",
                "content": "Useful content3",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post(`/blogs/${createdBlogs.id}/posts`)
            .send({
                "title": "Beautiful title2",
                "shortDescription": "Some interesting description2",
                "content": "Useful content2",
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdPost1 = createPost1.body

        const expectItems = [createdPost1]

        const createResponse = await request(app)
            .get(`/blogs/${createdBlogs.id}/posts?pageSize=2&sortBy=title&sortDirection=asc&pageNumber=2`)
            .expect(200)

        const createdPageWithPosts = createResponse.body

        expect(createdPageWithPosts).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    // Method PUT

    it('Method PUT /blogs by id. Expected 401 - unauthorized', async () => {
        await request(app)
            .put('/blogs/' + '0')
            .send({
                "name": "old blog",
                "youtubeUrl": "https://someoldurl.com"
            })
            .expect(401)
    })

    it('Method PUT by id. Expected 404 - blog not found', async () => {
        await request(app)
            .put('/blogs/' + '0')
            .send({
                "name": "old blog",
                "youtubeUrl": "https://someoldurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(404)
    })

    it('Method PUT by id. Expected 400 - bad request', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        await request(app)
            .put('/blogs/' + createdBlog.id)
            .send({
                "name": "",
                "youtubeUrl": ""
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method PUT by id. Expected 400 - bad request, so long', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        await request(app)
            .put('/blogs/' + createdBlog.id)
            .send({
                "name": "hfZGIF8GkFak8aWc", // 16
                "youtubeUrl": "VEkg6zSttbWNu4IbtUGj0BBOadu123TqMegg5YlVOlYZRiTtVm1phDbKTacjEVf5G0WGyx10oErbCAEaNAmWsw6hMJFlgv29wabvn" // 101
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method PUT by id. Expected 204 - update blog', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        await request(app)
            .put('/blogs/' + createdBlog.id)
            .send({
                "name": "old blog",
                "youtubeUrl": "https://someoldurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(204)
    })

    // Method DELETE

    it('Method DELETE /blogs.Expect 404 - blog not found', async ()=> {
        await request(app)
            .delete('/blogs/0')
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(404)
    })

    it('Method DELETE /blogs.Expect 401 - unauthorized', async ()=> {
        await request(app)
            .delete('/blogs/0')
            .expect(401)
    })

// Posts router test

    // Method POST

    it('Method POST /posts. Expected 401 - unauthorized', async  () => {
        await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": "string"
            })
            .expect(401)
    })

    it('Method POST /posts. Expected 400 - bad request', async () => {
        await request(app)
            .post('/posts')
            .send({
                "title": "",
                "shortDescription": "",
                "content": "",
                "blogId": ""
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method POST /posts. Expected 400 - so long request', async () => {
        await request(app)
            .post('/posts')
            .send({
                "title": "T3xdTb29DLyC1guW7us6dE9SOvAbb7c", // 31
                "shortDescription": "VM5sNPHGh9R6rbLuhxhYYSrbRSPSA1klIzZsNkP6TLAnp0zVpoCbKYhG83rExAFd5nSHGTyZdBuv3FjN5lWmMiX7O0mcrSD2GU9BK", // 101
                "content": "vrLXFe8tMVRPeg2hyM4JSs8gLXJKdwwj5SgwfRQIMrrcIKsoF3XXKpi102Bc0BKsKo9dZhw2sdJdqXYBGXOm7bkERRkawYzAncxnMjeD0uMmdDZdacVcgXMj2TrAAGz8hXkslsheanJglrShZJIkcvZ16rioXlrtys1ruKI6M9ckRIHILod3mxrWxDAsjlMuIWqSXhxrV0Pxnv5m7qGLHcHfuLhsqtcxnsYsHyDqctrUI21DJB4q5KK1t2CIUk8X8Gcsu0htLZoGIHghO4ZRWN8SEAgkRkI8boIQ7X68DcihnHjv00yunzaFDhMjwBWdso2aoakEui0u7LNvNp57C0ccOp5tNQnYnpxQHUfJ4nnt5zJSGAvlgKw1kFZjr7Kql2H9imVrh4U2Vs2vTEzLqWDwrG5OkzCo0q1M7fy52YNxMNO2n60hgUOECySmPvaqyyhhPAD17j88mM9j9TdANzFTCtWDkDEYVEpXAG95M8EGIpM1LJ7PoQJzszhMi7Odka25xK98FgnzwqB1cLHOfuyE6rqxguWe3bcEdJzAf16NLFQTQOu4jZfCIm0rSRnTWquEGyb7gHxQYlVM4BTbVPgj8THdc2QS28RGEvtS7A2ZUZSShIAlRHr99Hd8BuXN9N10FiiRH43i8oYukGqBb0F45F7Xh8BH6wj5D8lqXJW73iAlNePvSt4P569pLUAtPjp59HFQpPOByn34mszFPjbRgiSl7wE7gAU11rYU64zsbgS0QISBVYOXE6mtECwmLxBTi7clXGw37tWGt3cpqtyzKDMwUIBnfQBy0IjDalcIpmZFV9u2vK6EcsdOoyZcmJseTbU0owUJiJnKpqLE1zWFKC4Pvh4JitBRUuFufWDcuoSeZGCgYMJqjkDQTnbZe9RYz88iqwMbDq87TzmW62jZ52ow6MhQYYmaJfvbEYKHgaikXt0a94KTs5lXcqYh7jiqs6TYGSWHKdFLvw1K8omZu2QTo8d5aco3YRhv0", // 1001
                "blogId": "string"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method POST /posts + GET /posts/id. Expected 201 - return new post', async  () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createBlog.body

        const createResponse = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdPost = createResponse.body

        expect(createdPost).toEqual({
            id: expect.any(String),
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: expect.any(String),
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        })

        const post = await request(app)
            .get(`/posts/${createdPost.id}`)

        expect(post.body).toEqual(createdPost)
    })

    it('Method POST /posts/postId/comments + POST /users`with 201 + POST /auth with 200. Expect 404 - Post with this ID doesn`t exist', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        await request(app)
            .post('/posts/0/comments')
            .send({
                "content": "sn3uq3TtYPZSRMO51ouM" // 20
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(404)
    })

    it('Method POST /posts/postId/comments + POST /users`with 201 + POST /auth with 200. Expect 401 - Unauthorized', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        await request(app)
            .post('/posts/0/comments')
            .send({
                "content": "sn3uq3TtYPZSRMO51ouM" // 20
            })
            .expect(401)
    })

    it('Method POST /posts/postId/comments + POST /users`with 201 + POST /auth with 200. Expect 400 - So short input values', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createResponse = await request(app)
            .post('/posts/0/comments')
            .send({
                "content": "sn3uq3TtYPZSRMO51ou" // 19
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "content"
                }
            ]
        })
    })

    it('Method POST /posts/postId/comments + POST /users`with 201 + POST /auth with 200. Expect 400 - So long input values', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createResponse = await request(app)
            .post('/posts/0/comments')
            .send({
                "content": "tngMx9qTDl9Uo5S2XvFmc2TensV8Jl7OED8xhqw4OZCqTTKkd5AuZfJ47AFxtmuuo5EIM8sc0GBDIFqJWgfVVoct8RdvssC1l5lB1mdTjwfRBRgtUGpUOMB5bZarTCjMvVvGKiCWfVgQqtKCzXSqhVrebd3PIpkYXvx5tR3jOu3doTo3xHqvT5q4p5dLvVglYWLhJLnk2fvQIbT38OrEfWV6E0RBYuSuDWE7dSVAqnRU30wTIQ10Ht6HYjB21Ppf0zf2cmEJCm4SfIbqL3phsQ765rs6OYCoSbDXJ1EaJJb9I" // 301
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "content"
                }
            ]
        })
    })

    it('Method POST /posts/postId/comments + POST /users`with 201 + POST /auth with 200 + GET /comments by ID 200. Expect 400 - So long input values', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

            const createNewPost = await request(app)
                .post('/posts')
                .send({
                    "title": "Beautiful title",
                    "shortDescription": "Some interesting description",
                    "content": "Useful content",
                    "blogId": createNewBlog.body.id
                })
                .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
                .expect(201)

        const createResponse = await request(app)
            .post(`/posts/${createNewPost.body.id}/comments`)
            .send({
                "content": "koPcJQy6fNYWkxAK09XN" // 20
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const createdComment = await request(app)
            .get(`/comments/${createResponse.body.id}`)
            .expect(200)

        expect(createResponse.body).toEqual(createdComment.body)
    })

    // Method GET

    it('Method GET /posts without input query parameters. ' +
             'Expected 200 - return page with blogs ', async () => {

        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createBlog.body

        const createPost1 = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title2",
                "shortDescription": "Some interesting description2",
                "content": "Useful content2",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost2 = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title1",
                "shortDescription": "Some interesting description1",
                "content": "Useful content1",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const expectItems = [createPost2.body, createPost1.body]

        const givePageWithPosts = await request(app)
            .get('/posts')
            .expect(200)

        const createdPageWithPosts = givePageWithPosts.body

        expect(createdPageWithPosts).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expectItems
        })
    })

    it('Method GET /posts  with pageSize=2&sortBy=title&sortDirection=asc' +
        'Expect 200 - return page with 2 posts', async () => {

        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title4",
                "shortDescription": "Some interesting description4",
                "content": "Useful content4",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost2 = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title3",
                "shortDescription": "Some interesting description3",
                "content": "Useful content3",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost3 = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title2",
                "shortDescription": "Some interesting description2",
                "content": "Useful content2",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const expectItems = [createPost3.body, createPost2.body]

        const createResponse = await request(app)
            .get('/posts?pageSize=2&sortBy=title&sortDirection=asc')
            .expect(200)

        const createdPageWithPosts = createResponse.body

        expect(createdPageWithPosts).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET /posts  with pageSize=2&sortBy=title&sortDirection=asc&pageNumber=2' +
        'Expect 200 - return page with 1 posts', async () => {

        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        const createPost1 = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title4",
                "shortDescription": "Some interesting description4",
                "content": "Useful content4",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title3",
                "shortDescription": "Some interesting description3",
                "content": "Useful content3",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title2",
                "shortDescription": "Some interesting description2",
                "content": "Useful content2",
                "blogId": createdBlog.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const expectItems = [createPost1.body]

        const createResponse = await request(app)
            .get('/posts?pageSize=2&sortBy=title&sortDirection=asc&pageNumber=2')
            .expect(200)

        const createdPageWithPosts = createResponse.body

        expect(createdPageWithPosts).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET /posts by ID. Expect 404', async () => {
        await request(app)
            .get('/posts/0')
            .expect(404)
    })

    it('Method GET /posts/postId/comments. Expect 404', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createResponse = await request(app)
            .post(`/posts/0/comments`)
            .send({
                "content": "koPcJQy6fNYWkxAK09XN" // 20
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(404)
    })

    it('Method GET /posts/postId/comments without input query parameters.' +
        'Expect 200', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createComment1 = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "1koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const createComment2 = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "2koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const expectItems = [createComment2.body, createComment1.body]

        const createResponse = await request(app)
            .get(`/posts/${createPost.body.id}/comments`)
            .expect(200)

        expect(createResponse.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expectItems
        })
    })

    it('Method GET /posts/postId/comments with pageSize=2&sortDirection=asc.' +
        'Expect 200 - return page with 2 comments', async () => {

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createComment1 = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "1koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const createComment2 = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "2koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "3koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const expectItems = [createComment1.body, createComment2.body]

        const createResponse = await request(app)
            .get(`/posts/${createPost.body.id}/comments?pageSize=2&sortDirection=asc`)
            .expect(200)

        expect(createResponse.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET /posts/postId/comments with pageSize=2&sortDirection=asc&pageNumber=2.' +
        'Expect 200 - return page with 1 comment', async () => {

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "1koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "2koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const createComment3 = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "3koPcJQy6fNYWkxAK09XN"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const expectItems = [createComment3.body]

        const createResponse = await request(app)
            .get(`/posts/${createPost.body.id}/comments?pageSize=2&sortDirection=asc&pageNumber=2`)
            .expect(200)

        expect(createResponse.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    // Method PUT

    it('Method PUT /posts/id. Expected 404 - Not found', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .put('/posts/0')
            .send({
                "title": "New beautiful title",
                "shortDescription": "New some interesting description",
                "content": "New useful content",
                "blogId": createNewBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(404)
    })

    it('Method PUT /posts/id. Expect 401 - Unauthorized', async () => {
        await request(app)
            .put('/posts/0')
            .send({
                "title": "New beautiful title",
                "shortDescription": "New some interesting description",
                "content": "New useful content",
                "blogId": 0
            })
            .expect(401)
    })

    it('Method PUT /posts/id. Expect 400 - so short input values', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createResponse = await request(app)
            .put('/posts/0')
            .send({
                "title": "",
                "shortDescription": "",
                "content": "",
                "blogId": createNewBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)

        expect(createResponse.body).toEqual({"errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "title"
                },
                {
                    "message": expect.any(String),
                    "field": "shortDescription"
                },
                {
                    "message": expect.any(String),
                    "field": "content"
                }
            ]})
    })

    it('Method PUT /posts/id. Expect 400 - so long input values', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createResponse = await request(app)
            .put(`/posts/${createNewBlog.body.id}`)
            .send({
                "title": "4ONI9yRQpNxbr0JfYDBdnb2De9FWBFw", // 31
                "shortDescription": "OlIBxLoSrR78oDhWvK2vDT8aM1gInMlLSsau0QJH5DY7WX0A5LXOxgepj8Pu3heHVGuqbxiLtwi0CwFGaZAzahhySjbNnIEN1VVLx", // 101
                "content": "owEJXzuOKxXs4iqrRy6C29bGmIdYH38Al5rMhXVnGsLN5lmrEeMC0tuczoUcEI3iGQSeZuP6bPVGQkL9IAvXmsMktrfg2eXtOnsSPKyuuJCMdATfKctpIvvvCYadFdotLCzi4NnErZ7PI3gg4zkSTtt6XdJ7GCHPGnBGlsg8GbOTQ4GCVWpBGEqKhkCbdKhSgYYAtfvIc3pgcZskRFtS6MYSLmGQH7fmlYSazno0l1LS9y8Wn0cjSAK6SiklPIb5jS8lnMBG3HqAYHOb3Vxi8fG5m7Tq9U5Cnj8F9ZnSJ2dD4MjXLVz8vxxb4cS50xQWEDLTcLEABbSScHggQ8YmJp9Py3FJsT7SUICaJuBi1YsNnnVWRlpsnwm9lnYOmHc7vxFR4ulUx39rgBcKC2CPMd0zIAZoSn2B6DUzYapi5MxdJGBxJv1i5F1mK8qvlFWO13lbpxdZHo8xX8JlbAqvhmoM4xPfoBIQ8o4ADuzabvFBKFVDVML3KGz6KFI9lxu3SZXiDssRK3TqhKHwYhjIhIh3GtZUFjym0f9n9L6mKrrSAOhHrHCerdmIcP9s0kZBmvJsYZx5NPJh95DqQDb6raqe3n5QlPZKfv4tTT73xIiIx5owTltJcsVfvT8umK4ikMqiwStCSOq7UvPR1SSNTl9aB0cAxZjoXCE429DHOLRmAHSdJCxY9vEnYB5hIpk5rNOtc7VfELVJdBQ1WGRb2bjbnPk0ze5Eye4sWksW8BVsazBLHksvwsI9QdvlUm2cBpdDyV9uh9fJZWlMsvsW5vK8Gsh8YSCBuXjGHAgHkgegiOIAZI2L0XC8oTMoyxnELK0Pj3ZYJajGk37YfFrbCasvttgMahQ76iNtE0pmGhU5uq8KquAI1q77ZBD4NuVyKQqwppqsiJ1yyxK3ZSuBNV5qZJvvcf9ETG70tJAtgeu26p15gwZBjuMJlChaF81pPaAQvZxK4vQJruv0IsG20DqbryAAguzEqOxmQLYGR", // 1001
                "blogId": createNewBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)

            expect(createResponse.body).toEqual({
            "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    },
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    },
                    {
                        "message": expect.any(String),
                        "field": "content"
                    }
                ]
            })
    })

    it('Method PUT /posts/id + GET by id. Expect 204', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createNewPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createNewBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .put(`/posts/${createNewPost.body.id}`)
            .send({
                "title": "New beautiful title",
                "shortDescription": "New some interesting description",
                "content": "New useful content",
                "blogId": createNewBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(204)

        const updatedPost = request(app)
            .get(`/posts/${createNewPost.body.id}`)
            .expect(200)

        expect(createNewPost.body).not.toEqual(updatedPost)
    })

    // Method DELETE

    it('Method DELETE /posts/id. Expect 404', async () => {
        await request(app)
            .delete('/posts/0')
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(404)
    })

    it('Method DELETE /posts/id. Expect 401', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createNewPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createNewBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .delete(`/posts/${createNewPost.body.id}`)
            .expect(401)
    })

    it('Method DELETE /posts/id. Expect 204', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createNewPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createNewBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .delete(`/posts/${createNewPost.body.id}`)
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(204)
    })

// Users router test

    // Method POST (Test for 201 in create comments for posts)

    it('Method POST /users. Expect 401 - Unauthorized', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .expect(401)
    })

    it('Method POST /users. Expect 400 - So short input values', async () => {
        const createResponse = await request(app)
            .post('/users')
            .send({
                "login": "lo",
                "password": "passw",
                "email": "someonemailgmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "login"
                },
                {
                    "message": expect.any(String),
                    "field": "password"
                },
                {
                    "message": expect.any(String),
                    "field": "email"
                }
            ]
        })
    })

    it('Method POST /users. Expect 400 - So long input values', async () => {
        const createResponse = await request(app)
            .post('/users')
            .send({
                "login": "hah6nJkNgfm", // 11
                "password": "75mqX94KL7rMIS1XnlbKU", // 21
                "email": "someonemailgmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "login"
                },
                {
                    "message": expect.any(String),
                    "field": "password"
                },
                {
                    "message": expect.any(String),
                    "field": "email"
                }
            ]
        })
    })

    // Method GET

    it('Method GET /users without input query parameters.' +
        'Expect 200 - return page with users',async () => {

        const createUser1 = await request(app)
            .post('/users')
            .send({
                "login": "login2",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createUser2 = await request(app)
            .post('/users')
            .send({
                "login": "login1",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const expectItems = [createUser2.body, createUser1.body]

        const pageWithUsers = await request(app)
            .get('/users')
            .expect(200)

        expect(pageWithUsers.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: expectItems
        })
    })

    it('Method GET /users with searchLoginTerm=new&pageSize=2&sortBy=login&sortDirection=asc.' +
             'Expect 200 - return page with 2 users', async () => {

        await request(app)
            .post('/users')
            .send({
                "login": "login4",
                "password": "password4",
                "email": "someonemail4@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "New login3",
                "password": "password3",
                "email": "someonemail3@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createUser3 = await request(app)
            .post('/users')
            .send({
                "login": "New login2",
                "password": "password2",
                "email": "someonemail2@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createUser4 = await request(app)
            .post('/users')
            .send({
                "login": "New login1",
                "password": "password1",
                "email": "someonemail1@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const expectItems = [createUser4.body, createUser3.body]

        const pageWithUsers = await request(app)
            .get('/users?searchLoginTerm=new&pageSize=2&sortBy=login&sortDirection=asc')
            .expect(200)

        expect(pageWithUsers.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET /users with searchEmailTerm=new&pageSize=2&sortDirection=asc&pageNumber=2.' +
             'Expect 200 - return page with 1 user', async () => {

        await request(app)
            .post('/users')
            .send({
                "login": "login4",
                "password": "password4",
                "email": "someonemail4@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createUser2 = await request(app)
            .post('/users')
            .send({
                "login": "New login3",
                "password": "password3",
                "email": "newsomeonemail3@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "New login2",
                "password": "password2",
                "email": "newsomeonemail2@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "New login1",
                "password": "password1",
                "email": "newsomeonemail1@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const expectItems = [createUser2.body]

        const pageWithUsers = await request(app)
            .get('/users?searchEmailTerm=new&pageSize=2&sortBy=email&sortDirection=asc&pageNumber=2')
            .expect(200)

        expect(pageWithUsers.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    // Method DELETE

    it('Method DELETE /user/id. Expect 404', async () => {
        await request(app)
            .delete('/users/0')
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(404)
    })

    it('Method DELETE /user/id. Expect 401', async () => {
        const createUser = await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .delete(`/users/${createUser.body.id}`)
            .expect(401)
    })

    it('Method DELETE /user/id. Expect 204', async () => {
        const createUser = await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .delete(`/users/${createUser.body.id}`)
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(204)
    })

// Auth router test

    // Method POST

    // it('Method POST /auth/login. Expect 401 - wrong password or login', async () => {
    //     const createResponse = await request(app)
    //         .post('/auth/login')
    //         .send({
    //             "login": "NonExist",
    //             "password": "NonExistent password"
    //         })
    //         .expect(401)
    // })
    //
    // it('Method POST /auth/login. Expect 400 - So short input value', async () => {
    //     const createResponse = await request(app)
    //         .post('/auth/login')
    //         .send({
    //             "login": 'qw',
    //             "password": 'qwer'
    //         })
    //         .expect(400)
    //
    //     expect(createResponse.body).toEqual({
    //         "errorsMessages": [
    //             {
    //                 "message": expect.any(String),
    //                 "field": "login"
    //             },
    //             {
    //                 "message": expect.any(String),
    //                 "field": "password"
    //             }
    //         ]
    //     })
    // })
    //
    // it('Method POST /auth/login. Expect 400 - So long input value', async () => {
    //     const createResponse = await request(app)
    //         .post('/auth/login')
    //         .send({
    //             "login": 'EEPbgyXb69t',
    //             "password": 'MibmYM0VbfT0tp4uD7uZc'
    //         })
    //         .expect(400)
    //
    //     expect(createResponse.body).toEqual({
    //         "errorsMessages": [
    //             {
    //                 "message": expect.any(String),
    //                 "field": "login"
    //             },
    //             {
    //                 "message": expect.any(String),
    //                 "field": "password"
    //             }
    //         ]
    //     })
    // })

    it('Method POST /auth/login. Expect 200 - Return accessToken in body and refreshToken in cookie', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "Login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createResponse = await request(app)
            .post('/auth/login')
            .send({
                "login": 'Login',
                "password": 'password'
            })
            .expect(200)
        })

    it('Method POST auth/refresh-token. Expect 401', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "Login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const login = await request(app)
            .post('/auth/login')
            .send({
                "login": 'Login',
                "password": 'password'
            })
            .expect(200)

        await request(app)
            .post('/auth/refresh-token')
            .expect(200)

    })

    it('Method POST /auth/registration-confirmation. Expect 400 - incorrect input value', async () => {
        // как из отправленного емайла достать токен
    })

    it('Method POST /auth/registration-confirmation. Expect 204 - Email was verified.' +
        'Account was activated', async () => {
        // ?
    })

    it('Method POST /auth/registration. Expect 400 - so short input value', async () => {
        const createResponse = await request(app)
            .post('/auth/registration')
            .send({
                "login": "Be",
                "password": "5hucF",
                "email": "someomegmail.com"
            })
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "login"
                },
                {
                    "message": expect.any(String),
                    "field": "password"
                },
                {
                    "message": expect.any(String),
                    "field": "email"
                }
            ]
        })
    })

    it('Method POST /auth/registration. Expect 400 - so long input value', async () => {
        const createResponse = await request(app)
            .post('/auth/registration')
            .send({
                "login": "akOcQv2zgk7", // 11
                "password": "q7We3lTX9dGWHKt7eMn7i", // 21
                "email": "someome@gmail.com"
            })
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "login"
                },
                {
                    "message": expect.any(String),
                    "field": "password"
                }
            ]
        })
    })

    it('Method POST /auth/registration. Expect 204 - Input data is accepted. ' +
        'Email with confirmation code will be send to passed email address', async () => {
        const createResponse = await request(app)
            .post('/auth/registration')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .expect(204)

        // const emailSentInfo = createResponse.body.info.response
        // const emailSent = (emailSentInfo.split(' '))[2].join()
        //
        // expect(emailSent).toEqual('OK')
    })

    it('Method POST /auth/registration-email-resending. Expect 400 - email is already confirmed',
        async () => {
            await request(app)
                .post('/auth/registration')
                .send({
                    "login": "login",
                    "password": "password",
                    "email": "someonemail@gmail.com"
                })
                .expect(204)

            // await request(app)
            //     .post('/auth/registration')
            //     .send({
            //         "code": `${тутДолженБытьКод}`
            //     })
            //     .expect(204)

            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    "email": "someonemail@gmail.com"
                })
                .expect(400)
        })

    it('Method POST /auth/registration-email-resending. Expect 400 - wrong email',
        async () => {
            await request(app)
                .post('/auth/registration')
                .send({
                    "login": "login",
                    "password": "password",
                    "email": "someonemail@gmail.com"
                })
                .expect(204)

            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    "email": "someonemailgmail.com"
                })
                .expect(400)
    })

    it('Method POST /auth/registration-email-resending. Expect 400 - user not exist',
        async () => {
            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    "email": "someonemail@gmail.com"
                })
                .expect(400)
        })

    it('Method POST /auth/registration-email-resending. Expect 204 - Input data is accepted.' +
        'Email with confirmation code will be send to passed email address.',async () => {
        await request(app)
            .post('/auth/registration')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .expect(204)

        await request(app)
            .post('/auth/registration-email-resending')
            .send({
                "email": "someonemail@gmail.com"
            })
            .expect(204)
    })

    it('Method POST /auth/me. Expect 401 - Unauthorized', async () => {
        await request(app)
            .get('/auth/me')
            .expect(401)
    })

    it('Method POST /auth/me. Expect 200 - return info about me', async () => {
        const user = await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const token = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const aboutMe = await request(app)
            .get('/auth/me')
            .set({Authorization: `Bearer ${token.body.accessToken}`})
            .expect(200)

        expect(user.body.email).toEqual(aboutMe.body.email)
        expect(user.body.login).toEqual(aboutMe.body.login)
        expect(user.body.id).toEqual(aboutMe.body.userId)
    })

// Comment router test

    // Method GET

    it('Method GET /comments/commentId. Expect 404 - not found', async () => {
        const createResponse = await request(app)
            .get(`/comments/0`)
            .expect(404)
    })

    it('Method GET /comments/commentId. Expect 200 - return comment', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const createResponse = await request(app)
            .get(`/comments/${createComment.body.id}`)
            .expect(200)

        expect(createResponse.body).toEqual(createComment.body)
    })

    // Method PUT

    it('Method PUT /comments/commentId. Expect 404 - not found', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        await request(app)
            .put('/comments/0')
            .send({"content": "JErsJJtdhH8AgtfZuiv9"})
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(404)

    })

    it('Method PUT /comments/commentId.' +
        'Expect 403 - If try edit the comment that is not your own', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login1",
                "password": "password1",
                "email": "someonemail1@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const user1Registration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login1",
                "password": "password1"
            })
            .expect(200)

        await request(app)
            .post('/users')
            .send({
                "login": "login2",
                "password": "password2",
                "email": "someonemail2@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const user2Registration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login2",
                "password": "password2"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${user1Registration.body.accessToken}`})
            .expect(201)

        await request(app)
            .put(`/comments/${createComment.body.id}`)
            .set({Authorization: `Bearer ${user2Registration.body.accessToken}`})
            .expect(403)
    })

    it('Method PUT /comments/commentId. Expect 401 - Unauthorized', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        await request(app)
            .put(`/comments/${createComment.body.id}`)
            .send({"content": "JErsJJtdhH8AgtfZuiv9"})
            .expect(401)
    })

    it('Method PUT /comments/commentId. Expect 400 - So short input value', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const createResponse = await request(app)
            .put(`/comments/${createComment.body.id}`)
            .send({"content": "JErsJJtdhH8AgtfZuiv"}) //19
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "content"
                }
            ]
        })
    })

    it('Method PUT /comments/commentId. Expect 400 - So long input value', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const createResponse = await request(app)
            .put(`/comments/${createComment.body.id}`)
            .send({"content": "yrcBHEuJVqNmqNNwmTDT2iiBy6rx08ieDOiDzrGFLLIaWOvIE6BEq58DdgeqyhXoVvO0k2vZviYXvTxCFIiCqjTM1dqP6STvIopFyImrfBhgIaIIaaQwNr6DL4SC247VeORy6OgwhtWV2p6QxoJCc49nFPpTXewKFyX8qJ00FcMcmeA9G19ZgIwX9m1w57opPj3MGIWDFoW2m8dGolWAVkPrtoIjfd4gxQgvp0IKfiSPeZiJxeEhyDz6SYCPYWeObtrt9TpRDLnkCfXC9b5Tfk6aRIKz670lSoRF8BgcxeHFC"}) //301
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(400)

        expect(createResponse.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "content"
                }
            ]
        })
    })

    it('Method PUT /comments/commentId. Expect 204 - content is update', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        const updateComment = await request(app)
            .put(`/comments/${createComment.body.id}`)
            .send({
                "content": "New 99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(204)

        const createResponse = await request(app)
            .get(`/comments/${createComment.body.id}`)
            .expect(200)

        expect(createResponse.body).not.toEqual(createComment.body)
    })

    // Method DELETE

    it('Method DELETE /comments/commentId. Expect 404 - not found', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        await request(app)
            .delete('/comments/0')
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(404)
    })

    it('Method DELETE /comments/commentId.' +
        'Expect 403 - If try edit the comment that is not your own', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login1",
                "password": "password1",
                "email": "someonemail1@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const user1Registration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login1",
                "password": "password1"
            })
            .expect(200)

        await request(app)
            .post('/users')
            .send({
                "login": "login2",
                "password": "password2",
                "email": "someonemail2@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const user2Registration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login2",
                "password": "password2"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${user1Registration.body.accessToken}`})
            .expect(201)

        await request(app)
            .delete(`/comments/${createComment.body.id}`)
            .set({Authorization: `Bearer ${user2Registration.body.accessToken}`})
            .expect(403)
    })

    it('Method DELETE /comments/commentId. Expect 401 - Unauthorized', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        await request(app)
            .delete(`/comments/${createComment.body.id}`)
            .expect(401)
    })

    it('Method DELETE /comments/commentId. Expect 204 - content is delete', async () => {
        const createBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createPost = await request(app)
            .post('/posts')
            .send({
                "title": "Beautiful title",
                "shortDescription": "Some interesting description",
                "content": "Useful content",
                "blogId": createBlog.body.id
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "someonemail@gmail.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const userRegistration = await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(200)

        const createComment = await request(app)
            .post(`/posts/${createPost.body.id}/comments`)
            .send({
                "content": "99CzC2jxKwy6iAZqNMvf"
            })
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(201)

        await request(app)
            .delete(`/comments/${createComment.body.id}`)
            .set({Authorization: `Bearer ${userRegistration.body.accessToken}`})
            .expect(204)

        await request(app)
            .get(`/comments/${createComment.body.id}`)
            .expect(404)
    })
})