const mongoose = require('mongoose')

const dropletSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  keywords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Keyword'
  }],
  linkedDroplets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Droplet'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }]
})

const Droplet = mongoose.model('Droplet', dropletSchema)

module.exports = Droplet