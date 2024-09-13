class messenger extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    document.addEventListener('message', this.handleMessage.bind(this))
    this.render()
  }

  handleMessage (event) {
    const messenger = this.shadow.querySelector('.messenger')
    messenger.classList.add('visible')

    const messengercontent = this.shadow.querySelector('.messenger-content')
    messengercontent.classList.add(event.detail.type)

    this.shadow.querySelector('.messenger-content p').textContent = event.detail.message

    setTimeout(() => {
      messenger.classList.remove('visible')
      this.remove()
    }, 3000)
  }

  render () {
    this.shadow.innerHTML = /* html */ `
      <style>
        .messenger {
          position: fixed;
          width: 100%;
          display: flex;
          align-items: flex-end; 
          justify-content: flex-end; 
          height: 100vh;
          opacity: 0;
          visibility: hidden;
        }
        .messenger.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .messenger-content {
          background-color: #fefefe;
          padding: 20px;
          border: 1px solid #888;
          width: 300px;
          text-align: center;
          position: relative;
        }
        .messenger-content p {
          color: black;
        }
      </style>
      <div class="messenger">
        <div class="messenger-content">
          <p></p>
        </div>
      </div>
    `
  }
}

customElements.define('messenger-component', messenger)
