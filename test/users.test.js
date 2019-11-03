const supertest = require('supertest')
const expect = require('chai').expect
const { app, server } = require('../server/index')
const api = supertest(app)
const { initialUsers, resetUsers, usersInDb, getToken, getBogusToken, getOldUsersToken } = require('./users.testHelper')
const User = require('../server/models/user')

describe('GET /api/users/self', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeEach(async () => {
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
    expect(user._id.toString()).to.equal(targetUser._id.toString())
    expect(user.username).to.equal(targetUser.username)
    expect(user.lastName).to.equal(targetUser.lastName)
    expect(user.firstNames).to.equal(targetUser.firstNames)
    expect(user.email).to.equal(targetUser.email)
  })
})

describe('PUT /api/users/self', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeEach(async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('updates the calling user', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    targetUser.username = 'updatedUsername'
    targetUser.lastName = 'updatedLastname'
    targetUser.firstNames = 'updatedFirstNames'
    targetUser.email = 'updated@email.com'

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(targetUser)
      .expect(201)

    const updatedUser = response.body
    const usersAfter = await usersInDb()
    expect(usersAfter.length).to.equal(users.length)
    expect(updatedUser.username).to.equal(targetUser.username)
    expect(updatedUser.email).to.equal(targetUser.email)
    expect(updatedUser.lastName).to.equal(targetUser.lastName)
    expect(updatedUser.firstNames).to.equal(targetUser.firstNames)
  })

  it('returns error without token', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const response = await api
      .put('/api/users/self')
      .send(targetUser)
      .expect(401)
  })

  it('returns error with bogus token', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    const bogusToken = getBogusToken()

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(targetUser)
      .expect(401)

  })

  it('returns error with token of a removed user', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    const oldUsersToken = getOldUsersToken()

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + oldUsersToken)
      .send(targetUser)
      .expect(401)
  })

  it('does not accept user without username', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as username', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: '',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept username already in use by someone else', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)
    const otherUsers = users.filter(u => u._id.toString() !== targetUser._id.toString())

    const editedUser = {
      _id: targetUser._id,
      username: otherUsers[0].username,
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('updates user that does not change its current username', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: targetUser.username,
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(201)

    const updatedUser = response.body
    expect(updatedUser.username).to.equal(editedUser.username)
    expect(updatedUser.email).to.equal(editedUser.email)
    expect(updatedUser.lastName).to.equal(editedUser.lastName)
    expect(updatedUser.firstNames).to.equal(editedUser.firstNames)
  })

  it('does not accept user without email', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as email', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: '',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with malformed email', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: 'updatedFirstNames',
      email: 'updatedemail.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user without last name', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as last name', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: '',
      firstNames: 'updatedFirstNames',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user without first name', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

  it('does not accept user with empty string as first names', async () => {
    const users = await usersInDb()
    const targetUser = users.find((u) => u.username === tokenUser.username)

    const editedUser = {
      _id: targetUser._id,
      username: 'updatedUsername',
      lastName: 'updatedLastname',
      firstNames: '',
      email: 'updated@email.com',
    }

    const response = await api
      .put('/api/users/self')
      .set('Authorization', 'Bearer ' + token)
      .send(editedUser)
      .expect(400)
  })

})

describe('POST /api/users/register', () => {

  let tokenUser = initialUsers[1]
  let token = null

  beforeEach(async () => {
    await resetUsers()
    token = await getToken(tokenUser.username)
  })

  it('creates a new user', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    const newUser = response.body
    const newUserInDb = usersAfter.find(u => u.username === newUser.username)
    expect(usersAfter.length).to.equal(usersBefore.length + 1)
    expect(newUser.username).to.equal(user.username)
    expect(newUser.firstNames).to.equal(user.firstNames)
    expect(newUser.lastName).to.equal(user.lastName)
    expect(newUser.email).to.equal(user.email)
    expect(newUserInDb.username).to.equal(user.username)
    expect(newUserInDb.firstNames).to.equal(user.firstNames)
    expect(newUserInDb.lastName).to.equal(user.lastName)
    expect(newUserInDb.email).to.equal(user.email)
  })

  it('does not accept user without username', async () => {
    const usersBefore = await usersInDb()
    const user = {
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user with empty string as username', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: ' ',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept username already in use', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: usersBefore[0].username,
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user without email', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user with empty string as email', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: ' '
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user with malformed email', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: 'newLastname',
      email: 'newmail¨.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user without last name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user with empty string as last name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: 'newfirstname',
      lastName: ' ',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user without first name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

  it('does not accept user with empty string as first name', async () => {
    const usersBefore = await usersInDb()
    const user = {
      username: 'newusername',
      password: 'newpassword',
      password2: 'newpassword',
      firstNames: ' ',
      lastName: 'newLastname',
      email: 'new@mail.com'
    }

    const response = await api
      .post('/api/users/register')
      .send(user)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersBefore.length).to.equal(usersAfter.length)
  })

})

after(async () => {
  await server.close()
})