module.exports = (app) => {
  const router = require('express').Router()
  const paymentController = require('../controllers/customer/payment-controller.js')

  router.post('/create-customer', paymentController.createCustomer)
  router.post('/create-payment-intent', paymentController.createPaymentIntent)
  router.get('/', paymentController.findAll)
  router.get('/:id', paymentController.findOne)
  router.post('/:id/cancel', paymentController.cancel)
  router.post('/:id/capture', paymentController.capture)
  router.post('/:id/confirm', paymentController.confirm)

  app.use('/api/client/payments', router)
}
