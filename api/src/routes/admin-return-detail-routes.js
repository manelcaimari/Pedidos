module.exports = (app) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/customer/return-detail-controller.js')

  router.post('/', [authCookie.verifyUserCookie], controller.create)
  router.get('/', [authCookie.verifyUserCookie], controller.findAll)
  router.get('/:id', [authCookie.verifyUserCookie], controller.findOne)

  app.use('/api/admin/return-details', router)
}
