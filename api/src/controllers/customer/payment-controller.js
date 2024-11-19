const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  createCustomer: async (req, res) => {
    try {
      const { email, name, receipt_email } = req.body.customer
      console.log('Datos recibidos para crear cliente:', { email, name, receipt_email })

      // Buscar cliente existente por email
      const existingCustomer = await stripe.customers.list({
        email
      })

      let stripeCustomer

      if (existingCustomer.data.length > 0) {
        stripeCustomer = existingCustomer.data[0] // Cliente ya existe
        console.log('Cliente encontrado:', stripeCustomer.id)
      } else {
        // Crear un nuevo cliente si no existe
        stripeCustomer = await stripe.customers.create({
          email,
          name,
          receipt_email
        })
        console.log('Cliente creado:', stripeCustomer.id)
      }

      // Devolver el ID del cliente y el clientSecret para el PaymentIntent
      res.send({ customerId: stripeCustomer.id })
    } catch (error) {
      console.error('Error al crear cliente en Stripe:', error)
      res.status(500).send({ error: 'Error al crear el cliente' })
    }
  },

  createPaymentIntent: async (req, res) => {
    try {
      const { amount, currency, customerId, payment_method, receipt_email } = req.body
      console.log('Datos recibidos para crear PaymentIntent:', { amount, currency, customerId, payment_method, receipt_email })

      if (!payment_method) {
        return res.status(400).send({ error: 'El método de pago es necesario.' })
      }

      // Crear el PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId, // Usar el customerId creado previamente
        description: `Pago de ${customerId}`,
        receipt_email,
        payment_method, // Método de pago proporcionado
        payment_method_types: ['card'] // Tipo de pago (solo tarjeta por ahora)
      })

      // Confirmar el PaymentIntent
      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id)
      console.log('PaymentIntent confirmado:', confirmedPaymentIntent)

      // Devolver el clientSecret para el frontend
      res.send({ clientSecret: confirmedPaymentIntent.client_secret })
    } catch (error) {
      console.error('Error al crear y confirmar PaymentIntent:', error)
      res.status(500).send({ error: 'Error al crear PaymentIntent' })
    }
  },

  // Obtener todos los PaymentIntents
  findAll: async (req, res) => {
    try {
      const paymentIntents = await stripe.paymentIntents.list()
      res.send(paymentIntents)
    } catch (error) {
      console.error('Error en findAll:', error)
      res.status(500).send({ error: 'Error interno al obtener los PaymentIntents' })
    }
  },

  // Obtener un PaymentIntent específico
  findOne: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error obteniendo el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al obtener el PaymentIntent' })
    }
  },

  // Cancelar un PaymentIntent
  cancel: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error cancelando el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al cancelar el PaymentIntent' })
    }
  },

  // Capturar un PaymentIntent (para pagos autorizar y luego capturar)
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
      // Usamos el ID del PaymentIntent que recibimos en el frontend
      const paymentIntent = await stripe.paymentIntents.confirm(req.params.id)
      res.send(paymentIntent)
    } catch (error) {
      console.error('Error confirmando el PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al confirmar el PaymentIntent' })
    }
  }
}
