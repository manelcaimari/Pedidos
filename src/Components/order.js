class order extends HTMLElement {
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
                padding:1.5rem 1rem;
                display: flex;
                flex-direction: column;
                gap:1rem;
                min-height: 80vh;
                max-height: 80vh;
                font-weight: 600;

            }

            .item-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;

            }

            .item-name {
                font-size: 18px;
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
                font-weight: 700;

            }

            .quantity-control {
                display: flex;
                align-items: center;
                justify-content: center;

            }

            .quantity-control  {
                align-items: center;
                border: none;
                cursor: pointer;
                display: flex;
                font-size: 18px;
                height: 1.5rem;
            }

            .quantity-control span {
                box-sizing: border-box;
                width: 40px;
                color: white;
                text-align: center;
                margin: 0 ;
                background-color: hsla(213, 43%, 55%, 0.76);
                border:none;
                height: 100%;
                padding: 0.1rem;
            }

            .quantity-control button{
                width: 2rem;
                height: 100%;
                border:0;
                padding:0;
            }
        </style>
  
        <div class="order-item">
            <div class="item-details">
                <p class="item-name">Cocacola</p>
                <p class="item-price">90.00 €</p>
            </div>
            <div class="item-quantity">
                <span>16u, 330ml</span>
                <div class="quantity-control">
                    <button>-</button>
                    <span>1</span>
                    <button >+</button>
                </div>
            </div>
        </div>  
        `
      }
  }
  
  customElements.define('order-component', order)