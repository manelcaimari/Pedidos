class Login extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.data = {
      email: '',
      password: ''
    }

    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
        <style>
        .order h1 {
            font-size: 1.5rem;
            text-transform: capitalize;
            text-align: center;
        }
        .login {
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
        input[type="password"] {
            width: 300px;
            padding: 6px;
            border-radius: 3px;
            background-color: #3333ff;
            color: white;
            border-right: 1px solid #3333ff;
        }
        .form-button input {
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
            text-align: center;
            padding:1rem;
            border: none;
        }
        .remember a {
            font-size: 15px;
            color: hsl(0, 0%, 100%);
            text-decoration: none;
        }
        </style>
        <div class="order">
                <h1>pedidos</h1>
            </div>
            <form class="login" method="post">
                <div class="form-email">
                    <label for="email">Email</label>
                    <input type="email"  name="email" >
                </div>
                <div class="form-key">
                    <label for="password">Password</label>
                    <input type="password"  name="password">
                </div>
                <div class="form-button">
                    <input type="submit">
                </div>
            </form>
            <div class="remember">
                <a href="">Olvidé mi contraseña</a>
            </div>
        `
  }
}
customElements.define('login-component', Login)
