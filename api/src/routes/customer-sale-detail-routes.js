module.exports = (app) => {
  const router = require('express').Router()
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')
  const controller = require('../controllers/customer/sale-detail-controller.js')

  router.post('/', [authCustomerJwt.verifyCustomerToken], controller.create)
  router.get('/', [authCustomerJwt.verifyCustomerToken], controller.findAll)
  router.get('/:id', [authCustomerJwt.verifyCustomerToken], controller.findOne)

  app.use('/api/client/sale-details', router)
}
