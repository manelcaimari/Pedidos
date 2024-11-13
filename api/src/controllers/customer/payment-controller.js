const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {

  create: async (req, res) => {
    try {
      const { amount, currency, customer } = req.body
      console.log('Datos recibidos en el backend (create):', { amount, currency, customer })

      if (typeof amount !== 'number' || typeof currency !== 'string') {
        console.log('Error en validación de tipos en create')
        return res.status(400).send({ error: 'Amount debe ser número y currency debe ser string' })
      }

      if (!customer || typeof customer.name !== 'string' || typeof customer.email !== 'string' || typeof customer.address !== 'object') {
        console.log('Error en validación de customer en create')
        return res.status(400).send({ error: 'Customer debe tener nombre, email y dirección válidos' })
      }

      console.log('Validación correcta, creando PaymentIntent...')

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        description: `Pago de ${customer.name}`,
        metadata: {
          name: customer.name,
          email: customer.email,
          address: JSON.stringify(customer.address)
        }
      })

      console.log('PaymentIntent creado:', paymentIntent)
      res.send({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      console.error('Error creando PaymentIntent en create:', error.message || error)
      res.status(500).send({ error: 'Error interno al crear PaymentIntent' })
    }
  },

  findAll: async (req, res) => {
    console.log('Ejecutando findAll...')
    try {
      const paymentIntents = await stripe.paymentIntents.list()
      console.log('PaymentIntents obtenidos:', paymentIntents)
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
