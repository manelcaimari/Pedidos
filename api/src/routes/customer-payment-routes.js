module.exports = (app) => {
  const router = require('express').Router()
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')
  const paymentController = require('../controllers/customer/payment-controller.js')

  router.post('/create-payment-intent', [authCustomerJwt.verifyCustomerToken], paymentController.createpaymentintent)

  app.use('/api/client/payments', router)
}
