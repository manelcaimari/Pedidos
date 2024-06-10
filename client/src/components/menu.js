class menu extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      
      this.data = {

      }
  
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
        <style>
        .menu{
            text-align: center;
            border: none;
            gap: 20px; 
            width: 300px;
            margin: 10px 0;
            display: flex;
            flex-direction: column;
        }
        .orders{
            width: 300px;
            display: grid;
            align-items: center ;
            justify-content:center;
        }
        .orders button::first-letter{
            text-transform: capitalize;
        }
        .orders button{
            background-color: white;
            color:  hsl(273, 80%, 27%);
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
            <div class="menu">
                <div class="orders">
                    <a href="#"><button>nuevo pedido</button></a>
                </div>
                <div class="orders">
                    <a href="#"><button>pedidos anteriores</button></a>
                </div>
            </div>
        
        `
      }
  }
  
  customElements.define('menu-component', menu)