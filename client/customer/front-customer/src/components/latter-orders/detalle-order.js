import { store } from '../../redux/store.js'
import { setOrderDetails, setReference } from '../../redux/crud-slice.js'

class Devolution extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/sales`
    this.data = { rows: [], saleId: null }
  }

  connectedCallback() {
    document.addEventListener('showorderModal', this.handleMessage.bind(this))
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('showorderModal', this.handleMessage.bind(this))
  }

  async handleMessage(event) {
    const state = store.getState()
    const saleId = state.crud.saleId

    if (!saleId) {
      return
    }

    await this.getSaleDetails(saleId)

    if (this.data && this.data.rows && Array.isArray(this.data.rows)) {
      this.render()
      this.shadow.querySelector('.filter-modal').classList.add('visible')
    }
  }

  async getSaleDetails(saleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/sale-details?saleId=${saleId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      this.data = await response.json()
    } catch (error) {
    }
  }

  render() {
    this.shadow.innerHTML =
      /* html */`
      <style>
        * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
        .filter-modal {
          position: fixed;
          top: 50px;
          left: 0;
          width: 100%;
          height: calc(100% - 60px);
          background-color: #1D055B; 
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          visibility: hidden; 
          opacity: 0; 
          transition: opacity 0.3s ease-in-out, visibility 0.3s;
          z-index: 10;
        }
        .filter-modal.visible {
          opacity: 1;
          visibility: visible; 
        }
        .main{
          display:grid;
          align-items: start;
          align-content: space-between;
          width: 100%;
          height: 90%;
        }
        .order-item {
          width: 100%;
          display: grid;
          grid-gap: 15px;
        }
        .order {
          padding: 10px;
        }
        .item-details {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-weight: 600;
        }
        .item-name{
          text-transform: capitalize;
          font-size: 18px;
          margin: 0;
        }        
        .item-name, .item-price {
          font-size: 18px;
          margin: 0;
          color: #fff;
        }
        .item-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          color: #bbb;
        }
        .item-detail span {
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
        }
        .bottom {
          width: 100%;
          padding: 10px;
        }
        .total {
          padding: 1rem 0;
          color: white;
        }
        .item-total{
          display: flex;
          justify-content: space-between;
        }

        .total-title, .total-price {
          font-size: 20px;
          font-weight: 600;
        }
        .total-quantity {
          color: #bbb;
          font-size: 14px;
        }
        .orders {
          text-align: center;
        }
        .orders button {
          text-transform: capitalize;
          background-color: white;
          color: hsl(0, 0%, 0%);
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          max-width: 400px;
          transition: background-color 0.3s ease;
        }
        .orders button:hover {
          background-color: #e0e0e0;
        }
      </style>
      <div class="filter-modal">
        <div class="main">
          <div class="order-item"></div>
          <div class="bottom">
            <div class="total">
              <div class="item-total">
                <p class="total-title">Total</p>
                <p class="total-price"></p>
              </div>
            </div>
            <div class="orders">
              <button class="view-order-button">devolver pedido</button>
            </div>
          </div>
        </div>
      </div>
    `
    this.renderOrderButton()
    this.populateOrderItems()
    this.totalPrice()
  }

  populateOrderItems() {
    const orderItem = this.shadow.querySelector('.order-item')
    const fragment = document.createDocumentFragment()

    this.data.rows.forEach(item => {
      const orderElement = document.createElement('div')
      orderElement.classList.add('order')

      const orderDetails = document.createElement('div')
      orderDetails.classList.add('item-details')

      const title = document.createElement('p')
      title.classList.add('item-name')
      title.textContent = item.productName

      const priceP = document.createElement('p')
      priceP.classList.add('item-price')
      priceP.textContent = `${(parseFloat(item.basePrice) * parseFloat(item.quantity)).toFixed(2)} €`

      orderDetails.appendChild(title)
      orderDetails.appendChild(priceP)

      const itemDetail = document.createElement('div')
      itemDetail.classList.add('item-detail')

      const quantityControl = document.createElement('div')
      quantityControl.classList.add('quantity-control')

      const unities = document.createElement('span')
      unities.classList.add('item-united')
      unities.textContent = `${item.quantity}`
      quantityControl.appendChild(unities)
      itemDetail.appendChild(quantityControl)

      orderElement.appendChild(orderDetails)
      orderElement.appendChild(itemDetail)
      fragment.appendChild(orderElement)
    })

    orderItem.appendChild(fragment)
  }

  async totalPrice() {
    const total = this.data.rows.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity) || 0
      const basePrice = parseFloat(item.basePrice) || 0
      return acc + (basePrice * quantity)
    }, 0).toFixed(2)

    const totalPriceElement = this.shadow.querySelector('.total-price')
    totalPriceElement.textContent = `${total} €`
  }

  renderOrderButton() {
    const button = this.shadow.querySelector('.view-order-button')

    button.addEventListener('click', () => {
      this.handleOrderButtonClick()
    })
  }

  async handleOrderButtonClick() {
    const state = store.getState()
    const saleId = state.crud.saleId
    const reference = state.crud.reference

    if (!saleId) {
      return
    }

    const orderDetails = this.data.rows.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      basePrice: item.basePrice,
      totalPrice: (parseFloat(item.basePrice) * parseFloat(item.quantity)).toFixed(2) + ' €'
    }))

    store.dispatch(setOrderDetails(orderDetails))
    store.dispatch(setReference(reference))

    this.shadow.querySelector('.filter-modal').classList.remove('visible')

    document.dispatchEvent(new CustomEvent('showFilterModal', {
      detail: { saleId, reference }
    }))
    document.dispatchEvent(new CustomEvent('changeHeader', {
      detail: {
        title: `Tu Pedido: ${reference}`,
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>',
        linkHref: 'http://dev-pedidos.com/cliente/pedidos-anteriores'
      }
    }))
    document.body.style.overflow = 'hidden'
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

customElements.define('devolutionorder-component', Devolution)
