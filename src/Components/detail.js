class detail extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    async connectedCallback () {
        await this.loadData()
        await this.render()
        this.createOrderElements()
      }
    
    async loadData () {
        this.data = [
          {
            "title": "Cocacola",
            "price": "90.00",
            "unities": "16",
            "quantity": "330",
            "measurementQuantity": "ml",
            "measurementunities": "u",
            "measurementPrice": "€"
          },
          {
            "title": "Pepsi",
            "price": "80.00",
            "unities": "12",
            "quantity": "500",
            "measurementQuantity": "ml",
            "measurementunities": "u",
            "measurementPrice": "€"
          },
          {
            "title": "Fanta",
            "price": "70.00",
            "unities": "20",
            "quantity": "250",
            "measurementQuantity": "ml",
            "measurementunities": "u",
            "measurementPrice": "€"
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

        .item-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    
        .item-detail span{
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
        </div>  
        <div class="button-order">
            <div class="orders">
                <a href="#"><button>ver pedido</button></a>
            </div>
        </div>
        `
      
      }
      createOrderElements() {
        const ordersContainer = this.shadow.querySelector('.order-item');

        this.data.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');

            const orderDetailsDiv = document.createElement('div');
            orderDetailsDiv.classList.add('item-details');

            const titleP = document.createElement('p');
            titleP.classList.add('detail-title');
            titleP.textContent = order.title;

            const priceP = document.createElement('p');
            priceP.classList.add('detail-price');
            priceP.textContent = `${order.price}${order.measurementPrice}`;

            orderDetailsDiv.appendChild(titleP);
            orderDetailsDiv.appendChild(priceP);

            const itemDetailDiv = document.createElement('div');
            itemDetailDiv.classList.add('item-detail');

            const detailDiv = document.createElement('div');
            detailDiv.classList.add('detail');

            const unitiesSpan = document.createElement('span');
            unitiesSpan.classList.add('item-united');
            unitiesSpan.textContent = `${order.unities}${order.measurementunities}`;

            const quantitySpan = document.createElement('span');
            quantitySpan.classList.add('item-quantity');
            quantitySpan.textContent = `${order.quantity}${order.measurementQuantity}`;

            detailDiv.appendChild(unitiesSpan);
            detailDiv.appendChild(quantitySpan);

            const quantityControlDiv = document.createElement('div');
            quantityControlDiv.classList.add('quantity-control');

            const minusButton = document.createElement('button');
            minusButton.textContent = '-';
            const quantitySpan2 = document.createElement('span');
            quantitySpan2.textContent = '1';
            const plusButton = document.createElement('button');
            plusButton.textContent = '+';

            quantityControlDiv.appendChild(minusButton);
            quantityControlDiv.appendChild(quantitySpan2);
            quantityControlDiv.appendChild(plusButton);

            itemDetailDiv.appendChild(detailDiv);
            itemDetailDiv.appendChild(quantityControlDiv);

            orderDiv.appendChild(orderDetailsDiv);
            orderDiv.appendChild(itemDetailDiv);

            ordersContainer.appendChild(orderDiv);
        });
    }
  }
  
  customElements.define('detail-component', detail)
 