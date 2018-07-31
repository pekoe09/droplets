const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const dropletRouter = require('express').Router()
const Droplet = require('../models/droplet')
const Project = require('../models/project')
const Team = require('../models/team')
const Keyword = require('../models/keyword')

dropletRouter.get('/', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let droplets = []
  console.log('Query string', req.query)
  if (req.query.searchtext) {
    const searchRegExp = new RegExp(req.query.searchtext, 'i')
    droplets = await Droplet
      .find({
        owner: req.user._id,
        $or: [
          { header: searchRegExp },
          { summary: searchRegExp },
          { text: searchRegExp }
        ]
      })
      .populate('keywords linkedDroplets')
  }

  else if (req.query.project) {
    droplets = await Droplet
      .find({
        owner: req.user._id,
        projects: req.query.project
      })
      .populate('keywords linkedDroplets')
  }
  else {
    droplets = await Droplet
      .find({ owner: req.user._id })
      .populate('keywords linkedDroplets')
  }
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
    keywords: req.body.keywords ? req.body.keywords : [],
    linkedDroplets: req.body.linkedDroplets ? req.body.linkedDroplets : [],
    owner: req.user._id,
    projects: [project._id],
    teams: [project.team]
  })
  droplet = await droplet.save()

  // links Droplet to other Droplets
  if (droplet.linkedDroplets.length > 0) {
    await linkToDroplets(droplet._id, droplet.linkedDroplets)
  }

  // adds Droplet to Project's Droplet list
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
  droplet.linkedDroplets = req.body.linkedDroplets
  if (!droplet.projects.includes(project._id)) {
    droplet.projects = droplet.projects.concat(project._id)
  }
  if (!droplet.teams.includes(project.team)) {
    droplet.teams = droplet.teams.concat(project.team)
  }

  await linkToDroplets(droplet._id, droplet.linkedDroplets)

  droplet = await Droplet
    .findByIdAndUpdate(droplet._id, droplet, { new: true })
    .populate('keywords')
  res.status(201).json(droplet)
}))

dropletRouter.put('/addkeyword/:id', wrapAsync(async (req, res, next) => {
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

dropletRouter.put('/addlink/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  const mandatories = ['linkedDropletId']
  validateMandatoryFields(req, mandatories, 'Droplet', 'add link')

  let droplet = await Droplet.findById(req.params.id)
  if (!droplet) {
    let err = new Error('Droplet cannot be found')
    err.isBadRequest = true
    throw err
  }

  let linkedDroplet = await Droplet.findById(req.body.linkedDropletId)
  if (!linkedDroplet) {
    let err = new Error('Linked droplet cannot be found')
    err.isBadRequest = true
    throw err
  }

  let linkedDropletIds = droplet.linkedDroplets.map(d => d.toString())

  if (!linkedDropletIds.includes(linkedDroplet._id.toString())) {
    droplet.linkedDroplets = droplet.linkedDroplets.concat(linkedDroplet._id)
    droplet = await Droplet
      .findByIdAndUpdate(droplet._id, droplet, { new: true })
      .populate('keywords')
  } else {
    let err = new Error('Droplet already linked to')
    err.isBadRequest = true
    throw err
  }

  linkedDropletIds = linkedDroplet.linkedDroplets.map(d => d.toString())

  if (!linkedDroplet.linkedDroplets.includes(droplet._id.toString())) {
    linkedDroplet.linkedDroplets = linkedDroplet.linkedDroplets.concat(droplet._id)
    linkedDroplet = await Droplet
      .findByIdAndUpdate(linkedDroplet._id, linkedDroplet, { new: true })
      .populate('keywords')
  } else {
    let err = new Error('Droplet already linked from')
    err.isBadRequest = true
    throw err
  }

  res.status(201).json({ droplet, linkedDroplet })
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

  await linkToDroplets(droplet._id, [])

  await Droplet.findByIdAndRemove(droplet._id)
  res.status(204).end()
}))

const linkToDroplets = async (dropletId, linkedDroplets) => {
  linkedDroplets.forEach(async ld => {
    linkedDroplet = await Droplet.findById(ld)
    if (!linkedDroplet.linkedDroplets.includes(dropletId)) {
      linkedDroplet.linkedDroplets.concat(dropletId)
      await Droplet.findByIdAndUpdate(linkedDroplet._id, linkedDroplet)
    }
  })

  const obsoleteLinked = Droplet.find(d => d.linkedDroplets.includes(dropletId) && !linkedDroplets.includes(d._id))
  obsoleteLinked.forEach(async ol => {
    ol.linkedDroplets = ol.linkedDroplets.filter(ld => ld !== dropletId)
    await Droplet.findByIdAndUpdate(ol._id, ol)
  })
}

module.exports = dropletRouter