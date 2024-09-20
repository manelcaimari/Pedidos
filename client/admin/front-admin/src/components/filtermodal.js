import { store } from '../redux/store.js'
import { applyFilter } from '../redux/crud-slice.js'

class FilterButton extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/users`
  }

  connectedCallback () {
    document.addEventListener('showFilterModal', this.handleMessage.bind(this))
    this.render()
  }

  disconnectedCallback () {
    document.removeEventListener('showFilterModal', this.handleMessage.bind(this))
  }

  handleMessage (event) {
    this.shadow.querySelector('.filter-modal').classList.add('visible')
  }

  render () {
    this.shadow.innerHTML = /* html */ `
      <style>
        .filter-modal {
          position: fixed;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }

        .filter-modal.visible {
          opacity: 1;
          visibility: visible;

        }

        .filter-content {
          background-color: #fefefe;
          padding: 20px;
          border: 1px solid #888;
          width: 300px;
          text-align: center;
        }
        .form-group{
         display:flex;
         gap:1rem;
        }
        .filter-content p {
          color: black;
        }

        .buttons {
          display: flex;
          justify-content: center;
        }

        .apply-filter, .reset-filter {
          margin: 10px;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s;
        }

        .apply-filter {
          background-color: #4CAF50;
          color: white;
        }

        .apply-filter:hover {
          background-color: #45a049;
        }

        .reset-filter {
          background-color: #f44336;
          color: white;
        }

        .reset-filter:hover {
          background-color: #e53935;
        }

        form {
          display: grid;
          background-color: white;
          width: 20rem;
          height: 10rem;
          justify-content: space-around;
          align-items: end;
          justify-items: end;

        }

        .filter-email, .filter-name {
          display: flex;
          margin-bottom: 10px;
        }

        label {
          margin-bottom: 5px;
          font-weight: bold;
          color: black;
        }

        input {
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      </style>

      <div class="filter-modal">
        <form class="filter-form">
          <div class="form-group">
            <label for="filter-name">Nombre:</label>
            <input type="text"  name="name">
          </div>
          <div class="form-group">
            <label for="filter-email">Email:</label>
            <input type="email" name="email">
          </div>
          <div class="form-actions">
            <button type="button" class="apply-filter">Aplicar</button>
            <button type="button" class="reset-filter">Cancelar</button>
          </div>
        </form>
      </div>
    `

    this.shadow.querySelector('.reset-filter').addEventListener('click', () => {
      this.shadow.querySelector('.filter-modal').classList.remove('visible')
    })

    this.shadow.querySelector('.apply-filter').addEventListener('click', (event) => {
      event.preventDefault()
      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const queryString = Object.entries(formDataJson).map(([key, value]) => {
        return `${key}=${value}`
      }).join('&')

      store.dispatch(applyFilter(queryString))
      this.shadow.querySelector('.filter-modal').classList.remove('visible')
      form.reset()
    })
  }
}

customElements.define('filterbutton-component', FilterButton)
