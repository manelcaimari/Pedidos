class item extends HTMLElement {
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
        `
      }
  }
  
  customElements.define('item-component', item)