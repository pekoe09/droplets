const mongoose = require('mongoose')

const keywordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  droplets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Droplet'
  }]
})

const Keyword = mongoose.model('Keyword', keywordSchema)

module.exports = Keyword