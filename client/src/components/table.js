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
                .filter-content{
                    padding: 1rem 2rem 0 2rem
                }
           
                table {
                    display: flex;
                    align-content:center;
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
         
            const filterContentDiv = document.createElement('div'); 
            filterContentDiv.classList.add('filter-content');
         
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgIcon.setAttribute("viewBox", "0 0 24 24");
            svgIcon.innerHTML = '<title></title><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" />';
            summary.appendChild(svgIcon);
         
            const file = document.createElement('div');
            file.classList.add('file');
         
            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'myInput';
            input.placeholder = 'Buscar por nombre, email, etc...';
         
            const searchButton = document.createElement('button');
            searchButton.type = 'submit';
            const searchSvgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            searchSvgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            searchSvgIcon.setAttribute("viewBox", "0 0 24 24");
            searchSvgIcon.innerHTML = '<title></title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />';
            searchButton.appendChild(searchSvgIcon);
         
            const resetButton = document.createElement('button');
            resetButton.type = 'reset';
            const resetSvgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            resetSvgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            resetSvgIcon.setAttribute("viewBox", "0 0 24 24");
            resetSvgIcon.innerHTML = '<title></title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />';
            resetButton.appendChild(resetSvgIcon);
         
            const table = document.createElement('table');
            table.classList.add('table');
         
            this.createTableHeader(table);
            this.createTableBody(table);
         
            file.appendChild(input);
            file.appendChild(searchButton);
            file.appendChild(resetButton);
         
            filterContentDiv.appendChild(file); 
            filterContentDiv.appendChild(table); 
         
            filterDiv.appendChild(details);
            details.appendChild(summary);
            details.appendChild(filterContentDiv); 
            this.shadow.appendChild(filterDiv);
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