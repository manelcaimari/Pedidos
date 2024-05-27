class form extends HTMLElement {
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
       .orders{
        form{
    display: grid;
    gap: 1rem;
    padding:0 0 1rem 0;
    border-bottom: 1px solid white; 

}

.form-text, .form-date {
    display: flex;
    justify-content: space-between;

}

input[type='text'],
input[type='date']{
    padding: 3px;
    border: none;
    outline: none;
    color: #000000;
    background-color: #fff;
    width: 200px;

}

form button::first-letter{
    text-transform: capitalize;

}

form button{
    background-color: white;
    color:  hsl(240, 33%, 1%);
    border: none;
    border-radius: 5px;
    padding: 5px 0;
    text-align: center;
    text-decoration: none;
    font-size: 13px;
    width: 40%; 
    cursor: pointer;
    font-weight: 700;

}
        </style>
  
  <form>
  <div class="form-text">
      <input type="text" placeholder="referencia del pedido">
          <button type="submit">buscar por referencia</button>
  </div>
  <div class="form-date">
      <input type="date" placeholder="dd/mm/aaaa">
          <button type="submit">buscar por fecha</button>
  </div>
</form>
        `
      }
  }
  
  customElements.define('form-component', form)