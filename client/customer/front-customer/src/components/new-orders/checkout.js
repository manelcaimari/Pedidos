import { StripeElements } from '../stripe-elements.js';
class CheckoutComponent extends HTMLElement {
  constructor() {
    super();
    this.stripeElements = null; // Aquí almacenamos la instancia de StripeElements
    this.customerData = {};
    this.attachShadow({ mode: 'open' }); // Attach the shadow root
  }
  async connectedCallback() {
    document.addEventListener('showCheckoutModal', this.handleMessage.bind(this));
    try {
      console.log('Iniciando renderizado...');
      await this.render();
      console.log('Componente renderizado con éxito');

      this.setupEventListeners();
      console.log('Event listeners configurados');

      this.stripeElements = new StripeElements('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S');
      console.log('StripeElements creado con la clave proporcionada');

      await this.stripeElements.initializeStripe();
      console.log('Stripe inicializado con éxito');

      this.setupStripe(); // Asegúrate de que esto se ejecute después de la inicialización
      console.log('Stripe configurado');
    } catch (error) {
      console.error('Error en connectedCallback:', error);
    }
  }

  setupStripe() {
    const paymentElementContainer = document.querySelector('#payment-element-container');
    if (paymentElementContainer) {
      console.log('Contenedor de Stripe encontrado, montando el elemento...');
      this.stripeElements.mountCardElement(paymentElementContainer);
    } else {
      console.error('Contenedor #payment-element-container no encontrado en el Light DOM');
    }
  }

  setupEventListeners() {
    const form = this.querySelector('#customer-form');
    if (form) {
      form.addEventListener('submit', this.handleCustomerFormSubmit.bind(this));
    } else {
      console.error('Form not found when setting up event listeners.');
    }
  }

  handleMessage(event) {
    const { name, email, total } = event.detail;
    this.customerData = { name, email, total };
    const checkoutElement = this.shadowRoot.querySelector('.checkout');
    if (checkoutElement) {
      checkoutElement.classList.add('visible');
    } else {
      console.error('Elemento ".checkout" no encontrado.');
    }
  }

  async initiatePayment() {
    const paymentMethod = await this.stripeElements.createPaymentMethod(this.stripeElements.cardElement, this.customerData);
    if (!paymentMethod) {
      this.showMessage('No se pudo crear el método de pago. Intenta nuevamente.');
      return;
    }

    const paymentResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/client/payments/create-payment-intent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: this.customerData.total * 100, // Convertir a céntimos
          currency: 'eur',
          customerId: this.customerData.customerId,
          payment_method: paymentMethod.id,
          receipt_email: this.customerData.email,
        }),
      }
    );

    const paymentResponseJson = await paymentResponse.json();
    console.log('Respuesta del servidor:', paymentResponseJson);

    const { clientSecret } = paymentResponseJson;
    if (!clientSecret) {
      console.error('No se recibió el clientSecret del servidor');
      return;
    }

    const result = await this.stripeElements.confirmPayment(clientSecret, paymentMethod.id);
    if (result.success) {
      console.log('Pago completado con éxito:', result.paymentIntent);
      this.showMessage('¡Pago completado con éxito!');
    } else {
      console.error('Error al procesar el pago:', result.message);
      this.showMessage('Ocurrió un error al procesar el pago. Intenta nuevamente.');
    }
  }

  showMessage(message) {
    const messageContainer = this.shadowRoot.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.textContent = message;
      messageContainer.style.display = 'block';
    }
  }



  async render() {
    this.shadowRoot.innerHTML =
      /* html */`
      <style>
      .hidden {
  display: none;
}
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
        }

        #payment-element-container {
          border: 1px solid red;
          min-height: 200px;
          display: block;
        }

        .checkout {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }

        .checkout.visible {
          visibility: visible;
          opacity: 1;
        }

        form {
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        h2 {
          font-size: 1.5em;
          margin-bottom: 15px;
          color: #333;
          text-align: center;
        }

        label {
          font-size: 0.9em;
          color: #555;
          margin-bottom: 5px;
        }

        input {
          padding: 10px;
          font-size: 1em;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 15px;
          transition: border-color 0.3s;
        }

        input:focus {
          border-color: #0055DE;
          outline: none;
        }

        button {
          background: #0055DE;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 1.1em;
          cursor: pointer;
          transition: background 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        button:hover:not(:disabled) {
          background: #003bb5;
        }

        #spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #333;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin-left: 10px;
          display: none;
        }

        #payment-message {
          display: none;
          color: red;
          font-size: 0.9em;
          text-align: center;
        }

        .hidden {
          display: none;
        }

        .payment-form-container {
          display: none;
          margin-top: 30px;
        }

        .payment-form-container.visible {
          display: block;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>

      <div class="checkout">
      <form id="customer-form">
          <h2>Datos de Pago</h2>
          <div id="payment-element-container"></div>
          <button type="submit">Submit</button>
        </form>
      </div>
    `
    const checkoutElement = this.shadowRoot.querySelector('.checkout');
    if (checkoutElement) {
      console.log('Elemento de checkout encontrado en el Shadow DOM');
    } else {
      console.error('No se encontró el elemento .checkout en el Shadow DOM');
    }
  }
}
customElements.define('checkout-component', CheckoutComponent)
