import { store } from '../redux/store.js'

class Shoppingcart extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.cartItems = []
  }

  connectedCallback () {
    document.addEventListener('showFilterModal', this.handleMessage.bind(this))
    this.unsubscribe = store.subscribe(() => {
      console.log('Estado actualizado:', store.getState().crud.cart)
      this.cartItems = store.getState().crud.cart
      this.render()
    })

    this.render()
  }

  disconnectedCallback () {
    document.removeEventListener('showFilterModal', this.handleMessage.bind(this))

    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  handleMessage (event) {
    this.shadow.querySelector('.filter-modal').classList.add('visible')
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
      .filter-modal {
        position: fixed; 
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #1D055B;
        visibility: hidden; 
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center; 
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .filter-modal.visible {
        opacity: 1;
        visibility: visible;
      }
      .order-item {
        padding: 1rem;
        display: flex;

        min-height: 55vh;
        max-height: 80vh;
        font-size: 16px;
        
      
      }
      .item{
        padding: 10px 0;
        border-bottom: 1px solid white;  
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
      .total-title::first-letter{
        text-transform: capitalize;
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
    <div class="filter-modal">
      <div class="order-item"></div>
      <div class="bottom">
        <div class="total">
          <div class="item-total">
            <p class="total-title">Total</p>
            <p class="total-price">€${this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
          </div>
          <div class="total-quantity">
            <p>Impuesto no incluidos</p>
          </div>
        </div>
        <div class="orders">
          <button>Finalizar pedido</button>
        </div>
      </div>
      </div>
    `

    const orderItem = this.shadow.querySelector('.order-item')

    this.cartItems.forEach(item => {
      const itemContainer = document.createElement('div')
      itemContainer.classList.add('item')

      const itemDetails = document.createElement('div')
      itemDetails.classList.add('item-details')

      const title = document.createElement('p')
      title.classList.add('item-name')
      title.textContent = item.name || 'Producto'

      const price = document.createElement('p')
      price.classList.add('item-price')
      price.textContent = `${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)} €`

      const additionalDetails = document.createElement('p')
      additionalDetails.classList.add('item-details')
      additionalDetails.textContent = `${item.quantity}u, ${item.size || '---'}ml`

      itemDetails.appendChild(title)
      itemDetails.appendChild(price)
      itemContainer.appendChild(itemDetails)
      itemContainer.appendChild(additionalDetails)
      orderItem.appendChild(itemContainer)
    })
    const finishOrderBtn = this.shadow.querySelector('.orders button')
    finishOrderBtn.addEventListener('click', () => {
      console.log('Pedido finalizado')
    })
  }
}

customElements.define('shop-component', Shoppingcart)
