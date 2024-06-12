class TableComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        await this.loadData();
        this.render();
        this.addEventListeners();
    }

    async loadData() {
        this.data = [
            {
                "name": 'Carlos',
                "email": 'carlossedagambin@gmail.com',
                "creationDate": '2024-04-22',
                "updateDate": '2024-04-22'
            }
        ];
    }

    render() {
        
        this.shadow.innerHTML = 
            /*html*/`
            <style>
                details {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .filter summary {
                    display: grid;
                    width: 34rem;
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
                .file {
                    display: flex;
                    justify-content: center;
                }
                input[type="text"] {
                    width: calc(100% - 30px);
                    padding: 12px 20px;
                    box-sizing: border-box;
                    border: 0;
                }
                button {
                    padding: 12px;
                    background-color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 46px;
                    box-sizing: border-box;
                    border: 0;
                }
                button svg {
                    fill: hsl(229, 86%, 41%);
                    width: 24px;
                    height: 24px;
                }
                .container {
                    padding: 1rem 2rem 0 2rem;
                }
           
                table {
                    display: flex;
                    width: 100%;
                    border-collapse: collapse;
                    background-color: black;
                }
                th, td {
                    padding: 8px;
                    display: grid;
                }
                th {
                    text-align: left;
                }
                tr:nth-child(even) {
                    background-color: #3e0073;
                }
                tr:hover {
                    background-color: #5e00a3;
                }
                .filter-icon {
                    margin-right: 10px;
                }
            </style>
           
        `;
           const filterDiv = document.createElement('div');
           filterDiv.classList.add('filter');
   
           const details = document.createElement('details');
   
           const summary = document.createElement('summary');
           const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
           svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
           svgIcon.setAttribute("viewBox", "0 0 24 24");
           svgIcon.innerHTML = '<title></title><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" />';
           summary.appendChild(svgIcon);
   
           const containerDiv = document.createElement('div');
           containerDiv.classList.add('container');
   
           const input = document.createElement('input');
           input.type = 'text';
           input.id = 'myInput';
           input.placeholder = 'Buscar por nombre, email, etc...';
   
           const table = document.createElement('table');
           table.classList.add('table');
   
           this.createTableHeader(table);
           this.createTableBody(table);
   
           containerDiv.appendChild(input);
           filterDiv.appendChild(details);
           filterDiv.appendChild(containerDiv);
           this.shadow.appendChild(filterDiv);
           this.shadow.appendChild(table);
       }
   
       createTableHeader(table) {
           const thead = document.createElement('thead');
           const tr = document.createElement('tr');
   
           Object.keys(this.data[0]).forEach(key => {
               const th = document.createElement('th');
               th.textContent = key.toUpperCase();
               tr.appendChild(th);
           });
   
           thead.appendChild(tr);
           table.appendChild(thead);
       }
   
       createTableBody(table) {
           const tbody = document.createElement('tbody');
   
           this.data.forEach(customer => {
               const tr = document.createElement('tr');
   
               Object.values(customer).forEach(value => {
                   const td = document.createElement('td');
                   td.textContent = value;
                   tr.appendChild(td);
               });
   
               tbody.appendChild(tr);
           });
   
           table.appendChild(tbody);
       }
   }
   
   customElements.define('table-component', TableComponent);