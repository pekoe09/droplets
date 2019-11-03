const mongoose = require('mongoose')
const config = require('./utils/config')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// for avoiding Mongo deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

console.log('Connecting to database...')
mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise
console.log('...connected!')

close = () => {
  mongoose.connection.close()
}

module.exports = { close }