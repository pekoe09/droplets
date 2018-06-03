const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const config = require('./utils/config')

app.use(cors())
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../react-ui/build', 'index.html')))

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

module.exports = {
  app,
  server
}