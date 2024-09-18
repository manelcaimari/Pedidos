import { store } from '../redux/store.js'
import { refreshTable } from '../redux/crud-slice.js'

class FilterButton extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = `${import.meta.env.VITE_API_URL}/api/admin/users` // Define el endpoint
  }

  connectedCallback() {
    document.addEventListener('showFilterModal', this.handleMessage.bind(this))
    this.render()
  }

  handleMessage(event) {
    this.shadow.querySelector('.filter-modal').classList.add('visible')
  }

  render() {
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

        .buttons {
          display: flex;
          justify-content: center;
        }

        .apply-filter, .cancel-button {
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

        .cancel-button {
          background-color: #f44336;
          color: white;
        }

        .cancel-button:hover {
          background-color: #e53935;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
        }

        .input-field label {
          margin-bottom: 5px;
          font-weight: bold;
        }

        .input-field input {
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      </style>

      <div class="filter-modal">
        <div class="filter-content">
          <p>Filtrar registros</p>

          <!-- Formulario de Filtros -->
          <form id="filter-form">
            <input type="hidden" name="id">

            <div class="name input-field">
              <label for="name">Nombre</label>
              <input type="text" id="name" name="name" placeholder="Nombre">
            </div>

            <div class="email input-field">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="example@gmail.com">
            </div>

            <div class="buttons">
              <button type="button" class="apply-filter">Aplicar Filtro</button>
              <button type="button" class="cancel-button">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `

    const applyFilterButton = this.shadow.querySelector('.apply-filter')
    const cancelButton = this.shadow.querySelector('.cancel-button')
    const filterModal = this.shadow.querySelector('.filter-modal')

    applyFilterButton.addEventListener('click', async () => {
    
      const form = this.shadow.querySelector('#filter-form')
      const formData = new FormData(form)
      
      const filters = {}
      formData.forEach((value, key) => {
        if (value) filters[key] = value.trim() 
      })

     
      const response = await fetch(`${this.endpoint}?${new URLSearchParams(filters)}`)

    
      store.dispatch(refreshTable(this.endpoint))

    
      if (response.ok) {
        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: 'Filtro aplicado correctamente'
          }
        }))
        filterModal.classList.remove('visible')
      }
    })

    cancelButton.addEventListener('click', () => {
      filterModal.classList.remove('visible')
    })
  }
}

customElements.define('filterbutton-component', FilterButton)