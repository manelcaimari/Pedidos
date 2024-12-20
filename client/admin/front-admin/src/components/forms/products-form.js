import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class Form extends HTMLElement {
  constructor() {
    super()
    this.unsubscribe = null
    this.formElementData = null
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/products`
  }

  connectedCallback() {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data

        if (this.formElementData) {
          this.showElement(this.formElementData)
        } else {
          this.resetForm()
        }
      }
    })

    this.render()
  }

  render() {
    this.shadow.innerHTML =/* html */ `
      <style>
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
          display: flex;
          flex-direction: column;
          gap: 1rem; 
        } 

        .field {
          display: grid;
          gap: 0.5rem; 
          box-sizing: border-box;
          flex: 1 1 calc(50% - 1rem); 
        }
         input {
          background-color: #476bb9;
          color: white;
          border-right: 1px solid #476bb9;
          padding: 0.5rem;
        }
        select{
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
        
      </style>
      <section class="form">
        <div class="header-categori">
          <div class="tabs">
            <ul>
              <li class="tab active" data-tab="general">General</li>
              
            </ul>
          </div>
          <div class="categori-button">
            <div class="button-reset">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" /></svg>
            </div>
            <div class="button-save">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" /></svg>
            </div>
          </div>
        </div>
        <div class="validation-errors">
          <ul></ul>
        </div>
        <form>
          <div class="tab-content active" data-tab="general">
            <input type="hidden" name="id" value="">
            <div class="field">
              <label for="categoryId">Categoria</label>                
              <select name="productCategoryId"><option ></option></select>
            </div>   
            <div class="field">
              <label for="name">Nombre</label>
              <input type="text" id="name" name="name" >
            </div>
            <div class="field">
              <label for="reference">Referencia</label>
              <input type="text" id="reference" name="reference" >
            </div>
            <div class="field">
              <label for="precio">Precio</label>
              <input type="number" id="precio" name="basePrice">
            </div>
            <div class="field">
              <label for="units">Unidades</label>
              <input type="number" id="units" name="units" required min="1">
            </div>
            <div class="field">
              <label for="measurementUnit">Unidad de Medida</label>
              <select type="text" id="measurementUnit" name="measurementUnit" >
                <option value="gr">gr</option>
                <option value="ml">ml</option>
                <option value="ud">ud</option>
              </select>
            </div>
            <div class="field">
              <label for="measurement">Medida</label>
              <input type="number" id="measurement" name="measurement" required min="0">
            </div>
            <div class="field">
              <label for="visible">Visible</label>
              <select id="visible" name="visible" required>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div> 
        </form>
      </section>
      `
    this.getPrices()
    this.getProductCategories()
    this.setupEventListeners()
    this.tabsButton()
  }

  async getProductCategories(selectedCategoryId = null) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/product-categories`)
    this.productCategories = await response.json()

    const select = this.shadow.querySelector('[name="productCategoryId"]')

    select.innerHTML = ''

    this.productCategories.rows.forEach(category => {
      if (category.name) {
        const option = document.createElement('option')
        option.value = category.id
        option.textContent = category.name
        if (selectedCategoryId && category.id === selectedCategoryId) {
          option.selected = true
        }

        select.appendChild(option)
      }
    })
  }

  async getPrices() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/prices`)
    this.pricesCategories = await response.json()

    const priceInput = this.shadow.querySelector('[name="basePrice"]')

    if (this.pricesCategories.rows.length > 0) {
      const firstPrice = this.pricesCategories.rows[0]

      priceInput.value = firstPrice.id
      priceInput.setAttribute('placeholder', `Precio: ${firstPrice.name}`)
    }
  }

  setupEventListeners() {
    this.shadow.querySelector('.button-reset').addEventListener('click', () => {
      this.resetForm()
    })

    this.shadow.querySelector('.button-save').addEventListener('click', async (event) => {
      event.preventDefault()
      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }
      if (!formDataJson.productCategoryId) {
        alert('Por favor, selecciona una categoría de producto válida.')
        return
      }

      const method = formDataJson.id ? 'PUT' : 'POST'
      const endpoint = formDataJson.id ? `${this.endpoint}/${formDataJson.id}` : this.endpoint
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataJson)
        })

        if (response.status === 500 || response.status === 422) {
          throw response
        }

        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: 'Datos guardados correctamente',
            type: 'success'
          }
        }))
        store.dispatch(refreshTable(this.endpoint))
        this.resetForm()
      } catch (error) {
        const data = await error.json()

        if (error.status === 500) {
          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: data.message
            }
          }))
        }

        if (error.status === 422) {
          const validationErrorsDiv = this.shadow.querySelector('.validation-errors')
          const errorList = validationErrorsDiv.querySelector('ul')

          errorList.innerHTML = ''

          validationErrorsDiv.classList.add('active')

          this.shadow.querySelectorAll('input.error').forEach(input => {
            input.classList.remove('error')
          })

          data.message.forEach(errorMessage => {
            const input = this.shadow.querySelector(`[name='${errorMessage.path}']`)

            if (input) {
              input.classList.add('error')
            }

            const li = document.createElement('li')
            li.textContent = errorMessage.message
            errorList.appendChild(li)
          })
        }
      }
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

  showElement = async element => {
    this.resetForm()
    if (element.productCategoryId) {
      await this.getProductCategories(element.productCategoryId)
    } else {
      await this.getProductCategories()
    }
    Object.entries(element).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        const formElement = this.shadow.querySelector(`[name="${key}"]`)
        if (formElement.tagName.toLowerCase() === 'input') {
          if (formElement.type === 'radio') {
            const radioButton = this.shadow.querySelector(`[name="${key}"][value="${value}"]`)
            if (radioButton) {
              radioButton.checked = true
            }
          } else if (formElement.type === 'checkbox') {
            formElement.checked = !!value
          } else {
            formElement.value = value
          }
        }
        if (formElement.tagName.toLowerCase() === 'select') {
          formElement.querySelectorAll('option').forEach(option => {
            if (option.value === value) {
              option.selected = true
            }
          })
        }
        if (formElement.tagName.toLowerCase() === 'textarea') {
          formElement.value = value
        }
      }
    })
  }
}

customElements.define('products-form-component', Form)
