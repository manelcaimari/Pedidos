class shoppingcart extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    async connectedCallback () {
        await this.loadData()
        await this.render()
      }
    
    async loadData () {
        this.data = [
          {
            "title": "Cocacola",
            "total": "180.00€",
            "unities": "16u",
            "quantity": "330",
            "price": "90.00€",
            "pack":"2",
            "measurementQuantity": "ml",
        
          },
          {
            "title": "Cocacola",
            "total": "180.00€",
            "unities": "16u",
            "quantity": "330",
            "price": "90.00€",
            "pack":"3",
            "measurementQuantity": "ml",
           

          },
    
         
        ];
        this.calculateTotalPrice();
        }

    calculateTotalPrice() {
        this.totalPrice = this.data.reduce((total, item) => {
            return total + (parseFloat(item.price) * parseFloat(item.pack));
        }, 0);
    }

    render () {
      this.shadow.innerHTML =
         /*html*/`
            <style>
                .order-item {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    min-height: 65vh;
                    max-height:80vh;
                }
                .item{
                    padding: 10px 0;
                    border-bottom: 1px solid white;  
                }
                .item-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight:bold;
                }
                .item-name {
                    font-size: 17px;
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
                .item-quantity span{
                    font-weight:700;
                    font-size: 14px;
                }
                .quantity-control {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quantity-control  {
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                }
                .quantity-control input {
                    width: 40px;
                    color: white;
                    text-align: center;
                    margin: 0 ;
                    background-color: hsla(214, 87%, 56%, 0.966);
                }
                .bottom{
                    border: none;
                    gap: 20px; 
                    width: 100%;
                }
                .total {
                    padding: 0.5rem 1rem;
                }
                .item-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .total-title::first-letter{
                    text-transform: capitalize;
                }
                .total-title {
                    font-size: 20px;
                    margin: 0;
                    font-weight: 600;
                }
                .total-price {
                    font-size: 18px;
                    margin: 0;
                    font-weight: 600;
                }
                .total-quantity  ::first-letter{
                    text-transform: capitalize;
                }
                .total-quantity {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 500;
                }
                .orders{
                    margin-top: 5px;
                    text-align: center;
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
                    font-size: 16upx;
                    width: 70%; 
                    cursor: pointer;
                    font-weight: 600;
                }
         </style>`
           const orderItem = document.createElement('div');
           orderItem.classList.add('order-item');
   
           this.data.forEach(item => {
               const itemContainer = document.createElement('div');
               itemContainer.classList.add('item');
   
               const itemDetails = document.createElement('div');
               itemDetails.classList.add('item-details');
   
               const title = document.createElement('p');
               title.classList.add('item-name');
               title.textContent = item.title;
               itemDetails.appendChild(title);
   
               const price = document.createElement('p');
               price.classList.add('item-price');
               price.textContent = `${(parseFloat(item.price) * parseFloat(item.pack)).toFixed(2)} €`;
               itemDetails.appendChild(price);
   
               const itemQuantity = document.createElement('div');
               itemQuantity.classList.add('item-quantity');
   
               const unities = document.createElement('p');
               unities.classList.add('item-unities');
               unities.textContent = `${item.unities} , ${item.quantity} ${item.measurementQuantity}`;
               itemQuantity.appendChild(unities);
   
               const quantityControl = document.createElement('div');
               quantityControl.classList.add('quantity-control');
   
               const quantity = document.createElement('p');
               quantity.textContent = `${item.pack} x ${item.price}`;
               quantityControl.appendChild(quantity);
               itemQuantity.appendChild(quantityControl);
   
               itemContainer.appendChild(itemDetails);
               itemContainer.appendChild(itemQuantity);
               orderItem.appendChild(itemContainer);
           });
   
           const total = document.createElement('div');
           total.classList.add('total');
   
           const itemTotal = document.createElement('div');
           itemTotal.classList.add('item-total');
   
           const totalTitle = document.createElement('p');
           totalTitle.classList.add('total-title');
           totalTitle.textContent = 'total';
   
           const totalPrice = document.createElement('p');
           totalPrice.classList.add('total-price');
           totalPrice.textContent = `${this.totalPrice.toFixed(2)} €`;
   
           itemTotal.appendChild(totalTitle);
           itemTotal.appendChild(totalPrice);
   
           const totalQuantity = document.createElement('div');
           totalQuantity.classList.add('total-quantity');
   
           const taxInfo = document.createElement('p');
           taxInfo.textContent = 'impuesto no incluidos';
   
           totalQuantity.appendChild(taxInfo);
   
           total.appendChild(itemTotal);
           total.appendChild(totalQuantity);
   
           const bottom = document.createElement('div');
           bottom.classList.add('bottom');
   
           const orders = document.createElement('div');
           orders.classList.add('orders');
   
           const orderButton = document.createElement('button');
           orderButton.textContent = 'finalizar pedido';
   
           orders.appendChild(orderButton);
           bottom.appendChild(total);
           bottom.appendChild(orders);
   
           this.shadow.appendChild(orderItem);
           this.shadow.appendChild(bottom);
       }
   }
   
   customElements.define('shoppingcart-component', shoppingcart);