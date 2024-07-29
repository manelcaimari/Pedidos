class mainmid extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
        /*html*/`
        <style>
          main {
            display:grid;
            align-items: center;
            height: 80vh;
            padding: 0 13px;
          }
        </style>
        <main>
          <slot></slot>
        </main>
        `
      }
  }
  
  customElements.define('main-component', Main)