const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  createpaymentintent: async (req, res) => {
    const { amount } = req.body
    const customerId = req.customerId
    console.log(customerId)

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0.' })
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',

        metadata: {

        }
      })
      res.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      console.error('Error al crear el PaymentIntent:', error)
      res.status(500).json({ error: 'Error al procesar el pago.' })
    }
  }
}
