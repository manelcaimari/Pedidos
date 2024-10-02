module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/product-controller.js')

  router.get('/:id', controller.findAllForCustomer)

  app.use('/api/client/products', router)
}
