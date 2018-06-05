const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { initialUsers, resetUsers, usersInDb, getToken } = require('./users.testHelper')
const User = require('../models/user')

describe('GET /api/users/self', () => {

  let token = null

  beforeAll(async () => {
    await resetUsers()
    token = await getToken(initialUsers[0].username)
  })

  it('works', async () => {
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

})

afterAll(async () => {
  await server.close()
})