import { store } from '../../redux/store.js'
import { addItem } from '../../redux/crud-slice.js'

class DetailComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/customer/products`
    this.page = 1
    this.data = []
  }

  async connectedCallback () {
    try {
      await this.loadData()
      this.render()
    } catch (error) {
      console.error('Error loading data:', error)
      this.shadow.innerHTML = '<p>Error loading products. Please try again later.</p>'
    }
  }

  async loadData () {
    const endpoint = `${this.endpoint}?page=${this.page}`
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json()
    this.data = result.products
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        .order-item {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 70vh;
          max-height: 70vh;
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
          align-items: center;
          justify-content: center;
        }

        .quantity-control button {
          align-items: center;
          border: none;
          cursor: pointer;
          font-size: 18px;
          height: 1.5rem;
          width: 2rem;
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
          padding: 0.1rem;
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
            <a href="http://dev-pedidos.com/cliente/compra"><button>Ver pedido</button></a>
            <button id="add-to-cart">Añadir al carrito</button> 
          </div>
      </div>
    `

    this.createOrderElements()
    this.setupAddToCartButton()
  }

  createOrderElements () {
    const ordersContainer = this.shadow.querySelector('.order-item')

    ordersContainer.innerHTML = ''

    this.data.forEach(product => {
      const orderElement = document.createElement('div')
      orderElement.classList.add('order')

      const orderDetails = document.createElement('div')
      orderDetails.classList.add('item-details')

      const titleP = document.createElement('p')
      titleP.classList.add('detail-title')
      titleP.textContent = product.name

      const priceP = document.createElement('p')
      priceP.classList.add('detail-price')
      priceP.textContent = `${product.basePrice.toFixed(2)} €`

      orderDetails.appendChild(titleP)
      orderDetails.appendChild(priceP)

      ordersContainer.appendChild(orderDetails)

      const itemDetail = document.createElement('div')
      itemDetail.classList.add('item-detail')

      const detailContents = document.createElement('div')
      detailContents.classList.add('detail')

      const unitiesSpan = document.createElement('span')
      unitiesSpan.classList.add('item-united')
      unitiesSpan.textContent = `${product.units}, ${product.measurement} ${product.measurementUnit}`

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
        }
      })

      plusButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value)
        quantityInput.value = quantity + 1
      })

      quantityControl.appendChild(minusButton)
      quantityControl.appendChild(quantityInput)
      quantityControl.appendChild(plusButton)

      itemDetail.appendChild(detailContents)
      itemDetail.appendChild(quantityControl)

      orderElement.appendChild(orderDetails)
      orderElement.appendChild(itemDetail)

      ordersContainer.appendChild(orderElement)
    })
  }

  setupAddToCartButton () {
    const addToCartButton = this.shadow.getElementById('add-to-cart')
    addToCartButton.addEventListener('click', () => {
      this.handleAddToCart()
    })
  }

  handleAddToCart () {
    const quantityInputs = this.shadow.querySelectorAll('input[type="number"]')
    quantityInputs.forEach((input, index) => {
      const quantity = parseInt(input.value, 10)
      if (quantity > 0) {
        const product = this.data[index]

        const cartItem = {
          name: product.name,
          price: product.basePrice,
          quantity,
          units: product.units,
          measurement: product.measurement,
          measurementUnit: product.measurementUnit
        }

        store.dispatch(addItem(cartItem))
      }
    })
    alert('Productos añadidos al carrito.')
  }
}

customElements.define('detail-component', DetailComponent)
