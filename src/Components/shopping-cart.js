class shoppingcart extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      
      this.data = {
        title: ""
      }
  
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
         <style>

.order-item {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    min-height: 70vh;
    max-height: 70vh;

}

.item-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight:bold;

}

.item-name {
    font-size: 17px;
    margin: 0;

}

.item-price {
    font-size: 18px;
    margin: 0;

}

.item-quantity {
    display: flex;
    justify-content: space-between;
    align-items: center;

}
.item-quantity span{
    font-weight:700;
    font-size: 14px;

}


.quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;

}


.quantity-control  {
    border: none;
    cursor: pointer;
    font-size: 14px;

}


.quantity-control input {
    width: 40px;
    color: white;
    text-align: center;
    margin: 0 ;
    background-color: hsla(214, 87%, 56%, 0.966);

}

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
            <div class="order-item">
                <div class="item-details">
                    <p class="item-name">Cocacola</p>
                    <p class="item-price">180.00 €</p>
                </div>
                <div class="item-quantity">
                    <span>16u, 330ml</span>
                    <div class="quantity-control">
                        <p>2 x 90.00€</p>
                    </div>
                </div>
            </div>   
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
  
  customElements.define('shoppingcart-component', shoppingcart)