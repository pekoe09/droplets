const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

const checkUser = (req) => {
  if(!req.user) {
    let err = new Error('Request does not contain valid user identification')
    err.isBadRequest = true
    throw err
  }
}

module.exports = { wrapAsync, checkUser }