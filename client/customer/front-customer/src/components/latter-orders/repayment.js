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

      if (newSaleId !== this._saleId) {
        this._saleId = newSaleId
        this.getSaleDetails(this._saleId)
      }

      if (JSON.stringify(newOrderDetails) !== JSON.stringify(this.orderData)) {
        this.orderData = newOrderDetails
        this.cosita()
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
    console.log('Obteniendo detalles para el saleId:', saleId)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/sale-details?Id=${saleId}`)
      console.log('Respuesta de la API:', response)
      if (!response.ok) {
        console.error('Error en la respuesta de getSaleDetails:', response.statusText)
        return null
      }
      const data = await response.json()
      console.log('Detalles de la venta:', data)
      return data
    } catch (error) {
      console.error('Error en getSaleDetails:', error)
      return null
    }
  }

  cosita() {
    const ordersContainer = this.shadow.querySelector('.order-item')
    if (!ordersContainer) {
      console.warn('populateOrderItems: No se encontró el contenedor .order-item en el DOM')
      return
    }

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
      priceP.textContent = `${product.basePrice} €`

      orderDetails.appendChild(titleP)
      orderDetails.appendChild(priceP)

      const quantityControl = document.createElement('div')
      quantityControl.classList.add('quantity-control')

      const minusButton = document.createElement('button')
      minusButton.textContent = '-'

      const quantityInput = document.createElement('input')
      quantityInput.type = 'number'
      quantityInput.value = this.returnQuantities[product.productName] || '0'
      quantityInput.min = '0'
      quantityInput.max = product.quantity
      quantityInput.dataset.productName = product.productName

      const plusButton = document.createElement('button')
      plusButton.textContent = '+'

      if (!(product.productName in this.returnQuantities)) {
        this.returnQuantities[product.productName] = 0
      }

      minusButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value)
        if (quantity > 0) {
          quantityInput.value = quantity - 1
          this.returnQuantities[product.productName] = quantity - 1
        }
      })

      plusButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value)
        const maxQuantity = parseInt(quantityInput.max)
        if (quantity < maxQuantity) {
          quantityInput.value = quantity + 1
          this.returnQuantities[product.productName] = quantity + 1
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

  async renderOrderButton() {
    const button = this.shadow.querySelector('.view-order-button')
    button.addEventListener('click', async () => {
      const state = store.getState()
      const saleId = state.crud.saleId
      const reference = state.crud.reference

      console.log('Estado del store:', state)
      console.log('ID de venta:', saleId)
      console.log('Referencia:', reference)

      if (!saleId) {
        alert('El ID de venta no es válido.')
        return
      }

      const orderDetails = await this.getSaleDetails(saleId)
      console.log('Detalles de la venta:', orderDetails)

      if (orderDetails === null || !Array.isArray(orderDetails) || orderDetails.length === 0) {
        alert('No se pudieron obtener los detalles de la venta. Verifica la consola para más detalles.')
        return
      }

      const totalBasePrice = orderDetails.reduce((acc, product) => {
        const quantityInput = this.shadow.querySelector(`input[data-product-name="${product.productName}"]`)
        const quantity = quantityInput ? parseInt(quantityInput.value) : 0
        return acc + parseFloat(product.basePrice) * quantity
      }, 0)

      console.log('Precio total base:', totalBasePrice)

      const returnData = {
        saleId,
        customerId: 1,
        reference,
        totalBasePrice,
        returnDate: new Date().toISOString().split('T')[0],
        returnTime: new Date().toLocaleTimeString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        returnDetails: orderDetails.map(product => {
          const quantityInput = this.shadow.querySelector(`input[data-product-name="${product.productName}"]`)
          const quantity = quantityInput ? parseInt(quantityInput.value) : 0
          return {
            saleDetailId: product.saleDetailId || 'No saleDetailId',
            productId: product.productId || 'No productId',
            productName: product.productName || 'No productName',
            quantity,
            priceId: product.priceId || product.basePrice
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
        } else {
          const error = await response.json()
          if (Array.isArray(error.message)) {
            alert('Error al procesar la devolución:\n' + error.message.join('\n'))
          }
        }
      } catch (error) {
        alert('Error en la solicitud de devolución: ' + error.message)
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
