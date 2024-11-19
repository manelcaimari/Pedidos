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
    this.stripe = await loadStripe('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S')

    if (!this.stripe) {
      throw new Error('Stripe failed to initialize.')
    }

    this.elements = this.stripe.elements()
    this.cardElement = this.elements.create('card')

    const paymentElementContainer = this.shadowRoot.querySelector('#payment-element-container')
    if (paymentElementContainer) {
      this.cardElement.mount(paymentElementContainer) // Asegúrate de que se monta correctamente
    } else {
      console.error('No se encontró el contenedor para el CardElement.')
    }
    const initiateButton = this.shadowRoot.querySelector('#initiate-payment')
    const form = this.shadowRoot.querySelector('#customer-form')

    if (initiateButton) initiateButton.classList.add('hidden') // Oculta el botón
    if (form) form.classList.remove('hidden') // Muestra el formulario
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

  async createPaymentMethod() {
    if (!this.cardElement) {
      console.error('El CardElement no está inicializado correctamente.')
      return null
    }

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        name: this.customerData.name,
        email: this.customerData.email
      }
    })

    if (error) {
      console.error('Error creando el método de pago:', error)
      this.showMessage(`Error: ${error.message}`)
      return null
    }

    return paymentMethod
  }

  setupEventListeners() {
    const initiatePaymentButton = this.shadowRoot.querySelector('#initiate-payment')
    if (initiatePaymentButton) {
      initiatePaymentButton.addEventListener('click', (event) => {
        this.initiatePayment(event)
        initiatePaymentButton.style.display = 'none' // Hace que el botón desaparezca
        const form = this.shadowRoot.querySelector('#customer-form')
        if (form) form.classList.remove('hidden') // Asegura que el formulario sea visible
      })
    }

    const customerForm = this.shadowRoot.querySelector('#customer-form')
    if (customerForm) {
      customerForm.addEventListener('submit', this.handleCustomerFormSubmit.bind(this)) // Asegúrate de que este método esté definido
    }
  }

  handleCustomerFormSubmit(event) {
    event.preventDefault() // Evitar el comportamiento predeterminado del formulario
    this.initiatePayment() // Llamar a la función que maneja el proceso de pago
  }

  async initiatePayment() {
    const { name, email, total } = this.customerData

    if (!name || !email || total <= 0) {
      this.showMessage('Por favor, ingresa tus datos antes de continuar.')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments/create-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: { email, name, receipt_email: email } })
      })

      const { customerId } = await response.json()

      if (!customerId) {
        this.showMessage('Error creando el cliente. Intenta de nuevo.')
        return
      }

      const paymentMethod = await this.createPaymentMethod()
      if (!paymentMethod) {
        this.showMessage('No se pudo crear el método de pago. Intenta nuevamente.')
        return
      }

      const paymentResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total * 100,
          currency: 'eur',
          customerId,
          payment_method: paymentMethod.id,
          receipt_email: email
        })
      })

      const { clientSecret } = await paymentResponse.json()

      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      })

      if (error) {
        console.error('Error de pago:', error)
        this.showMessage(`Error: ${error.message}`)
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Pago completado:', paymentIntent)
        this.showMessage('Pago completado con éxito!')
      } else {
        console.error('Error desconocido en el estado del PaymentIntent')
      }
    } catch (error) {
      console.error('Error en el proceso de pago:', error)
      this.showMessage('Error al procesar el pago. Intenta nuevamente.')
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
      <button id="initiate-payment">Iniciar Pago</button>
      <form id="customer-form" class="hidden">
          <h2>Datos de Pago</h2>
          <div id="payment-element-container"></div>
          <button type="submit">Submit</button>
        </form>
      </div>
    `
  }
}
customElements.define('checkout-component', CheckoutComponent)
