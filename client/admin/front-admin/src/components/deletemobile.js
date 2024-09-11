class deletemobile extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    this.render()
    this.showModal()
    this.addEventListeners()
  }

  showModal () {
    const modal = this.shadow.getElementById('myModal')
    modal.style.display = 'block'
  }

  addEventListeners () {
    const saveBtn = this.shadow.getElementById('saveBtn')
    const deleteBtn = this.shadow.getElementById('deleteBtn')
    const modal = this.shadow.getElementById('myModal')

    saveBtn.addEventListener('click', () => {
      alert('Guardado!')
      modal.style.display = 'none'
    })

    deleteBtn.addEventListener('click', () => {
      alert('Borrado!')
      modal.style.display = 'none'
    })
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
       <style>
       .modal {
          display: none; 
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5); 
        }
        
        .modal-content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 300px;
          text-align: center;
        }

        .modal-button {
          margin: 10px;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        .save-button {
          background-color: #4CAF50;
          color: white;
        }

        .delete-button {
          background-color: #f44336;
          color: white;
        }
       </style>
       <div id="myModal" class="modal">
        <div class="modal-content">
          <p>¿Deseas guardar o borrar?</p>
          <button class="modal-button save-button" id="saveBtn">Guardar</button>
          <button class="modal-button delete-button" id="deleteBtn">Borrar</button>
        </div>
    </div>
      `
  }
}
customElements.define('deletemobile-component', deletemobile)
