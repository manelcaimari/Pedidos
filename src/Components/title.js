class Title extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      
      this.data = {
        title: "Pedidos"
      }
  
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
        <style>
        h1{
          font-size:1.5rem ;
          text-transform: capitalize;
          text-align:center;
        }
        </style>
  
        <h1>${this.data.title}</h1>
        `
      }
  }
  
  customElements.define('title-component', Title)