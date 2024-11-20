const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  // Crear un PaymentMethod y un PaymentIntent
  create: async (req, res) => {
    try {
      const { amount, currency, customer, payment_method } = req.body

      // Crear el PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        }
      })

      res.status(200).json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      console.error('Error creando PaymentMethod o PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al crear PaymentMethod o PaymentIntent' })
    }
  },

  findAll: async (req, res) => {
    try {
      const paymentIntents = await stripe.paymentIntents.list()
      res.send(paymentIntents)
    } catch (error) {
      console.error('Error en findAll:', error)
      res.status(500).send({ error: 'Error interno al obtener los PaymentIntents' })
    }
  },

  findOne: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error obteniendo el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al obtener el PaymentIntent' })
    }
  },

  cancel: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error cancelando el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al cancelar el PaymentIntent' })
    }
  },

  capture: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.capture(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error capturando el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al capturar el PaymentIntent' })
    }
  },

  // Confirmar un PaymentIntent (para confirmación directa en backend)
  confirm: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error confirmando el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al confirmar el PaymentIntent' })
    }
  }
}
