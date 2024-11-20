exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-user', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-user') {
      const EmailService = require('../services/email-service')
      const emailService = new EmailService('gmail')
      const user = JSON.parse(message)
      const data = {}

      emailService.sendEmail(user, 'user', 'activationUrl', data)
    }
  })
}
