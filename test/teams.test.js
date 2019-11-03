const supertest = require('supertest')
const expect = require('chai').expect
const { app, server } = require('../server/index')
const api = supertest(app)
const { initialTeams, resetTeams, teamsInDb } = require('./teams.testHelper')
const { resetUsers, usersInDb, getToken, getBogusToken, getOldUsersToken, nonExistingID } = require('./users.testHelper')
const Team = require('../server/models/team')
const Project = require('../server/models/project')

describe('GET /api/teams', () => {

  let tokenUser = null
  let token = null

  beforeEach(async () => {
    await resetUsers()
    const users = await usersInDb()
    tokenUser = users[1]
    await resetTeams()
    token = await getToken(tokenUser.username)
  })

  it('works', async () => {
    await api
      .get('/api/teams')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('returns error without token', async () => {
    await api
      .get('/api/teams')
      .expect(401)
  })

  it('returns error with bogus token', async () => {
    const bogusToken = await getBogusToken()
    await api
      .get('/api/teams')
      .set('Authorization', 'Bearer ' + bogusToken)
      .expect(401)
  })

  it('returns error with token of a removed user', async () => {
    const oldUsersToken = await getOldUsersToken()
    await api
      .get('/api/teams')
      .set('Authorization', 'Bearer ' + oldUsersToken)
      .expect(401)
  })

  it('returns teams in json format', async () => {
    await api
      .get('/api/teams')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /application\/json/)
  })

  it('returns only the teams where user is member', async () => {
    const allTeams = await teamsInDb()
    const myTeamIds = allTeams
      .filter(t => t.members.includes(tokenUser._id.toString()))
      .map(t => t._id)

    const response = await api
      .get('/api/teams')
      .set('Authorization', 'Bearer ' + token)

    const teams = response.body
    const teamIds = teams.map(t => t._id)
    expect(teams.length).to.equal(myTeamIds.length)
    teamIds.forEach(id => expect(myTeamIds).to.include(id))
    myTeamIds.forEach(id => expect(teamIds).to.include(id))
  })
})

describe('POST /api/teams', () => {

  let tokenUser = null
  let token = null

  beforeEach(async () => {
    await resetUsers()
    const users = await usersInDb()
    tokenUser = users[1]
    token = await getToken(tokenUser.username)
  })

  beforeEach(async () => {
    await resetTeams()
  })

  it('creates a new team', async () => {
    const teamsBefore = await teamsInDb()
    const team = {
      name: 'newteam'
    }

    const response = await api
      .post('/api/teams')
      .send(team)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const teamsAfter = await teamsInDb()
    const newTeam = response.body
    const newTeamInDb = teamsAfter.find(t => t.name === team.name)
    const teamMembers = newTeam.members.map(m => m.username)
    const teamMembersInDb = newTeamInDb.members.map(m => m.username)
    expect(teamsAfter.length).to.equal(teamsBefore.length + 1)
    expect(newTeam.name).to.equal(team.name)
    expect(newTeam.owner.username).to.equal(tokenUser.username)
    expect(newTeamInDb.name).to.equal(team.name)
    expect(newTeamInDb.owner.username).to.equal(tokenUser.username)
    expect(teamMembers).to.include(tokenUser.username)
    expect(teamMembersInDb).to.include(tokenUser.username)
  })

  it('adds the team to creators teams', async () => {
    const team = {
      name: 'newteam'
    }

    const response = await api
      .post('/api/teams')
      .send(team)
      .set('Authorization', 'Bearer ' + token)

    const usersAfter = await usersInDb()
    const owner = usersAfter.find(u => u.username === tokenUser.username)
    const matchedTeams = owner.teams.find(t => t.name === team.name)
    expect(matchedTeams.name).to.equal(team.name)
  })

  it('returns error without token', async () => {
    const teamsBefore = await teamsInDb()
    const team = {
      name: 'newteam'
    }

    const response = await api
      .post('/api/teams')
      .send(team)
      .expect(401)

    const teamsAfter = await teamsInDb()
    expect(teamsAfter.length).to.equal(teamsBefore.length)
  })

  it('returns error with bogus token', async () => {
    const teamsBefore = await teamsInDb()
    const bogusToken = await getBogusToken()
    const team = {
      name: 'newteam'
    }

    const response = await api
      .post('/api/teams')
      .send(team)
      .set('Authorization', 'Bearer ' + bogusToken)
      .expect(401)

    const teamsAfter = await teamsInDb()
    expect(teamsAfter.length).to.equal(teamsBefore.length)
  })

  it('returns error with old users token', async () => {
    const teamsBefore = await teamsInDb()
    const oldUsersToken = await getOldUsersToken()
    const team = {
      name: 'newteam'
    }

    const response = await api
      .post('/api/teams')
      .send(team)
      .set('Authorization', 'Bearer ' + oldUsersToken)
      .expect(401)

    const teamsAfter = await teamsInDb()
    expect(teamsAfter.length).to.equal(teamsBefore.length)
  })

  it('does not accept team without a name', async () => {
    const teamsBefore = await teamsInDb()
    const team = {}

    const response = await api
      .post('/api/teams')
      .send(team)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const teamsAfter = await teamsInDb()
    expect(teamsAfter.length).to.equal(teamsBefore.length)
  })

  it('does not accept team with empty string as a name', async () => {
    const teamsBefore = await teamsInDb()
    const team = {
      name: ' '
    }

    const response = await api
      .post('/api/teams')
      .send(team)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const teamsAfter = await teamsInDb()
    expect(teamsAfter.length).to.equal(teamsBefore.length)
  })
})

describe('PUT /api/teams/:id', async () => {
  let tokenUser = null
  let token = null

  beforeEach(async () => {
    await resetUsers()
    const users = await usersInDb()
    tokenUser = users[1]
    token = await getToken(tokenUser.username)
  })

  beforeEach(async () => {
    await resetTeams()
  })

  it('updates existing team', async () => {
    const users = await usersInDb()
    const teamsBefore = await teamsInDb()
    const targetTeam = {
      name: 'updatedname',
      ownerId: users[1]._id
    }

    const response = await api
      .put(`/api/teams/${teamsBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(201)

    const updatedTeam = response.body
    const teamsAfter = await teamsInDb()
    expect(teamsAfter.length).to.equal(teamsBefore.length)
    expect(updatedTeam.name).to.equal(targetTeam.name)
    expect(updatedTeam.owner.username).to.equal(users[1].username)
  })

  it('returns error without token', async () => {
    const teamsBefore = await teamsInDb()
    const users = await usersInDb()
    const originalTeam = teamsBefore[1]
    const targetTeam = {
      name: 'updatedname',
      ownerId: users[1]._id
    }

    const response = await api
      .put(`/api/teams/${originalTeam._id}`)
      .send(targetTeam)
      .expect(401)

    const teamsAfter = await teamsInDb()
    const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
    expect(teamsAfter.length).to.equal(teamsBefore.length)
    expect(teamInDb.name).to.equal(originalTeam.name)
    expect(teamInDb.owner.username).to.equal(originalTeam.owner.username)
    expect(teamInDb.members.length).to.equal(originalTeam.members.length)
  })

  it('returns error with bogus token', async () => {
    const teamsBefore = await teamsInDb()
    const users = await usersInDb()
    const originalTeam = teamsBefore[1]
    const targetTeam = {
      name: 'updatedname',
      ownerId: users[1]._id
    }
    const bogusToken = getBogusToken()

    const response = await api
      .put(`/api/teams/${originalTeam._id}`)
      .set('Authorization', 'Bearer ' + bogusToken)
      .send(targetTeam)
      .expect(401)

    const teamsAfter = await teamsInDb()
    const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
    expect(teamsAfter.length).to.equal(teamsBefore.length)
    expect(teamInDb.name).to.equal(originalTeam.name)
    expect(teamInDb.owner.username).to.equal(originalTeam.owner.username)
    expect(teamInDb.members.length).to.equal(originalTeam.members.length)
  })

  it('returns error with old users token', async () => {
    const teamsBefore = await teamsInDb()
    const users = await usersInDb()
    const originalTeam = teamsBefore[1]
    const targetTeam = {
      name: 'updatedname',
      ownerId: users[1]._id
    }
    const oldUsersToken = getOldUsersToken()

    const response = await api
      .put(`/api/teams/${originalTeam._id}`)
      .set('Authorization', 'Bearer ' + oldUsersToken)
      .send(targetTeam)
      .expect(401)

    const teamsAfter = await teamsInDb()
    const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
    expect(teamsAfter.length).to.equal(teamsBefore.length)
    expect(teamInDb.name).to.equal(originalTeam.name)
    expect(teamInDb.owner.username).to.equal(originalTeam.owner.username)
    expect(teamInDb.members.length).to.equal(originalTeam.members.length)
  })

  it('returns error if calling user is not the owner', async () => {
    const teamsBefore = await teamsInDb()
    const users = await usersInDb()
    const originalTeam = new Team(
      {
        name: 'otherOwner',
        owner: users[2]._id,
        members: [users[2]._id]
      }
    )
    const savedTeam = await originalTeam.save()
    const targetTeam = {
      name: 'updatedname',
      ownerId: users[2]._id
    }

    const response = await api
      .put(`/api/teams/${savedTeam._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(401)

    const teamsAfter = await teamsInDb()
    const teamInDb = teamsAfter.find(t => t._id.toString() === savedTeam._id.toString())
    expect(teamsAfter.length).to.equal(teamsBefore.length + 1)
    expect(teamInDb.name).to.equal(originalTeam.name)
    expect(teamInDb.owner._id.toString()).to.equal(originalTeam.owner.toString())
    expect(teamInDb.members.length).to.equal(originalTeam.members.length)
    await Team.findByIdAndDelete(savedTeam._id)
  })

  it('returns error if reported owner is not a member', async () => {
    const teamsBefore = await teamsInDb()
    const users = await usersInDb()
    const originalTeam = new Team(
      {
        name: 'otherMember',
        owner: users[1]._id,
        members: [users[2]._id]
      }
    )
    const savedTeam = await originalTeam.save()
    const targetTeam = {
      name: 'updatedname',
      ownerId: users[1]._id
    }

    const response = await api
      .put(`/api/teams/${savedTeam._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(400)

    const teamsAfter = await teamsInDb()
    const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
    expect(teamsAfter.length).to.equal(teamsBefore.length + 1)
    expect(teamInDb.name).to.equal(originalTeam.name)
    expect(teamInDb.owner._id.toString()).to.equal(originalTeam.owner.toString())
    expect(teamInDb.members.length).to.equal(originalTeam.members.length)
    await Team.findByIdAndDelete(savedTeam._id)
  })

  it('does not accept team without a name', async () => {
    const users = await usersInDb()
    const teamsBefore = await teamsInDb()
    const originalTeam = teamsBefore[1]
    const targetTeam = {
      ownerId: users[1]._id
    }

    const response = await api
      .put(`/api/teams/${teamsBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(400)

      const teamsAfter = await teamsInDb()
      const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
      expect(teamsAfter.length).to.equal(teamsBefore.length)
      expect(teamInDb.name).to.equal(originalTeam.name)
      expect(teamInDb.owner._id.toString()).to.equal(originalTeam.owner._id.toString())
      expect(teamInDb.members.length).to.equal(originalTeam.members.length)
  })

  it('does not accept team with an empty string as a name', async () => {
    const users = await usersInDb()
    const teamsBefore = await teamsInDb()
    const originalTeam = teamsBefore[1]
    const targetTeam = {
      name: '',
      ownerId: users[1]._id
    }

    const response = await api
      .put(`/api/teams/${teamsBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(400)

      const teamsAfter = await teamsInDb()
      const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
      expect(teamsAfter.length).to.equal(teamsBefore.length)
      expect(teamInDb.name).to.equal(originalTeam.name)
      expect(teamInDb.owner._id.toString()).to.equal(originalTeam.owner._id.toString())
      expect(teamInDb.members.length).to.equal(originalTeam.members.length)
  })

  it('does not accept team without an owner', async () => {
    const users = await usersInDb()
    const teamsBefore = await teamsInDb()
    const originalTeam = teamsBefore[1]
    const targetTeam = {
      name: 'othername',
      ownerId: ''
    }

    const response = await api
      .put(`/api/teams/${teamsBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(400)

      const teamsAfter = await teamsInDb()
      const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
      expect(teamsAfter.length).to.equal(teamsBefore.length)
      expect(teamInDb.name).to.equal(originalTeam.name)
      expect(teamInDb.owner._id.toString()).to.equal(originalTeam.owner._id.toString())
      expect(teamInDb.members.length).to.equal(originalTeam.members.length)
  })

  it('accepts a change of owner', async () => {
    const users = await usersInDb()
    const teamsBefore = await teamsInDb()
    const originalTeam = new Team(
      {
        name: 'otherMember',
        owner: users[1]._id,
        members: [users[1]._id, users[2]._id]
      }
    )
    const savedTeam = await originalTeam.save()
    const targetTeam = {
      name: 'updatedname',
      ownerId: users[2]._id,
    }

    const response = await api
      .put(`/api/teams/${savedTeam._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(201)

    const updatedTeam = response.body
    const teamsAfter = await teamsInDb()
    expect(teamsAfter.length).to.equal(teamsBefore.length + 1)
    expect(updatedTeam.name).to.equal(targetTeam.name)
    expect(updatedTeam.owner._id.toString()).to.equal(users[2]._id.toString())
    await Team.findByIdAndDelete(savedTeam._id)
  })

  it('does not accept team with a non-existing owner', async () => {
    const nonExistingUserID = await nonExistingID()
    const teamsBefore = await teamsInDb()
    const originalTeam = teamsBefore[1]
    const targetTeam = {
      name: 'othername',
      ownerId: nonExistingUserID,
      members: [nonExistingUserID]
    }

    const response = await api
      .put(`/api/teams/${teamsBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(targetTeam)
      .expect(400)

      const teamsAfter = await teamsInDb()
      const teamInDb = teamsAfter.find(t => t._id.toString() === originalTeam._id.toString())
      expect(teamsAfter.length).to.equal(teamsBefore.length)
      expect(teamInDb.name).to.equal(originalTeam.name)
      expect(teamInDb.owner._id.toString()).to.equal(originalTeam.owner._id.toString())
      expect(teamInDb.members.length).to.equal(originalTeam.members.length)
  })  
})

after(async () => {
  await server.close()
})