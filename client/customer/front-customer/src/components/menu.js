class menu extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.data = {}
    this.render()
  }

  render() {
    this.shadow.innerHTML = /* html */`
      <style>
      .menu {
        text-align: center;
        border: none;
        gap: 20px; 
        width: 300px;
        margin: 10px 0;
        display: flex;
        flex-direction: column;
      }
      .orders {
        width: 300px;
        display: grid;
        align-items: center;
        justify-content: center;
      }
      .orders button::first-letter {
        text-transform: capitalize;
      }
      .orders button {
        background-color: white;
        color: hsl(273, 80%, 27%);
        border: none;
        border-radius: 13px;
        padding: 7px 0;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
        width: 250px;
        cursor: pointer;
        font-weight: 600;
      }
      </style>
        `

    const menuContainer = document.createElement('div')
    menuContainer.classList.add('menu')

    const newOrderDiv = document.createElement('div')
    newOrderDiv.classList.add('orders')
    const newOrderLink = document.createElement('a')
    newOrderLink.href = '/cliente/nuevo-pedido'
    const newOrderButton = document.createElement('button')
    newOrderButton.textContent = 'nuevo pedido'
    newOrderLink.appendChild(newOrderButton)
    newOrderDiv.appendChild(newOrderLink)
    menuContainer.appendChild(newOrderDiv)

    const previousOrdersDiv = document.createElement('div')
    previousOrdersDiv.classList.add('orders')
    const previousOrdersLink = document.createElement('a')
    previousOrdersLink.href = '/cliente/pedidos-anteriores'
    const previousOrdersButton = document.createElement('button')
    previousOrdersButton.textContent = 'pedidos anteriores'
    previousOrdersLink.appendChild(previousOrdersButton)
    previousOrdersDiv.appendChild(previousOrdersLink)
    menuContainer.appendChild(previousOrdersDiv)

    this.shadow.appendChild(menuContainer)
  }
}

customElements.define('menu-component', menu)
