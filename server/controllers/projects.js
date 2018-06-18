const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const projectRouter = require('express').Router()
const Team = require('../models/team')
const User = require('../models/user')
const Project = require('../models/project')

projectRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['name', 'teamId']
  validateMandatoryFields(req, mandatories, 'Project', 'create')

  let team = await Team.findById(req.body.teamId)
  if (!team) {
    let err = new Error('Team cannot be found')
    err.isBadRequest = true
    throw err
  }

  let project = new Project({
    name: req.body.name,
    description: req.body.description,
    team: req.body.teamId
  })
  project = await project.save()
  team.projects = team.projects.push(project._id)
  await Team.findByIdAndUpdate(team._id, team)

  project = await Project
    .findById(project._id)
    .populate('team')

  res.status(201).json(project)
}))

projectRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['name', 'teamId']
  validateMandatoryFields(req, mandatories, 'Project', 'update')

  let project = await Project.findById(req.params.id).populate('team')
  if (!project) {
    let err = new Error('Project cannot be found')
    err.isBadRequest = true
    throw err
  }
  if (project.team.owner.toString() !== req.user._id) {
    let err = new Error('User is not the owner of the team which controls this project')
    err.isUnauthorizedAttempt = true
    throw err
  }

  project.name = req.body.name
  project.description = req.body.description
  project = await Project
    .findByIdAndUpdate(project._id, project, { new: true })
    .populate('team')
  res.status(201).json(project)
}))

projectRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  let project = await Project.findById(req.params.id).populate('team')
  if (!project) {
    let err = new Error('Project cannot be found')
    err.isBadRequest = true
    throw err
  }
  if (project.team.owner.toString() !== req.user._id) {
    let err = new Error('User is not the owner of the team which controls this project')
    err.isUnauthorizedAttempt = true
    throw err
  }
  let team = await Team.findById(project.team._id)
  if (team) {
    team.projects = team.projects.filter(p => p.toString() !== project._id.toString())
    await Team.findByIdAndUpdate(team._id, team)
  }

  await Project.findByIdAndRemove(project._id)
  res.status(204).end()
}))

module.exports = projectRouter