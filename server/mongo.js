const mongoose = require('mongoose')
const config = require('./utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log('Connecting to database...')
mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise
console.log('...connected!')

close = () => {
  mongoose.connection.close()
  console.log('Database connection closed.')
}

module.exports = { close }