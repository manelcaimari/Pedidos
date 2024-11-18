import { loadStripe } from '@stripe/stripe-js'

class CheckoutComponent extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.stripe = null
    this.elements = null
    this.cardElement = null
    this.customerData = {}
  }

  async connectedCallback() {
    document.addEventListener('showCheckoutModal', this.handleMessage.bind(this))
    try {
      await this.render()
      console.log('Rendered checkout component')
      this.setupEventListeners()
      await this.initializeStripe()
      console.log('Stripe initialized')
    } catch (error) {
      console.error('Error in connectedCallback:', error)
    }
  }

  async initializeStripe() {
    try {
      this.stripe = await loadStripe('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S')
      if (!this.stripe) {
        throw new Error('Stripe failed to initialize.')
      }


      // Check if Stripe is initialized
      if (!this.stripe) {
        console.error('Stripe is not initialized.');
        this.showMessage('Error al inicializar el sistema de pago. Intenta de nuevo.');
        return;
      }
      // Inicializa Stripe Elements si aún no lo has hecho
      if (!this.elements) {
        this.elements = this.stripe.elements();
      }

      // Crear un elemento de tarjeta si aún no existe
      if (!this.cardElement) {
        this.cardElement = this.elements.create('card', {
          style: {
            base: {
              color: '#32325d',
              fontFamily: 'Arial, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
            },
          },
        });

        // Montar el elemento en el contenedor
        const paymentContainer = this.shadowRoot.querySelector('#payment-element-container');
        if (paymentContainer) {
          this.cardElement.mount(paymentContainer);
        } else {
          console.error('Error: #payment-element-container does not exist in the DOM.');
        }
      }

      // Crear el método de pago a partir de los datos de la tarjeta
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
        billing_details: {
          name,
          email,
        },
      });

      if (error) {
        console.error('Error al crear el Payment Method:', error.message);
        this.showMessage('Hubo un problema al procesar el método de pago.');
        return;
      }
      console.log('Stripe initialized successfully.')
    } catch (error) {
      console.error('Error initializing Stripe:', error)
      this.showMessage('Failed to initialize payment system. Please try again later.')
    }
  }

  handleMessage(event) {
    const { name, email, total } = event.detail
    const sanitizedTotal = parseFloat(total.toString().replace(/[,.]/g, ''))
    this.customerData = {
      name,
      email,
      total: sanitizedTotal
    }

    const checkoutElement = this.shadowRoot.querySelector('.checkout')
    if (checkoutElement) {
      checkoutElement.classList.add('visible')
    } else {
      console.error('Elemento ".checkout" no encontrado.')
    }
  }

  setupEventListeners() {
    const customerForm = this.shadowRoot.querySelector('#customer-form')
    if (customerForm) {
      customerForm.addEventListener('submit', this.handleCustomerFormSubmit.bind(this))
    }
  }

  async handleCustomerFormSubmit(event) {
    event.preventDefault()

    const { name, email, total } = this.customerData
    if (!name || !email || total <= 0) {
      this.showMessage('Por favor, verifica todos los datos ingresados.')
      return
    }


    try {

      // Fetch clientSecret from your API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: this.customerData.total,
          currency: 'eur',
          customer: { name: this.customerData.name, email: this.customerData.email },
          payment_method: this.paymentMethodId,
          payment_method_types: ['card'], // Corrige el error aquí
          receipt_email: this.customerData.email
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error: ${errorText}`)
        throw new Error(`Error en la API: ${errorText}`)
      }

      const { clientSecret } = await response.json()
      console.log('clientSecret recibido:', clientSecret)

      // Initialize Elements with the clientSecret
      this.elements = this.stripe.elements({ clientSecret })
      const paymentElement = this.elements.create('payment')
      paymentElement.mount('#payment-element-container')

      // Save the clientSecret for payment confirmation
      this.clientSecret = clientSecret
    } catch (error) {
      console.error('Error procesando el formulario:', error)
      this.showMessage('Hubo un problema con el pago. Intenta de nuevo.')
    }
  }

  async handleStripePayment() {
    try {
      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: this.elements,
        clientSecret: this.clientSecret
      })

      if (error) {
        console.error('Error confirmando el pago:', error)
        this.showMessage(error.message)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Aquí desaparece el modal de checkout
        const checkoutElement = this.shadowRoot.querySelector('.checkout')
        if (checkoutElement) {
          checkoutElement.classList.remove('visible')
        }
        // Aquí disparas el evento para mostrar el modal de referencia
        document.dispatchEvent(
          new CustomEvent('showReferenceModal', {
            detail: {
              // Envía detalles del PaymentIntent
            }
          })
        )

        // También puedes agregar un mensaje de éxito si lo deseas
        this.showMessage('Pago exitoso. Redirigiendo...')
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error)
      this.showMessage('Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.')
    }
  }

  showMessage(message) {
    const messageContainer = this.shadowRoot.querySelector('.message-container')
    if (messageContainer) {
      messageContainer.textContent = message
      messageContainer.style.display = 'block'
    }
  }

  async render() {
    this.shadow.innerHTML =
      /* html */`
      <style>
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
  }
}
customElements.define('checkout-component', CheckoutComponent)
