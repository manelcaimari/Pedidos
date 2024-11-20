import { loadStripe } from '@stripe/stripe-js'

class CheckoutComponent extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.stripe = null
    this.elements = null
    this.cardElement = null
    this.customerData = {}
    this.customerForm = null
    this.paymentElementContainer = null
  }

  async connectedCallback() {
    document.addEventListener('showCheckoutModal', this.handleMessage.bind(this))
    try {
      await this.render()
      console.log('Rendered checkout component')

      // Store references to the elements to avoid repeated DOM queries
      this.customerForm = this.shadowRoot.querySelector('#customer-form')
      this.paymentElementContainer = this.shadowRoot.querySelector('#payment-element-container')

      if (!this.customerForm || !this.paymentElementContainer) {
        throw new Error('Essential form elements are missing.')
      }

      this.setupEventListeners()
      await this.initializeStripe()
      console.log('Stripe initialized')
    } catch (error) {
      console.error('Error in connectedCallback:', error)
      this.showMessage('Error initializing checkout. Please try again later.')
    }
  }

  handleMessage(event) {
    const { name, email, total } = event.detail
    let sanitizedTotal = total.toString().replace(/[,.]/g, '')

    // Simplify the sanitization logic for the total
    if (sanitizedTotal.endsWith('00')) {
      sanitizedTotal = sanitizedTotal.slice(0, -2)
    }

    const finalTotal = parseFloat(sanitizedTotal)
    this.customerData = {
      name,
      email,
      total: finalTotal * 100 // Convert amount to cents for Stripe
    }

    console.log('Customer data and total:', this.customerData)
    const checkoutElement = this.shadowRoot.querySelector('.checkout')
    if (checkoutElement) {
      checkoutElement.classList.add('visible')
    } else {
      console.error('Checkout element not found.')
    }
  }

  setupEventListeners() {
    if (this.customerForm) {
      this.customerForm.addEventListener('submit', this.handleCustomerFormSubmit.bind(this))
    }
  }

  async initializeStripe() {
    try {
      if (this.stripe) {
        return // Avoid reinitializing if Stripe is already initialized
      }

      // Initialize Stripe
      this.stripe = await loadStripe('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S')

      if (!this.stripe) {
        throw new Error('Stripe failed to load')
      }

      // Initialize elements
      this.elements = this.stripe.elements()
      this.cardElement = this.elements.create('card')

      // Mount the card element
      this.cardElement.mount(this.paymentElementContainer)
      this.cardElement.on('ready', () => {
        console.log('Card element is ready for use')
      })
    } catch (error) {
      console.error('Error initializing Stripe:', error)
      this.showMessage('There was an issue initializing Stripe. Please try again later.')
    }
  }

  async createPaymentIntent(total, customerData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'eur',
          customer: customerData
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${await response.text()}`)
      }

      const { clientSecret } = await response.json()
      if (!clientSecret) {
        throw new Error('No client secret received from API')
      }

      await this.handleStripePayment(clientSecret)
    } catch (error) {
      console.error('Error processing payment intent:', error)
      this.showMessage('There was an issue processing your payment. Please try again.')
    }
  }

  async handleCustomerFormSubmit(event) {
    event.preventDefault()

    const { name, email, total } = this.customerData

    if (!name || !email || !total || total <= 0) {
      this.showMessage('Please check your input data.')
      return
    }

    try {
      // Create payment method (ID)
      await this.createPaymentIntent(total, { name, email })
    } catch (error) {
      console.error('Error processing form submission:', error)
      this.showMessage('There was an issue processing your payment.')
    }
  }

  async handleStripePayment(clientSecret) {
    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: this.cardElement
      })

      if (error) {
        throw new Error(`Error confirming payment: ${error.message}`)
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment successful')
        this.showMessage('Payment successful')
      } else {
        console.log('Payment failed:', paymentIntent.status)
        this.showMessage('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      this.showMessage('There was an issue processing your payment. Please try again later.')
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
    this.shadow.innerHTML = /* html */`
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
     
    `
  }
}
customElements.define('checkout-component', CheckoutComponent)
