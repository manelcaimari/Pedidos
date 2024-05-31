class detail extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    async connectedCallback () {
        await this.loadData()
        await this.render()
      }
    
    loadData () {
        this.data = [
          {
            "title": "Cocacola",
            "price": "90.00",
            "unities": "16",
            "quantity": "330",
            "measurementQuantity":" ml",
            "measurementUnitied":" u",
            "measurementPrice":" € "
          }
        ]
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
        <style>
        .order-item {
            padding:1.5rem 1rem;
            display: flex;
            flex-direction: column;
            gap:1rem;
            min-height: 80vh;
            max-height: 80vh;
            font-weight: 600;

        }

        .item-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;

        }

        .item-name {
            font-size: 18px;
            margin: 0;

        }

        .item-price {
            font-size: 18px;
            margin: 0;
            
        }

        .item-quantity {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
        }
        .quantity{
            display:flex;
            gap:10px;
        }

        .item-quantity span{
            font-weight: 700;

        }

        .quantity-control {
            display: flex;
            align-items: center;
            justify-content: center;

        }

        .quantity-control  {
            align-items: center;
            border: none;
            cursor: pointer;
            display: flex;
            font-size: 18px;
            height: 1.5rem;
        }

        .quantity-control span {
            box-sizing: border-box;
            width: 40px;
            color: white;
            text-align: center;
            margin: 0 ;
            background-color: hsla(213, 43%, 55%, 0.76);
            border:none;
            height: 100%;
            padding: 0.1rem;
        }

        .quantity-control button{
            width: 2rem;
            height: 100%;
            border:0;
            padding:0;
        }

        .button-order{
            text-align: center;
            border: none;
            gap: 20px; 
            margin: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;

        }

        .orders{
            width: 75%;
            display: grid;
            align-items: center ;

        }

        .orders button::first-letter{
            text-transform: capitalize;
        }

        .orders button{
            background-color: white;
            color:  hsl(0, 0%, 0%);
            border: none;
            border-radius: 13px;
            padding: 8px 0;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            width: 100%; 
            cursor: pointer;
            font-weight: 600;
            
        }
        </style>
        <div class="order-item">
           <div class="item-details">
               <!-- <p class="item-name">Cocacola</p>
               <p class="item-price">90.00 €</p> -->
           </div>
           <div class="item-quantity">
                <div class="quantity">
               <!-- <span>16u, 330ml</span> -->
                </div>
               <div class="quantity-control">
                   <button>-</button>
                   <span>1</span>
                   <button >+</button>
               </div>
           </div>
        </div>  
        <div class="button-order">
           <div class="orders">
               <a href="#"><button>ver pedido</button></a>
           </div>
        </div> 

        `
        this.data.forEach(item => {

            const itemsContainer = this.shadow.querySelector('.order-item')
            const itemContainer = document.createElement('div')
            itemContainer.classList.add('item-details')
            
            const title = document.createElement('p')
            title.textContent = item.title
            itemContainer.appendChild(title)
      
            const price = document.createElement('p')
            price.textContent = item.price
            itemContainer.appendChild(price)

            const Containeritems = this.shadow.querySelector('.item-quantity')
            const Containeritem = document.createElement('div')
            Containeritem.classList.add('quantity')

            const unities = document.createElement('p')
            unities.textContent = item.unities
            Containeritem.appendChild(unities)

            const quantity = document.createElement('p')
            quantity.textContent = item.quantity
            Containeritem.appendChild(quantity)

            itemsContainer.appendChild(itemContainer)
            Containeritems.appendChild(Containeritem)
          })
      }
  }
  
  customElements.define('detail-component', detail)
 