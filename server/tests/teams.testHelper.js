const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Team = require('../models/team')
const User = require('../models/user')

const initialTeams = [
  {
    name: 'team1'
  },
  {
    name: 'team2'
  },
  {
    name: 'team3'
  }
]

const teamsInDb = async () => {
  return await Team
    .find({})
    .populate('owner members projects')
}

const nonExistingID = async () => {
  let users = await User.find({})
  let team = new Team({
    name: 'noteam',
    owner: users[0]._id,
    members: [],
    projects: []
  })
  team = await team.save()
  const id = team._id
  await Team.findByIdAndRemove(id)
  return id
}

resetTeams = async () => {
  await Team.remove({})
  let users = await User.find({})
  const teamObjects = initialTeams.map(t => new Team(
    {
      name: t.name,
      owner: users[1]._id,
      members: [users[1]._id]
    }
  ))
  const promiseArray = teamObjects.map(o => o.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialTeams,
  teamsInDb,
  nonExistingID,
  resetTeams
}