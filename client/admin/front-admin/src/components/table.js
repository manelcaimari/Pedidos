class TableComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        await this.loadData();
        this.render();
        this.updateTableBody();
    }

    async loadData() {
        this.data = [
            {
              "name": "Blabla",
              "email": "blabla@gmail.com",
              "created_at": "07/06/2024",
              "updated_at": "10/07/2024"
            },
            {
              "name": "Bloblo",
              "email": "bloblo@gmail.com",
              "created_at": "10/06/2024",
              "updated_at": "12/07/2024"
            },
            {
              "name": "Blublu",
              "email": "blublu@gmail.com",
              "created_at": "15/06/2024",
              "updated_at": "17/07/2024"
            },
            {
              "name": "Blibli",
              "email": "blibli@gmail.com",
              "created_at": "21/06/2024",
              "updated_at": "23/07/2024"
            },
            {
              "name": "Bleble",
              "email": "bleble@gmail.com",
              "created_at": "25/06/2024",
              "updated_at": "27/07/2024"
            }
            
          ]
        this.info = {
            "reference": "1",
            "result": "10"
        }
        ;
    }
    render() {
        this.shadow.innerHTML = 
            /*html*/`
            <style>
                ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .table {
                    display: grid;
                    gap:1rem;
                    height: 90vh;
                    grid-template-rows: auto 1fr auto; 
                }
                .filter-button{
                    background-color:white;
                }
                .table-body {
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    overflow-y: auto; 
                }
                .table-register {
                    width: calc(98% - 30px);
                    box-sizing: border-box;
                    border: 0;
                }
                .table-register-buttons ul {
                    display: flex;
                    justify-content: right;
                    background-color: #fff;
                }
                svg {
                    fill: hsl(229, 86%, 41%);
                    padding: 7px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height:40px;
                    box-sizing: border-box;
                    border: 0;
                }
                .table-register-data{
                    display:grid;
                    gap:4rem;
                    border: 0;
                    padding:0;
                }
                .table-register-data li{
                    background-color: black;
                }
                .table-register-data span {
                    font-size: 16px;
                    font-weight: 600;
                }
                .table-footer {
                    background-color: white; 
                    padding: 10px;
                }
                .table-info-registers span{
                    color:black;
                }
            </style>
            <section class="table">
                <div class="table-header">
                    <div class="table-header-buttons">
                        <ul>
                            <li class="filter-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>     
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="table-body">
                </div>
                <div class="table-footer">
                    <div class="table-info-registers">
                        <span>${this.info.reference} registro en total, mostrando ${this.info.result} por página</span>
                    </div>
                </div>
            </section>
            `;
         }
         updateTableBody() {
            const tableBody = this.shadow.querySelector('.table-body');
            const fragment = document.createDocumentFragment();
    
            this.data.forEach(customer => {
                const registerDiv = document.createElement('div');
                registerDiv.className = 'table-register';
    
                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'table-register-buttons';
    
                const ulButtons = document.createElement('ul');
    
                const editLi = document.createElement('li');
                editLi.className = 'edit-button';
                editLi.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg>';
    
                const deleteLi = document.createElement('li');
                deleteLi.className = 'delete-button';
                deleteLi.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
    
                ulButtons.appendChild(editLi);
                ulButtons.appendChild(deleteLi);
                buttonsDiv.appendChild(ulButtons);
    
                const dataDiv = document.createElement('div');
                dataDiv.className = 'table-register-data';
    
                const ulData = document.createElement('ul');
    
                Object.entries(customer).forEach(([key, value]) => {
                    const li = document.createElement('li');
                    li.innerHTML = `${key}: ${value}`;
                    ulData.appendChild(li);
                });
    
                dataDiv.appendChild(ulData);
    
                registerDiv.appendChild(buttonsDiv);
                registerDiv.appendChild(dataDiv);
    
                fragment.appendChild(registerDiv);
            });
            tableBody.appendChild(fragment);
        }
    }
customElements.define('table-component', TableComponent);