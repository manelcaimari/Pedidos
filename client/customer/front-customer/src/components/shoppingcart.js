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
        *{
          box-sizing: border-box;

        }

        .filter-modal {
          position: fixed;
          top: 60px;
          left: 0;
          width: 100%;
          height: calc(100% - 60px);
          background-color: #0b0b4e; 
          visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
          padding: 20px; 
        }

        .filter-modal.visible {
          opacity: 1;
          visibility: visible;
        }

        .order-item {
          width: 100%;
          min-height: 55vh;
          max-height: 80vh;
          display: grid;
          gap: 10px; 
        }

        .order {
          
          justify-content: space-between;
          align-items: center;
  
          padding: 10px 0;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .item-name {
          font-size: 18px;
          margin: 0;
          color: white; 
        }

        .item-price {
          font-size: 18px;
          margin: 0;
          color: white;
        }

        .item-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .item-detail span {
          font-weight: 700;
          color: white;
        }

        .quantity-control input {
          width: 40px;
          color: white;
          text-align: center;
          margin: 0;
          background-color: hsla(214, 87%, 56%, 0.966);
        }

        .bottom {
          border: none;
          width: 100%;
          padding-top: 20px;
          
        }

        .total {
         
          justify-content: space-between;
          padding: 1rem 0;
          color: white;
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
          color: white;
        }

        .total-price {
          font-size: 20px;
          margin: 0;
          font-weight: 600;
          color: white;
        }

        .total-quantity {
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .orders {
          text-align: center;
        }

        .orders button {
          background-color: white;
          color: hsl(0, 0%, 0%);
          border: none;
          border-radius: 13px;
          padding: 8px 0;
          width: 100%; 
          max-width: 400px; 
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


    const fragment = document.createDocumentFragment()


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
      additionalDetails.textContent = `${item.units || 0}u, ${item.measurement || ''} ${item.measurementUnit || ''}`

      itemDetails.appendChild(title)
      itemDetails.appendChild(price)
      itemContainer.appendChild(itemDetails)
      itemContainer.appendChild(additionalDetails)
      fragment.appendChild(itemContainer)
    })

    orderItem.appendChild(fragment)

    const finishOrderBtn = this.shadow.querySelector('.orders button')
    finishOrderBtn.addEventListener('click', () => {
      console.log('Pedido finalizado')
    })
  }
}
customElements.define('shop-component', Shoppingcart)
