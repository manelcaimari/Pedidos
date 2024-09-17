class FilterModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    document.addEventListener('showFilterModal', this.handleShowFilterModal.bind(this))
    this.render()
  }

  handleShowFilterModal (event) {
    this.shadow.querySelector('.filter-modal').classList.add('active')
  }

  render () {
    this.shadow.innerHTML =
      /* html */ `
        <style>
          *{
            box-sizing: border-box;
          }

          .filter-modal{
            align-items: center;
            background-color: hsla(0, 0%, 0%, 50%);
            display: flex;
            height: 100vh;
            justify-content: center;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            z-index: 5000;
            transition: opacity 0.3s;
            opacity: 0;
            visibility: hidden;
          }

          .filter-modal.active{
            opacity: 1;
            visibility: visible;
          }


          button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
          }

          .filter-form {
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            z-index: 1000;
            width: 20rem;
          }     
        </style>

        <div class="filter-modal">
          <form class="filter-form">
            <div class="form-group">
              <label for="filter-name">Nombre:</label>
              <input type="text" id="filter-name" name="name">
            </div>
            <div class="form-group">
              <label for="filter-email">Email:</label>
              <input type="email" id="filter-email" name="email">
            </div>
            <div class="form-actions">
              <button type="button" class="apply-filter">Aplicar</button>
              <button type="reset">Cancelar</button>
            </div>
          </form>
        </div>
    `

    this.shadow.querySelector('.apply-filter').addEventListener('click', () => {
      this.shadow.querySelector('.form-actions').classList.remove('active')
    })
  }
}

customElements.define('filtermodal-component', FilterModal)