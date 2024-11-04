import { store } from '../redux/store.js'
import isEqual from 'lodash-es/isEqual'

class SaleController extends HTMLElement {
  constructor() {
    super()
    this.unsubscribe = null
    this.visualSaleElementData = null
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/sales`
  }

  connectedCallback() {
    document.addEventListener('showtablemodal', this.handleMessage.bind(this))
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()
      console.log('Estado actual de Redux:', currentState)
      if (currentState.crud.visualSaleElement &&
          !isEqual(this.visualSaleElementData, currentState.crud.visualSaleElement.data)) {
        this.visualSaleElementData = currentState.crud.visualSaleElement.data

        console.log('Datos de visualSaleElement:', this.visualSaleElementData)
        this.visualSaleElementData ? this.showElement(this.visualSaleElementData) : this.resetForm()
      }
    })
    this.render()
  }

  disconnectedCallback() {
    document.removeEventListener('showtablemodal', this.handleMessage.bind(this))
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
        .form {
          display: grid;
          gap: 1rem;
        }
        .tabs {
          display: flex;
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: grid;
          gap: 1rem;
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
        .tabs ul li.active {
          background-color: hsl(272, 40%, 35%);
          color: white;
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
        .validation-errors {
          background-color: hsl(0, 93%, 66%);
          display: none;
          margin-bottom: 1rem;
          padding: 1rem;
        }
        .validation-errors.active {
          display: block;
        }
        .validation-errors ul {
          margin: 0;
          padding: 0;
        }
        .validation-errors li {
          color: hsl(0, 0%, 100%);
          font-weight: 600;
        }
        .editer input {
          width: 96%;
          padding: 0.5rem;
          background-color: rgb(90, 14, 90);
        }
        .categori-button {
          background-color: white;
          border: 0;
          padding: 0 0.5rem;
          display: flex;
        }
        .header-categori .categori-button svg {
          fill: hsl(229, 86%, 41%);
        }
         form {
          display: grid;
          flex-direction: column;
          gap: 1rem; 
        } 
        .saless{
          display: flex;
          gap:1rem;
          flex-direction: column;
        }
        .objects-container{
          display:flex;
          gap:1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem; 
          box-sizing: border-box;
        }
        input {
          background-color: #476bb9;
          color: white;
          border: 1px solid #476bb9;
          padding: 0.5rem;
          border-radius: 4px; 
        }
        select {
          background-color: #476bb9;
          color: white;
          border-right: 1px solid #476bb9;
          padding: 0.5rem;
        }
        .categori-button svg {
          width: 40px;
          height: 40px;
          padding: 0;
        }
        .product-details {
          display: flex;          
          flex-direction: column; 
          gap: 1rem;   
        }
        .detail-item {
          display: flex; 
          border-radius: 5px; 
        }
        .form-group {
          display: flex;
          flex-direction: column; 
          width: 100%;
        }
        .detail-content {
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 0.5rem; 
          width: 100%;
        }
        </style>
        <div class="filter-modal">
          <section class="form">
          <div class="header-categori">
            <div class="tabs">
              <ul>
                <li class="tab active" data-tab="general">General</li>
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
          <div class="validation-errors">
            <ul></ul>
          </div>
          <form>
            <div class="tab-content active " data-tab="general">
              <input type="hidden" name="id" value="">
              <div class=""></div>
              <div class="product-details"></div>
              <div class="return-details"></div>
            </div>
          </form>
        </section>
      </div>
    `
    this.setupEventListeners()
    this.tabsButton()
    this.getBasePrices()
  }

  showElement(element) {
    console.log('Elemento recibido en showElement:', element)
    console.log('Valor de totalReturnPrice en showElement:', element.totalReturnPrice)

    this.resetForm()
    const formContainer = this.shadow.querySelector('.tab-content[data-tab="general"]')
    this.clearDynamicFields(formContainer)

    const salesContainer = this.createSalesContainer(element)
    formContainer.insertBefore(salesContainer, this.shadow.querySelector('.product-details'))

    this.getSaleDetails(element.id)
    this.getReturns(element.id)

    this.renderTotalReturnPrice(salesContainer, element.totalReturnPrice)
  }

  clearDynamicFields(container) {
    container.querySelectorAll('.dynamic-field').forEach(field => field.remove())
  }

  renderTotalReturnPrice(container, totalReturnPrice) {
    if (totalReturnPrice !== undefined) {
      console.log('Renderizando totalReturnPrice con valor:', totalReturnPrice)
      container.appendChild(this.createFieldContainer('totalReturnPrice', totalReturnPrice.toFixed(2)))
    } else {
      console.log('totalReturnPrice no está definido en element.')
    }
  }

