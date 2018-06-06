const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

const checkUser = (req) => {
  if (!req.user) {
    let err = new Error('Request does not contain valid user identification')
    err.isUnauthorizedAttempt = true
    throw err
  }
}

const validateMandatoryField = (req, fieldName, entity, operation) => {
  const fieldParts = fieldName.split('.')
  let fieldFound = false
  if (fieldParts.length === 1) {
    fieldFound = req.body[fieldName]
  } else if (fieldParts.length === 2) {
    fieldFound = req.body[fieldParts[0]][fieldParts[1]]
  }
  if (!fieldFound) {
    let err = new Error(`Field ${fieldName} is missing when trying to ${operation} ${entity}`)
    err.isBadRequest = true
    throw err
  }
}

const validateMandatoryFields = (req, fieldNames, entity, operation) => {
  fieldNames.forEach(f => validateMandatoryField(req, f, entity, operation))
}

const validateEmailForm = (email) => {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  const isValid = re.test(email.toLowerCase())
  if (!isValid) {
    let err = new Error('Email is in invalidu format')
    err.isBadRequest = true
    throw err
  }
}

module.exports = {
  wrapAsync,
  checkUser,
  validateMandatoryField,
  validateMandatoryFields,
  validateEmailForm
}