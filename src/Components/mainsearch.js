class mainsearch extends HTMLElement {
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
            display: grid;
            gap: 0.2rem;
            padding:0.3rem 0.5rem;
    
        }
   
    </style>
        <main>
            <slot></slot>
        </main>
        `
      }
  }
  
  customElements.define('mainsearch-component', mainsearch)