  createSalesContainer(element) {
    const salesContainer = document.createElement('div')
    salesContainer.classList.add('saless')

    const titleElement = document.createElement('h2')
    titleElement.textContent = 'Detalles de la Compra'
    salesContainer.appendChild(titleElement)

    const objectsContainer = document.createElement('div')
    objectsContainer.classList.add('objects-container')

    this.populateSalesDetails(objectsContainer, element)
    salesContainer.appendChild(objectsContainer)

    return salesContainer
  }

  populateSalesDetails(container, element) {
    const keysToShow = ['saleDate', 'saleTime', 'customerId', 'reference', 'totalBasePrice', 'totalReturnPrice']

    keysToShow.forEach(key => {
      if (key in element) {
        const fieldContainer = this.createFieldContainer(key, element[key])
        container.appendChild(fieldContainer)
      }
    })
  }

  createFieldContainer(key, value) {
    const fieldContainer = document.createElement('div')
    fieldContainer.classList.add('field', 'dynamic-field')

    const innerContainer = document.createElement('div')
    innerContainer.classList.add('inner-field')

    const label = document.createElement('label')
    label.setAttribute('for', key)
    label.textContent = this.getFieldLabel(key)
    innerContainer.appendChild(label)

    const input = document.createElement('input')
    input.type = typeof value === 'number' ? 'number' : 'text'
    input.id = key
    input.name = key
    input.value = value
    input.readOnly = true
    innerContainer.appendChild(input)

    fieldContainer.appendChild(innerContainer)
    return fieldContainer
  }

  getFieldLabel(key) {
    const labels = {
      saleDate: 'Fecha de Venta',
      saleTime: 'Hora de Venta',
      customerId: 'ID de Cliente',
      reference: 'Referencia',
      totalBasePrice: 'Total',
      totalReturnPrice: 'Total de Devolución'
    }
    return labels[key] || key
  }

