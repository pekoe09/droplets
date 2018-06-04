const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { wrapAsync, checkUser } = require('./controllerHelpers')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/register', wrapAsync(async (req, res, next) => {
  const body = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  let user = new User({
    username: body.username,
    passwordHash,
    firstNames: body.firstNames,
    lastName: body.lastName,
    email: body.email
  })

  user = await user.save()
  res.status(201).json(user)
}))

userRouter.get('/self', wrapAsync(async (req, res, next) => {
  checkUser(req)

  const user = await User.findById(req.user._id)
  res.json(user)
}))

userRouter.put('/self', wrapAsync(async (req, res, next) => {
  checkUser(req)

  const body = req.body
  let user = await User.findById(req.user._id)
  user.username = body.username
  user.firstNames = body.firstNames
  user.lastName = body.lastName
  user.email = body.email

  user = await User.findByIdAndUpdate(user._id, user)
  res.status(201).json(user)
}))

module.exports = userRouter