import isEqual from 'lodash-es/isEqual'
import { store } from '../redux/store.js'
import { showFormElement } from '../redux/crud-slice.js'

class Table extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
    this.unsubscribe = null
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/users`
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(async () => {
      const currentState = store.getState()

      if (currentState.crud.tableEndpoint && isEqual(this.endpoint, currentState.crud.tableEndpoint)) {
        await this.loadData()
        await this.render()
      }
    })

    await this.loadData()
    await this.render()
  }

  async loadData () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`)
    this.data = await response.json()
  }

  render () {
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
        .filter-button{
          background-color:white;
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
        .table-footer {
          background-color: white; 
          padding: 10px;
        }
        .table-info-registers span{
          color:black;
        }
      </style>
      <section class="table">
        <div class="table-header">
          <div class="table-header-buttons">
            <ul>
              <li class="filter-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>     
              </li>
            </ul>
          </div>
        </div>
        <div class="table-body">
        </div>
        <div class="table-footer">
          <div class="table-info-registers">
            <span>1 registro en total, mostrando 10 por página</span>
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
      editLi.className = 'edit-button'
      editLi.dataset.id = customer.id
      editLi.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg>'

      const deleteLi = document.createElement('li')
      deleteLi.className = 'delete-button'
      deleteLi.dataset.id = customer.id
      deleteLi.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>'

      ulButtons.appendChild(editLi)
      ulButtons.appendChild(deleteLi)
      buttonsDiv.appendChild(ulButtons)

      const dataDiv = document.createElement('div')
      dataDiv.className = 'table-register-data'

      const ulData = document.createElement('ul')

      let elementItemList = document.createElement('li')
      elementItemList.textContent = `nombre: ${customer.name}`
      ulData.appendChild(elementItemList)

      elementItemList = document.createElement('li')
      elementItemList.textContent = `email: ${customer.email}`
      ulData.appendChild(elementItemList)

      elementItemList = document.createElement('li')
      elementItemList.textContent = `creado : ${customer.createdAt}`
      ulData.appendChild(elementItemList)

      dataDiv.appendChild(ulData)

      registerDiv.appendChild(buttonsDiv)
      registerDiv.appendChild(dataDiv)

      fragment.appendChild(registerDiv)
    })
    tableBody.appendChild(fragment)

    this.renderRegisterButtons()
    this.renderFilterButton()
  }

  
  renderFilterButton() {
    const filterButton = this.shadow.querySelector('.filter-button')
    filterButton.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('showFilterModal'))
    })
  }
  

  async renderRegisterButtons () {
    this.shadow.querySelector('.table-body').addEventListener('click', async (event) => {
      if (event.target.closest('.edit-button')) {
        const id = event.target.closest('.edit-button').dataset.id
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`)
        const data = await response.json()

        const formElement = {
          data
        }

        store.dispatch(showFormElement(formElement))
      }
      if (event.target.closest('.delete-button')) {
        const deleteButton = event.target.closest('.delete-button')
        const element = `${this.endpoint}/${deleteButton.dataset.id}`

        document.dispatchEvent(new CustomEvent('showDeleteModal', {
          detail: {
            endpoint: this.endpoint,
            element
          }
        }))
      }
    })
  }
}
customElements.define('table-component', Table)
