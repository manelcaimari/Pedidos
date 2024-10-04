module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/product-controller.js')

  router.get('/', controller.findAll)
  router.get('/:id', controller.findOne)

  app.use('/api/client/products', router)
}
