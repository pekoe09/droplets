const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  lastName: {
    type: String,
    required: true,
    select: true
  },
  firstNames: {
    type: String,
    required: true,
    select: true
  },
  email: {
    type: String,
    required: true,
    select: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }]
})

userSchema.virtual('fullName').get(() => {
  return (`${this.firstNames} ${this.lastName}`)
})

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

const User = mongoose.model('User', userSchema)

module.exports = User