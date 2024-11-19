import { loadStripe } from '@stripe/stripe-js';

export class StripeElements {
  constructor(stripePublicKey) {
    this.stripe = null;
    this.elements = null;
    this.cardElement = null;
    this.stripePublicKey = stripePublicKey;
  }

  async initializeStripe() {
    try {
      // Cargar Stripe
      this.stripe = await loadStripe(this.stripePublicKey);
      if (!this.stripe) {
        throw new Error("Stripe no pudo ser cargado correctamente");
      }

      // Inicializar elementos de Stripe
      this.elements = this.stripe.elements();
      console.log("Stripe y elementos cargados correctamente.");
    } catch (error) {
      console.error("Error al cargar Stripe:", error);
    }
  }

  mountCardElement(container) {
    try {
      if (!this.elements) {
        console.error("Los elementos de Stripe no han sido inicializados.");
        return;
      }
      this.cardElement = this.elements.create('card');
      this.cardElement.mount(container);
      console.log("Elemento Card montado con éxito.");
    } catch (error) {
      console.error("Error al montar el Card Element:", error);
    }
  }

  async createPaymentMethod(cardElement, customerData) {
    try {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerData.name,
          email: customerData.email,
        },
      });

      if (error) {
        console.error("Error creando el método de pago:", error);
        return null;
      }

      return paymentMethod;
    } catch (error) {
      console.error("Error creando el método de pago:", error);
      return null;
    }
  }

  async confirmPayment(clientSecret, paymentMethodId) {
    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        console.error("Error de pago:", error);
        return { success: false, message: error.message };
      }

      return { success: true, paymentIntent };
    } catch (error) {
      console.error("Error confirmando el pago:", error);
      return { success: false, message: error.message };
    }
  }
}