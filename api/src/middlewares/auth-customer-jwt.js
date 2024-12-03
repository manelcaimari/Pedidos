require('dotenv').config()
const jwt = require('jsonwebtoken')
const process = require('process')

const verifyCustomerToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      redirection: '/cliente/login'
    })
  }

  const token = req.headers.authorization.split(' ')[1]

  if (token === 'null') {
    return res.status(401).send({
      redirection: '/cliente/login'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        redirection: '/cliente/login'
      })
    }

    if (decoded.type && decoded.type !== 'customer') {
      return res.status(401).send({
        redirection: '/cliente/login'
      })
    }

    req.customerId = decoded.customerId

    next()
  })
}

const authCustomerJwt = {
  verifyCustomerToken
}

module.exports = authCustomerJwt
