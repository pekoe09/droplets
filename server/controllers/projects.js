const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const projectRouter = require('express').Router()
const Project = require('../models/project')

projectRouter.get('/', wrapAsync(async (req, res, next) {
  checkUser(req)
  const mandatories = ['name']
  validateMandatoryFields(req, mandatories, 'Project', 'get')

  const project = await Project.find({})
}))

projectRouter.post('/', wrapAsync(async (req, res, next) => {

}))

projectRouter.put('/:id', wrapAsync(async (req, res, next) => {

}))

projectRouter.delete('/:id', wrapAsync(async (req, res, next) => {

}))

module.exports = projectRouter