import { store } from '../../redux/store.js'

class Repayment extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.orderData = []
    this.returnQuantities = {}
    this.saleId = null
  }

  async connectedCallback() {
    document.addEventListener('showFilterModal', this.handleMessage.bind(this))

    this.unsubscribe = store.subscribe(() => {
      const state = store.getState()
      const newSaleId = state.crud.saleId
      const newOrderDetails = state.crud.orderDetails

      if (newSaleId !== this.saleId) {
        this.saleId = newSaleId
        this.getSaleDetails(this.saleId)
      }

      if (JSON.stringify(newOrderDetails) !== JSON.stringify(this.orderData)) {
        this.orderData = newOrderDetails
        this.renderOrderItems()
      }
    })

    await this.render()
  }

  disconnectedCallback() {
    this.unsubscribe()
    document.removeEventListener('showFilterModal', this.handleMessage.bind(this))
  }

  handleMessage(event) {
    const detailsElement = this.shadow.querySelector('.detalls')
    if (detailsElement) {
      detailsElement.classList.add('visible')
      this.handleBoundMessage = this.handleMessage.bind(this)
      document.addEventListener('showFilterModal', this.handleBoundMessage)
      document.removeEventListener('showFilterModal', this.handleBoundMessage)
    }
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
          width: 100%;
          padding: 10px;
          display: flex;
          justify-content: center;
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

    this.renderOrderButton()
  }

  async getSaleDetails(saleId) {
    if (!saleId) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/sale-details?Id=${saleId}`)

      if (!response.ok) return null

      const data = await response.json()

      if (!data || !Array.isArray(data.rows)) return null

      this.orderData = data.rows
      this.renderOrderItems()

      return this.orderData
    } catch (error) {
      return null
    }
  }

  renderOrderItems() {
    const ordersContainer = this.shadow.querySelector('.order-item')

    if (!ordersContainer) return

    ordersContainer.innerHTML = ''
    const fragment = document.createDocumentFragment()

    this.orderData.forEach((product, index) => {
      const orderElement = document.createElement('div')
      orderElement.classList.add('order')

      const orderDetails = document.createElement('div')
      orderDetails.classList.add('item-details')

      const titleP = document.createElement('p')
      titleP.classList.add('item-name')
      titleP.textContent = product.productName

      const priceP = document.createElement('p')
      priceP.classList.add('item-price')
      const totalPrice = (parseFloat(product.basePrice) * parseFloat(product.quantity)).toFixed(2)
      priceP.textContent = `${totalPrice} €`

      orderDetails.appendChild(titleP)
      orderDetails.appendChild(priceP)

      const quantityControl = document.createElement('div')
      quantityControl.classList.add('quantity-control')

      const minusButton = document.createElement('button')
      minusButton.textContent = '-'

      const quantityInput = document.createElement('input')
      quantityInput.type = 'number'
      const productKey = product.productId || product.productName
      quantityInput.value = this.returnQuantities[productKey] || '0'
      quantityInput.min = '0'
      quantityInput.max = product.quantity
      quantityInput.dataset.productName = product.productName
      quantityInput.dataset.index = index

      const plusButton = document.createElement('button')
      plusButton.textContent = '+'

      minusButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value)
        if (quantity > 0) {
          quantityInput.value = quantity - 1
          this.returnQuantities[productKey] = quantity - 1
        }
      })

      plusButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value)
        const maxQuantity = parseInt(quantityInput.max)
        if (quantity < maxQuantity) {
          quantityInput.value = quantity + 1
          this.returnQuantities[productKey] = quantity + 1
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

  getUpdatedProductDetails() {
    const productDetails = []
    const orderItems = this.shadow.querySelectorAll('.order')
    const state = store.getState()

    const productsInOrderDetails = state.crud.orderDetails

    orderItems.forEach(orderItem => {
      const quantityInput = orderItem.querySelector('input[type="number"]')
      const productName = orderItem.querySelector('.item-name').textContent

      if (quantityInput) {
        const quantity = parseInt(quantityInput.value)

        const product = productsInOrderDetails.find(p => p.productName === productName)

        if (product) {
          productDetails.push({
            productName,
            quantity,
            basePrice: product.basePrice,
            priceId: product.priceId,
            saledetailId: product.saledetailId,
            productId: product.productId
          })
        }
      }
    })

    return productDetails
  }

  async renderOrderButton() {
    const button = this.shadow.querySelector('.view-order-button')

    button.addEventListener('click', async () => {
      const productDetails = this.getUpdatedProductDetails()

      if (!productDetails || productDetails.length === 0) {
        console.error('No se encontraron detalles de productos.')
        return
      }

      const state = store.getState()
      const saleId = state.crud.saleId
      const customerId = state.crud.customerId || 1
      let totalBasePrice = 0

      const reference = state.crud.reference

      productDetails.forEach(product => {
        const { quantity, basePrice, productName } = product

        const quantityNumber = Number(quantity)
        const basePriceNumber = Number(basePrice)

        if (!isNaN(quantityNumber) && !isNaN(basePriceNumber) && quantityNumber > 0 && basePriceNumber > 0) {
          const productTotal = quantityNumber * basePriceNumber
          totalBasePrice += productTotal

          console.log(`Producto: ${productName}, Cantidad: ${quantityNumber}, Precio Base: ${basePriceNumber}, Total: ${productTotal.toFixed(2)} €`)
        } else {
          console.error(`Datos inválidos para el producto ${product.productName}: cantidad o precio base no válidos`)
        }
      })

      const orderDetails = productDetails.map(product => ({
        productName: product.productName,
        productId: product.productId,
        priceId: product.priceId,
        quantity: product.quantity,
        saledetailId: product.saledetailId
      }))

      const returnData = {
        saleId,
        reference,
        customerId,
        totalBasePrice,
        returnDate: new Date().toISOString().split('T')[0],
        returnTime: new Date().toLocaleTimeString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        returnDetails: orderDetails.map(product => {
          return {
            productName: product.productName,
            productId: product.productId,
            priceId: product.priceId,
            quantity: product.quantity,
            saledetailId: product.saledetailId
          }
        })
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/returns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(returnData)
        })

        if (response.ok) {
          this.resetOrderItems()
          this.returnQuantities = {}
          this.render()

          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: 'Devolución procesada correctamente',
              type: 'success'
            }
          }))
        } else {
          const error = await response.json()
          if (Array.isArray(error.message)) {
            alert('Error al procesar la devolución:\n' + error.message.join('\n'))

            document.dispatchEvent(new CustomEvent('message', {
              detail: {
                message: 'Error al procesar la devolución',
                type: 'error'
              }
            }))
          }
        }
      } catch (error) {
        alert('Error en la solicitud de devolución: ' + error.message)
        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: 'Error en la solicitud de devolución',
            type: 'error'
          }
        }))
      }
    })
  }

  resetOrderItems() {
    this.returnQuantities = {}
    this.orderData = []
    this.shadow.querySelector('.detalls').classList.remove('visible')
  }
}
customElements.define('repayment-component', Repayment)
