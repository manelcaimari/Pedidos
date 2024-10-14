import { store } from '../../redux/store.js'
import { setCart } from '../../redux/crud-slice.js'
class Repayment extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/sales`
    this.data = []
    this.orderData = []
    this.unsubscribe = null
  }

  connectedCallback() {
    document.addEventListener('showFilterModal', this.handleMessage.bind(this))
    this.unsubscribe = store.subscribe(this.render.bind(this))
    this.data = store.getState().crud.orderDetails

    console.log('Datos del pedido:', this.data)
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('showFilterModal', this.handleMessage.bind(this))
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  handleMessage(event) {
    const state = store.getState()
    const orderId = state.crud.saleId
    console.log('Sale ID:', orderId)

    if (!orderId) {
      console.error('Sale ID no definido, no se puede procesar la devolución.')
      return
    }

    this.getSaleDetails(orderId)
  }

  async getSaleDetails(saleId) {
    try {
      const response = await fetch(`${this.endpoint}?id=${saleId}`)
      const saleDetails = await response.json()
      this.orderData = saleDetails
      this.render()

      this.shadow.querySelector('.detalls').classList.add('visible')
    } catch (error) {
      console.error('Error al obtener los detalles de la venta:', error)
    }
  }

  addToCart(productId, quantityChange) {
    const currentState = store.getState()
    const existingCartItem = currentState.crud.cart.find(item => item.productId === productId)
    const newQuantity = existingCartItem ? existingCartItem.quantity + quantityChange : quantityChange

    console.log('Añadiendo al carrito:', { productId, newQuantity })
    store.dispatch(setCart({ productId, quantity: newQuantity }))
  }

  render() {
    this.shadow.innerHTML = /* html */`
      <style>
      * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
        .detalls {
          position: fixed;
          top: 50px;
          left: 0;
          width: 100%;
          height:100%;
          background-color: #1D055B;
          display: flex;
          flex-direction: column;
          align-items: center;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s ease-in-out, visibility 0.3s;
          z-index: 10;
        }
        .detalls.visible {
          visibility: visible;
          opacity: 1;
        }
        .order-item {
          min-height: 75vh;
          max-height: 90vh;
          font-weight: 600;
          width: 100%; 
        }
        .order {
    
          gap: 1rem;
          padding: 1rem;
          width: 100%; 
    
        }
        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .item-name {
          text-transform: capitalize;
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
          height: 25px;
          
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
        <div class="detalls">
          <div class="order-item"></div>
          <div class="button-order">
            <div class="orders">
                <button class="view-order-button">Devuelto</button>
              </div>
          </div>
        </div>
    `
    this.populateOrderItems()
    this.renderOrderButton()
  }

  populateOrderItems() {
    const ordersContainer = this.shadow.querySelector('.order-item')
    const fragment = document.createDocumentFragment()
    this.data = store.getState().crud.orderDetails

    if (this.data && Array.isArray(this.data)) {
      this.data.forEach(product => {
        const orderElement = document.createElement('div')
        orderElement.classList.add('order')

        const orderDetails = document.createElement('div')
        orderDetails.classList.add('item-details')

        const titleP = document.createElement('p')
        titleP.classList.add('item-name')
        titleP.textContent = product.productName

        const priceP = document.createElement('p')
        priceP.classList.add('item-price')
        priceP.textContent = `${product.basePrice} €`

        orderDetails.appendChild(titleP)
        orderDetails.appendChild(priceP)

        const quantityControl = document.createElement('div')
        quantityControl.classList.add('quantity-control')

        const minusButton = document.createElement('button')
        minusButton.textContent = '-'

        const quantityInput = document.createElement('input')
        quantityInput.type = 'number'
        quantityInput.value = '0'
        quantityInput.min = '0'
        quantityInput.max = product.quantity

        const plusButton = document.createElement('button')
        plusButton.textContent = '+'

        const productId = product.productId

        minusButton.addEventListener('click', () => {
          const quantity = parseInt(quantityInput.value)
          if (quantity > 0) {
            quantityInput.value = quantity - 1
            this.addToCart(productId, -1)
          }
        })

        plusButton.addEventListener('click', (event) => {
          event.preventDefault() // Evita que el botón recargue la página
          const quantity = parseInt(quantityInput.value)
          const maxQuantity = parseInt(quantityInput.max)

          if (quantity < maxQuantity) {
            quantityInput.value = quantity + 1
            this.addToCart(productId, 1)
          }
        })
        quantityControl.appendChild(minusButton)
        quantityControl.appendChild(quantityInput)
        quantityControl.appendChild(plusButton)

        const itemDetail = document.createElement('div')
        itemDetail.classList.add('item-detail')

        itemDetail.appendChild(orderDetails)
        itemDetail.appendChild(quantityControl)

        orderElement.appendChild(itemDetail)
        fragment.appendChild(orderElement)
      })

      ordersContainer.appendChild(fragment)
    }
  }

  renderOrderButton() {
    const button = this.shadow.querySelector('.view-order-button')
    button.addEventListener('click', async () => {
      const orderDetails = store.getState().crud.orderDetails
      const state = store.getState()
      const saleId = state.crud.saleId
      const reference = state.crud.reference

      if (orderDetails && Array.isArray(orderDetails)) {
        const totalBasePrice = orderDetails.reduce((acc, product) => acc + parseFloat(product.basePrice) * product.quantity, 0)

        const returnData = {
          saleId,
          customerId: 1,
          reference,
          totalBasePrice,
          returnDate: new Date().toISOString().split('T')[0],
          returnTime: new Date().toLocaleTimeString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        console.log('Datos de devolución:', returnData)

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/returns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(returnData)
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Devolución procesada:', result)

            alert(result.message)
            this.resetOrderItems()
            this.data = []
            this.render()
          } else {
            const error = await response.json()
            console.error('Error al procesar la devolución:', error)

            if (Array.isArray(error.message)) {
              alert('Error al procesar la devolución:\n' + error.message.join('\n'))
            } else {
              alert('Error al procesar la devolución: ' + error.message)
            }
          }
        } catch (error) {
          console.error('Error en la solicitud de devolución:', error)
          alert('Error en la solicitud de devolución: ' + error.message)
        }
      } else {
        alert('No hay detalles del pedido para procesar la devolución.')
      }
    })
  }
}

customElements.define('repayment-component', Repayment)
