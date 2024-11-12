module.exports = (app) => {
  const router = require('express').Router()
  const paymentController = require('../controllers/customer/payment-controller.js')

  app.post('/api/payments', paymentController.create)
  app.get('/api/payments', paymentController.findAll)
  app.get('/api/payments/:id', paymentController.findOne)
  app.post('/api/payments/:id/cancel', paymentController.cancel)
  app.post('/api/payments/:id/capture', paymentController.capture)
  app.post('/api/payments/:id/confirm', paymentController.confirm)

  router.post('/:id/increment_authorization', paymentController.incrementAuthorization)
  router.post('/:id/apply_customer_balance', paymentController.applyCustomerBalance)
  router.post('/search', paymentController.search)
  router.post('/:id/verify_microdeposits', paymentController.verifyMicrodeposits)

  app.use('/api/client/payments', router)
}
