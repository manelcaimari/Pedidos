class conference extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    this.data = [
      {
        reference: '00000000002',
        total: '180',
        date: '20-05-2024',
        hour: '11:13',
        measurementtotal: '€'
      },
      {
        reference: '00000000003',
        total: '270',
        date: '13-05-2024',
        hour: '17:09',
        measurementtotal: '€'
      },
      {
        reference: '00000000002',
        total: '270',
        date: '13-05-2024',
        hour: '17:09',
        measurementtotal: '€'
      }
    ]
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
    this.data.forEach(order => {
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
      total.textContent = `${order.total} ${order.measurementtotal}`
      orderDetails.appendChild(total)

      orderContainer.appendChild(orderDetails)

      const orderQuantity = document.createElement('div')
      orderQuantity.classList.add('order-quantity')

      const dateTimeContainer = document.createElement('div')
      dateTimeContainer.classList.add('date-time-container')

      const date = document.createElement('span')
      date.classList.add('detail-date')
      date.textContent = order.date
      dateTimeContainer.appendChild(date)

      const hour = document.createElement('span')
      hour.classList.add('detail-hour')
      hour.textContent = order.hour
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
}

customElements.define('conference-component', conference)
