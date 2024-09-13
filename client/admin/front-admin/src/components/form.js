import isEqual from 'lodash-es/isEqual'
import { store } from '../redux/store.js'
import { refreshTable } from '../redux/crud-slice.js'

class Form extends HTMLElement {
  constructor () {
    super()
    this.unsubscribe = null
    this.formElementData = null
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/users`
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }
    })

    this.render()
  }

  render () {
    this.shadow.innerHTML =/* html */ `
      <style>
        a{
          text-decoration: none;
          color: inherit;
        }
        ul{
          list-style: none;
          margin: 0;
          padding: 0;
          display:flex;
        }
        .form{
          display:grid;
          gap:1rem;
        }
        .categori_list   {
          display:flex;
          background-color:white;
          width:100%;
        }
        .header_categori {
          display:flex;
          justify-content:space-between;
        }
        .header_categori li {
          background-color: rgb(90, 14, 90);
          padding: 0 1rem;
          align-content: center;
        }
        .editer input {
          width: 96%;
          padding: 0.5rem;
          background-color: rgb(90, 14, 90);
        }
        .categori_button {
          background-color: white;
          border: 0;
          padding: 0 0.5rem;
          display:flex;
        }
        .header_categori .categori_button svg {
          fill: hsl(229, 86%, 41%);
        }
        form {
          width: 100%;
          display: flex;
          box-sizing: border-box;
          gap: 1rem;
        }
        .name,.email {
          flex: 1;
          display:grid;
          gap:0.5rem;
        }
          .email input,
          .name input {
          background-color: #476bb9;
          color: white;
          border-right: 1px solid #476bb9;
          padding:0.5rem;
        }
        .categori_button svg {
          width: 40px;
          height: 40px;
          padding: 0;
        }
      </style>
      <section class="form">
        <div class="header_categori">
          <div class="categori_list" >
            <ul>
              <li>General</li>
            
            </ul>
          </div>
          <div class="categori_button">
            <div class="button_reset">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" /></svg>
            </div>
            <div class="button_save">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" /></svg>
            </div>
          </div>
        </div>
        <form >
          <input type="hidden" name="id">
          <div class="name">
            <label>Nombre</label>
            <input type="text" name="name" >
          </div>
          <div class="email">
            <label >Email</label>
            <input type="email" name="email">
          </div>
        </form>
      </section>
      `
    this.button_save()
    this.button_reset()
  }

  button_reset () {
    this.shadow.querySelector('.button_reset').addEventListener('click', async (event) => {
      const form = this.shadow.querySelector('form')
      form.reset()
      this.shadow.querySelector("[name='id']").value = ''
    })
  }

  button_save () {
    this.shadow.querySelector('.button_save').addEventListener('click', async (event) => {
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

        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: 'Datos guardados correctamente',
            type: 'success'
          }
        }))
        store.dispatch(refreshTable(this.endpoint))
        this.shadow.querySelector("[name='id']").value = ''
        form.reset()
      } catch {
        console.error(error)
      }
    })
  }

  showElement = async element => {
    Object.entries(element).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        this.shadow.querySelector(`[name="${key}"]`).value = value
      }
    })
  }
}

customElements.define('form-component', Form)
