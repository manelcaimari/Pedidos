module.exports = (app) => {
  const router = require('express').Router()
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')
  const controller = require('../controllers/customer/routes-controller.js')

  router.get('/', [authCustomerJwt.verifyCustomerToken], controller.findAll)

  app.use('/api/customer/routes', router)
}
