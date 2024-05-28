class bottom extends HTMLElement {
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
    .bottom{
        border: none;
        gap: 20px; 
        width: 100%;
    }
    .total {
        padding: 0.5rem 1rem;

    }
    .item-total {
        display: flex;
        justify-content: space-between;
        align-items: center;

    }
    .total-title {
        font-size: 20px;
        margin: 0;
        font-weight: 600;

    }
    .total-price {
        font-size: 18px;
        margin: 0;
        font-weight: 600;
    }
    .total-quantity  ::first-letter{
        text-transform: capitalize;
    }
    .total-quantity {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
    }
    .orders{
        margin-top: 5px;
        text-align: center;
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
        width: 70%; 
        cursor: pointer;
        font-weight: 600;
    }
    </style>
    <div class="bottom">
        <div class="total">
            <div class="item-total">
                <p class="total-title">Cocacola</p>
                <p class="total-price">180.00 €</p>
            </div>
            <div class="total-quantity">
                <p>impuesto no incluidos</p>
            </div>
        </div>
        <div class="orders">
            <a href="#"><button>finalizar pedido</button></a>
        </div>
    </div>
        `
      }
  }
  
  customElements.define('bottom-component', bottom)