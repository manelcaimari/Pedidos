class Activate extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
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
            width: 300px;
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
        .error-message {
            display: none;
            color: red;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        .success-message {
            display: none;
            color: green;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        </style>
        <div class="container">
        <h1>Elija una contraseña para su cuenta</h1>
        <ul>
            <li>- 8 caracteres como mínimo</li>
            <li>- Al menos una letra mayúscula</li>
            <li>- Al menos un número</li>
        </ul>
        <form id="password-form">
        <div class="error-message" id="error-message"></div>
        <div class="success-message" id="success-message"></div>
        <input type="password" id="password" placeholder="Contraseña" required>
        <input type="password" id="confirm-password" placeholder="Repita la contraseña" required>
       
        <button type="submit">Enviar</button>
        </form>
    </div>
        `
    this.shadow.querySelector('#password-form').addEventListener('submit', this.handleSubmit.bind(this))
  }

  async handleSubmit(event) {
    event.preventDefault()
    const passwordInput = this.shadow.querySelector('#password')
    const confirmPasswordInput = this.shadow.querySelector('#confirm-password')
    const errorMessage = this.shadow.querySelector('#error-message')
    const successMessage = this.shadow.querySelector('#success-message')

    if (!passwordInput || !confirmPasswordInput || !errorMessage || !successMessage) {
      console.error('Los campos de contraseña o los mensajes de estado no están disponibles.')
      return
    }

    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/

    errorMessage.style.display = 'none'
    errorMessage.textContent = ''
    successMessage.style.display = 'none'
    successMessage.textContent = ''

    if (password !== confirmPassword) {
      errorMessage.textContent = 'Las contraseñas no coinciden.'
      errorMessage.style.display = 'block'
      return
    }

    if (!passwordRegex.test(password)) {
      errorMessage.textContent = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.'
      errorMessage.style.display = 'block'
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (!token) {
      errorMessage.textContent = 'Falta el token en la URL. Por favor, intente nuevamente.'
      errorMessage.style.display = 'block'
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        errorMessage.textContent = errorData.message || 'Hubo un error al activar la cuenta.'
        errorMessage.style.display = 'block'
        return
      }

      // Mostrar éxito
      successMessage.textContent = '¡La cuenta ha sido activada con éxito!'
      successMessage.style.display = 'block'
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      errorMessage.textContent = 'Hubo un error inesperado. Por favor, intente más tarde.'
      errorMessage.style.display = 'block'
    }
  }
}

customElements.define('activate-component', Activate)
