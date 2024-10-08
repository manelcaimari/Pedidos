import { store } from '../redux/store.js'
import { refreshTable, showFormElement } from '../redux/crud-slice.js'

class DeleteModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    document.addEventListener('showDeleteModal', this.handleShowDeleteModal.bind(this))
    this.render()
  }

  handleShowDeleteModal (event) {
    this.endpoint = event.detail.endpoint
    this.element = event.detail.element
    this.shadow.querySelector('.register').classList.add('visible')
  }

  render () {
    this.shadow.innerHTML = /* html */ `
      <style>
        .register {
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

        .register.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .register-content {
          background-color: #fefefe;
          padding: 20px;
          border: 1px solid #888;
          width: 300px;
          text-align: center;
        }
        .register-content p {
          color: black;
        }
        .buttons {
          display: flex;
          justify-content: center;
        }
        .delete-button, .cancel-button {
          margin: 10px;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .delete-button {
          background-color: #4CAF50;
          color: white;
        }
        .delete-button:hover {
          background-color: #45a049;
        }
        .cancel-button {
          background-color: #f44336;
          color: white;
        }
        .cancel-button:hover {
          background-color: #e53935;
        }
       
      </style>
      <div class="register ">
        <div class="register-content">
          <p>¿Deseas eliminar el registro?</p>
          <div class="buttons">
            <button class="delete-button">Eliminar</button>
            <button class="cancel-button">Cancelar</button>
          </div>
        
        </div>
      </div>
    `
    const deleteButton = this.shadow.querySelector('.delete-button')
    const cancelButton = this.shadow.querySelector('.cancel-button')
    const register = this.shadow.querySelector('.register')

    deleteButton.addEventListener('click', async () => {
      const response = await fetch(this.element, {
        method: 'DELETE'
      })
      store.dispatch(refreshTable(this.endpoint))

      const formElement = {
        data: null
      }

      store.dispatch(showFormElement(formElement))
      if (response.ok) {
        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: 'Registro eliminado correctamente'
          }
        }))
        this.shadow.querySelector('.register').classList.remove('visible')
      }
    })

    register.classList.remove('visible')
    cancelButton.addEventListener('click', () => {
      register.classList.remove('visible')
    })
  }
}

customElements.define('deletemodal-component', DeleteModal)
