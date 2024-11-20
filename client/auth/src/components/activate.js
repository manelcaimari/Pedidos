class Activate extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.data = {
      email: '',
      password: ''
    }

    this.render()
  }

  render() {
    this.shadow.innerHTML = /* html */`
        <style>
        .container {
            text-align: center;
            background-color: transparent;
            padding: 20px;
            border-radius: 8px;
        }

        h1 {
            margin-bottom: 20px;
            font-size: 1.5rem;
        }

        ul {
            list-style: none;
            padding: 0;
            text-align: left;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }

        ul li {
            margin: 5px 0;
        }

        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
        }

        button {
            background-color: #6a5acd; 
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1rem;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            background-color: #483d8b; 
        }
        </style>
        <div class="container">
        <h1>Elija una contraseña para su cuenta</h1>
        <ul>
            <li>- 8 caracteres como mínimo</li>
            <li>- Al menos una letra mayúscula</li>
            <li>- Al menos un número</li>
        </ul>
        <form>
            <input type="password" placeholder="Contraseña" required>
            <input type="password" placeholder="Repita la contraseña" required>
            <button type="submit">Enviar</button>
        </form>
    </div>
        `
  }
}
customElements.define('activate-component', Activate)
