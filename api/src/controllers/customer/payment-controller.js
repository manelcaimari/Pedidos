const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  create: async (req, res) => {
    try {
      const { amount, currency, customer, payment_method } = req.body;
      console.log('Datos recibidos en el backend (create):', { amount, currency, customer, payment_method });

      // Validación de los datos recibidos
      if (typeof amount !== 'number' || typeof currency !== 'string') {
        return res.status(400).send({ error: 'Amount debe ser un número y currency debe ser un string' });
      }

      if (!customer || typeof customer.name !== 'string' || typeof customer.email !== 'string') {
        return res.status(400).send({ error: 'Customer debe tener nombre y email válidos' });
      }



      // Crear el PaymentIntent con Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        description: `Pago de ${customer.name}`,
        metadata: { name: customer.name, email: customer.email },
        payment_method,    // El ID del método de pago proporcionado desde el frontend


      });
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
      console.log('Últimos 4 dígitos de la tarjeta:', paymentMethod.card.last4);
      console.log('PaymentIntent creado:', paymentIntent);
      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creando PaymentIntent:', error);
      res.status(500).send({ error: 'Error interno al crear PaymentIntent' });
    }
  },

  // Obtener todos los PaymentIntents
  findAll: async (req, res) => {
    try {
      const paymentIntents = await stripe.paymentIntents.list();
      res.send(paymentIntents);
    } catch (error) {
      console.error('Error en findAll:', error);
      res.status(500).send({ error: 'Error interno al obtener los PaymentIntents' });
    }
  },

  // Obtener un PaymentIntent específico
  findOne: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
      res.send(paymentIntent);
    } catch (error) {
      console.error('Error obteniendo el PaymentIntent:', error);
      res.status(500).send({ error: 'Error interno al obtener el PaymentIntent' });
    }
  },

  // Cancelar un PaymentIntent
  cancel: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(req.params.id);
      res.send(paymentIntent);
    } catch (error) {
      console.error('Error cancelando el PaymentIntent:', error);
      res.status(500).send({ error: 'Error interno al cancelar el PaymentIntent' });
    }
  },

  // Capturar un PaymentIntent (para pagos autorizar y luego capturar)
  capture: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.capture(req.params.id);
      res.send(paymentIntent);
    } catch (error) {
      console.error('Error capturando el PaymentIntent:', error);
      res.status(500).send({ error: 'Error interno al capturar el PaymentIntent' });
    }
  },

  // Confirmar un PaymentIntent (para confirmación directa en backend)
  confirm: async (req, res) => {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(req.params.id);
      res.send(paymentIntent);
    } catch (error) {
      console.error('Error confirmando el PaymentIntent:', error);
      res.status(500).send({ error: 'Error interno al confirmar el PaymentIntent' });
    }
  },
};