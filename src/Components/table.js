class table extends HTMLElement {
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
        details {
            width: 100%;
            display: flex;
            justify-content: center;
        }
        .filter summary{
            display: grid;
        }
        .filter summary{
            display: grid;
            width:34rem;
        }
        .filter details summary {
            cursor: pointer;
            list-style: none;
            background-color: aliceblue;
            padding: 0.1rem 0.5rem;
            margin-bottom: 1rem;
        }
        .filter details svg{
            fill: hsl(229, 86%, 41%);
            width: 30px;
            height: 30px;
        }
        .file{
            display: flex;
            justify-content:center;
        }
        input[type="text"] {
            width: calc(100% - 120px); 
            padding: 12px 20px;
            box-sizing: border-box;
            border:0;
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
            border:0;
        }
        button svg {
            fill: hsl(229, 86%, 41%);
            width: 24px;
            height: 24px;
        }
        .container {
            padding: 20px;
        }
        table {
            display:flex;
            width: 100%;
            border-collapse: collapse;
            background-color:black;
        }
        th, td {
            padding: 8px;
            display:grid;
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
            <div class="filter">
                <details>
                    <summary>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>     
                    </summary>
                    <div class="container">
                        <div class="file">
                            <input type="text" id="myInput" onkeyup="filterTable()" placeholder="Buscar por nombre, email, etc...">
                            <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg></button>
                            <button type="reset"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                        </div>
                        <table id="myTable">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Fecha de creación</th>
                                    <th>Fecha de actualización</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Carlos</td>
                                    <td>carlossedagambin@gmail.com</td>
                                    <td>2024-04-22</td>
                                    <td>2024-04-22</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </details>
            </div>
        
        `
      }
  }
  
  customElements.define('table-component', table)