class header extends HTMLElement {
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
        header {
            width: 100%;
            max-width:100% ;
            background-color: #000000;
            padding:0.3rem 0.5rem;
            box-sizing: border-box;
            align-items: center;
            display: flex;
            justify-content: space-between;
        }
   
    </style>
        <header>
            <slot></slot>
        </header>
        `
      }
  }
  
  customElements.define('header-component', header)