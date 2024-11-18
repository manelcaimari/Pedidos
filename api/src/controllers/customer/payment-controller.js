const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  create: async (req, res) => {
    try {
      const { amount, currency, customer, payment_method, receipt_email } = req.body
      console.log('Datos recibidos en el backend (create):', { amount, currency, customer, payment_method, receipt_email })

      // Crear un cliente en Stripe si no existe
      let stripeCustomer
      if (customer.email) {
        const existingCustomer = await stripe.customers.list({
          email: customer.email
        })

        if (existingCustomer.data.length > 0) {
          stripeCustomer = existingCustomer.data[0] // Si el cliente ya existe
        } else {
          // Crear un nuevo cliente si no existe
          stripeCustomer = await stripe.customers.create({
            email: customer.email,
            name: customer.name,
            receipt_email
          })
        }
      }

      // Verificar si se proporcionó un método de pago
      if (!payment_method) {
        return res.status(400).send({ error: 'El método de pago es necesario.' })
      }

      // Crear el PaymentIntent con el ID del cliente de Stripe y el método de pago proporcionado
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: stripeCustomer.id,
        description: `Pago de ${customer.name}`,
        metadata: { name: customer.name, email: customer.email },
        receipt_email,
        payment_method, // Aquí se pasa el método de pago proporcionado
        payment_method_types: ['card'] // Lista explícita de métodos de pago soportados
      })

      // Confirmar el PaymentIntent
      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id)
      console.log('PaymentIntent confirmado:', confirmedPaymentIntent)

      res.send({ clientSecret: confirmedPaymentIntent.client_secret })
    } catch (error) {
      console.error('Error creando PaymentIntent:', error)
      res.status(500).send({ error: 'Error interno al crear PaymentIntent' })
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
