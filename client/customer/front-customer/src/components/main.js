class Main extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.position = this.getAttribute('position')
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
        main.center {
          display:grid;
          justify-content: center;
          align-items: center;
        }
        main.mid{
          display:grid;
          align-items: center;
          height: 80vh;
          padding: 0 13px;
    
        }
        main.search{
          display: grid;
          gap: 0.2rem;
          padding:0.3rem 0.5rem;
        }
   
    </style>
      <main class="${this.position}">
        <slot></slot>
      </main>
    `
  }
}

customElements.define('main-component', Main)
