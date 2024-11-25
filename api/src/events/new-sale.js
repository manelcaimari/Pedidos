const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-sale', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-sale') {
      const emailService = new EmailService('gmail')
      const sale = JSON.parse(message)

      emailService.sendEmail(sale, 'customer', 'orderDetails', sale)
    }
  })
}