  async getSaleDetails(saleId) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/sale-details?saleId=${saleId}`)
    const data = await response.json()
    this.processSaleDetails(data)
  }

  processSaleDetails(data) {
    this.saleDetailsData = data.rows
    this.populateSaleDetails()
  }

  populateSaleDetails() {
    const detailsContainer = this.shadow.querySelector('.product-details')
    detailsContainer.innerHTML = ''

    const titleElement = document.createElement('h2')
    titleElement.textContent = 'Detalles del Pedido'
    detailsContainer.appendChild(titleElement)

    this.saleDetailsData.forEach((detail) => {
      const { productName, basePrice, quantity } = detail

      const detailDiv = document.createElement('div')
      detailDiv.classList.add('detail-item')

      const detailContent = document.createElement('div')
      detailContent.classList.add('detail-content')

      const productGroup = document.createElement('div')
      productGroup.classList.add('form-group')
      const productLabel = document.createElement('label')
      productLabel.textContent = 'Producto:'
      productGroup.appendChild(productLabel)

      const productInput = document.createElement('input')
      productInput.type = 'text'
      productInput.value = productName
      productInput.readOnly = true
      productGroup.appendChild(productInput)

      detailContent.appendChild(productGroup)

      const quantityGroup = document.createElement('div')
      quantityGroup.classList.add('form-group')
      const quantityLabel = document.createElement('label')
      quantityLabel.textContent = 'Cantidad:'
      quantityGroup.appendChild(quantityLabel)

      const quantityInput = document.createElement('input')
      quantityInput.type = 'number'
      quantityInput.value = quantity
      quantityInput.readOnly = true
      quantityGroup.appendChild(quantityInput)

      detailContent.appendChild(quantityGroup)
      const priceGroup = document.createElement('div')
      priceGroup.classList.add('form-group')
      const priceLabel = document.createElement('label')
      priceLabel.textContent = 'Precio:'
      priceGroup.appendChild(priceLabel)

      const priceInput = document.createElement('input')
      priceInput.type = 'text'
      priceInput.value = basePrice
      priceInput.readOnly = true
      priceGroup.appendChild(priceInput)

      detailContent.appendChild(priceGroup)

      const totalGroup = document.createElement('div')
      totalGroup.classList.add('form-group')
      const totalLabel = document.createElement('label')
      totalLabel.textContent = 'Total:'
      totalGroup.appendChild(totalLabel)

      const totalInput = document.createElement('input')
      totalInput.type = 'text'
      totalInput.value = (basePrice * quantity).toFixed(2)
      totalInput.readOnly = true
      totalGroup.appendChild(totalInput)

      detailContent.appendChild(totalGroup)

      detailDiv.appendChild(detailContent)
      detailsContainer.appendChild(detailDiv)
    })
  }

  async getReturns(saleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/returns?saleId=${saleId}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('Datos de devoluciones recibidos:', data)

      this.processReturns(data)
    } catch (error) {
      console.error('Error fetching returns:', error)
    }
  }

  processReturns(data) {
    let totalReturnPrice = 0

    if (data && data.rows && data.rows.length > 0) {
      data.rows.forEach(returnItem => {
        const returnId = returnItem.id

        totalReturnPrice += returnItem.totalBasePrice || 0

        this.getReturnDetails(returnId)
      })

      console.log('totalReturnPrice calculado:', totalReturnPrice)
      this.visualSaleElementData = this.visualSaleElementData || {}
      this.visualSaleElementData.totalReturnPrice = totalReturnPrice
    } else {
      this.visualSaleElementData.totalReturnPrice = 0
    }

    console.log('Antes de llamar a showElement en processReturns:', this.visualSaleElementData)
    this.showElement(this.visualSaleElementData)
  }

  async getReturnDetails(returnId) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/return-details?returnId=${returnId}`)
    const data = await response.json()
    this.populateReturnDetails(data.rows)
  }

  populateReturnDetails(returnData) {
    const detailsContainer = this.shadow.querySelector('.return-details')
    detailsContainer.innerHTML = ''

    const titleElement = document.createElement('h2')
    titleElement.textContent = 'Detalles de la Devolución'
    detailsContainer.appendChild(titleElement)

    returnData.forEach((detail) => {
      const { productName, productId, quantity } = detail

      const basePrice = this.basePricesMap[productId] || 0
      const returnTotal = (basePrice * quantity).toFixed(2)

      const detailDiv = document.createElement('div')
      detailDiv.classList.add('detail-item')

      const detailContent = document.createElement('div')
      detailContent.classList.add('detail-content')

      const productGroup = document.createElement('div')
      productGroup.classList.add('form-group')
      const productLabel = document.createElement('label')
      productLabel.textContent = 'Producto:'
      productGroup.appendChild(productLabel)

      const productInput = document.createElement('input')
      productInput.type = 'text'
      productInput.value = productName
      productInput.readOnly = true
      productGroup.appendChild(productInput)

      detailContent.appendChild(productGroup)

      const quantityGroup = document.createElement('div')
      quantityGroup.classList.add('form-group')
      const quantityLabel = document.createElement('label')
      quantityLabel.textContent = 'Cantidad:'
      quantityGroup.appendChild(quantityLabel)

      const quantityInput = document.createElement('input')
      quantityInput.type = 'number'
      quantityInput.value = quantity
      quantityInput.readOnly = true
      quantityGroup.appendChild(quantityInput)

      detailContent.appendChild(quantityGroup)

      const basePriceGroup = document.createElement('div')
      basePriceGroup.classList.add('form-group')
      const basePriceLabel = document.createElement('label')
      basePriceLabel.textContent = 'Total:'
      basePriceGroup.appendChild(basePriceLabel)

      const basePriceInput = document.createElement('input')
      basePriceInput.type = 'text'
      basePriceInput.value = `${returnTotal} €`
      basePriceInput.readOnly = true
      basePriceGroup.appendChild(basePriceInput)

      detailContent.appendChild(basePriceGroup)

      detailDiv.appendChild(detailContent)
      detailsContainer.appendChild(detailDiv)
    })
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

  setupEventListeners() {
    this.shadow.querySelector('.button-reset').addEventListener('click', () => {
      this.resetForm()
    })
  }

  resetForm = () => {
    this.shadow.querySelector('.validation-errors').classList.remove('active')
    const errorList = this.shadow.querySelector('.validation-errors ul')
    errorList.innerHTML = ''
    this.shadow.querySelectorAll('input.error').forEach(input => {
      input.classList.remove('error')
    })
    this.shadow.querySelector('form').reset()
    this.shadow.querySelector("[name='id']").value = ''
    const detailsContainer = this.shadow.querySelector('.product-details')
    detailsContainer.innerHTML = ''
  }

  tabsButton() {
    this.shadow.querySelector('.form').addEventListener('click', async (event) => {
      if (event.target.closest('.tab')) {
        const tab = event.target.closest('.tab')

        if (!tab.classList.contains('active')) {
          this.shadow.querySelector('.tab.active').classList.remove('active')
          tab.classList.add('active')
          this.shadow.querySelector('.tab-content.active').classList.remove('active')
          this.shadow.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active')
        }
      }
    })
  }
}
customElements.define('sale-controller-component', SaleController)
