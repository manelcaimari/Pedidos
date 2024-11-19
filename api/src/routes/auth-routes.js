module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/auth/auth-routes-controller.js')

  router.get('/', controller.findAll)

  app.use('/api/auth/routes', router)
}
