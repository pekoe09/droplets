const mongoose = require('mongoose')

const desktopDropletSchema = new mongoose.Schema({
  dropletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Droplet',
    required: true
  },
  posX: { type: mongoose.Schema.Types.Number },
  posY: { type: mongoose.Schema.Types.Number },
  posZ: { type: mongoose.Schema.Types.Number }
})

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  droplets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Droplet'
  }],
  desktopDroplets: [desktopDropletSchema]
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project