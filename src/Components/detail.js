class detail extends HTMLElement {
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
        main {
            display: grid;
            gap: 2rem;
            grid-template-columns: 1fr 2fr;
            padding: 1rem;
        }

        details {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .filter summary{
            display: grid;
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
            gap:1rem;
        }
        .result-general form div{
            display: flex;
            align-content: center;
        }
        .result-general,
        .result-one { 
            border-radius: 8px;
        }

        .result-general label,
        .result-one label {
            gap:1rem;
        }
        .result-general label{
            background-color: rgb(90, 14, 90); 
            padding:0 0.5rem;
            align-content: center;

        }
        .result-general input,
        .result-one input {
            width: 100%;
            padding: 0.5rem;
            border: none;
        }
        .result-general input{
            margin-bottom: 0;
            border-radius: 0;
            background-color: white;
        }
        .result-general button{
            background-color: white;
            border:0;
            padding: 0 0.5rem;
        }
        .result-general button svg{
            fill: hsl(229, 86%, 41%);
        }
        .result-one {
            display: flex;
            gap: 1rem;
        }
        .ultimo{
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
        .result-one .form-Name label ,
        .result-one .form-email label {
            align-self: flex-start;
            display: grid;
        }
        .result-one .form-email input,
        .result-one .form-Name input{
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
         <main>
         <div class="filter">
             <details>
                 <summary>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>     
                 </summary>
                 <form action="" method="">
                     <input type="search" contenteditable="true">
                     <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg></button>
                     <button type="reset"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                 </form>
             </details>
         </div>
         <div class="result">
             <div class="result-general" >
                 <form name="general_result" action="" method="">
                     <div>
                         <label for="general">General</label>
                         <input type="text" class="general" name="general_result" contenteditable="true" >
                         <button type="reset"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" /></svg></button>
                         <button type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title></title><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" /></svg></button>
                     </div>
                 </form>
             </div>    
             <div class="result-one" action="" method="">
                 <form class="ultimo">
                     <div class="form-Name">
                         <label for="name">Nombre</label>
                         <input type="text"  name="generator" class="name">
                     </div>
                     <div class="form-email">
                         <label for="email">Email</label>
                         <input type="email"  name="generator" class="emails">
                     </div>
                 </form>
             </div>
         </div>
     </main>
        
        `
      }
  }
  
  customElements.define('detail-component', detail)