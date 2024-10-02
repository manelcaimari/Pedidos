// import { store } from '../../redux/store.js'
// import { addItem, removeItem, updateItemQuantity } from '../../redux/crud-slice.js'

// class ShoppingCart extends HTMLElement {
//   constructor () {
//     super()
//     this.shadow = this.attachShadow({ mode: 'open' })
//   }

//   async connectedCallback () {
//     await this.loadProducts()
//     this.render()
//   }

//   async loadProducts () {
//     try {
//       const response = await fetch('/api/admin/products')
//       const products = await response.json()

//       for (const product of products) {
//         const priceResponse = await fetch(`/api/admin/prices/${product.id}`)
//         const price = await priceResponse.json()

//         store.dispatch(addItem({
//           id: product.id,
//           name: product.name,
//           price: price.basePrice,
//           quantity: 1
//         }))
//       }
//     } catch (error) {
//       console.error('Error loading products:', error)
//     }
//   }

//   render () {
//     const state = store.getState()
//     const shadowRoot = this.shadow
//     shadowRoot.innerHTML = /* html */ `
//       <style>
//         .order-item {
//           padding: 1rem;
//           display: flex;
//           flex-direction: column;
//           min-height: 65vh;
//           max-height:80vh;
//         }
//         .item{
//           padding: 10px 0;
//           border-bottom: 1px solid white;
//         }
//         .item-details {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           font-weight:bold;
//         }
//         .item-name {
//           font-size: 17px;
//           margin: 0;
//         }
//         .item-price {
//           font-size: 18px;
//           margin: 0;
//         }
//         .item-quantity {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .item-quantity span{
//           font-weight:700;
//           font-size: 14px;
//         }
//         .quantity-control {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .quantity-control  {
//           border: none;
//           cursor: pointer;
//           font-size: 14px;
//         }
//         .quantity-control input {
//           width: 40px;
//           color: white;
//           text-align: center;
//           margin: 0 ;
//           background-color: hsla(214, 87%, 56%, 0.966);
//         }
//         .bottom{
//           border: none;
//           gap: 20px;
//           width: 100%;
//         }
//         .total {
//           padding: 0.5rem 1rem;
//         }
//         .item-total {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .total-title::first-letter{
//           text-transform: capitalize;
//         }
//         .total-title {
//           font-size: 20px;
//           margin: 0;
//           font-weight: 600;
//         }
//         .total-price {
//           font-size: 18px;
//           margin: 0;
//           font-weight: 600;
//         }
//         .total-quantity  ::first-letter{
//           text-transform: capitalize;
//         }
//         .total-quantity {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           font-weight: 500;
//         }
//         .orders{
//           margin-top: 5px;
//           text-align: center;
//         }
//         .orders button::first-letter{
//           text-transform: capitalize;
//         }
//         .orders button{
//           background-color: white;
//           color:  hsl(0, 0%, 0%);
//           border: none;
//           border-radius: 13px;
//           padding: 8px 0;
//           text-align: center;
//           text-decoration: none;
//           font-size: 16upx;
//           width: 70%;
//           cursor: pointer;
//           font-weight: 600;
//         }
//         </style>
//         <div class="order-item"></div>
//           <div class="bottom">
//             <div class="total">
//               <div class="item-total">
//                 <p class="total-title">Total</p>
//                 <p class="total-price">${this.calculateTotalPrice().toFixed(2)} €</p>
//               </div>
//               <div class="total-quantity">
//                 <p>Impuesto no incluidos</p>
//               </div>
//             </div>
//             <div class="orders">${state.cart.total.toFixed(2)} €</div>
//             <button id="finalizar-compra">Finalizar Compra</button>
//           </div>
//         `

//     const ordersContainer = shadowRoot.querySelector('.order-item')

//     state.crud.items.forEach((item, index) => {
//       const itemElement = document.createElement('div')
//       itemElement.classList.add('item')

//       itemElement.innerHTML = `
//          <div class="item-details">
//            <p class="item-name">${item.name}</p>
//            <p class="item-price">${(item.price * item.quantity).toFixed(2)} €</p>
//          </div>
//          <div class="item-quantity">
//            <span>Cantidad: ${item.quantity}</span>
//            <div class="quantity-control">
//              <button class="quantity-control minus">-</button>
//              <input type="number" value="${item.quantity}" min="1" />
//              <button class="quantity-control plus">+</button>
//            </div>
//          </div>
//          <button class="remove-item">Eliminar</button>
//        `

//       itemElement.querySelector('.remove-item').addEventListener('click', () => {
//         store.dispatch(removeItem(index))
//         this.render()
//       })

//       itemElement.querySelector('.quantity-control.plus').addEventListener('click', () => {
//         const quantityInput = itemElement.querySelector('input[type="number"]')
//         quantityInput.value = parseInt(quantityInput.value) + 1
//         store.dispatch(updateItemQuantity(index, quantityInput.value))
//         this.render()
//       })

//       itemElement.querySelector('.quantity-control.minus').addEventListener('click', () => {
//         const quantityInput = itemElement.querySelector('input[type="number"]')
//         if (quantityInput.value > 1) {
//           quantityInput.value = parseInt(quantityInput.value) - 1
//           store.dispatch(updateItemQuantity(index, quantityInput.value))
//           this.render()
//         }
//       })

//       ordersContainer.appendChild(itemElement)
//     })

//     shadowRoot.getElementById('finalizar-compra').addEventListener('click', () => {
//       this.handleFinalizarCompra()
//     })
//   }

//   handleFinalizarCompra () {
//     alert('Compra finalizada. Gracias por su compra!')
//   }

//   calculateTotalPrice () {
//     const state = store.getState()
//     return state.crud.items.reduce((total, item) => total + (item.price * item.quantity), 0)
//   }
// }

// customElements.define('shoppingcart-component', ShoppingCart)
