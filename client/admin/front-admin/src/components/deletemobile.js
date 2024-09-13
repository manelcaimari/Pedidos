class DeleteMobile extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
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
        }

        .register.visible {
          opacity: 1;
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
        .buttons{
          display:flex;
          justify-content:center;
        }
        .saveBtn, .deleteBtn {
          margin: 10px;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .saveBtn {
          background-color: #4CAF50;
          color: white;
        }
        .saveBtn:hover {
          background-color: #45a049;
        }
        .deleteBtn {
          background-color: #f44336;
          color: white;
        }
        .deleteBtn:hover {
          background-color: #e53935;
        }  
      </style>
        <div class="register">
          <div class="register-content">
            <p>¿Deseas eliminar el registro ?</p>
            <div class="buttons">
              <button class="saveBtn">si</button>
              <button class="deleteBtn">no</button>
            </div>
          </div>
        </div>
    `
    this.checkVisibility(true)
    this.addEventListeners()
  }

  checkVisibility (show) {
    const modal = this.shadow.querySelector('.register')
    if (show) {
      modal.classList.add('visible')
    } else {
      modal.classList.remove('visible')
    }
  }

  addEventListeners () {
    const saveBtn = this.shadow.querySelector('.saveBtn')
    const deleteBtn = this.shadow.querySelector('.deleteBtn')

    saveBtn.addEventListener('click', () => {
      alert('Guardado')
      this.checkVisibility(false)
    })

    deleteBtn.addEventListener('click', () => {
      alert('Borrado')
      this.checkVisibility(false)
    })
  }
}

customElements.define('deletemobile-component', DeleteMobile)
