class sesion extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      
      this.data = {
        title: ""
      }
  
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
        <style>
        .login{
    display:grid;
    gap:1rem;

}

.order h1{
    font-size:1.5rem ;
    text-transform: capitalize;
    text-align:center;

}

.sesion {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px; 
    column-gap: 0;

}

label {
    align-self: flex-start;
    display: grid;

}

input[type="email"],
input[type="password"]{
    width: 300px;
    padding: 6px;
    border-radius: 3px;
    background-color: #3333ff;
    color: white;
    border-right: 1px solid #3333ff;    

}
.result-one input[type="email"],
.result-one input[type="text"]{
    width: 300px;
    padding: 6px;
    border-radius: 3px;
    background-color: #3333ff;
    color: white;
    border-right: 1px solid #3333ff;    

}

.form-button button{
    width: 300px;
    padding: 8px;
    border: none;
    border-radius: 10px;
    background-color: #703868;
    color: white;
    font-size: 13px;
    cursor: pointer;

}

.remember {
    text-align:center;
    border:none;

}

.remember a{
    font-size: 15px;
    color: hsl(0, 0%, 100%);
    text-decoration: none;

}
        </style>
        <section class="login">
            <div class="order">
                <h1>pedidos</h1>
            </div>
            <form class="sesion" method="post">
                <div class="form-email">
                    <label for="email">Email</label>
                    <input type="email"  name="email" >
                </div>
                <div class="form-key">
                    <label for="password">Password</label>
                    <input type="password"  name="password">
                </div>
                <div class="form-button">
                    <button type="submit">Enviar</button>
                </div>
            </form>
            <div class="remember">
                <a href="#">Olvidé mi contraseña</a>
            </div>
        </section>
        
        `
      }
  }
  
  customElements.define('sesion-component', sesion)