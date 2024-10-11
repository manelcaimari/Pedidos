class DevolutionComponent extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/products`
    this.data = []
  }

  async connectedCallback() {
    await this.loadData()
    await this.render()
    document.addEventListener('latterorder', this.handleMessage.bind(this))
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('latterorder', this.handleMessage.bind(this))
  }

  async handleMessage(event) {
    this.render()
    this.shadow.querySelector('.filter-modal').classList.add('visible')
  }

  render() {
    this.shadow.innerHTML = /* html */`
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
          background-color: #1D055B;
          display: flex;
          flex-direction: column;
          align-items: center;

          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s ease-in-out, visibility 0.3s;
          z-index: 10;
        }
        .filter-modal.visible {
          opacity: 1;
          visibility: visible;
        }
        .order-item {
          min-height: 75vh;
          max-height: 90vh;
          font-weight: 600;
        }
        .order{
          display:grid;
          gap: 0.5rem;
          padding:1rem 0.5rem;
     
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
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
        <div class="filter-modal">
          <div class="order-item"></div>
          <div class="button-order">
            <div class="orders">
                <button class="view-order-button">Ver pedido</button>
              </div>
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
    this.renderOrderButton()
  }
}

customElements.define('devolution-component', DevolutionComponent)
