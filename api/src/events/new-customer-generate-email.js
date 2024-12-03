const AuthorizationService = require('../services/authorization-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-customer', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-customer') {
      const customer = JSON.parse(message)
      const authorizationService = new AuthorizationService()
      const activationUrl = await authorizationService.createActivationToken(customer.id, 'customer')

      const EmailService = require('../services/email-service')
      const emailService = new EmailService('gmail')

      const data = {
        customer,
        activationUrl
      }

      emailService.sendEmail(customer, 'customer', 'activationUrl', data)
    }
  })
}
