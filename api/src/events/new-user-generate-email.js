const AuthorizationService = require('../services/authorization-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-user', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-user') {
      const user = JSON.parse(message)
      const authorizationService = new AuthorizationService()
      const activationUrl = await authorizationService.createActivationToken(user.id, 'user')

      const EmailService = require('../services/email-service')
      const emailService = new EmailService('gmail')

      const data = {
        user,
        activationUrl
      }

      emailService.sendEmail(user, 'user', 'activationUrl', data)
    }
  })
}
