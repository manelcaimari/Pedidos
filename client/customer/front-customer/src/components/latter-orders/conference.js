import { store } from '../../redux/store.js'
import { setSaleId, setReference, setQueryString, setCustomerDetails } from '../../redux/crud-slice.js'

class Conference extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/sales`
    this.data = { rows: [] }
    this.queryString = null
  }

  async connectedCallback() {
    this.unsubscribe = store.subscribe(async () => {
      const currentState = store.getState()
      this.customer = currentState.crud.customer
      const newQueryString = currentState.crud.queryString

      if (this.customer && this.customer.id) {
        if (this.queryString !== newQueryString) {
          this.queryString = newQueryString
          await this.loadData()
          await this.render()
        }
      }
    })

    store.dispatch(setQueryString(this.queryString))
    await this.getActivationToken()
  }

  async getActivationToken() {
    const token = localStorage.getItem('customerAccessToken')
    if (!token) {
      return
    }
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]))
      const customerId = decodedToken.customerId

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/customers/${customerId}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('customerAccessToken')
        }
      })

      if (response.ok) {
        const customerData = await response.json()
        await this.loadData(customerData)
      }
    } catch (error) {
      console.error('Error al obtener el token de activación:', error)
    }
  }

  disconnectedCallback() {
    this.unsubscribe()
  }

  async loadData(customerData) {
    store.dispatch(setCustomerDetails(customerData))
    const algo = customerData.id

    const endpoint = this.queryString ? `${this.endpoint}?${this.queryString}&customerId=${algo}` : `${this.endpoint}?customerId=${algo}`
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const allSales = await response.json()
      console.log('Datos de ventas:', allSales)
      this.data.rows = allSales.rows.filter(sale => sale.customerId === customerData.id)

      this.render()
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    }
  }

  render() {
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
    ordersContainer.innerHTML = ''
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
      button.classList.add('check-order-details')
      button.textContent = 'ver pedido'

      quantityControlContainer.appendChild(button)

      orderQuantity.appendChild(quantityControlContainer)
      orderContainer.appendChild(orderQuantity)
      ordersContainer.appendChild(orderContainer)
    })
    this.renderOrderButton()
  }

  async renderOrderButton() {
    const orderButtons = this.shadow.querySelectorAll('.check-order-details')

    orderButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const saleId = this.data.rows[index].id
        const reference = this.data.rows[index].reference

        document.dispatchEvent(new CustomEvent('showorderModal', {
          detail: { saleId, reference }
        }))

        store.dispatch(setSaleId(saleId))
        store.dispatch(setReference(reference))

        document.dispatchEvent(new CustomEvent('changeHeader', {
          detail: {
            title: `Resumen de tu pedido: ${reference}`,
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>',
            linkHref: 'http://dev-pedidos.com/cliente/pedidos-anteriores'
          }
        }))

        document.body.style.overflow = 'hidden'
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
  }
}

customElements.define('conference-component', Conference)
