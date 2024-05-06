class Title extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      
      this.data = {
        title: "Bienvenido"
      }
  
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
        `
        <style>
            h2 {   
              color: hsl(0, 0%, 0%);
              font-family: 'Roboto', sans-serif;
              font-size: 2em;
              font-weight: 600;
              margin: 0;
              text-decoration: none;
              text-align:center;
            }
        </style>
  
        <h2>${this.data.title}</h2>
        `
      }
  }
  
  customElements.define('title-component', Title)