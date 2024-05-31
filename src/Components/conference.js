class conference extends HTMLElement {
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
        .all{
            display: grid;
            gap: 0.2rem;
            padding:0.3rem 0.5rem;
        }
        .sop{
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
        .sop button::first-letter{
            text-transform: capitalize;
        }
        button{
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
            .orders {
            display:grid;
            align-content: center;
            width: 100%;
        }
        .order:not(:last-child) {
            padding:0 0 10px 0;
            border-bottom: 1px solid white; 
        }
        .order-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight:bold;
        }
        .order-details p{
            font-weight: 600;
            font-size: 16px;
        }
        .detail-name .detail-price {
            font-size: 18px;
            margin: 0;
        }
        .order-quantity {
            display: flex;
            justify-content: space-between;
        }
        .order-quantity span{
            font-weight: 700;
            font-size: 14px;
        }
        .quantity-control{
            width: 100px;

        }

        .order button::first-letter{
            text-transform: capitalize;

        }

        .order button{
            background-color: white;
            color:  hsl(0, 0%, 0%);
            border: none;
            border-radius: 3px;
            padding: 5px 0;
            text-align: center;
            text-decoration: none;
            font-size: 14px;
            width: 100%; 
            cursor: pointer;
            font-weight: 600;
            
        }
        </style>
        <div class="all">
            <div class="sop">
                <div class="form-text">
                    <input type="text" placeholder="Referencia del pedido">
                    <button type="submit">buscar por referencia</button>
                </div>
                <div class="form-date">
                    <input type="date" placeholder="dd/mm/aaaa">
                    <button type="submit">buscar por fecha</button>
                </div>
            </div>
            <div class="orders">
                <div class="order">
                    <div class="order-details">
                        <p class="detail-name">00000000002</p>
                        <p class="detail-price">180 €</p>
                    </div>
                    <div class="order-quantity">
                        <span>20-05-2024 11:13</span>
                        <div class="quantity-control">
                            <a href="#"><button>ver pedido</button></a>
                        </div>
                    </div>
                </div>
                <div class="order">
                    <div class="order-details">
                        <p class="detail-name">00000000003</p>
                        <p class="detail-price">270 €</p>
                    </div>
                    <div class="order-quantity">
                        <span>13-05-2024 17:09</span>
                        <div class="quantity-control">
                        <a href="#"><button>ver pedido</button></a>
                        </div>
                    </div>
                </div>
                <div class="order">
                    <div class="order-details">
                        <p class="detail-name">00000000002</p>
                        <p class="detail-price">270 €</p>
                    </div>
                    <div class="order-quantity">
                        <span>13-05-2024 17:09</span>
                        <div class="quantity-control">
                            <a href="#"><button>ver pedido</button></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
      }
  }
  
  customElements.define('conference-component', conference)