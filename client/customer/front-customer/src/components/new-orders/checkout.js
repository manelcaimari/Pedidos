import { loadStripe } from '@stripe/stripe-js'

class Checkout extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = null
    this.stripe = loadStripe('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S')
  }

  async connectedCallback() {
    document.addEventListener('showCheckoutModal', this.handleMessage.bind(this))

    if (this.stripe) {
      this.render()
    } else {
      console.error('Stripe no se cargó correctamente')
    }
  }

  disconnectedCallback() {
    document.removeEventListener('showCheckoutModal', this.handleMessage.bind(this))
  }

  async handleMessage(event) {
    this.data = event.detail
    this.shadow.querySelector('.checkout').classList.add('visible')
    await this.initializePayment()
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
          left: 0;
          width: 100%;
          height: 100%;
          padding: 10px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-content: center;
          visibility: hidden;
          background-color: '#F6F8FA';
          opacity: 0;
          transform: translateX(100%);
          transition: transform 0.5s ease, opacity 0.5s ease;
          z-index: 10;
        }
        .checkout.visible {
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
        }

       

        form {
          width: 30vw;
          min-width: 500px;
          align-self: center;
          box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
          border-radius: 7px;
          padding: 40px;
          margin-top: auto;
          margin-bottom: auto;
        }

        .hidden {
          display: none;
        }

        #payment-message {
          color: rgb(105, 115, 134);
          font-size: 16px;
          line-height: 20px;
          padding-top: 12px;
          text-align: center;
        }
        #payment-element {
          margin-bottom: 24px;
        }
        button {
          background: #0055DE;
          font-family: Arial, sans-serif;
          color: #ffffff;
          border-radius: 4px;
          border: 0;
          padding: 12px 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: block;
          transition: all 0.2s ease;
          box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          width: 100%;
        }
        button:hover {
          filter: contrast(115%);
        }
        button:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .spinner,
        .spinner:before,
        .spinner:after {
          border-radius: 50%;
        }
        .spinner {
          color: #ffffff;
          font-size: 22px;
          text-indent: -99999px;
          margin: 0px auto;
          position: relative;
          width: 20px;
          height: 20px;
          box-shadow: inset 0 0 0 2px;
          -webkit-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
        }
        .spinner:before,
        .spinner:after {
          position: absolute;
          content: "";
        }
        .spinner:before {
          width: 10.4px;
          height: 20.4px;
          background: #0055DE;
          border-radius: 20.4px 0 0 20.4px;
          top: -0.2px;
          left: -0.2px;
          -webkit-transform-origin: 10.4px 10.2px;
          transform-origin: 10.4px 10.2px;
          -webkit-animation: loading 2s infinite ease 1.5s;
          animation: loading 2s infinite ease 1.5s;
        }
        .spinner:after {
          width: 10.4px;
          height: 10.2px;
          background: #0055DE;
          border-radius: 0 10.2px 10.2px 0;
          top: -0.1px;
          left: 10.2px;
          -webkit-transform-origin: 0px 10.2px;
          transform-origin: 0px 10.2px;
          -webkit-animation: loading 2s infinite ease;
          animation: loading 2s infinite ease;
        }
        #dpm-annotation {
          align-self: center;
          color: #353A44;
          width: 30vw;
          min-width: 500px;
          line-height: 20px;
          margin-bottom: 20px;
        }

        #dpm-integration-checker {
          display: inline;
          color: #533AFD;
        }

        #payment-status {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          row-gap: 30px;
          width: 30vw;
          min-width: 500px;
          min-height: 380px;
          align-self: center;
          box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
            0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
          border-radius: 7px;
          padding: 40px;
          opacity: 0;
          animation: fadeInAnimation 1s ease forwards;
        }

        #status-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          width: 40px;
          border-radius: 50%;
        }

        h2 {
          margin: 0;
          color: #30313D;
          text-align: center;
        }

        a {
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          font-family: Arial, sans-serif;
          display: block;
        }
        a:hover {
          filter: contrast(120%);
        }

        #details-table {
          overflow-x: auto;
          width: 100%;
        }

        table {
          width: 100%;
          font-size: 14px;
          border-collapse: collapse;
        }
        table tbody tr:first-child td {
          border-top: 1px solid #E6E6E6; 
          padding-top: 10px;
        }
        table tbody tr:last-child td {
          border-bottom: 1px solid #E6E6E6; 
        }
        td {
          padding-bottom: 10px;
        }

        .TableContent {
          text-align: right;
          color: #6D6E78;
        }

        .TableLabel {
          font-weight: 600;
          color: #30313D;
        }

        #view-details {
          color: #0055DE;
        }

        #retry-button {
          text-align: center;
          background: #0055DE;
          color: #ffffff;
          border-radius: 4px;
          border: 0;
          padding: 12px 16px;
          transition: all 0.2s ease;
          box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          width: 100%;
        }
        @-webkit-keyframes loading {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        @keyframes loading {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        @keyframes fadeInAnimation {
          to {
            opacity: 1;
          }
        }
        @media only screen and (max-width: 600px) {
          form, #dpm-annotation, #payment-status{
            width: 80vw;
            min-width: initial;
          }
        }
        </style>
        <div class="checkout">
          <form id="payment-form">
            <div class="payment-element-container"></div>
            <button id="submit">
              <div class="spinner hidden" id="spinner"></div>
              <span id="button-text">Finalizar compra</span>
            </button>
            <div id="payment-message" class="hidden"></div>
          </form>
        </div>
      `
  }

  async initializePayment() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10000, currency: 'eur' })
      })

      const data = await response.json()
      const clientSecret = data.clientSecret

      if (!clientSecret) {
        console.error('Client secret is missing')
        return
      }

      const appearance = {
        theme: 'flat',
        labels: 'floating',
        variables: {
          fontFamily: '"Gill Sans", sans-serif',
          fontLineHeight: '1.5',
          borderRadius: '4px',
          spacingUnit: '2px'
        }
      }

      const options = {
        clientSecret,
        appearance
      }

      this.elements = await this.stripe.elements(options)

      console.log(this.elements)
      this.paymentElement = await this.elements.create('payment')

      const container = this.shadow.querySelector('.payment-element-container')

      if (container) {
        await this.paymentElement.mount(container)
        console.log('PaymentElement montado correctamente.')
      } else {
        console.error('Contenedor de pago no encontrado!')
      }
    } catch (error) {
      console.error('Error al inicializar el pago:', error)
    }
  }
}
customElements.define('checkout-component', Checkout)
