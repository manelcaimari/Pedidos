class title extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
      this.title = this.getAttribute('title')
    }

    
    connectedCallback () {
        this.data = {
            title:"title"
           }
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
        <style>
        h2::first-letter{
            text-transform: capitalize;
        }
        h2{
            font-size: 1rem;
            font-weight:bold;
        }
        </style>
  
        <div class="title">
          <h2>${this.title}</h2>
        </div>
        `
      }
  }
  
  customElements.define('title-component', title)