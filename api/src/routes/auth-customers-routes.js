module.exports = (app) => {
  const auth = require('../controllers/auth/auth-customer-controller.js')

  app.post('/api/auth/customer/signin', auth.signin)
  app.post('/api/auth/customer/reset', auth.reset)
}
