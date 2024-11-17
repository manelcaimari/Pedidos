module.exports = (app) => {
  const router = require('express').Router()
  const paymentController = require('../controllers/customer/payment-controller.js')

  router.post('/create', paymentController.create);
  router.get('/', paymentController.findAll);
  router.get('/:id', paymentController.findOne);
  router.post('/:id/cancel', paymentController.cancel);
  router.post('/:id/capture', paymentController.capture);
  router.post('/:id/confirm', paymentController.confirm);

  app.use('/api/client/payments', router)
}
