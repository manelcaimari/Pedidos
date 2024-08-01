class Error extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
          <style>
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              height: 100vh;
              background-color: #ffffff;
              box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
              justify-content: center;
            }
            .error-box {
              max-width: 400px;
              display:grid;
              gap:1rem;
            }
            .error-code {
              font-size: 10rem;
              font-weight: bold;
              color: #007bff;
              text-shadow: 2px 2px 5px rgba(0, 123, 255, 0.3);
            }
            .error-message {
              font-size: 2rem;
              margin-bottom: 20px;
            }

            .error-description {
              font-size: 1rem;
              margin-bottom: 30px;
              color: #6c757d;
            }
            .btn-home {
              display: inline-block;
              padding: 12px 24px;
              font-size: 1rem;
              color: #fff;
              background-color: #007bff;
              border-radius: 5px;
              text-decoration: none;
              transition: background-color 0.3s ease;
            }
            .btn-home:hover {
              background-color: #0056b3;
            }
          </style>
          <div class="container">
        <div class="error-box">
            <div class="error-code">404</div>
            <div class="error-message">Página no encontrada</div>
            <div class="error-description">Lo sentimos, pero la página que buscas no existe o ha sido movida.</div>
            <a href="" class="btn-home">Volver al inicio</a>
        </div>
    </div>
          `
  }
}
customElements.define('error-component', Error)
