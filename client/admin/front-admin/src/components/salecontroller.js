import isEqual from 'lodash-es/isEqual'
import { store } from '../redux/store.js'

class SaleController extends HTMLElement {
  constructor() {
    super()
    this.unsubscribe = null
    this.visualSaleElementData = null
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/sale-details`
  }

  connectedCallback() {
    document.addEventListener('showtablemodal', this.handleMessage.bind(this))
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()
      console.log('Estado actual de Redux:', currentState)

      if (currentState.crud.visualSaleElement &&
          !isEqual(this.visualSaleElementData, currentState.crud.visualSaleElement.data)) {
        this.visualSaleElementData = currentState.crud.visualSaleElement.data

        if (this.visualSaleElementData && this.visualSaleElementData.id) {
          this.getSaleDetails(this.visualSaleElementData.id)
          this.getReturns(this.visualSaleElementData.id)
        }
      }
    })
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('showtablemodal', this.handleMessage.bind(this))

    if (this.unsubscribe) this.unsubscribe()
  }

  handleMessage() {
    this.shadow.querySelector('.filter-modal').classList.add('visible')
  }

  render() {
    this.shadow.innerHTML =/* html */ `
      <style>
        .filter-modal {
          display: flex;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }
        .filter-modal.visible {
          opacity: 1;
          visibility: visible;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
        }
        .table-general {
          display: grid;
          gap: 1rem;
          width: 100%;
        }
        .tabs {
          display: flex;
        }
        .tab-content {
          display: none;
        }     
        .tabs ul {
          display: flex;
        }
        .tabs ul li {
          color: hsl(239, 73%, 47%);
          cursor: pointer;
          font-weight: bold;
          display: flex;
          font-size: 0.8rem;
          padding: 0.6rem;
        }
        .header-categori {
          display: flex;
          justify-content: space-between;
          background-color: white;
        }
        .header-categori li {
          background-color: rgb(90, 14, 90);
          padding: 0 1rem;
          align-content: center;
        }
        .categori-button svg {
          width: 40px;
          height: 40px;
          padding: 0;
        }
        .categori-button {
          background-color: white;
          border: 0;
          padding: 0 0.5rem;
          display: flex;
        }
        .button-reset svg{
          fill: hsl(229, 86%, 41%);
        }
        .editer input {
          width: 96%;
          padding: 0.5rem;
          background-color: rgb(90, 14, 90);
        }
        .detalles-caja{
          display:flex;      
          justify-content: space-between;
        }
        .datos{
          display:flex;
          flex-direction: column;     
        }
        </style>
        <div class="filter-modal">
          <section class="table-general">
            <div class="header-categori">
              <div class="tabs">
                <ul>
                  <li>General</li>
                </ul>
              </div>
              <div class="categori-button">
                <div class="button-reset">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title></title>
                    <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" />
                  </svg>
                </div>
              </div>
            </div>
          <div class="General">
            <input type="hidden" name="id" value="">
            <div class="sale-details"></div>
            <div class="product-details"></div>
            <div class="return-details"></div>
          </div>
        </section>
      </div>
    `
    this.getSaleDetails()
    this.getBasePrices()
  }

  async getBasePrices () {
    const pricesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/prices`)
    this.pricesCategories = await pricesResponse.json()
    this.basePricesMap = {}
    this.pricesCategories.rows.forEach(price => {
      if (price.current) {
        this.basePricesMap[price.productId] = price.basePrice
      }
    })
  }

  renderSale(data) {
    console.log('Valor de returnTotalBasePrice al renderizar:', this.returnTotalBasePrice)
    const saleDetailsDiv = this.shadowRoot.querySelector('.sale-details')
    if (!data || !saleDetailsDiv) return

    const saleDate = new Date(data.saleDate)
    const formattedDate = saleDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })

    const saleContent = `
        <h2>Detalles de la Venta:</h2>
        <div class="detalles-caja">
            <div class="datos"><p><strong>Cliente:</strong></p><p>${data.customerId}</p></div>
            <div class="datos"><p><strong>Referencia:</strong></p><p>${data.reference}</p></div>
            <div class="datos"><p><strong>Total:</strong></p><p>${data.totalBasePrice}€</p></div>
            <div class="datos"><p><strong>Fecha:</strong></p><p>${formattedDate}</p></div>
            <div class="datos"><p><strong>Tiempo:</strong></p><p>${data.saleTime}</p></div>
            <div class="datos"><p><strong>Devolución:</strong></p><p>${this.returnTotalBasePrice.toFixed(2)}€</p></div>
        </div>
    `
    saleDetailsDiv.innerHTML = saleContent
  }

  async getSaleDetails(saleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/sale-details?saleId=${saleId}`)
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la venta: ' + response.statusText)
      }
      const data = await response.json()

      const { totalBasePrice, returnId } = await this.getReturns(saleId)

      this.processSaleDetails(data, totalBasePrice)

      if (returnId) {
        await this.getReturnDetails(returnId)
      }

      this.renderSale(this.visualSaleElementData)
    } catch (error) {
      console.error('Error en getSaleDetails:', error)
    }
  }

  processSaleDetails(data, totalBasePrice) {
    this.saleDetailsData = data.rows
    this.returnTotalBasePrice = totalBasePrice
    this.populateSaleDetails()
  }

  populateSaleDetails() {
    const detailsContainer = this.shadow.querySelector('.product-details')
    detailsContainer.innerHTML = ''

    const titleElement = document.createElement('h2')
    titleElement.textContent = 'Detalles del Pedido:'
    detailsContainer.appendChild(titleElement)

    this.saleDetailsData.forEach((detail) => {
      const detallesCaja = document.createElement('div')
      detallesCaja.classList.add('detalles-caja')
      const { productName, basePrice, quantity } = detail

      const productDetail = document.createElement('div')
      productDetail.classList.add('datos')
      productDetail.innerHTML = `<p><strong>Producto:</strong></p><p> ${productName}</p>`
      detallesCaja.appendChild(productDetail)

      const quantityDetail = document.createElement('div')
      quantityDetail.classList.add('datos')
      quantityDetail.innerHTML = `<p><strong>Cantidad:</strong></p><p> ${quantity}</p>`
      detallesCaja.appendChild(quantityDetail)

      const priceDetail = document.createElement('div')
      priceDetail.classList.add('datos')
      priceDetail.innerHTML = `<p><strong>Precio:</strong></p><p> ${parseFloat(basePrice).toFixed(2)}€</p>`
      detallesCaja.appendChild(priceDetail)

      const totalDetail = document.createElement('div')
      totalDetail.classList.add('datos')
      totalDetail.innerHTML = `<p><strong>Total:</strong></p><p> ${(basePrice * quantity).toFixed(2)}€</p>`
      detallesCaja.appendChild(totalDetail)
      detailsContainer.appendChild(detallesCaja)
    })
  }

  async getReturns(saleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/returns?saleId=${saleId}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      if (data.rows && data.rows.length > 0) {
        const totalBasePrice = parseFloat(data.rows[0].totalBasePrice)
        const returnId = data.rows[0].id
        return { totalBasePrice, returnId }
      } else {
        return { totalBasePrice: 0, returnId: null }
      }
    } catch (error) {
      console.error('Error en getReturns:', error)
      return { totalBasePrice: 0, returnId: null }
    }
  }

  async getReturnDetails(returnId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/return-details?returnId=${returnId}`)
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la devolución: ' + response.statusText)
      }
      const data = await response.json()
      console.log('Datos de la devolución recibidos:', data)
      this.populateReturnDetails(data.rows)
    } catch (error) {
      console.error('Error en getReturnDetails:', error)
    }
  }

  populateReturnDetails(returnData) {
    const detailsContainer = this.shadow.querySelector('.return-details')
    detailsContainer.innerHTML = ''

    const titleElement = document.createElement('h2')
    titleElement.textContent = 'Detalles de la Devolución:'
    detailsContainer.appendChild(titleElement)

    returnData.forEach((detail) => {
      const detallesCaja = document.createElement('div')
      detallesCaja.classList.add('detalles-caja')

      const { productName, quantity, priceId } = detail
      const basePrice = this.basePricesMap[priceId] || 0

      const productDetail = document.createElement('div')
      productDetail.classList.add('datos')
      productDetail.innerHTML = `<p><strong>Producto:</strong> ${productName}</p>`
      detallesCaja.appendChild(productDetail)

      const quantityDetail = document.createElement('div')
      quantityDetail.classList.add('datos')
      quantityDetail.innerHTML = `<p><strong>Cantidad:</strong> ${quantity}</p>`
      detallesCaja.appendChild(quantityDetail)

      const priceDetail = document.createElement('div')
      priceDetail.classList.add('datos')
      priceDetail.innerHTML = `<p><strong>Precio:</strong> ${parseFloat(basePrice).toFixed(2)}€</p>`
      detallesCaja.appendChild(priceDetail)

      const totalDetail = document.createElement('div')
      totalDetail.classList.add('datos')
      totalDetail.innerHTML = `<p><strong>Total:</strong> ${(basePrice * quantity).toFixed(2)}€</p>`
      detallesCaja.appendChild(totalDetail)

      detailsContainer.appendChild(detallesCaja)
    })
  }
}

customElements.define('sale-controller-component', SaleController)
