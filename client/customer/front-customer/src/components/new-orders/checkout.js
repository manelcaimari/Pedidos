import { loadStripe } from '@stripe/stripe-js'

class CheckoutComponent extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback() {
    await this.render()
    document.addEventListener('showCheckoutModal', this.handleMessage.bind(this))
  }

  async handleMessage(event) {
    console.log('Evento recibido: showCheckoutModal')
    console.log('Detalles del evento:', event.detail)

    if (!this.stripe) {
      console.log('Inicializando Stripe...')
      await this.initStripe()
    }

    const checkout = this.shadowRoot.querySelector('.checkout')
    if (checkout) {
      checkout.classList.add('visible')
      console.log('Formulario de pago mostrado')
    } else {
      console.error('Elemento .checkout no encontrado')
    }

    // Si necesitas usar los datos, como el monto, puedes hacer algo como esto:
    if (event.detail && event.detail.amount) {
      console.log(`Monto recibido: $${event.detail.amount / 100}`)
    }
  }

  render() {
    this.shadow.innerHTML =
      /* html */`
      <style>
        * {
          box-sizing: border-box;
        }

        .checkout {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          visibility: hidden;
          opacity: 0;
          transform: translateX(100%);
          transition: transform 0.5s ease, opacity 0.5s ease;
          z-index: 10;
        }

        .checkout.visible {
          visibility: visible;
          opacity: 1;
          transform: translateX(0);
        }

        form {
          background-color: white;
          padding: 40px;
          box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
        }

        h2 {
          text-align: center;
          color: #30313D;
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #30313D;
          font-weight: 600;
        }

        input,
        button {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 5px;
          font-size: 16px;
        }

        button {
          background: #0055DE;
          color: white;
          border: none;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        button:hover {
          background: #004BB5;
        }

        #card-element {
          height: 40px;
          border: 1px solid #ccc;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          justify-content: space-between;
          gap: 16px; 
        }

        .form-group input {
          width: 100%;
        }


        #error-message,
        #success-message {
          font-size: 14px;
          text-align: center;
          padding-top: 12px;
        }

        .error-message {
          color: red;
        }

        .success-message {
          color: green;
        }

        /* Responsividad para dispositivos pequeños */
        @media (max-width: 600px) {
          .form-group {
            flex-direction: column;
          }

          .form-group input {
            width: 100%; /* En pantallas pequeñas, los campos ocupan el 100% del ancho */
          }
        }
      </style>
        <div class="checkout">
          <form id="payment-form">
          <label for="card-element">Tarjeta de Crédito</label>
          <div id="card-element"></div>
            <div class="form-group">
              <div>
                <label for="name">Nombre Completo</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div>
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required />
              </div>
            </div>
            <div class="form-group">
              <div>
                <label for="address">Dirección</label>
                <input type="text" id="address" name="address" required />
              </div>
              <div>
                <label for="city">Ciudad</label>
                <input type="text" id="city" name="city" required />
              </div>
            </div>
            <div class="form-group">
              <div>
                <label for="postal_code">Código Postal</label>
                <input type="text" id="postal_code" name="postal_code" required />
              </div>
              <div>
                <label for="country">País</label>
                <input type="text" id="country" name="country" required />
              </div>
            </div>
            <button type="submit">Pago</button>
            <div id="card-errors" class="error-message"></div>
            <div id="success-message" class="success-message"></div>
          </form>
        </div>
    `
  }

  async initStripe() {
    try {
      console.log('Cargando Stripe...')
      this.stripe = await loadStripe('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S')
      if (!this.stripe) {
        console.error('Error al cargar Stripe')
        return
      }

      this.elements = this.stripe.elements()
      const style = {
        base: {
          iconColor: '#4CAF50',
          color: '#333',
          fontWeight: '500',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': { color: '#fce883' },
          '::placeholder': { color: '#888888' },
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '12px'
        },
        invalid: {
          iconColor: '#FF3B30',
          color: '#FF3B30',
          borderColor: '#FF3B30'
        },
        focus: {
          borderColor: '#0055DE',
          backgroundColor: '#F1F9FF'
        }
      }

      const cardContainer = this.shadowRoot.querySelector('#card-element')
      if (cardContainer) {
        this.card = this.elements.create('card', { style })
        this.card.mount(cardContainer)
      }

      this.shadowRoot.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault()
        const { clientSecret } = await this.createPaymentIntent()
        this.processPayment(clientSecret)
      })
    } catch (error) {
      console.error('Error al cargar Stripe:', error)
    }
  }

  async processPayment(clientSecret) {
    console.log('Procesando pago con clientSecret:', clientSecret)
    const button = this.shadowRoot.querySelector('button')
    button.disabled = true
    button.textContent = 'Procesando...'

    const spinner = document.createElement('div')
    spinner.classList.add('spinner')
    this.shadowRoot.querySelector('form').appendChild(spinner)

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: this.card }
      })

      this.shadowRoot.querySelector('form').removeChild(spinner)
      button.disabled = false
      button.textContent = 'Pagar $50.00'

      if (error) {
        console.log('Error en confirmación de pago:', error)
        this.shadowRoot.querySelector('#card-errors').textContent = error.message
      } else if (paymentIntent.status === 'succeeded') {
        this.shadowRoot.querySelector('#success-message').textContent = 'Pago realizado con éxito'
        this.shadowRoot.querySelector('#card-errors').textContent = ''
      }
    } catch (error) {
      console.error('Error al procesar pago:', error)
      this.shadowRoot.querySelector('#card-errors').textContent = 'Ocurrió un error en el pago'
    }
  }

  async createPaymentIntent() {
    // Simulación de la creación del PaymentIntent
    const response = await fetch('/create-payment-intent', { method: 'POST' })
    return response.json()
  }
}

customElements.define('checkout-component', CheckoutComponent)
