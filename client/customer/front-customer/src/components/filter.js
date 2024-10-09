import { store } from '../redux/store.js'
import { applyFilter } from '../redux/crud-slice.js'
class Filter extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
      <style>
      .filter{
        display: grid;
        gap: 1rem;
        padding:1rem 0;
        border-bottom: 1px solid white;
      }
      .form-text, .form-date {
        display: flex;
        justify-content: space-between;
      }
      input[type='text'],
      input[type='date']{
        padding: 3px;
        border: none;
        font-size: 11px;
        outline: none;
        color: #000000;
        background-color: #fff;
        width: 45%;
      }
      .filter button::first-letter{
        text-transform: capitalize;
      }
      .filter button{
        background-color: white;
        color:  hsl(240, 33%, 1%);
        border: none;
        border-radius: 5px;
        padding: 5px 0;
        text-align: center;
        text-decoration: none;
        font-size: 11px;
        width: 40%;
        cursor: pointer;
        font-weight: 700;
      }

      </style>

      <div class="filter">
        <form class="form-text">
          <input type="text" placeholder="Referencia del pedido" name="reference">
          <button type="submit" class="search-referent">Buscar por referencia</button>
        </form>
        <form class="form-date">
          <input type="date" name="saleDate">
          <button type="submit" class="search-date">Buscar por fecha</button>
        </form>
      </div>
    `

    this.shadow.querySelector('.form-text').addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      const reference = formData.get('reference')
      store.dispatch(applyFilter(`reference=${reference}`))
      event.target.reset()
    })

    this.shadow.querySelector('.form-date').addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      const orderDate = formData.get('saleDate')

      const formattedDate = new Date(orderDate).toISOString().split('T')[0]

      store.dispatch(applyFilter(`saleDate=${formattedDate}`))
      event.target.reset()
    })
  }
}

customElements.define('filter-component', Filter)
