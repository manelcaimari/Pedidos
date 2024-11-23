const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  createpaymentintent: async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,  // El monto de la transacción en centavos (1000 = $10.00)
      currency: 'usd',
      payment_method_types: ['card']  // Especifica que solo se aceptan tarjetas
    });

    // Devolver el clientSecret al frontend
    res.json({ clientSecret: paymentIntent.client_secret })
  }
}