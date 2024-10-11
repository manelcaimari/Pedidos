module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/return-controller.js')

  router.post('/', controller.create)
  router.get('/', controller.findAll)
  router.get('/:id', controller.findOne)

  app.use('/api/client/returns', router)
}
