const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const projectRouter = require('express').Router()
const Team = require('../models/team')
const User = require('../models/user')
const Project = require('../models/project')
const Droplet = require('../models/droplet')

projectRouter.get('/', wrapAsync(async (req, res, next) => {
  checkUser(req)

  const projects = await Project.find({ team: { $in: req.user.teams } })
  console.log('Found projects', projects)
  res.json(projects)
}))

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
    team: req.body.teamId,
    droplets: [],
    desktopDroplets: []
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

projectRouter.put('/:id/adddesktopdroplet', wrapAsync(async (req, res, next) => {
  console.log('Adding droplet ' + req.body.dropletId)
  checkUser(req)
  const mandatories = ['dropletId']
  validateMandatoryFields(req, mandatories, 'Project', 'add desktop Droplet')

  let project = await Project.findById(req.params.id).populate('team')
  if (!project) {
    let err = new Error('Project cannot be found')
    err.isBadRequest = true
    throw err
  }

  let droplet = await Droplet.findById(req.body.dropletId)
  if (!droplet) {
    let err = new Error('Droplet cannot be found')
    err.isBadRequest = true
    throw err
  }
  console.log(droplet)

  project.desktopDroplets = project.desktopDroplets.concat({
    dropletId: droplet._id
  })
  project = await Project
    .findByIdAndUpdate(project._id, project, { new: true })
    .populate('team', 'desktopDroplets')
  console.log('Updated project')
  console.log(project)
  res.status(201).json(project)
}))

projectRouter.put('/removedesktopdroplet', wrapAsync(async (re, res, next) => {
  checkUser(req)
  const mandatories = ['dropletId', 'projectId']
  validateMandatoryFields(req, mandatories, 'Project', 'remove desktop Droplet')

  let project = await Project.findById(req.body.projectId).populate('team')
  if (!project) {
    let err = new Error('Project cannot be found')
    err.isBadRequest = true
    throw err
  }

  project.desktopDroplets = project.desktopDroplets.filter(d => d._id.toString() !== req.body.dropletId)
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
  if (project.team.owner.toString() !== req.user._id.toString()) {
    let err = new Error('User is not the owner of the team which controls this project')
    err.isUnauthorizedAttempt = true
    throw err
  }

  let team = await Team.findById(project.team._id)
  if (team) {
    team.projects = team.projects.filter(p => p.toString() !== project._id.toString())
    await Team.findByIdAndUpdate(team._id, team)
  }
  project.droplets.forEach(async d => {
    let droplet = await Droplet.findById(d)
    droplet.projects = droplet.projects.filter(p => p.toString() !== project._id.toString())
    await Droplet.findByIdAndUpdate(d, droplet)
  })

  await Project.findByIdAndRemove(project._id)
  res.status(204).end()
}))

module.exports = projectRouter