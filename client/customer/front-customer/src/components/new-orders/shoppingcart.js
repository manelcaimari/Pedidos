import { store } from '../../redux/store.js'

class Shoppingcart extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.cartItems = []
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/client/sales`
  }

  async connectedCallback() {
    document.addEventListener('showFilterModal', this.handleMessage.bind(this))
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState()
      this.cartItems = state.crud.cart
      this.customerDetails = state.crud.customerDetails
      this.render()
    })
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('showFilterModal', this.handleMessage.bind(this))

    if (this.unsubscribe) {
      this.unsubscribe()
    }
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
              <div class="total-quantity">
                <p>Impuesto no incluidos</p>
              </div>
            </div>
            <div class="orders">
              <button>Pagar Ahora</button>
            </div>
          </div>
        </div>
      </div>
    `

    const orderItem = this.shadow.querySelector('.order-item')

    const fragment = document.createDocumentFragment()

    this.cartItems.forEach(item => {
      const orderElement = document.createElement('div')
      orderElement.classList.add('order')

      const orderDetails = document.createElement('div')
      orderDetails.classList.add('item-details')

      const title = document.createElement('p')
      title.classList.add('item-name')
      title.textContent = item.name || 'Producto'

      const priceP = document.createElement('p')
      priceP.classList.add('item-price')
      priceP.textContent = `${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)} €`

      orderDetails.appendChild(title)
      orderDetails.appendChild(priceP)

      const itemDetail = document.createElement('div')
      itemDetail.classList.add('item-detail')

      const detailContents = document.createElement('div')
      detailContents.classList.add('detail')

      const unitiesSpan = document.createElement('span')
      unitiesSpan.classList.add('item-united')
      unitiesSpan.textContent = `${item.units || 0}u, ${item.measurement || ''} ${item.measurementUnit || ''}`

      detailContents.appendChild(unitiesSpan)

      const quantityControl = document.createElement('div')
      quantityControl.classList.add('quantity-control')

      const unities = document.createElement('span')
      unities.classList.add('item-united')
      unities.textContent = `${item.quantity || ''}x${item.price}`
      quantityControl.appendChild(unities)
      itemDetail.appendChild(detailContents)
      itemDetail.appendChild(quantityControl)

      orderElement.appendChild(orderDetails)
      orderElement.appendChild(itemDetail)

      fragment.appendChild(orderElement)
    })

    orderItem.appendChild(fragment)

    this.buttonfinality()
    this.totalprice()
  }

  async totalprice() {
    const total = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
    const totalPriceElement = this.shadow.querySelector('.total-price')
    totalPriceElement.textContent = `${total} €`
  }

  async buttonfinality() {
    const finishOrderBtn = this.shadow.querySelector('.orders button');

    finishOrderBtn.addEventListener('click', async () => {
      this.shadow.querySelector('.filter-modal').classList.remove('visible');

      // Obtener el total del carrito
      const totalAmount = parseFloat(
        this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
      );

      // Eliminar la clase 'hidden' del formulario de pago para mostrarlo
      document.getElementById('payment-form').classList.remove('hidden');

      // Llama a la inicialización del flujo de Stripe con el total del carrito
      document.dispatchEvent(new CustomEvent('initializeStripePayment', { detail: { totalAmount } }));
    });
  }


}


// async buttonfinality() {
//   const finishOrderBtn = this.shadow.querySelector('.orders button')

//   finishOrderBtn.addEventListener('click', async () => {
//     if (this.cartItems.length === 0) {
//       document.dispatchEvent(new CustomEvent('message', {
//         detail: {
//           type: 'error',
//           message: 'Tu carrito está vacío. Añade productos antes de finalizar el pedido.'
//         }
//       }))
//       return
//     }

//     const saleData = {
//       customerId: this.customerDetails.Id,
//       items: this.cartItems.map(item => ({
//         productId: item.productId,
//         priceId: item.priceId,
//         productName: item.name,
//         basePrice: item.price,
//         quantity: item.quantity
//       }))
//     }

//     try {
//       const response = await fetch(this.endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(saleData)
//       })

//       if (response.ok) {
//         const data = await response.json()

//         this.shadow.querySelector('.filter-modal').classList.remove('visible')
//         document.dispatchEvent(new CustomEvent('showrenferentModal', {
//           detail: { reference: data.reference }
//         }))
//       } else {
//         const errorData = await response.json()
//         console.error('Error al crear la venta:', errorData)

//         document.dispatchEvent(new CustomEvent('message', {
//           detail: {
//             type: 'error',
//             message: 'No se pudo finalizar el pedido. Inténtalo de nuevo.'
//           }
//         }))
//       }
//     } catch (error) {
//       console.error('Error en la solicitud:', error)

//       document.dispatchEvent(new CustomEvent('message', {
//         detail: {
//           type: 'error',
//           message: 'Ocurrió un error al finalizar el pedido. Verifica tu conexión a internet.'
//         }
//       }))
//     }
//   })
// }
// }
// customElements.define('shop-component', Shoppingcart)

customElements.define('shop-component', Shoppingcart)
