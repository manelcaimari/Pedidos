class orders extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    document.addEventListener('showrenferentModal', this.handleMessage.bind(this))
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('showrenferentModal', this.handleMessage.bind(this))
  }

  handleMessage(event) {
    this.render()
    this.shadow.querySelector('.reference').classList.add('visible')
  }

  render() {
    this.shadow.innerHTML =
      /* html */`
        <style>
        * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
        .reference {
          position: fixed;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #1D055B;
          padding: 10px;
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
          transition: transform 0.5s ease, opacity 0.5s ease;
          z-index: 10;
        }
      
        .main{
          display:grid;
          align-content: center;
          height: 80vh;
          padding: 0 13px;
          gap: 2rem;
        }
        .order-title h2::first-letter{
          text-transform: capitalize;
        }
        .order-title h2{
          font-size:1.4rem ;
          font-weight: 900;
          text-align:center;
          align-content:center;
        }
        .order-text ::first-letter{
          text-transform: capitalize;
        }
        .order-text{
          text-align:center;
          font-size:16px;
        }
        .go-home{
          text-align: center;
        }
        .go-home button::first-letter{
          text-transform: capitalize;
        }
        .go-home button{
          background-color: white;
          color:  hsl(240, 33%, 1%);
          border: none;
          border-radius: 13px;
          padding: 7px 0;
          text-align: center;
          text-decoration: none;
          font-size: 16px;
          width: 70%;
          cursor: pointer;
          font-weight: 700;
        }
        </style>
        <div class="reference visible ">
          <div class='main'>
            <div class="order-title">
              <h2>pedido realizado con èxito.</h2>
            </div>
            <div class="order-text">
              <p>en breve recibirá un correo con los detalles.</p>
            </div>
            <div class="go-home">
              <a href="/cliente"><button>volver a inicio</button></a>
            </div>
          </div>
        </div>
      `
  }
}

customElements.define('orders-component', orders)
