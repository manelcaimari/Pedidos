class maincenter extends HTMLElement {
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
            justify-content: center;
            align-items: center;
    
        }
   
    </style>
        <main>
            <slot></slot>
            </main>
        `
      }
  }
  
  customElements.define('maincenter-component', maincenter)