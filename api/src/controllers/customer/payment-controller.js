const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  create: async (req, res) => {
    try {
      const { amount, currency } = req.body
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency
      })

      res.send({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      console.error('Error creando el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al crear el PaymentIntent' })
    }
  },

  findAll: async (req, res) => {
    try {
      const paymentIntents = await stripe.paymentIntents.list()
      res.send(paymentIntents)
    } catch (error) {
      console.error('Error obteniendo los PaymentIntents:', error)
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

  confirm: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error confirmando el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al confirmar el PaymentIntent' })
    }
  },

  incrementAuthorization: async (req, res) => {
    try {
      const { amount } = req.body
      const paymentIntent = await stripe.paymentIntents.incrementAuthorization(req.params.id, { amount })
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error incrementando la autorización del PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al incrementar la autorización' })
    }
  },

  applyCustomerBalance: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.applyCustomerBalance(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error aplicando el saldo del cliente al PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al aplicar el saldo del cliente' })
    }
  },

  search: async (req, res) => {
    try {
      const { query } = req.body
      const paymentIntents = await stripe.paymentIntents.list({ limit: 10, query })
      res.send(paymentIntents)
    } catch (error) {
      console.error('Error buscando PaymentIntents:', error)
      res.status(500).send({ error: 'Error interno al buscar PaymentIntents' })
    }
  },
  verifyMicrodeposits: async (req, res) => {
    try {
      const { amounts } = req.body
      const paymentIntent = await stripe.paymentIntents.verifyMicrodeposits(req.params.id, { amounts })
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error verificando los microdepósitos:', error)
      res.status(500).send({ error: 'Error interno al verificar los microdepósitos' })
    }
  }
}
