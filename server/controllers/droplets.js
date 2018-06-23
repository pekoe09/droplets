const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const dropletRouter = require('express').Router()
const Droplet = require('../models/droplet')
const Project = require('../models/project')
const Team = require('../models/team')

dropletRouter.get('/', wrapAsync(async (req, res, next) => {
  checkUser(req)

  // TODO: query string item for different perspectives (team, project, keyword)
  const droplets = await Droplet.find({ owner: req.user._id })
  res.json(droplets)
}))

dropletRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['header', 'text', 'projectId', 'teamId']
  validateMandatoryFields(req, mandatories, 'Droplet', 'create')

  let team = await Team.findById(req.body.teamId)
  if (!team) {
    let err = new Error('Team cannot be found')
    err.isBadRequest = true
    throw err
  }

  let project = await Team.findById(req.body.projectId)
  if (!project) {
    let err = new Error('Project cannot be found')
    err.isBadRequest = true
    throw err
  }

  let droplet = new Droplet({
    header: req.body.header,
    summary: req.body.summary,
    text: req.body.text,
    keywords: req.body.keywords,
    owner: req.user._id,
    projects: [req.body.projectId],
    teams: [req.body.teamId]
  })
  droplet = await droplet.save()
  project.droplets = project.droplets.push(droplet._id)
  await Project.findByIdAndUpdate(project._id, project)

  res.status(201).json(droplet)
}))

dropletRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['header', 'text', 'projectId', 'teamId']
  validateMandatoryFields(req, mandatories, 'Droplet', 'create')

  let droplet = await Droplet.findById(req.params.id)
  if (!droplet) {
    let err = new Error('Droplet cannot be found')
    err.isBadRequest = true
    throw err
  }

  droplet.header = req.body.header
  droplet.summary = req.body.summary
  droplet.text = req.body.text
  droplet.keywords = req.body.keywords
  droplet = await Droplet.findByIdAndUpdate(droplet._id, droplet, { new: true })
  res.status(201).json(droplet)
}))

//TODO: adding/removing droplet to/from teams/projects
//TODO: transferring droplet ownership to another user
//TODO: automatically adding summary field based on text start if not provided

dropletRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  let droplet = await Droplet.findById(req.params.id)
  if (!droplet) {
    let err = new Error('Droplet cannot be found')
    err.isBadRequest = true
    throw err
  }
  if (droplet.owner.toString() !== req.user._id.toString()) {
    let err = new Error('User is not the owner of the droplet')
    err.isUnauthorizedAttempt = true
    throw err
  }

  droplet.projects.forEach(async p => {
    let project = await Project.findById(p)
    project.droplets = project.droplets.filter(d => d.toString() !== d._id.toString())
    await Project.findByIdAndUpdate(p, project)
  })

  await Droplet.findByIdAndRemove(droplet._id)
  res.status(204).end()
}))

module.exports = dropletRouter