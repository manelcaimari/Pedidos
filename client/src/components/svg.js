class svg extends HTMLElement {
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
            
        .svg {
              height: 1.8rem;
              fill: hsl(0, 0%, 100%);
              width: 2rem;
              justify-content:center;
          }
          button{
            height: 100%; 
            width: 100%;
            background-color:transparent;
            border:0;
            padding:0;
            align-items: center;
            justify-content: center;

          }
          a{
            display: block;
            height: 100%; 
            width: 100%;
       
             
          }
          svg{
            height: 1.8rem;
            fill: hsl(0, 0%, 100%);
            width: 2rem;
          }
        </style>
          <div class="svg">
              <button> <a href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><title>apps</title><path d="M7 7H3V3H7M13 7H9V3H13M19 7H15V3H19M7 13H3V9H7M13 13H9V9H13M19 13H15V9H19M7 19H3V15H7M13 19H9V15H13M19 19H15V15H19Z" /></svg></a></button>
          </div>
          `
      }
    }
    
    customElements.define('svg-component', svg)