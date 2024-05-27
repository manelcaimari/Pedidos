class button extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      
      this.data = {
       
      }
  
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
        <style>
    .button-order{
    text-align: center;
    border: none;
    gap: 20px; 
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;

}

.orders{
    width: 75%;
    display: grid;
    align-items: center ;

}

.orders button::first-letter{
    text-transform: capitalize;
}

.orders button{
    background-color: white;
    color:  hsl(0, 0%, 0%);
    border: none;
    border-radius: 13px;
    padding: 8px 0;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    width: 100%; 
    cursor: pointer;
    font-weight: 600;
    
}

        </style>
  
  <div class="button-order">
  <div class="orders">
      <a href="#"><button>ver pedido</button></a>
  </div>
</div> 
        `
      }
  }
  
  customElements.define('button-component', button)