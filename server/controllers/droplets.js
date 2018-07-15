const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const dropletRouter = require('express').Router()
const Droplet = require('../models/droplet')
const Project = require('../models/project')
const Team = require('../models/team')
const Keyword = require('../models/keyword')

dropletRouter.get('/', wrapAsync(async (req, res, next) => {
  checkUser(req)

  // TODO: query string item for different perspectives (team, project, keyword)
  const droplets = await Droplet
    .find({ owner: req.user._id })
    .populate('keywords')
  res.json(droplets)
}))

dropletRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['header', 'text', 'projectId']
  validateMandatoryFields(req, mandatories, 'Droplet', 'create')

  let project = await Project.findById(req.body.projectId)
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
    projects: [project._id],
    teams: [project.team]
  })
  droplet = await droplet.save()
  project.droplets = project.droplets.push(droplet._id)
  await Project.findByIdAndUpdate(project._id, project)
  droplet = droplet
    .findById(droplet._id)
    .populate('keywords')

  res.status(201).json(droplet)
}))

dropletRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['header', 'text', 'projectId']
  validateMandatoryFields(req, mandatories, 'Droplet', 'update')

  let droplet = await Droplet.findById(req.params.id)
  if (!droplet) {
    let err = new Error('Droplet cannot be found')
    err.isBadRequest = true
    throw err
  }

  let project = await Project.findById(req.body.projectId)
  if (!project) {
    let err = new Error('Project cannot be found')
    err.isBadRequest = true
    throw err
  }

  droplet.header = req.body.header
  droplet.summary = req.body.summary
  droplet.text = req.body.text
  droplet.keywords = req.body.keywords
  if (!droplet.projects.includes(project._id)) {
    droplet.projects = droplet.projects.concat(project._id)
  }
  if (!droplet.teams.includes(project.team)) {
    droplet.teams = droplet.teams.concat(project.team)
  }

  droplet = await Droplet
    .findByIdAndUpdate(droplet._id, droplet, { new: true })
    .populate('keywords')
  res.status(201).json(droplet)
}))

dropletRouter.put('/addKeyword/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['keywordText']
  validateMandatoryFields(req, mandatories, 'Droplet', 'add keyword')

  let droplet = await Droplet.findById(req.params.id)
  if (!droplet) {
    let err = new Error('Droplet cannot be found')
    err.isBadRequest = true
    throw err
  }

  let keyword = await Keyword.find({ name: req.body.keywordText })
  if (keyword.length === 0) {
    console.log('Not found keyword')
    keyword = new Keyword({
      name: req.body.keywordText,
      droplets: [droplet._id]
    })
    keyword = await keyword.save()
    console.log('Added keyword')
  } else if (droplet.keywords.includes(keyword._id)) {
    console.log('Keyword exists but on dorplet')
    let err = new Error('Droplet already has the keyword')
    err.isBadRequest = true
    throw err
  } else {
    console.log('Keyword exists')
    console.log(keyword)
    keyword.droplets = keyword.droplets.concat(droplet._id)
    keyword = await Keyword.findByIdAndUpdate(keyword._id, keyword)
  }

  console.log('Adding keyword on droplet')
  console.log(droplet)
  droplet.keywords = droplet.keywords.concat(keyword)
  droplet = await Droplet
    .findByIdAndUpdate(droplet._id, droplet, { new: true })
    .populate('keywords')
  res.status(201).json({ keyword, droplet })
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