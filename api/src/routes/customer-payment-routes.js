module.exports = (app) => {
  const router = require('express').Router()
  const paymentController = require('../controllers/customer/payment-controller.js')

  router.post('/create-payment-intent', paymentController.createpaymentintent)


  app.use('/api/client/payments', router)
}
