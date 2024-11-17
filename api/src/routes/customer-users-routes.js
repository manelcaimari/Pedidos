module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/customer-controller.js')

  router.get('/', controller.findAll)
  router.get('/:id', controller.findOne)


  app.use('/api/client/customers', router)
}
