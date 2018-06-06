const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const config = require('./utils/config')
const { tokenExtractor } = require('./utils/tokenExtractor')
const { userExtractor } = require('./utils/userExtractor')
const mongo = require('./mongo')

const userRouter = require('./controllers/users')

app.use(cors())
app.use(bodyParser.json())
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/users', userRouter)

//app.use(express.static(path.resolve(__dirname, '../react-ui/build', 'index.html')))
app.use(express.static(path.resolve(__dirname, '../react-ui/build')))

app.get('*', (req, res) => {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
})

app.use((err, req, res, next) => {
  console.log(err.message)
  // console.log(err.code)
  // console.log(err.stack)
  if (err.isBadRequest) {
    res.status(400).json({ error: err.message })
  } else if (err.isUnauthorizedAttempt) {
    res.status(401).json({ error: err.message })
  } else if (err.isForbidden) {
    res.status(403).json({ error: err.message })
  } else {
    res.status(500).json({ error: 'Something has gone wrong' })
  }
})

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongo.close()
})

module.exports = {
  app,
  server
}