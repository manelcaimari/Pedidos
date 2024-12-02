module.exports = (app) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/sale-detail-controller.js')

  router.post('/'[authCookie.verifyUserCookie], controller.create)
  router.get('/'[authCookie.verifyUserCookie], controller.findAll)
  router.get('/:id'[authCookie.verifyUserCookie], controller.findOne)
  router.put('/:id'[authCookie.verifyUserCookie], controller.update)
  router.delete('/:id'[authCookie.verifyUserCookie], controller.delete)
  router.get('/'[authCookie.verifyUserCookie], controller.findBySaleId)

  app.use('/api/admin/sale-details', router)
}
