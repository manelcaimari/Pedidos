import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { showVisualSaleElement, applyFilter } from '../../redux/crud-slice.js'

class Table extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
    this.unsubscribe = null
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/sales`
    this.queryString = null
    this.page = 1
  }

  async connectedCallback() {
    this.unsubscribe = store.subscribe(async () => {
      const currentState = store.getState()
      if (currentState.crud.tableEndpoint && isEqual(this.endpoint, currentState.crud.tableEndpoint)) {
        await this.loadData()
        await this.render()
      }
      if (!isEqual(this.queryString, currentState.crud.queryString)) {
        this.queryString = currentState.crud.queryString
        await this.loadData()
        await this.render()
      }
      if (currentState.crud.visualSaleElement || currentState.crud.saleDetails) {
        this.renderSale(currentState.crud.visualSaleElement || currentState.crud.saleDetails)
      }
    })

    await this.loadData()
    await this.render()
  }

  async loadData() {
    const endpoint = this.queryString ? `${this.endpoint}?${this.queryString}&page=${this.page}` : `${this.endpoint}?page=${this.page}`
    const response = await fetch(endpoint)
    this.data = await response.json()
  }

  render() {
    this.shadow.innerHTML =
      /* html */`
      <style>
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .table {
          display: grid;
          gap:1rem;
          height: 90vh;
          grid-template-rows: auto 1fr auto;
        }
        .table-header{
          background-color: hsl(0, 0%, 100%);
          padding: 0 0.5rem;
          position: relative;
          display: inline-block;
        }

        .filter-button, .filter-cancel-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .filter-button.active, .filter-cancel-button.active{
          display: block;
        }
        .table-body {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }
        .table-register {
          width: calc(98% - 30px);
          box-sizing: border-box;
          border: 0;
        }
        .table-register-buttons ul {
          display: flex;
          justify-content: right;
          background-color: #fff;
        }
        svg {
          fill: hsl(229, 86%, 41%);
          padding: 7px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height:40px;
          box-sizing: border-box;
          border: 0;
        }
        .table-register-data{
          display:grid;
          gap:4rem;
          border: 0;
          padding:0;
        }
        .table-register-data li{
          background-color: black;
        }
        .table-register-data li{
          font-size: 16px;
          font-weight: 600;
          padding:0.2rem;
          padding-left:0.5rem;
        }
        .table-footer{
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .table-info{
          background-color: hsl(0, 0%, 100%);
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          width: 100%;
          align-items: center
        }

        .table-info p{
          color: hsl(0, 0%, 29%);
          font-weight: 700;
          margin: 0;
        }
        .table-page-buttons{
          align-items: center;
          display: flex;
          gap: 0.5rem;
          align-items: baseline
        }

        .table-page-button{
          cursor: pointer;
          fill: hsl(225, 63%, 65%);
          height: 1.5rem;
          width: 1.5rem;
        }

        .current-page{
          align-items: flex-end;
          display: flex;
          height: 1.5rem;
          width: 4rem;
        }

        .current-page input{
          border: none;
          border-radius: 0.5rem;
          color: hsl(225, 63%, 65%);
          font-weight: 600;
          outline: none;
          text-align: center;
          width: 100%;
        }

        .current-page label{
          border: 1px solid  hsl(225, 63%, 65%);
          border-radius: 0.5rem;
          display: flex;
          gap: 0.2rem;
          padding: 0 0.2rem;
        }

        .current-page button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          padding: 0;
        }

        .current-page svg{
          fill: hsl(225, 63%, 65%);
          width: 1.5rem;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      </style>
      <section class="table">
        <div class="table-header">
          <div class="filter-button active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>
          </div>
          <div class="filter-cancel-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.57L21.83,13.76L23.24,15.17L20.43,18L23.24,20.83L21.83,22.24L19,19.4L16.17,22.24L14.76,20.83M12,12V19.88C12.04,20.18 11.94,20.5 11.71,20.71C11.32,21.1 10.69,21.1 10.3,20.71L8.29,18.7C8.06,18.47 7.96,18.16 8,17.87V12H7.97L2.21,4.62C1.87,4.19 1.95,3.56 2.38,3.22C2.57,3.08 2.78,3 3,3V3H17V3C17.22,3 17.43,3.08 17.62,3.22C18.05,3.56 18.13,4.19 17.79,4.62L12.03,12H12Z" /></svg>
          </div>
        </div>
        <div class="table-body">
        </div>
        <div class="table-footer">
          <div class="table-info">
            <div>
              <p>
                ${this.data.count} ${this.data.count === 1 ? 'registro' : 'registros'} en total, mostrando ${this.data.meta.size} por página
              </p>
            </div>
            <div class="table-page-buttons">
              <div class="table-page-button" data-page="1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.41,7.41L17,6L11,12L17,18L18.41,16.59L13.83,12L18.41,7.41M12.41,7.41L11,6L5,12L11,18L12.41,16.59L7.83,12L12.41,7.41Z" /></svg>
              </div>
              <div class="table-page-button" data-page="${this.data.meta.currentPage > 1 ? parseInt(this.data.meta.currentPage) - 1 : 1}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-left</title><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>
              </div>
              <div class="current-page">
                <label>
                  <input type="number" value="${this.data.meta.currentPage}">
                  <button class="go-to-page">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,10V14H13L9.5,17.5L11.92,19.92L19.84,12L11.92,4.08L9.5,6.5L13,10H4Z" /></svg>
                  </button>
                </label>
              </div>
              <div class="table-page-button" data-page="${parseInt(this.data.meta.currentPage) + 1 < this.data.meta.pages ? parseInt(this.data.meta.currentPage) + 1 : this.data.meta.pages}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-right</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
              </div>
              <div class="table-page-button" data-page="${this.data.meta.pages}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-double-right</title><path d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    `

    const tableBody = this.shadow.querySelector('.table-body')
    const fragment = document.createDocumentFragment()

    this.data.rows.forEach(customer => {
      const registerDiv = document.createElement('div')
      registerDiv.className = 'table-register'

      const buttonsDiv = document.createElement('div')
      buttonsDiv.className = 'table-register-buttons'

      const ulButtons = document.createElement('ul')

      const editLi = document.createElement('li')
      editLi.className = 'visual-button'
      editLi.dataset.id = customer.id
      editLi.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" /></svg>'

      ulButtons.appendChild(editLi)
      buttonsDiv.appendChild(ulButtons)

      const dataDiv = document.createElement('div')
      dataDiv.className = 'table-register-data'

      const ulData = document.createElement('ul')

      let elementItemList = document.createElement('li')
      elementItemList.textContent = `id: ${customer.id}`
      ulData.appendChild(elementItemList)

      elementItemList = document.createElement('li')
      elementItemList.textContent = `id del cliente: ${customer.customerId}`
      ulData.appendChild(elementItemList)

      elementItemList = document.createElement('li')
      elementItemList.textContent = `referencia: ${customer.reference}`
      ulData.appendChild(elementItemList)

      elementItemList = document.createElement('li')
      elementItemList.textContent = `total : ${customer.totalBasePrice}`
      ulData.appendChild(elementItemList)

      dataDiv.appendChild(ulData)

      registerDiv.appendChild(buttonsDiv)
      registerDiv.appendChild(dataDiv)

      fragment.appendChild(registerDiv)
    })
    tableBody.appendChild(fragment)

    this.rendervisualButton()
    this.renderRegisterButtons()
    this.renderFilterButton()
  }

  async renderFilterButton() {
    const filterButton = this.shadow.querySelector('.filter-button')
    const filterCancelButton = this.shadow.querySelector('.filter-cancel-button')

    filterButton.addEventListener('click', (e) => {
      document.dispatchEvent(new CustomEvent('showFilterModal'))
    })

    filterCancelButton.addEventListener('click', (e) => {
      store.dispatch(applyFilter(null))
      filterButton.classList.add('active')
      filterCancelButton.classList.remove('active')
    })
  }

  async rendervisualButton() {
    const visualButton = this.shadow.querySelector('.visual-button')

    visualButton.addEventListener('click', (e) => {
      document.dispatchEvent(new CustomEvent('showtablemodal'))
    })

    visualButton.classList.add('active')
  }

  async renderRegisterButtons() {
    this.shadow.querySelector('.go-to-page').addEventListener('click', async event => {
      const page = this.shadow.querySelector('.current-page input').value

      if (!page || page < 1 || page.includes('.') || page.includes(',')) {
        this.shadow.querySelector('.current-page input').value = this.page
      } else if (page > this.data.meta.pages) {
        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: `No se puede acceder a la página ${page}, solo hay ${this.data.meta.pages} ${this.data.meta.pages === 1 ? 'página disponible' : 'páginas disponibles'} `,
            type: 'error'
          }
        }))
        this.shadow.querySelector('.current-page input').value = this.page
      } else {
        this.page = page
        await this.loadData()
        await this.render()
      }
    })
    this.shadow.querySelector('.table').addEventListener('click', async (event) => {
      if (event.target.closest('.visual-button')) {
        const id = event.target.closest('.visual-button').dataset.id
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/sales/${id}`)
        const data = await response.json()

        const visualSaleElement = { data }
        store.dispatch(showVisualSaleElement(visualSaleElement))
      }
      if (event.target.closest('.table-page-button')) {
        const pageButton = event.target.closest('.table-page-button')
        this.page = pageButton.dataset.page
        await this.loadData()
        await this.render()
      }
      if (event.target.closest('.filter-button')) {
        document.dispatchEvent(new CustomEvent('showFilterModal'))
      }
      if (event.target.closest('.filter-cancel-button')) {
        const filterCancelButton = event.target.closest('.filter-cancel-button')
        const filterButton = this.shadow.querySelector('.filter-button')
        store.dispatch(applyFilter(null))
        filterButton.classList.add('active')
        filterCancelButton.classList.remove('active')
      }
    })
  }
}
customElements.define('sales-table-component', Table)
