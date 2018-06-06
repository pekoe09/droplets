const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { initialUsers, resetUsers, usersInDb, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')
const User = require('../models/user')

describe('GET /api/users/self', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeAll(async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('works', async () => {
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('returns error without token', async () => {
    await api
      .get('/api/users/self')
      .expect(401)
  })

  it('returns error with bogus token', async () => {
    const bogusToken = getBogusToken()
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + bogusToken)
      .expect(401)
  })

  it('returns error with token of a removed user', async () => {
    const oldUsersToken = getOldUsersToken()
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + oldUsersToken)
      .expect(401)
  })

  it('returns user in json format', async () => {
    await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the correct user', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const response = await api
      .get('/api/users/self')
      .set('Authorization', 'Bearer ' + token)

    const user = response.body
    expect(user._id.toString()).toEqual(targetUser._id.toString())
    expect(user.username).toEqual(targetUser.username)
    expect(user.lastName).toEqual(targetUser.lastName)
    expect(user.firstNames).toEqual(targetUser.firstNames)
    expect(user.email).toEqual(targetUser.email)
  })
})

describe('PUT /api/users/self', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeAll(async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('updates the calling user', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    targetUser.username = 'updatedUsername',
      targetUser.lastName = 'updatedLastname',
      targetUser.firstNames = 'updatedFirstNames',
      targetUser.email = 'updated@email.com'

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(targetUser)
      .expect(201)

    const updatedUser = response.body
    expect(updatedUser.username).toEqual(targetUser.username)
    expect(updatedUser.email).toEqual(targetUser.email)
    expect(updatedUser.lastName).toEqual(targetUser.lastName)
    expect(updatedUser.firstNames).toEqual(targetUser.firstNames) 
  })

  it('returns error without token', async () => {

  })

  it('returns error with bogus token', async () => {

  })

  it('returns error with token of a removed user', async () => {

  })

  it('does not accept user without username', async () => {

  })

  it('does not accept user with empty string as username', async () => {

  })

  it('does not accept username already in use by someone else', async () => {

  })

  it('does not accept user without email', async () => {

  })

  it('does not accept user with empty string as email', async () => {

  })

  it('does not accept user with malformed email', async () => {

  })

  it('does not accept user without last name', async () => {

  })

  it('does not accept user with empty string as last name', async () => {

  })

  it('does not accept user without first name', async () => {

  })

  it('does not accept user with empty string as first names', async () => {

  })

})

afterAll(async () => {
  await server.close()
})