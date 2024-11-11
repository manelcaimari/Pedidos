module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/payment-controller.js')

  router.post('/', controller.create)
  router.get('/', controller.findAll)
  router.get('/:id', controller.findOne)
  router.post('/:id/cancel', controller.cancel)
  router.post('/:id/capture', controller.capture)
  router.post('/:id/confirm', controller.confirm)
  router.post('/:id/increment_authorization', controller.incrementAuthorization)
  router.post('/:id/apply_customer_balance', controller.applyCustomerBalance)
  router.post('/search', controller.search)
  router.post('/:id/verify_microdeposits', controller.verifyMicrodeposits)

  app.use('/api/client/payments', router)
}
