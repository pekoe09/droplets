const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    req.user = null
  } else {
    const userId = getUserIdFromToken(req.token)
    if (!userId) {
      let err = new Error('Token is invalid')
      err.isUnauthorizedAttempt = true
      next(err)
    }
    req.user = await User.findById(userId)
  }
  next()
}

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    return decodedToken.userId
  } catch (exception) {
    console.log('Token exception', exception)
    return null
  }
}

module.exports = { userExtractor }