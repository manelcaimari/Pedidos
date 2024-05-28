class orders extends HTMLElement {
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
        .order-title h2::first-letter{
            text-transform: capitalize;
        }
        .order-title h2{
            font-size:1.4rem ;
            font-weight: 900;
            text-align:center;
            align-content:center;
        }
        .order-text ::first-letter{
            text-transform: capitalize;

        }
        .order-text{
            text-align:center;
            font-size:16px;
        
        }
        .go-home{
            text-align: center;
        }
        .go-home button::first-letter{
            text-transform: capitalize;
        }
        .go-home button{
            background-color: white;
            color:  hsl(240, 33%, 1%);
            border: none;
            border-radius: 13px;
            padding: 7px 0;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            width: 70%; 
            cursor: pointer;
            font-weight: 700;
        }
        </style>
        <div class="order-title">
            <h2>pedido realizado con èxito.</h2>
        </div>
        <div class="order-text">
            <p>en breve recibirá un correo con los detalles. La rederencia de su pedido es 00000000002</p>
        </div>
        <div class="go-home">
            <a href="#"><button>volver a inicio</button></a>
        </div>
     
        `
      }
  }
  
  customElements.define('orders-component', orders)