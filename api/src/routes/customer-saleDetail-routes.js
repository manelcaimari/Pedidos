module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/saleDetail-controller.js')

  router.post('/', controller.create)

  app.use('/api/client/sale-details', router)
}
