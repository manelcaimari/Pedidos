class panel extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.data = {
            title: "",
            general: "",
            name: "",
            email: ""
        };

        this.render();
    }

    setData(newData) {
        this.data = { ...this.data, ...newData };
        this.render();
    }

    render() {
        this.shadow.innerHTML =/*html*/ `
        <style>
            details {
                width: 100%;
                display: flex;
                justify-content: center;
            }

            .filter summary {
                display: grid;
            }

            .filter details summary {
                cursor: pointer;
                list-style: none;
                background-color: aliceblue;
                padding: 0.1rem 0.5rem;
                margin-bottom: 1rem;
            }

            .filter details svg {
                fill: hsl(229, 86%, 41%);
                width: 30px;
                height: 30px;
            }

            .filter details form {
                display: flex;
                justify-content: center;
            }

            .filter form input {
                padding: 0.6rem;
                border: none;
                width: 60%;
            }

            .filter form button {
                background: none;
                border: none;
                cursor: pointer;
                background-color: white;
            }

            .result {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .result-general form div {
                display: flex;
                align-content: center;
            }

            .result-general,
            .result-one {
                border-radius: 8px;
            }

            .result-general label,
            .result-one label {
                gap: 1rem;
            }

            .result-general label {
                background-color: rgb(90, 14, 90);
                padding: 0 0.5rem;
                align-content: center;
            }

            .result-general input {
                width: 100%;
                padding: 0.5rem;
                border: none;
                background-color: rgb(90, 14, 90);
            }

            .result-one input {
                width: 96%;
                padding: 0.5rem;
                background-color: rgb(90, 14, 90);
            }

            .result-general input {
                margin-bottom: 0;
                border-radius: 0;
                background-color: white;
            }

            .result-general button {
                background-color: white;
                border: 0;
                padding: 0 0.5rem;
            }

            .result-general button svg {
                fill: hsl(229, 86%, 41%);
            }

            .result-one {
                display: flex;
                gap: 10rem;
            }

            .ultimo {
                width: 100%;
                display: flex;
                box-sizing: border-box;
                gap: 1rem;
            }

            .result-one .form-Name,
            .result-one .form-email {
                flex: 1;
                gap: 0rem;
            }

            .result-one .form-Name label,
            .result-one .form-email label {
                align-self: flex-start;
                display: grid;
            }

            .result-one .form-email input,
            .result-one .form-Name input {
                background-color: #476bb9;
                color: white;
                border-right: 1px solid #476bb9;
            }

            button svg {
                width: 40px;
                height: 40px;
                padding: 0;
            }
        </style>
        <div class="result">
            <div class="result-general"></div>   
            <div class="result-one"></div>
        </div>
        `;

        this.formGenerator = new FormGenerator(this.data, this.shadow);
    }
}

class FormGenerator {
    constructor(data, shadowRoot) {
        this.data = data;
        this.shadowRoot = shadowRoot;
        this.init();
    }

    init() {
        this.createGeneralForm();
        this.createSpecificForm();
    }

    createGeneralForm() {
        const resultGeneral = this.shadowRoot.querySelector('.result-general');
        resultGeneral.innerHTML = ''; 
        
        const form = document.createElement('form');
        form.name = "general_result";
        form.method = "";
        form.action = "";

        const div = document.createElement('div');

        const label = document.createElement('label');
        label.setAttribute('for', 'general');
        label.textContent = 'General';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'general';
        input.name = 'general_result';
        input.setAttribute('contenteditable', 'true');
        input.value = this.data.general;

        const resetButton = document.createElement('button');
        resetButton.type = 'reset';
        resetButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" /></svg>';

        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" /></svg>';

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(resetButton);
        div.appendChild(button);
        form.appendChild(div);
        resultGeneral.appendChild(form);
    }

    createSpecificForm() {
        const resultOne = this.shadowRoot.querySelector('.result-one');
        resultOne.innerHTML = ''; 

        const divUltimo = document.createElement('div');
        divUltimo.className = 'ultimo';

        const formNameDiv = document.createElement('div');
        formNameDiv.className = 'form-Name';

        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', 'name');
        nameLabel.textContent = 'Nombre';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'generator';
        nameInput.className = 'name';
        nameInput.value = this.data.name;

        formNameDiv.appendChild(nameLabel);
        formNameDiv.appendChild(nameInput);

        const formEmailDiv = document.createElement('div');
        formEmailDiv.className = 'form-email';

        const emailLabel = document.createElement('label');
        emailLabel.setAttribute('for', 'email');
        emailLabel.textContent = 'Email';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'generator';
        emailInput.className = 'emails';
        emailInput.value = this.data.email;

        formEmailDiv.appendChild(emailLabel);
        formEmailDiv.appendChild(emailInput);

        divUltimo.appendChild(formNameDiv);
        divUltimo.appendChild(formEmailDiv);

        resultOne.appendChild(divUltimo);
    }
}

customElements.define('panel-component', panel);