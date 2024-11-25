const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  createpaymentintent: async (req, res) => {
    const { amount, customerName, customerEmail } = req.body

    console.log('Datos recibidos:', { amount, customerName, customerEmail }) // <-- Verifica los datos aquí

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0.' })
    }

    try {
      const customer = await stripe.customers.create({
        name: customerName,
        email: customerEmail
      })

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        customer: customer.id,
        payment_method_types: ['card'],
        metadata: {
          customerName,
          customerEmail
        }
      })
      res.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      console.error('Error al crear el PaymentIntent:', error)
      res.status(500).json({ error: 'Error al procesar el pago.' })
    }
  }
}
