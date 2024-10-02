import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class Form extends HTMLElement {
  constructor () {
    super()
    this.unsubscribe = null
    this.formElementData = null
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/companies`
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data

        this.formElementData ? this.showElement(this.formElementData) : this.resetForm()
      }
    })

    this.render()
  }

  render () {
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
      }
      .form-element {
        display: grid;
        gap: 0.5rem;
      }
      .form-element label {
        font-weight: bold;
      }
      .form-element input {
        width: 100%;
        padding: 0.5rem;
        background-color: #476bb9;
        color: white;
        border-right: 1px solid #476bb9;
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
            <div class="button_reset">
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
            <input type="hidden" name="id">
            <div class="form-element">
              <div class="form-element-label">
                <label for="commercialName">Nombre</label>
              </div>
              <div class="form-element-input">
                <input type="text" name="commercialName" id="commercialName">
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="vatNumber">NIF</label>
              </div>
              <div class="form-element-input">
                <input type="text" name="vatNumber" id="vatNumber">
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="commercialAddress">Dirección comercial</label>
              </div>
              <div class="form-element-input">
                <input type="text" name="commercialAddress" id="commercialAddress">
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="fiscalAddress">Dirección fiscal</label>
              </div>
              <div class="form-element-input">
                <input type="text" name="fiscalAddress" id="fiscalAddress">
              </div>
            </div>
          </div>
         
        </form>
      </section>
      `
    this.setupEventListeners()
    this.tabsButton()
  }

  setupEventListeners () {
    this.shadow.querySelector('.button_reset').addEventListener('click', () => {
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

  tabsButton () {
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

  showElement (element) {
    this.resetForm()
    Object.entries(element).forEach(([key, value]) => {
      const input = this.shadow.querySelector(`[name="${key}"]`)
      if (input) {
        input.value = value
      }
    })
  }
}

customElements.define('companies-form-component', Form)
