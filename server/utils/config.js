if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGO_URI
let s3Bucket = process.env.S3_BUCKET
let awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
let awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
let awsRegion = process.env.AWS_REGION

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGO_URI
}

module.exports = {
  mongoUrl,
  port,
  s3Bucket,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion
}