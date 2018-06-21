const { wrapAsync, checkUser, validateMandatoryField } = require('./controllerHelpers')
const teamRouter = require('express').Router()
const Team = require('../models/team')
const User = require('../models/user')
const Project = require('../models/project')

teamRouter.get('/', wrapAsync(async (req, res, next) => {
  checkUser(req)

  const user = await User
    .findById(req.user._id)
    .populate({
      path: 'teams',
      populate: { path: 'projects owner members' }
    })
  res.json(user.teams)
}))

teamRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryField(req, 'name')

  let team = new Team({
    name: req.body.name,
    owner: req.user._id,
    members: [req.user._id],
    projects: []
  })
  team = await team.save()
  let user = await User.findById(req.user._id)
  user.teams.push(team._id)
  await User.findByIdAndUpdate(user._id, user)
  
  team = await Team
    .findById(team._id)
    .populate('owner members projects')

  res.status(201).json(team)
}))

teamRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryField(req, 'name ownerId')
  let team = await Team.findById(req.params.id)
  if (team.owner.toString() !== req.user._id) {
    let err = new Error('User is not the owner of the team')
    err.isUnauthorizedAttempt = true
    throw err
  }
  if (!team.members.includes(req.body.owner)) {
    let err = new Error('Owner must be a member of the team')
    err.isBadRequest = true
    throw err
  }

  team.name = req.body.name
  team.owner = req.body.ownerId
  team = await Team
    .findByIdAndUpdate(team._id, team)
    .populate('owner members projects')
  res.status(201).json(team)
}))

teamRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  let team = await Team.findById(req.params.id)
  if (team.owner.toString() !== req.user._id.toString()) {
    let err = new Error('User is not the owner of the team')
    err.isUnauthorizedAttempt = true
    throw err
  }
  if (team.projects.length > 0) {
    let err = new Error('Team cannot be removed as it still has projects')
    err.isBadRequest = true
    throw err
  }

  team.members.forEach(async m => {
    let member = await User.findById(m)
    member.teams = member.teams.filter(t => t !== team._id)
    await User.findByIdAndUpdate(m, member)
  })

  await Team.findByIdAndRemove(team._id)
  res.status(204).end()
}))

module.exports = teamRouter