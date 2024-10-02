module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/price-controller.js')

  router.get('/', controller.findAll)
  router.get('/:id', controller.findOne)


  app.use('/api/client/prices', router)
}
