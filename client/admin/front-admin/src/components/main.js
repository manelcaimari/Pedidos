class Main extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        main{
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr 2fr;
          padding: 1rem;
        }
      </style>
      <main>
        <slot></slot>
      </main>
      `
  }
}

customElements.define('main-component', Main)
