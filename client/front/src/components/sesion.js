class sesion extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.data = {
            email: "",
            password: ""
        };

        this.render();
    }

    setData(newData) {
        this.data = { ...this.data, ...newData };
        this.render();
    }

    render() {
        this.shadow.innerHTML = /*html*/`
        <style>
        .order h1 {
            font-size: 1.5rem;
            text-transform: capitalize;
            text-align: center;
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
        input[type="password"] {
            width: 300px;
            padding: 6px;
            border-radius: 3px;
            background-color: #3333ff;
            color: white;
            border-right: 1px solid #3333ff;
        }

        .form-button button {
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
            border: none;
        }

        .remember a {
            font-size: 15px;
            color: hsl(0, 0%, 100%);
            text-decoration: none;
        }
        </style>
        `;

        const container = document.createElement('div');

        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');
        const orderTitle = document.createElement('h1');
        orderTitle.textContent = 'pedidos';
        orderDiv.appendChild(orderTitle);
        container.appendChild(orderDiv);

        const form = document.createElement('form');
        form.classList.add('sesion');
        form.method = 'post';

        const emailDiv = document.createElement('div');
        emailDiv.classList.add('form-email');
        const emailLabel = document.createElement('label');
        emailLabel.setAttribute('for', 'email');
        emailLabel.textContent = 'Email';
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.value = this.data.email;
        emailDiv.appendChild(emailLabel);
        emailDiv.appendChild(emailInput);
        form.appendChild(emailDiv);

        const passwordDiv = document.createElement('div');
        passwordDiv.classList.add('form-key');
        const passwordLabel = document.createElement('label');
        passwordLabel.setAttribute('for', 'password');
        passwordLabel.textContent = 'Password';
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.name = 'password';
        passwordInput.value = this.data.password;
        passwordDiv.appendChild(passwordLabel);
        passwordDiv.appendChild(passwordInput);
        form.appendChild(passwordDiv);

        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('form-button');
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Enviar';
        buttonDiv.appendChild(submitButton);
        form.appendChild(buttonDiv);

        container.appendChild(form);

        const rememberDiv = document.createElement('div');
        rememberDiv.classList.add('remember');
        const rememberLink = document.createElement('a');
        rememberLink.href = '#';
        rememberLink.textContent = 'Olvidé mi contraseña';
        rememberDiv.appendChild(rememberLink);
        container.appendChild(rememberDiv);

        this.shadow.appendChild(container);
    }
}

customElements.define('sesion-component', sesion);