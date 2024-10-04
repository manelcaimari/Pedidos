import { store } from '../redux/store.js'
import { toggleCart, setCart } from '../redux/crud-slice.js'

class DetailComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/products`
    this.data = []
    this.cartItems = []
    this.basePricesMap = {}
    this.selectionCounts = {}
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    try {
      const response = await fetch(this.endpoint)
      if (!response.ok) throw new Error('Error en la carga de productos')
      this.data = await response.json()
      await this.getBasePrices()
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        .order-item {
          min-height: 75vh;
          max-height: 90vh;
          font-weight: 600;
        }
        .order{
          display:grid;
          gap:1rem;
          padding:1rem 0.5rem;
     
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

        .item-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-detail span {
          font-weight: 700;
        }

        .quantity-control {
          display: flex;
          align-items:stretch;
          height: 100%;
        }

        .quantity-control button {
          align-items: center;
          border: none;
          cursor: pointer;
          font-size: 18px;
          height: 1.5rem;
          width: 1.5rem;
        }

        .quantity-control input {
          box-sizing: border-box;
          width: 40px;
          color: black;
          text-align: center;
          margin: 0;
          background-color: hsla(213, 43%, 55%, 0.76);
          border: none;
          height: 100%;
          
        }

        .button-order {
          text-align: center;
          border: none;
          gap: 20px;
          margin: 10px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .orders {
          width: 75%;
          display: grid;
          align-items: center;
        }

        .orders button::first-letter {
          text-transform: capitalize;
        }

        .orders button {
          background-color: white;
          color: hsl(0, 0%, 0%);
          border: none;
          border-radius: 13px;
          padding: 8px 0;
          text-align: center;
          text-decoration: none;
          font-size: 16px;
          width: 100%;
          cursor: pointer;
          font-weight: 600;
        }
        </style>
      <div class="order-item"></div>
      <div class="button-order">
        <div class="orders">
            <button class="filter-button">Ver pedido</button>
          </div>
      </div>
    `

    const ordersContainer = this.shadow.querySelector('.order-item')
    const fragment = document.createDocumentFragment()

    this.data.rows.forEach(customer => {
      const productId = customer.id
      const orderElement = document.createElement('div')
      orderElement.classList.add('order')

      const orderDetails = document.createElement('div')
      orderDetails.classList.add('item-details')

      const titleP = document.createElement('p')
      titleP.classList.add('item-name')
      titleP.textContent = customer.name

      const priceP = document.createElement('p')
      priceP.classList.add('item-price')
      priceP.textContent = `${this.basePricesMap[customer.id] ? this.basePricesMap[customer.id] + ' €' : 'Desconocido'}`

      orderDetails.appendChild(titleP)
      orderDetails.appendChild(priceP)

      const itemDetail = document.createElement('div')
      itemDetail.classList.add('item-detail')

      const detailContents = document.createElement('div')
      detailContents.classList.add('detail')

      const unitiesSpan = document.createElement('span')
      unitiesSpan.classList.add('item-united')
      unitiesSpan.textContent = `${customer.units || 0}u, ${customer.measurement || ''} ${customer.measurementUnit || ''}`

      detailContents.appendChild(unitiesSpan)

      const quantityControl = document.createElement('div')
      quantityControl.classList.add('quantity-control')

      const minusButton = document.createElement('button')
      minusButton.textContent = '-'
      const quantityInput = document.createElement('input')
      quantityInput.type = 'number'
      quantityInput.value = '0'
      quantityInput.min = '0'
      const plusButton = document.createElement('button')
      plusButton.textContent = '+'

      minusButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value)
        if (quantity > 0) {
          quantityInput.value = quantity - 1
          this.addToCart(productId, -1)
        }
      })

      plusButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value)
        quantityInput.value = quantity + 1
        this.addToCart(productId, 1)
      })

      quantityControl.appendChild(minusButton)
      quantityControl.appendChild(quantityInput)
      quantityControl.appendChild(plusButton)

      itemDetail.appendChild(detailContents)
      itemDetail.appendChild(quantityControl)

      orderElement.appendChild(orderDetails)
      orderElement.appendChild(itemDetail)

      fragment.appendChild(orderElement)
    })

    ordersContainer.appendChild(fragment)
    this.renderFilterButton()
  }

  addToCart (productId, quantity) {
    const product = this.data.rows.find(item => item.id === productId)

    if (!product) return

    const cartItem = {
      id: productId,
      name: product.name,
      price: this.basePricesMap[productId],
      quantity
    }
    store.dispatch(setCart(cartItem))
  }

  async renderFilterButton () {
    const filterButton = this.shadow.querySelector('.filter-button')

    filterButton.addEventListener('click', () => {
      store.dispatch(toggleCart())
      document.dispatchEvent(new CustomEvent('showFilterModal'))
    })
  }

  async getBasePrices () {
    try {
      const pricesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/client/prices`)
      if (!pricesResponse.ok) throw new Error('Error al cargar precios')
      const pricesCategories = await pricesResponse.json()
      this.basePricesMap = {}

      pricesCategories.rows.forEach(price => {
        if (price.current) {
          this.basePricesMap[price.productId] = price.basePrice
        }
      })
    } catch (error) {
      console.error('Error al obtener precios base:', error)
    }
  }
}

customElements.define('detail-component', DetailComponent)
