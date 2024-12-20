import { store } from '../../redux/store.js'
import { setOrderDetails } from '../../redux/crud-slice.js'

class Devolution extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/sales`
    this.data = { rows: [], saleId: null }
    this.saleId = null
  }

  async connectedCallback() {
    document.addEventListener('showorderModal', this.handleMessage.bind(this))
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState()
      const newSaleId = state.crud.saleId

      if (newSaleId !== this.saleId) {
        this.saleId = newSaleId
        if (this.saleId) {
          this.getSaleDetails(this.saleId).then(() => {
          })
          this.getReturns(this.saleId)
        }
      }
    })
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('showorderModal', this.handleMessage.bind(this))
  }

  handleMessage(event) {
    this.shadow.querySelector('.filter-modal').classList.add('visible')
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
          transform: translateX(100%);
          transition: transform 0.5s ease, opacity 0.5s ease;
          z-index: 10;
        }
        .filter-modal.visible {
          opacity: 1;
          transform: translateX(0);
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
    this.populateOrderItems(this.data.rows)
    this.totalPrice()
  }

  async getSaleDetails(saleId, returnId) {
    try {
      if (returnId) {
        await this.getReturnDetails(returnId)
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/sale-details?saleId=${saleId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      this.data = await response.json()
      this.populateOrderItems(this.data.rows)
      this.totalPrice()
    } catch (error) {
      console.error('Error fetching sale details:', error)
    }
  }

  async getReturns(saleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/returns?saleId=${saleId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.rows && data.rows.length > 0) {
        const returnIds = data.rows.map(row => row.id)
        const returnDetailsPromises = returnIds.map(returnId => this.getReturnDetails(returnId))
        await Promise.all(returnDetailsPromises)
        return { returnIds }
      }
      return { returnIds: null }
    } catch (error) {
      console.error('Error fetching returns:', error)
      return { returnIds: null }
    }
  }

  async getReturnDetails(returnId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/return-details?returnId=${returnId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.rows && data.rows.length > 0) {
        const groupedItems = {}
        data.rows.forEach(returnedItem => {
          const { productId, quantity } = returnedItem
          if (groupedItems[productId]) {
            groupedItems[productId] += quantity
          } else {
            groupedItems[productId] = quantity
          }
        })
        Object.entries(groupedItems).forEach(([productId, totalQuantity]) => {
          const itemInSale = this.data.rows.find(item => String(item.productId) === String(productId))
          if (itemInSale) {
            itemInSale.returnedQuantity = itemInSale.returnedQuantity
              ? itemInSale.returnedQuantity + totalQuantity
              : totalQuantity
          }
        })
        this.populateOrderItems(this.data.rows)
      }
    } catch (error) {
      console.error('Error al obtener los detalles de la devolución:', error)
    }
  }

  populateOrderItems(items) {
    const orderItem = this.shadow.querySelector('.order-item')
    if (!orderItem) {
      console.warn('El elemento .order-item no está disponible en el DOM')
      return
    }
    orderItem.innerHTML = ''
    const fragment = document.createDocumentFragment()
    items.forEach(item => {
      const orderElement = document.createElement('div')
      orderElement.classList.add('order')
      const orderDetails = document.createElement('div')
      orderDetails.classList.add('item-details')
      const title = document.createElement('p')
      title.classList.add('item-name')
      title.textContent = item.productName
      const priceP = document.createElement('p')
      priceP.classList.add('item-price')
      if (parseFloat(item.returnedQuantity) > 0) {
        const adjustedQuantity = parseFloat(item.quantity) - parseFloat(item.returnedQuantity)
        priceP.textContent = `${(parseFloat(item.basePrice) * adjustedQuantity).toFixed(2)} € (Precio: ${(parseFloat(item.basePrice) * parseFloat(item.quantity))}-${(parseFloat(item.basePrice) * parseFloat(item.returnedQuantity))} )`
      } else {
        priceP.textContent = `${(parseFloat(item.basePrice) * parseFloat(item.quantity)).toFixed(2)} €`
      }
      orderDetails.appendChild(title)
      orderDetails.appendChild(priceP)
      const itemDetail = document.createElement('div')
      itemDetail.classList.add('item-detail')
      const quantityControl = document.createElement('div')
      quantityControl.classList.add('quantity-control')
      const unities = document.createElement('span')
      unities.classList.add('item-united')
      unities.textContent = `${item.quantity}`
      if (item.returnedQuantity && item.returnedQuantity > 0) {
        const returnedInfo = document.createElement('span')
        returnedInfo.classList.add('item-returned')
        returnedInfo.textContent = ` (Devuelto: ${item.returnedQuantity})`
        unities.appendChild(returnedInfo)
      }
      quantityControl.appendChild(unities)
      itemDetail.appendChild(quantityControl)
      orderElement.appendChild(orderDetails)
      orderElement.appendChild(itemDetail)
      fragment.appendChild(orderElement)
    })
    orderItem.appendChild(fragment)
    this.totalPrice()
  }

  async totalPrice() {
    const totalPriceElement = this.shadow.querySelector('.total-price')
    const total = this.data.rows.reduce((sum, item) => {
      const adjustedQuantity = item.returnedQuantity ? item.quantity - item.returnedQuantity : item.quantity
      return sum + (parseFloat(item.basePrice) * adjustedQuantity)
    }, 0)

    totalPriceElement.textContent = `${total.toFixed(2)} €`
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
      console.error('No sale ID provided, aborting order process.')
      return
    }

    const orderDetails = this.data.rows.map(item => {
      const remainingQuantity = item.quantity - (item.returnedQuantity || 0)

      return {
        productId: item.productId,
        saledetailId: item.id,
        priceId: item.priceId,
        productName: item.productName,
        quantity: item.returnedQuantity ? remainingQuantity : item.quantity,
        basePrice: item.basePrice,
        totalPrice: (parseFloat(item.basePrice) * (item.returnedQuantity ? remainingQuantity : item.quantity)).toFixed(2) + ' €'
      }
    })
    console.log(orderDetails)

    store.dispatch(setOrderDetails(orderDetails))

    this.shadow.querySelector('.filter-modal').classList.remove('visible')

    document.dispatchEvent(new CustomEvent('showFilterModal', {
      detail: { saleId }
    }))
    document.dispatchEvent(new CustomEvent('changeHeader', {
      detail: {
        title: 'Tu Pedido',
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
