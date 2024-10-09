import { store } from '../redux/store.js'

class Conference extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/sales`
    this.data = []
    this.queryString = null
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(async () => {
      const currentState = store.getState()
      const newQueryString = currentState.crud.queryString

      if (this.queryString !== newQueryString) {
        this.queryString = newQueryString
        await this.loadData()
        this.render()
      }
    })

    await this.loadData()
    this.render()
  }

  async loadData () {
    const endpoint = this.queryString ? `${this.endpoint}?${this.queryString}` : this.endpoint
    const response = await fetch(endpoint)

    this.data = await response.json()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
      <style>
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
          font-weight: 600;
          font-size: 16px;
        }
        .detail-name .detail-price {
          font-size: 18px;
          margin: 0;
        }
        .date-time-container{
          display:flex;
          gap:0.5rem;
        }
        .order-quantity {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
        </div>
    `
    const ordersContainer = this.shadow.querySelector('.orders')
    this.data.rows.forEach(order => {
      const orderContainer = document.createElement('div')
      orderContainer.classList.add('order')

      const orderDetails = document.createElement('div')
      orderDetails.classList.add('order-details')

      const reference = document.createElement('p')
      reference.classList.add('detail-reference')
      reference.textContent = order.reference
      orderDetails.appendChild(reference)

      const total = document.createElement('p')
      total.classList.add('detail-price')
      total.textContent = `${order.totalBasePrice} €`
      orderDetails.appendChild(total)

      orderContainer.appendChild(orderDetails)

      const orderQuantity = document.createElement('div')
      orderQuantity.classList.add('order-quantity')

      const dateTimeContainer = document.createElement('div')
      dateTimeContainer.classList.add('date-time-container')

      const date = document.createElement('span')
      date.classList.add('detail-date')
      date.textContent = order.saleDate
      dateTimeContainer.appendChild(date)

      const hour = document.createElement('span')
      hour.classList.add('detail-hour')
      hour.textContent = order.saleTime
      dateTimeContainer.appendChild(hour)

      orderQuantity.appendChild(dateTimeContainer)

      const quantityControlContainer = document.createElement('div')
      quantityControlContainer.classList.add('quantity-control')

      const button = document.createElement('button')
      button.textContent = 'ver pedido'
      quantityControlContainer.appendChild(button)

      orderQuantity.appendChild(quantityControlContainer)
      orderContainer.appendChild(orderQuantity)
      ordersContainer.appendChild(orderContainer)
    })
  }

  disconnectedCallback () {
    this.unsubscribe()
  }
}

customElements.define('conference-component', Conference)
