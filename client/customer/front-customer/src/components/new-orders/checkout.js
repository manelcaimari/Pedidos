import { loadStripe } from '@stripe/stripe-js'
class CheckoutComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.stripe = null;
    this.elements = null;
    this.customerData = {};
  }

  async connectedCallback() {
    document.addEventListener('showCheckoutModal', this.handleMessage.bind(this));

    try {
      await this.render();
      console.log("Rendered checkout component");

      const customerForm = this.shadowRoot.querySelector("#customer-form");
      if (!customerForm) {
        console.error("Customer form not found in shadow DOM!");
        return;
      }

      this.setupEventListeners();
      await this.initializeStripe();
      console.log("Stripe initialized");
    } catch (error) {
      console.error("Error in connectedCallback:", error);
    }
  }

  handleMessage(event) {
    const { name, email, total } = event.detail;
    let sanitizedTotal = total.toString().replace(/[,.]/g, '');

    if (sanitizedTotal.endsWith('00')) {
      sanitizedTotal = sanitizedTotal.slice(0, -2);
    }

    const finalTotal = parseFloat(sanitizedTotal);

    this.customerData = {
      name,
      email,
      total: finalTotal * 100 // Stripe usa la cantidad en centavos
    };

    console.log("Datos del cliente y total:", this.customerData);
    const checkoutElement = this.shadowRoot.querySelector('.checkout');
    if (checkoutElement) {
      checkoutElement.classList.add('visible');
    } else {
      console.error('Elemento ".checkout" no encontrado.');
    }
  }

  setupEventListeners() {
    const customerForm = this.shadowRoot.querySelector("#customer-form");
    if (customerForm) {
      customerForm.addEventListener("submit", this.handleCustomerFormSubmit.bind(this));
    }
  }

  async initializeStripe() {
    try {
      this.stripe = await loadStripe("pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S");
      console.log("Stripe initialized successfully.");

      // Asegurarte de que Stripe Elements se inicializa correctamente
      const appearance = { theme: 'stripe' };
      const paymentElementContainer = this.shadowRoot.querySelector("#payment-element-container");

      if (!paymentElementContainer) {
        throw new Error("Contenedor de Stripe Elements no encontrado.");
      }

      // Inicializar Stripe Elements con el `clientSecret`
      this.elements = this.stripe.elements({ appearance });

      // Crear el elemento de pago
      const paymentElement = this.elements.create("payment");

      // Montar el elemento de pago en el contenedor
      paymentElement.mount(paymentElementContainer);

      // Habilitar el formulario o el botón de envío solo después de que Stripe Elements esté listo
      const form = this.shadowRoot.querySelector("#customer-form");
      const submitButton = form.querySelector("button");
      submitButton.disabled = false;  // Habilitar el botón de envío
    } catch (error) {
      console.error("Error initializing Stripe:", error);
      this.showMessage("Failed to initialize payment system. Please try again later.");
    }
  }

  async handleCustomerFormSubmit(event) {
    event.preventDefault();

    const { name, email, total } = this.customerData;

    if (!name || !email || !total || total <= 0) {
      this.showMessage("Por favor, verifica los datos ingresados.");
      return;
    }

    try {


      // Enviar los datos al backend para crear el PaymentIntent
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'eur', customer: { name, email }, payment_method: "pm_card_visa" })
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${await response.text()}`);
      }

      const { clientSecret } = await response.json();
      if (!clientSecret) {
        throw new Error("No se recibió el client secret de la API.");
      }

      // Manejar el pago con Stripe
      await this.handleStripePayment(clientSecret);
    } catch (error) {
      console.error("Error procesando el formulario:", error);
      this.showMessage("Hubo un problema con el pago. Intenta de nuevo.");
    }
  }

  async handleStripePayment(clientSecret) {
    try {
      if (!this.stripe) {
        throw new Error("Stripe no está inicializado.");
      }

      // Configurar Stripe Elements
      const appearance = { theme: 'stripe' };
      const paymentElementContainer = this.shadowRoot.querySelector("#payment-element-container");

      if (!paymentElementContainer) {
        throw new Error("Contenedor del elemento de pago no encontrado.");
      }

      // Inicializar Stripe Elements con el `clientSecret`
      this.elements = this.stripe.elements({ appearance, clientSecret });

      // Crear el elemento de pago
      const paymentElement = this.elements.create("payment");

      // Montar el elemento de pago
      paymentElement.mount(paymentElementContainer);
    } catch (error) {
      console.error("Error configurando Stripe:", error);
      this.showMessage("Hubo un problema al procesar tu pago.");
    }
  }

  // Función para procesar el pago cuando se envía el formulario
  async handlePaymentSubmit(event, clientSecret) {
    event.preventDefault();

    // Confirmar el pago con Stripe usando el clientSecret
    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,  // URL a la que Stripe redirigirá después del pago
      },
    });

    if (error) {
      this.showMessage(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      this.showMessage("Pago exitoso");
    }
  }

  showMessage(message) {
    const messageContainer = this.shadowRoot.querySelector(".message-container");
    if (messageContainer) {
      messageContainer.textContent = message;
      messageContainer.style.display = "block";
    }
  }

  async render() {
    this.shadow.innerHTML =       /* html */`
    <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
        }
        #payment-element-container {
  border: 1px solid red; /* Para visualizarlo */
  min-height: 200px; /* Asegura espacio suficiente */
  display: block; /* Asegúrate de que esté visible */
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
     
    `;
  }
}

customElements.define("checkout-component", CheckoutComponent);