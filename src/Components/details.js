class details extends HTMLElement {
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
       .orders{
        form{
            .orders {
    display:grid;
    align-content: center;
    width: 100%;

}

.order:not(:last-child) {
    padding:0 0 10px 0;
    border-bottom: 1px solid white; 

}

.order-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight:bold;

}

.order-details p{
    font-weight: 700;
    font-size: 18px;

}

.detail-name .detail-price {
    font-size: 18px;
    margin: 0;

}

.order-quantity {
    display: flex;
    justify-content: space-between;
  
}

.order-quantity span{
    font-weight: 700;
    font-size: 14px;

}

.quantity-control{
    width: 100px;

}

.order button::first-letter{
    text-transform: capitalize;

}

.order button{
    background-color: white;
    color:  hsl(0, 0%, 0%);
    border: none;
    border-radius: 3px;
    padding: 5px 0;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    width: 100%; 
    cursor: pointer;
    font-weight: 600;
    
}
        </style>
  
  <div class="orders">
  <div class="order">
      <div class="order-details">
          <p class="detail-name">00000000002</p>
          <p class="detail-price">180 €</p>
      </div>
      <div class="order-quantity">
          <span>20-05-2024 11:13</span>
          <div class="quantity-control">
              <a href="#"><button>ver pedido</button></a>
          </div>
      </div>
  </div>
  <div class="order">
      <div class="order-details">
          <p class="detail-name">00000000003</p>
          <p class="detail-price">270 €</p>
      </div>
      <div class="order-quantity">
          <span>13-05-2024 17:09</span>
          <div class="quantity-control">
          <a href="#"><button>ver pedido</button></a>
          </div>
      </div>
  </div>
  <div class="order">
      <div class="order-details">
          <p class="detail-name">00000000002</p>
          <p class="detail-price">270 €</p>
      </div>
      <div class="order-quantity">
          <span>13-05-2024 17:09</span>
          <div class="quantity-control">
              <a href="#"><button>ver pedido</button></a>
          </div>
      </div>
  </div>
</div>
        `
      }
  }
  
  customElements.define('details-component', details)